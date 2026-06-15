import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: "new" | "contacted" | "proposal sent" | "in progress" | "converted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      maxlength: [255, "Email cannot exceed 255 characters"],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
      default: "",
    },
    company: {
      type: String,
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
      default: "",
    },
    service: {
      type: String,
      trim: true,
      maxlength: [100, "Service name cannot exceed 100 characters"],
      default: "",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "contacted", "proposal sent", "in progress", "converted", "rejected"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

// Index on status for admin queries filtering by lead state
ContactSchema.index({ status: 1, createdAt: -1 });

const Contact: Model<IContact> =
  mongoose.models.Contact ??
  mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
