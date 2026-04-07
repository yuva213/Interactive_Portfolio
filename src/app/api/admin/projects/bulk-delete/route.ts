import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    await Project.deleteMany({});
    return NextResponse.json({ success: true, message: "All projects wiped." }, { status: 200 });
  } catch (error: any) {
    console.error("Error bulk deleting projects:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Failed to wipe projects" }, { status: 500 });
  }
}
