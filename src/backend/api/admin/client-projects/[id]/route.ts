import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import ClientProject from "@/backend/models/ClientProject";
import Client from "@/backend/models/Client";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * GET /api/admin/client-projects/[id]
 *
 * Fetch a single project by ID with populated client info.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. JWT Authentication
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

    // 2. Fetch from DB
    const { id } = await params;
    await dbConnect();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Client; // Ensure Client model is registered

    const project = await ClientProject.findById(id).populate("clientId", "name company email phone");

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/admin/client-projects/[id]] Error:`, error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/client-projects/[id]
 *
 * Partially updates a project record.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. JWT Authentication
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

    // 2. Parse request body and params
    const { id } = await params;
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    // 3. Build update object
    const allowedFields = ["projectName", "clientId", "description", "budget", "startDate", "deadline", "status", "technologies"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field];
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, error: "No valid fields to update." }, { status: 400 });
    }

    // Validate status
    if (update.status && !["Planning", "In Progress", "Testing", "Completed", "On Hold"].includes(update.status)) {
      return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });
    }

    // 4. Update Database
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Client;

    if (update.clientId) {
      const clientExists = await Client.findById(update.clientId);
      if (!clientExists) {
        return NextResponse.json({ success: false, error: "Client not found." }, { status: 404 });
      }
    }

    const updatedProject = await ClientProject.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    ).populate("clientId", "name company email");

    if (!updatedProject) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProject }, { status: 200 });
  } catch (error) {
    console.error(`[PATCH /api/admin/client-projects/[id]] Error:`, error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/client-projects/[id]
 *
 * Permanently deletes a project.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. JWT Authentication
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

    const { id } = await params;
    await dbConnect();
    
    const deletedProject = await ClientProject.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id: deletedProject._id } }, { status: 200 });
  } catch (error) {
    console.error(`[DELETE /api/admin/client-projects/[id]] Error:`, error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
