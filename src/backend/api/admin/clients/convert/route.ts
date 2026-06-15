import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Client from "@/backend/models/Client";
import Contact from "@/backend/models/Contact";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * POST /api/admin/clients/convert
 *
 * Atomically converts a lead (Contact) into a Client:
 *  1. Creates a new Client from the lead's data + any extra fields
 *  2. Updates the lead's status to "converted"
 *  3. Returns the new client
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

    // 2. Parse body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }

    const { leadId, address, notes } = body as {
      leadId?: string;
      address?: string;
      notes?: string;
    };

    if (!leadId || typeof leadId !== "string") {
      return NextResponse.json(
        { success: false, error: "leadId is required." },
        { status: 400 }
      );
    }

    // 3. Connect to Database
    await dbConnect();

    // 4. Find the lead
    const lead = await Contact.findById(leadId);
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    // 5. Check if a client with this email already exists
    const existingClient = await Client.findOne({ email: lead.email });
    if (existingClient) {
      return NextResponse.json(
        { success: false, error: "A client with this email already exists." },
        { status: 409 }
      );
    }

    // 6. Create the client
    const client = await Client.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      address: ((address as string) || "").trim(),
      notes: ((notes as string) || "").trim(),
      status: "active",
    });

    // 7. Update lead status to "converted"
    lead.status = "converted";
    await lead.save();

    console.log(
      `[POST /api/admin/clients/convert] Lead ${leadId} converted to client ${client._id}`
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          client,
          lead: { _id: lead._id, status: lead.status },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error & { code?: number };

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A client with this email already exists." },
        { status: 409 }
      );
    }

    console.error("[POST /api/admin/clients/convert] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
