import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import dbConnect from "@/backend/database/mongodb";
import ClientProject from "@/backend/models/ClientProject";
import Payment from "@/backend/models/Payment";
import Client from "@/backend/models/Client";

const JWT_SECRET = process.env.JWT_SECRET || "";

async function getClientIdFromToken(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get("client_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return (payload as any).id || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientId = await getClientIdFromToken(request);
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Fetch client info
    const client = await Client.findById(clientId).select("name email company phone");
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    // Fetch projects assigned to this client
    const projects = await ClientProject.find({ clientId })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch all payments/invoices for this client
    const payments = await Payment.find({ clientId })
      .populate("projectId", "projectName")
      .sort({ createdAt: -1 })
      .lean();

    // Compute stats
    const totalInvoiced = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalPaid = payments
      .filter((p) => p.status === "Paid")
      .reduce((acc, p) => acc + p.amount, 0);
    const totalPending = payments
      .filter((p) => p.status === "Pending")
      .reduce((acc, p) => acc + p.amount, 0);

    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter(
        (p) => p.status === "In Progress" || p.status === "Testing"
      ).length,
      completedProjects: projects.filter((p) => p.status === "Completed").length,
      totalInvoiced,
      totalPaid,
      totalPending,
      pendingInvoices: payments.filter((p) => p.status === "Pending").length,
    };

    return NextResponse.json({
      success: true,
      data: {
        client,
        projects,
        payments,
        stats,
      },
    });
  } catch (error) {
    console.error("[Client Dashboard GET Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
