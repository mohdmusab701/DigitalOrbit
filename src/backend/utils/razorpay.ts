import Razorpay from "razorpay";
import crypto from "crypto";

let _razorpay: Razorpay | null = null;

/**
 * Lazily initializes the Razorpay instance to avoid crashing at build time
 * when environment variables are not available.
 */
function getRazorpayInstance(): Razorpay {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        "Razorpay keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are missing from environment variables."
      );
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

/**
 * Generates an order in Razorpay
 * @param amount Amount in smallest currency unit (e.g., paise for INR)
 * @param currency Currency code (e.g., "INR")
 * @param receipt A unique receipt ID (usually the internal invoice number)
 */
export const createRazorpayOrder = async (
  amount: number,
  currency: string = "INR",
  receipt: string
) => {
  const razorpay = getRazorpayInstance();
  const options = {
    amount,
    currency,
    receipt,
  };
  return await razorpay.orders.create(options);
};

/**
 * Verifies the Razorpay signature to ensure the payment callback is authentic
 */
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};
