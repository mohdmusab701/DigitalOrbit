import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Booking from "@/backend/models/Booking";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: any = {};
    if (status) query.status = status;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ];
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .sort({ meetingDate: 1, meetingTime: 1 }) // Sort upcoming first
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Stats
    const stats = {
      total: await Booking.countDocuments(),
      pending: await Booking.countDocuments({ status: "pending" }),
      approved: await Booking.countDocuments({ status: "approved" }),
      cancelled: await Booking.countDocuments({ status: "cancelled" }),
    };

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        stats,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("[Admin Bookings GET Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
