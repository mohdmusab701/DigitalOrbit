import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Booking from "@/backend/models/Booking";
import { sendBookingStatusEmail } from "@/backend/utils/email";
import { format } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const booking = await Booking.findById(id).lean();
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("[Admin Booking GET Error]", error);
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

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const previousStatus = booking.status;
    const previousDate = booking.meetingDate;
    const previousTime = booking.meetingTime;

    // Update fields
    if (body.status) booking.status = body.status;
    if (body.meetingDate) booking.meetingDate = new Date(body.meetingDate);
    if (body.meetingTime) booking.meetingTime = body.meetingTime;
    if (body.meetingType) booking.meetingType = body.meetingType;
    if (body.googleEventId !== undefined) booking.googleEventId = body.googleEventId;
    
    // Optional meeting link logic (e.g. static zoom link for approved bookings)
    const meetingLink = body.meetingLink || (booking.status === "approved" && booking.meetingType === "Google Meet" ? "https://meet.google.com/xyz-abcd-efg" : undefined);

    await booking.save();

    // Send email notification if status or time changed and it's a relevant status
    if (
      (body.status && previousStatus !== body.status && ["approved", "rejected", "cancelled"].includes(body.status)) ||
      (body.status === "rescheduled" || (body.meetingDate && new Date(body.meetingDate).getTime() !== new Date(previousDate).getTime()) || (body.meetingTime && body.meetingTime !== previousTime))
    ) {
      const emailStatus = body.status === "rescheduled" || (body.meetingTime && body.meetingTime !== previousTime) 
          ? "rescheduled" 
          : body.status;
          
      if (["approved", "rejected", "rescheduled", "cancelled"].includes(emailStatus)) {
        try {
          const formattedDate = format(new Date(booking.meetingDate), "MMMM dd, yyyy");
          await sendBookingStatusEmail(
            booking.email,
            booking.name,
            emailStatus as any,
            formattedDate,
            booking.meetingTime,
            booking.meetingType,
            meetingLink
          );
        } catch (emailErr) {
          console.error("Failed to send booking status update email:", emailErr);
        }
      }
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("[Admin Booking PATCH Error]", error);
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
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("[Admin Booking DELETE Error]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
