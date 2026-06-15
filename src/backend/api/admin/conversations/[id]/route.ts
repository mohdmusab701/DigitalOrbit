import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Conversation from "@/backend/models/Conversation";
import Contact from "@/backend/models/Contact";

// ─── GET — Fetch single conversation ─────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const conversation = await Conversation.findById(id).lean();
    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: conversation });
  } catch (error) {
    console.error("[Admin Conversation GET Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ─── PATCH — Update status / Convert to Lead ─────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await dbConnect();

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Update status
    if (body.status) {
      conversation.status = body.status;
    }

    // Convert to lead (create a Contact entry)
    if (body.convertToLead) {
      if (!conversation.visitorEmail) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Cannot convert to lead: visitor email is missing. Visitor must share their email in the chat first.",
          },
          { status: 400 }
        );
      }

      // Check if lead already exists
      const existingContact = await Contact.findOne({
        email: conversation.visitorEmail,
      });

      if (existingContact) {
        conversation.status = "converted";
        await conversation.save();
        return NextResponse.json({
          success: true,
          message: "Contact already exists. Conversation marked as converted.",
          data: conversation,
        });
      }

      // Build a summary from chat messages
      const chatSummary = conversation.messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(" | ")
        .slice(0, 4000);

      await Contact.create({
        name: conversation.visitorName || "Chat Visitor",
        email: conversation.visitorEmail,
        phone: conversation.visitorPhone || "",
        company: "",
        service: "",
        message: `[Chat Lead] ${chatSummary}`,
        status: "new",
      });

      conversation.status = "converted";
      await conversation.save();

      return NextResponse.json({
        success: true,
        message: "Chat converted to lead successfully!",
        data: conversation,
      });
    }

    await conversation.save();
    return NextResponse.json({ success: true, data: conversation });
  } catch (error) {
    console.error("[Admin Conversation PATCH Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ─── DELETE — Remove conversation ────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const conversation = await Conversation.findByIdAndDelete(id);
    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("[Admin Conversation DELETE Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
