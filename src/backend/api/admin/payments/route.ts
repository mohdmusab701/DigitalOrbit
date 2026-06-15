import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Payment from "@/backend/models/Payment";
import Client from "@/backend/models/Client";
import ClientProject from "@/backend/models/ClientProject";
import { validatePaymentInput } from "@/backend/validations";
import { sendInvoiceEmail } from "@/backend/utils/email";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: any = {};
    if (status) query.status = status;

    let clientIds: string[] = [];
    if (search) {
      const searchRegex = new RegExp(search, "i");
      const clients = await Client.find({
        $or: [{ name: searchRegex }, { company: searchRegex }, { email: searchRegex }],
      }).select("_id");
      clientIds = clients.map((c) => (c._id as string).toString());
      query.$or = [{ invoiceNumber: searchRegex }, { clientId: { $in: clientIds } }];
    }

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate("clientId", "name email company")
      .populate("projectId", "projectName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate basic stats
    const allPayments = await Payment.find();
    const stats = {
      totalRevenue: allPayments.filter(p => p.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0),
      pending: allPayments.filter(p => p.status === "Pending").length,
      paid: allPayments.filter(p => p.status === "Paid").length,
      failed: allPayments.filter(p => p.status === "Failed").length,
    };

    return NextResponse.json({
      success: true,
      data: {
        payments,
        stats,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("[Admin Payments GET Error]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validatePaymentInput(body);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify Client and Project
    const client = await Client.findById(validation.data.clientId);
    if (!client) {
      return NextResponse.json({ success: false, error: "Client not found." }, { status: 404 });
    }

    const project = await ClientProject.findById(validation.data.projectId);
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    // Generate unique invoice number: INV-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = crypto.randomBytes(2).toString("hex").toUpperCase();
    const invoiceNumber = `INV-${dateStr}-${randomStr}`;

    const payment = await Payment.create({
      ...validation.data,
      invoiceNumber,
      status: validation.data.status || "Pending",
    });

    // Send Email Notification
    const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client/pay/${payment._id}`;
    await sendInvoiceEmail(client.email, client.name, payment.amount, payment.currency, invoiceNumber, paymentLink);

    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (error) {
    console.error("[Admin Payments POST Error]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
