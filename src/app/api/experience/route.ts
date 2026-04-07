import dbConnect from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const experiences = await Experience.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}
