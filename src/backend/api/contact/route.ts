import { NextResponse } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Contact from "@/backend/models/Contact";
import { validateContactInput } from "@/backend/validations";
import nodemailer from "nodemailer";

/**
 * POST /api/contact
 *
 * Creates a new contact lead in MongoDB.
 * Validates all fields server-side before persisting.
 * Sends an email notification to the admin.
 */
export async function POST(request: Request) {
  try {
    // 1. Parse request body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      console.warn("[POST /api/contact] Invalid JSON body received");
      return NextResponse.json(
        { success: false, error: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }

    // 2. Validate inputs
    const validation = validateContactInput(body);
    if (!validation.success || !validation.data) {
      console.log("[POST /api/contact] Validation failed:", validation.errors);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // 3. Connect to database (uses cached connection + DNS fix)
    console.log("[POST /api/contact] Connecting to MongoDB...");
    await dbConnect();
    console.log("[POST /api/contact] Connected successfully");

    // 4. Persist the contact lead
    const contact = await Contact.create({
      name: validation.data.name,
      email: validation.data.email,
      phone: validation.data.phone,
      company: validation.data.company,
      service: validation.data.service,
      message: validation.data.message,
      status: "new",
    });

    console.log(
      `[POST /api/contact] Lead saved: ${contact._id} (${contact.email})`
    );

    // 5. Send Email Notification
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to admin
        subject: `New Lead: ${contact.name} - ${contact.service || "General Inquiry"}`,
        html: `
          <h2>New Contact Request</h2>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone || "N/A"}</p>
          <p><strong>Company:</strong> ${contact.company || "N/A"}</p>
          <p><strong>Service:</strong> ${contact.service || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${contact.message.replace(/\n/g, "<br>")}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("[POST /api/contact] Email notification sent successfully.");
    } catch (emailError) {
      console.error("[POST /api/contact] Failed to send email notification:", emailError);
      // We don't throw here. The lead is already saved in MongoDB.
      // We handle email errors gracefully by logging them and continuing.
    }

    // 6. Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          createdAt: contact.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error & { name?: string; code?: string; errors?: Record<string, any> };

    console.error("[POST /api/contact] Error:", {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack?.split("\n").slice(0, 5).join("\n"),
    });

    // Handle Mongoose validation errors
    if (err.name === "ValidationError" && err.errors) {
      const mongooseErrors: Record<string, string> = {};
      for (const [key, val] of Object.entries(err.errors)) {
        mongooseErrors[key] = (val as any).message;
      }
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: mongooseErrors },
        { status: 400 }
      );
    }

    // Handle DNS / connection errors with a clear message
    if (
      err.message?.includes("querySrv") ||
      err.message?.includes("ECONNREFUSED") ||
      err.message?.includes("ENOTFOUND")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed. Please try again in a moment.",
          detail: err.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
