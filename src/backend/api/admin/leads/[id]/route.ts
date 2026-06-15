import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Contact from "@/backend/models/Contact";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

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
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["new", "contacted", "proposal sent", "in progress", "converted", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    // 3. Update Database
    await dbConnect();
    const updatedLead = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedLead },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[PATCH /api/admin/leads/[id]] Error:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
    const deletedLead = await Contact.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { id: deletedLead._id } },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[DELETE /api/admin/leads/[id]] Error:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
