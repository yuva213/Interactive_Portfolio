import React from "react";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, Loader2 } from "lucide-react";
import RevealAnimation from "@/components/reveal-animations";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | Portfolio",
  description: "Thoughts, tutorials, and updates from the space.",
};

export default async function BlogPage() {
  await dbConnect();
  const posts = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen font-sans">
      <RevealAnimation>
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Space Log
        </h1>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto italic font-mono">
          "Sharing discoveries from the frontier of code."
        </p>
      </RevealAnimation>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any, index: number) => (
          <RevealAnimation key={post.slug} delay={index * 0.1}>
            <Link href={`/blogs/${post.slug}`}>
              <Card className="h-[300px] flex flex-col bg-zinc-950/40 border-zinc-900 border-2 backdrop-blur-sm hover:border-purple-500/50 transition-all group overflow-hidden rounded-3xl">
                <CardHeader className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400 px-3 py-1 font-mono uppercase text-[10px] tracking-widest">
                      {post.tags?.[0] || "LOG"}
                    </Badge>
                    <span className="text-[10px] uppercase font-bold text-zinc-600 flex items-center gap-2">
                      <CalendarDays className="w-3 h-3 text-purple-500" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-black group-hover:text-purple-400 transition-colors leading-tight mb-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-zinc-500 font-mono text-sm leading-relaxed">
                    {post.content.substring(0, 150)}...
                  </CardDescription>
                </CardHeader>
                <CardFooter className="bg-zinc-900/10 border-t border-zinc-900/50 py-4 px-6 flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-600">
                    <User className="w-4 h-4 text-purple-500" />
                    {post.author || "ADMIN"}
                  </div>
                  <span className="text-[10px] text-zinc-700 font-black uppercase tracking-tighter">READ_POST →</span>
                </CardFooter>
              </Card>
            </Link>
          </RevealAnimation>
        ))}
      </div>
      
      {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-zinc-900 rounded-[3rem]">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-800 mb-6" />
              <p className="text-zinc-700 font-black uppercase tracking-widest text-center">Awaiting data from deep space...</p>
          </div>
      )}
    </div>
  );
}
