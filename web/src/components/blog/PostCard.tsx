import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/data/blog";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-6 py-6 border-b border-gray-100 last:border-0"
    >
      <div className="relative flex-shrink-0 w-32 h-24 md:w-48 md:h-32 rounded-xl overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 8rem, 12rem"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7b6bb2]">
          {post.category}
        </span>

        <h3 className="mt-1 text-lg font-semibold text-[#1a1a1a] group-hover:text-[#5e4985] transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="mt-2 text-sm text-gray-500 line-clamp-2 hidden md:block">
          {post.excerpt}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime} de leitura</span>
        </div>
      </div>
    </Link>
  );
}
