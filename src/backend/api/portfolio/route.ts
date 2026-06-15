import { NextResponse } from "next/server";
import dbConnect from '@/backend/database/mongodb';
import Project from '@/backend/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({});
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ message: "Create project placeholder" });
}
