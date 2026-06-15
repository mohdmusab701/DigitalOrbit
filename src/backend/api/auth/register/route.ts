import { NextResponse } from "next/server";
import dbConnect from '@/backend/database/mongodb';
import User from '@/backend/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 });
    }

    const newUser = await User.create({
      name,
      email,
      passwordHash: password, // In production, hash this using bcrypt
      role: "user"
    });

    return NextResponse.json({ success: true, user: { id: newUser._id, name: newUser.name, email: newUser.email } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
