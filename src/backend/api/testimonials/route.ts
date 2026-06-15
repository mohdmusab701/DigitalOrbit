import { NextResponse } from "next/server";
import dbConnect from '@/backend/database/mongodb';
import Testimonial from '@/backend/models/Testimonial';

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({ featured: true });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ message: "Create testimonial placeholder" });
}
