import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Payment from "@/backend/models/Payment";

/**
 * Public API to fetch basic invoice details for payment checkout.
 * Only returns minimal, non-sensitive data needed for the pay page.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const payment = await Payment.findById(id)
      .populate("clientId", "name email")
      .populate("projectId", "projectName")
      .lean();

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("[Payment Details GET Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
