import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Contact from "@/backend/models/Contact";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function GET(request: NextRequest) {
  try {
    // 1. JWT Authentication Protection
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }

    // 2. Parse Pagination Query Parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    // 3. Connect to Database
    await dbConnect();

    // 4. Fetch Paginated Data & Stats
    const [leads, total, newLeads, contacted, converted, rejected] = await Promise.all([
      Contact.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Contact.countDocuments({}),
      Contact.countDocuments({ status: "new" }),
      Contact.countDocuments({ status: "contacted" }),
      Contact.countDocuments({ status: "converted" }),
      Contact.countDocuments({ status: "rejected" })
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return NextResponse.json(
      {
        success: true,
        data: {
          leads,
          stats: {
            total,
            newLeads,
            contacted,
            converted,
            rejected
          },
          pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/admin/contacts] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
