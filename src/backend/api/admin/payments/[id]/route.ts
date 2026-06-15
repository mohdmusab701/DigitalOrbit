import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Payment from "@/backend/models/Payment";
import { validatePaymentInput } from "@/backend/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const payment = await Payment.findById(id)
      .populate("clientId", "name email company")
      .populate("projectId", "projectName");

    if (!payment) {
      return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    console.error("[Admin Payment GET Error]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await dbConnect();

    // Partial validation or custom update logic
    const payment = await Payment.findById(id);
    if (!payment) {
      return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
    }

    // Update allowed fields
    if (body.status) payment.status = body.status;
    if (body.amount) payment.amount = Number(body.amount);
    if (body.clientId) payment.clientId = body.clientId;
    if (body.projectId) payment.projectId = body.projectId;
    
    // Auto-set paymentDate if marked as Paid manually
    if (body.status === "Paid" && !payment.paymentDate) {
      payment.paymentDate = new Date();
    }

    await payment.save();

    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    console.error("[Admin Payment PATCH Error]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    console.error("[Admin Payment DELETE Error]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
