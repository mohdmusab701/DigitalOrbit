import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterested: string;
  meetingDate: Date;
  meetingTime: string; // e.g. "10:00 AM"
  meetingType: "Google Meet" | "Zoom" | "Phone";
  status: "pending" | "approved" | "rejected" | "rescheduled" | "completed" | "cancelled";
  notes?: string;
  googleEventId?: string; // For future google calendar integration
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    serviceInterested: {
      type: String,
      required: [true, "Service is required"],
    },
    meetingDate: {
      type: Date,
      required: [true, "Meeting date is required"],
    },
    meetingTime: {
      type: String,
      required: [true, "Meeting time is required"],
    },
    meetingType: {
      type: String,
      enum: ["Google Meet", "Zoom", "Phone"],
      required: [true, "Meeting type is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "rescheduled", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    googleEventId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overlapping bookings visually (optional validation hook can be added here)
BookingSchema.index({ meetingDate: 1, meetingTime: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1, meetingDate: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
