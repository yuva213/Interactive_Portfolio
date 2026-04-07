import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected an array of projects" }, { status: 400 });
    }

    // Insert all projects into the DB at once
    const projects = await Project.insertMany(body);
    return NextResponse.json({ success: true, count: projects.length }, { status: 201 });
  } catch (error: any) {
    console.error("Error bulk creating projects:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Failed to bulk create projects" }, { status: 500 });
  }
}
