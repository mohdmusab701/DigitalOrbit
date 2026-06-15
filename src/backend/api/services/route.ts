import { NextResponse } from "next/server";
import dbConnect from '@/backend/database/mongodb';
import Service from '@/backend/models/Service';

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({ isActive: true });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ message: "Create service placeholder" });
}
