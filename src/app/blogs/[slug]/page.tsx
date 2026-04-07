import React from "react";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import ScrollProgress from "@/components/ui/scroll-progress";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RevealAnimation from "@/components/reveal-animations";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  await dbConnect();
  const posts = await Blog.find({ isPublished: true }, { slug: 1 }).lean();
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  try {
    const post = await Blog.findOne({ slug }).lean() as any;
    if (!post) return { title: "Post Not Found" };
    return {
      title: `${post.title} | Portfolio`,
      description: post.content.substring(0, 160),
    };
  } catch {
    return {
      title: "Blog Not Found | Portfolio",
    };
  }
}

const components = {
  h1: (props: any) => (
    <h1 className="text-3xl md:text-5xl font-bold mt-12 mb-6 text-zinc-100" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-4 text-zinc-200" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-zinc-300" {...props} />
  ),
  p: (props: any) => (
    <p className="text-zinc-400 leading-relaxed mb-6 text-lg" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-6 text-zinc-400 space-y-2" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-6 text-zinc-400 space-y-2" {...props} />
  ),
  li: (props: any) => <li className="ml-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-purple-500 pl-4 italic text-zinc-400 my-6 bg-zinc-900/50 py-2 pr-4 rounded-r"
      {...props}
    />
  ),
  code: (props: any) => (
    <code className="bg-zinc-900 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto mb-6 border border-zinc-800" {...props} />
  ),
  a: (props: any) => (
    <a className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors" {...props} />
  ),
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  
  const post = await Blog.findOne({ slug }).lean() as any;

  if (!post) notFound();

  return (
    <div className="min-h-screen relative font-sans bg-black">
      <ScrollProgress className="bg-gradient-to-r from-purple-500 to-pink-500" />

      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <RevealAnimation>
          <Link
            href="/blogs"
            className="inline-flex items-center text-zinc-500 hover:text-purple-400 transition-colors mb-8 group font-mono text-sm uppercase tracking-widest font-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            ←_RETURN_TO_LOGS
          </Link>
        </RevealAnimation>

        <RevealAnimation delay={0.1}>
          <div className="mb-12 border-b border-zinc-900 pb-12">
            <div className="flex gap-4 mb-8 flex-wrap">
              {post.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="border-zinc-800 text-zinc-500 hover:text-purple-400 px-4 py-1 rounded-full uppercase text-[10px] font-black tracking-widest">
                  #{tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-700">
              {post.title}
            </h1>
            <div className="flex items-center gap-10 text-zinc-600 text-xs font-black uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                BY_{post.author || "ADMIN"}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-purple-600" />
                DATE_{new Date(post.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </RevealAnimation>

        <RevealAnimation delay={0.2}>
          <article className="prose prose-invert max-w-none prose-purple lg:prose-xl">
            <MDXRemote source={post.content} components={components} />
          </article>
        </RevealAnimation>
      </div>
    </div>
  );
}
