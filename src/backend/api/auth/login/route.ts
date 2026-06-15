import { NextResponse } from "next/server";
import dbConnect from "@/backend/database/mongodb";
import Admin from "@/backend/models/Admin";
import { validateLoginInput } from "@/backend/validations";
import { signJWT } from "@/backend/services/jwt";

export async function POST(request: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const validation = validateLoginInput(body);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    await dbConnect();

    const admin = await Admin.findOne({ email: validation.data.email });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await admin.comparePassword(validation.data.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT using jose
    const token = await signJWT({ 
        id: admin._id, 
        email: admin.email, 
        role: admin.role 
    }, JWT_SECRET);

    // Create response
    const response = NextResponse.json(
      { success: true, data: { id: admin._id, email: admin.email, role: admin.role } },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/login] Error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
