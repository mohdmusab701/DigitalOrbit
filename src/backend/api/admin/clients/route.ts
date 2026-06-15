import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Client from "@/backend/models/Client";
import { validateClientInput } from "@/backend/validations";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * GET /api/admin/clients
 *
 * Returns paginated client list with stats.
 * Supports search by name/email/company and filter by status.
 */
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

    // 2. Parse Query Parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "";

    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    // 3. Connect to Database
    await dbConnect();

    // 4. Build query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ];
    }

    if (statusFilter && ["active", "inactive"].includes(statusFilter)) {
      filter.status = statusFilter;
    }

    // 5. Fetch Paginated Data & Stats
    const [clients, total, totalAll, active, inactive] = await Promise.all([
      Client.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Client.countDocuments(filter),
      Client.countDocuments({}),
      Client.countDocuments({ status: "active" }),
      Client.countDocuments({ status: "inactive" }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return NextResponse.json(
      {
        success: true,
        data: {
          clients,
          stats: {
            total: totalAll,
            active,
            inactive,
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
    console.error("[GET /api/admin/clients] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/clients
 *
 * Creates a new client with validated input.
 */
export async function POST(request: NextRequest) {
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

    // 2. Parse and validate body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }

    const validation = validateClientInput(body);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // 3. Connect to Database
    await dbConnect();

    // 4. Check for duplicate email
    const existing = await Client.findOne({ email: validation.data.email });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A client with this email already exists.", errors: { email: "Email already in use." } },
        { status: 409 }
      );
    }

    // 5. Create client
    const client = await Client.create({
      name: validation.data.name,
      email: validation.data.email,
      phone: validation.data.phone,
      company: validation.data.company,
      address: validation.data.address,
      notes: validation.data.notes,
      status: validation.data.status || "active",
    });

    console.log(`[POST /api/admin/clients] Client created: ${client._id} (${client.email})`);

    return NextResponse.json(
      { success: true, data: client },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error & { code?: number };

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A client with this email already exists.", errors: { email: "Email already in use." } },
        { status: 409 }
      );
    }

    console.error("[POST /api/admin/clients] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
