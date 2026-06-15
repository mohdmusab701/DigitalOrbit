"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Shield,
  ArrowLeft,
  FileText,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  projectId?: { _id: string; projectName: string };
  clientId?: { _id: string; name: string; email: string };
  createdAt: string;
}

type PageState = "loading" | "ready" | "processing" | "success" | "failed" | "error" | "already_paid";

export default function ClientPayPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch invoice details
  const fetchInvoice = useCallback(async () => {
    try {
      // We fetch via the create-order endpoint to also get the invoice details
      // But first, let's use a simple GET to check the invoice status
      const res = await fetch(`/api/payments/${paymentId}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Invoice not found");
      }
      const inv = json.data;
      setInvoice(inv);

      if (inv.status === "Paid") {
        setPageState("already_paid");
      } else if (inv.status === "Refunded") {
        setPageState("error");
        setErrorMsg("This invoice has been refunded.");
      } else {
        setPageState("ready");
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
      setPageState("error");
    }
  }, [paymentId]);

  useEffect(() => {
    if (paymentId) fetchInvoice();
  }, [paymentId, fetchInvoice]);

  const handlePayment = async () => {
    setPageState("processing");
    try {
      // 1. Create Razorpay Order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok || !orderJson.success) {
        throw new Error(orderJson.error || "Failed to initiate payment");
      }

      const { orderId, amount, currency, keyId, prefill } = orderJson.data;

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount,
        currency,
        name: "DigitalOrbit",
        description: `Invoice #${invoice?.invoiceNumber}`,
        order_id: orderId,
        prefill: {
          name: prefill.name,
          email: prefill.email,
        },
        theme: {
          color: "#0284c7",
        },
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (verifyRes.ok && verifyJson.success) {
              setPageState("success");
            } else {
              setErrorMsg(verifyJson.error || "Verification failed");
              setPageState("failed");
            }
          } catch {
            setErrorMsg("Payment verification failed. Please contact support.");
            setPageState("failed");
          }
        },
        modal: {
          ondismiss: function () {
            setPageState("ready");
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error("Payment gateway is loading. Please try again.");
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMsg(response.error?.description || "Payment failed");
        setPageState("failed");
      });
      rzp.open();
    } catch (err) {
      setErrorMsg((err as Error).message);
      setPageState("failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-4 selection:bg-primary-500/30">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* ── Loading ── */}
        {pageState === "loading" && (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Loading invoice...</p>
          </div>
        )}

        {/* ── Error ── */}
        {pageState === "error" && (
          <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-slate-200/50 dark:border-dark-border/50 rounded-3xl p-8 shadow-2xl text-center">
            <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Invoice Error</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{errorMsg}</p>
            <button
              onClick={() => router.push("/client/dashboard")}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ── Already Paid ── */}
        {pageState === "already_paid" && (
          <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-slate-200/50 dark:border-dark-border/50 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Already Paid</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              Invoice <span className="font-semibold text-slate-700 dark:text-slate-200">#{invoice?.invoiceNumber}</span> has already been paid.
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 my-4">
              {invoice?.currency} {invoice?.amount.toLocaleString()}
            </p>
            <button
              onClick={() => router.push("/client/dashboard")}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ── Ready to Pay ── */}
        {(pageState === "ready" || pageState === "processing") && invoice && (
          <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-slate-200/50 dark:border-dark-border/50 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary-500/20">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Complete Payment</h2>
              <p className="text-slate-500 dark:text-slate-400">Secure payment powered by Razorpay</p>
            </div>

            {/* Invoice Details */}
            <div className="bg-slate-50 dark:bg-dark-bg/50 rounded-2xl p-5 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Invoice
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">#{invoice.invoiceNumber}</span>
              </div>
              {invoice.projectId?.projectName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Project</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{invoice.projectId.projectName}</span>
                </div>
              )}
              <div className="border-t border-slate-200 dark:border-dark-border pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Amount Due</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {invoice.currency} {invoice.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={pageState === "processing"}
              className="w-full relative group overflow-hidden bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-4 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <div className="relative flex items-center justify-center gap-2 font-semibold text-lg">
                {pageState === "processing" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <IndianRupee className="w-5 h-5" />
                    Pay {invoice.currency} {invoice.amount.toLocaleString()}
                  </>
                )}
              </div>
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-400 dark:text-slate-500">
              <Shield className="w-3.5 h-3.5" />
              <span>256-bit SSL Encryption • Powered by Razorpay</span>
            </div>
          </div>
        )}

        {/* ── Success ── */}
        {pageState === "success" && (
          <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-slate-200/50 dark:border-dark-border/50 rounded-3xl p-8 shadow-2xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Your payment of <span className="font-semibold text-slate-700 dark:text-slate-200">{invoice?.currency} {invoice?.amount.toLocaleString()}</span> for invoice <span className="font-semibold text-slate-700 dark:text-slate-200">#{invoice?.invoiceNumber}</span> has been received.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">A confirmation email has been sent to your registered email address.</p>
            <button
              onClick={() => router.push("/client/dashboard")}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ── Failed ── */}
        {pageState === "failed" && (
          <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-slate-200/50 dark:border-dark-border/50 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Payment Failed</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{errorMsg || "Something went wrong during the payment process."}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setPageState("ready");
                  setErrorMsg("");
                }}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/client/dashboard")}
                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Back link */}
        {pageState !== "loading" && (
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/client/dashboard")}
              className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
