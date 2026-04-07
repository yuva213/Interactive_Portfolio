import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const blog = await Blog.findOne({ slug, isPublished: true });
      if (!blog) return NextResponse.json({ error: "Post not found" }, { status: 404 });
      return NextResponse.json(blog);
    }

    const blogs = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
