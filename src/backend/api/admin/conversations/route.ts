import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Conversation from "@/backend/models/Conversation";
import Contact from "@/backend/models/Contact";

// ─── GET /api/admin/conversations — List all conversations ───
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const leadOnly = searchParams.get("leadOnly") === "true";

    const query: any = {};
    if (status) query.status = status;
    if (leadOnly) query.leadCaptured = true;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { visitorName: searchRegex },
        { visitorEmail: searchRegex },
        { visitorPhone: searchRegex },
        { sessionId: searchRegex },
      ];
    }

    const total = await Conversation.countDocuments(query);
    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Compute stats
    const allConversations = await Conversation.countDocuments();
    const leadsCount = await Conversation.countDocuments({ leadCaptured: true });
    const activeCount = await Conversation.countDocuments({ status: "active" });
    const convertedCount = await Conversation.countDocuments({ status: "converted" });

    return NextResponse.json({
      success: true,
      data: {
        conversations: conversations.map((c) => ({
          ...c,
          messageCount: c.messages?.length || 0,
          lastMessage:
            c.messages && c.messages.length > 0
              ? c.messages[c.messages.length - 1].content.slice(0, 100)
              : "",
        })),
        stats: {
          total: allConversations,
          leads: leadsCount,
          active: activeCount,
          converted: convertedCount,
        },
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("[Admin Conversations GET Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
