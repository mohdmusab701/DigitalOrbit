import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Payment from "@/backend/models/Payment";
import Client from "@/backend/models/Client";
import { verifyRazorpaySignature } from "@/backend/utils/razorpay";
import {
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
} from "@/backend/utils/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !paymentId
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required verification data" },
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

    // Verify the Razorpay signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    const client = payment.clientId as any;
    const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client/pay/${payment._id}`;

    if (isValid) {
      // Payment verified successfully
      payment.status = "Paid";
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.paymentDate = new Date();
      await payment.save();

      // Send success email
      if (client?.email) {
        await sendPaymentSuccessEmail(
          client.email,
          client.name,
          payment.amount,
          payment.currency,
          payment.invoiceNumber
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        data: { status: "Paid" },
      });
    } else {
      // Signature mismatch — fraud attempt or error
      payment.status = "Failed";
      await payment.save();

      // Send failure email
      if (client?.email) {
        await sendPaymentFailedEmail(
          client.email,
          client.name,
          payment.invoiceNumber,
          paymentLink
        );
      }

      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[Verify Payment Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
