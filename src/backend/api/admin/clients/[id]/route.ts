import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Client from "@/backend/models/Client";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * PATCH /api/admin/clients/[id]
 *
 * Partially updates a client record.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. Parse request body and params
    const { id } = await params;
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }

    // 3. Build update object — only allow known fields
    const allowedFields = ["name", "email", "phone", "company", "address", "notes", "status"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field];
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update." },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (update.status && !["active", "inactive"].includes(update.status)) {
      return NextResponse.json(
        { success: false, error: "Status must be 'active' or 'inactive'." },
        { status: 400 }
      );
    }

    // 4. Update Database
    await dbConnect();

    // If email is being changed, check for duplicates
    if (update.email) {
      update.email = (update.email as string).trim().toLowerCase();
      const existing = await Client.findOne({ email: update.email, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "A client with this email already exists.", errors: { email: "Email already in use." } },
          { status: 409 }
        );
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedClient },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[PATCH /api/admin/clients/[id]] Error:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/clients/[id]
 *
 * Permanently deletes a client record.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. Parse params
    const { id } = await params;

    // 3. Delete Database Record
    await dbConnect();
    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { id: deletedClient._id } },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[DELETE /api/admin/clients/[id]] Error:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
