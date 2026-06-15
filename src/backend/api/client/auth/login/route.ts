import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import dbConnect from "@/backend/database/mongodb";
import Client from "@/backend/models/Client";
import { validateClientLoginInput } from "@/backend/validations";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateClientLoginInput(body);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    await dbConnect();

    const client = await Client.findOne({ email: validation.data.email });
    
    if (!client || client.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Invalid credentials or inactive account." },
        { status: 401 }
      );
    }

    if (!client.password) {
      return NextResponse.json(
        { success: false, error: "Account not setup for login. Please contact admin." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(validation.data.password as string, client.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ id: client._id, role: "client", email: client.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json(
      { success: true, message: "Logged in successfully" },
      { status: 200 }
    );

    response.cookies.set("client_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("[Client Login Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
