import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPayment extends Document {
  clientId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client ID is required"],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "ClientProject",
      required: [true, "Project ID is required"],
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"],
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
PaymentSchema.index({ clientId: 1, status: 1 });
PaymentSchema.index({ invoiceNumber: 1 }, { unique: true });

const Payment: Model<IPayment> =
  mongoose.models.Payment ??
  mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
