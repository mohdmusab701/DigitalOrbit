import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import ClientProject from "@/backend/models/ClientProject";
import Client from "@/backend/models/Client";
import { validateClientProjectInput } from "@/backend/validations";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * GET /api/admin/client-projects
 *
 * Returns paginated project list with stats.
 * Supports search by projectName, filter by status and clientId.
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
    const clientIdFilter = searchParams.get("clientId") || "";

    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    // 3. Connect to Database
    await dbConnect();

    // Ensure Client model is registered so populate works
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Client;

    // 4. Build query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (search.trim()) {
      filter.projectName = new RegExp(search.trim(), "i");
    }

    if (statusFilter && ["Planning", "In Progress", "Testing", "Completed", "On Hold"].includes(statusFilter)) {
      filter.status = statusFilter;
    }

    if (clientIdFilter) {
      filter.clientId = clientIdFilter;
    }

    // 5. Fetch Paginated Data & Stats
    const [projects, total, totalAll, active, completed] = await Promise.all([
      ClientProject.find(filter)
        .populate("clientId", "name company email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      ClientProject.countDocuments(filter),
      ClientProject.countDocuments({}),
      ClientProject.countDocuments({ status: { $in: ["Planning", "In Progress", "Testing"] } }),
      ClientProject.countDocuments({ status: "Completed" }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return NextResponse.json(
      {
        success: true,
        data: {
          projects,
          stats: {
            total: totalAll,
            active,
            completed,
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
    console.error("[GET /api/admin/client-projects] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/client-projects
 *
 * Creates a new managed project with validated input.
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

    const validation = validateClientProjectInput(body);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // 3. Connect to Database
    await dbConnect();

    // 4. Verify client exists
    const client = await Client.findById(validation.data.clientId);
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found." },
        { status: 404 }
      );
    }

    // 5. Create project
    const project = await ClientProject.create({
      projectName: validation.data.projectName,
      clientId: validation.data.clientId,
      description: validation.data.description,
      budget: validation.data.budget,
      startDate: validation.data.startDate ? new Date(validation.data.startDate) : undefined,
      deadline: validation.data.deadline ? new Date(validation.data.deadline) : undefined,
      status: validation.data.status,
      technologies: validation.data.technologies,
    });

    console.log(`[POST /api/admin/client-projects] Project created: ${project._id} (${project.projectName})`);

    // Populate client data before returning
    await project.populate("clientId", "name company email");

    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/client-projects] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
