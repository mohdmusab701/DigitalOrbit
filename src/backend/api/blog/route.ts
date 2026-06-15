import { NextResponse } from "next/server";
import dbConnect from '@/backend/database/mongodb';
import Blog from '@/backend/models/Blog';

export async function GET() {
  try {
    await dbConnect();
    const posts = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ message: "Create blog post placeholder" });
}
