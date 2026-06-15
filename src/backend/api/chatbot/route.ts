import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Conversation from "@/backend/models/Conversation";
import {
  generateBotResponse,
  extractLeadInfo,
  WELCOME_MESSAGE,
} from "@/backend/utils/chatbot";

// ─── Rate Limiting (in-memory, per-IP) ────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// ─── Input Sanitization ──────────────────────────────────────
function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>/g, "") // strip HTML
    .replace(/[<>]/g, "")    // strip leftover angle brackets
    .trim()
    .slice(0, 2000);         // max length
}

// ─── POST /api/chatbot — Send a message ──────────────────────
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { sessionId, message, pageUrl } = body;

    // Validation
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const sanitizedMessage = sanitize(message);

    await dbConnect();

    // Find or create conversation
    let conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        pageUrl: pageUrl || "",
        userAgent: request.headers.get("user-agent") || "",
        messages: [
          {
            role: "bot",
            content: WELCOME_MESSAGE,
            timestamp: new Date(),
          },
        ],
      });
    }

    // Add user message
    conversation.messages.push({
      role: "user",
      content: sanitizedMessage,
      timestamp: new Date(),
    });

    // Extract lead info from message
    const leadInfo = extractLeadInfo(sanitizedMessage);
    if (leadInfo.name && !conversation.visitorName) {
      conversation.visitorName = leadInfo.name;
    }
    if (leadInfo.email && !conversation.visitorEmail) {
      conversation.visitorEmail = leadInfo.email;
      conversation.leadCaptured = true;
    }
    if (leadInfo.phone && !conversation.visitorPhone) {
      conversation.visitorPhone = leadInfo.phone;
    }

    // Generate bot response
    const botResponse = generateBotResponse(sanitizedMessage, {
      messageCount: conversation.messages.filter((m) => m.role === "user").length,
      leadCaptured: conversation.leadCaptured,
      visitorName: conversation.visitorName,
    });

    conversation.messages.push({
      role: "bot",
      content: botResponse,
      timestamp: new Date(),
    });

    await conversation.save();

    return NextResponse.json({
      success: true,
      data: {
        reply: botResponse,
        sessionId: conversation.sessionId,
        leadCaptured: conversation.leadCaptured,
      },
    });
  } catch (error) {
    console.error("[Chatbot POST Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ─── GET /api/chatbot?sessionId=xxx — Fetch conversation ─────
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return NextResponse.json({
        success: true,
        data: {
          messages: [
            {
              role: "bot",
              content: WELCOME_MESSAGE,
              timestamp: new Date(),
            },
          ],
          sessionId,
          leadCaptured: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        messages: conversation.messages,
        sessionId: conversation.sessionId,
        leadCaptured: conversation.leadCaptured,
        visitorName: conversation.visitorName,
      },
    });
  } catch (error) {
    console.error("[Chatbot GET Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
