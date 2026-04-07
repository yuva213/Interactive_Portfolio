import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
