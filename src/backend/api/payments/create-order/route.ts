import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Payment from "@/backend/models/Payment";
import Client from "@/backend/models/Client";
import { createRazorpayOrder } from "@/backend/utils/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Payment ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const payment = await Payment.findById(paymentId).populate(
      "clientId",
      "name email"
    );

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    if (payment.status !== "Pending") {
      return NextResponse.json(
        { success: false, error: `Invoice is already ${payment.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Amount is in paise (smallest currency unit) for Razorpay
    const amountInPaise = Math.round(payment.amount * 100);

    const order = await createRazorpayOrder(
      amountInPaise,
      payment.currency,
      payment.invoiceNumber
    );

    // Store the Razorpay order ID on the payment record
    payment.razorpayOrderId = order.id;
    await payment.save();

    const client = payment.clientId as any;

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: amountInPaise,
        currency: payment.currency,
        invoiceNumber: payment.invoiceNumber,
        keyId: process.env.RAZORPAY_KEY_ID || "",
        prefill: {
          name: client?.name || "",
          email: client?.email || "",
        },
      },
    });
  } catch (error) {
    console.error("[Create Order Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
