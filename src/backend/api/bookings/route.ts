import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Booking from "@/backend/models/Booking";
import { validateEmail, validatePhone } from "@/backend/validations";
import { sendBookingConfirmationEmail } from "@/backend/utils/email";
import { format } from "date-fns";

// Rate limiting (simple in-memory for public endpoints)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // bookings per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
      
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many booking requests from this IP. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, company, serviceInterested, meetingDate, meetingTime, meetingType, notes } = body;

    // Validation
    const errors: Record<string, string> = {};
    if (!name?.trim()) errors.name = "Name is required";
    if (!email?.trim() || !validateEmail(email)) errors.email = "Valid email is required";
    if (!phone?.trim() || !validatePhone(phone)) errors.phone = "Valid phone number is required";
    if (!serviceInterested?.trim()) errors.serviceInterested = "Service selection is required";
    if (!meetingDate) errors.meetingDate = "Meeting date is required";
    if (!meetingTime?.trim()) errors.meetingTime = "Meeting time is required";
    if (!meetingType || !["Google Meet", "Zoom", "Phone"].includes(meetingType)) {
      errors.meetingType = "Valid meeting type is required (Google Meet, Zoom, or Phone)";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    await dbConnect();

    // Check if slot is already booked (naive check)
    const existingBooking = await Booking.findOne({
      meetingDate: new Date(meetingDate),
      meetingTime,
      status: { $in: ["approved", "pending"] },
    });

    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: "This time slot is no longer available. Please select another time." },
        { status: 400 }
      );
    }

    const booking = new Booking({
      name,
      email,
      phone,
      company,
      serviceInterested,
      meetingDate: new Date(meetingDate),
      meetingTime,
      meetingType,
      notes,
      status: "pending",
    });

    await booking.save();

    // Send Confirmation Email
    try {
      const formattedDate = format(new Date(meetingDate), "MMMM dd, yyyy");
      await sendBookingConfirmationEmail(email, name, formattedDate, meetingTime, meetingType);
    } catch (emailErr) {
      console.error("Failed to send booking confirmation email:", emailErr);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      { success: true, message: "Booking received successfully", data: booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Booking POST Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
