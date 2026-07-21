import Link from "next/link";
import { BlogPost } from "@/data/blog";

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block"
    >
      {/* Image */}
      <div className="overflow-hidden rounded-[1.15rem] bg-[var(--amelia-soft)]">
        <img
          src={post.image}
          alt={post.title}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            featured ? "h-[220px] sm:h-[250px]" : "h-48 sm:h-52"
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className="mt-5 inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--amelia-purple)]">
          {post.category}
        </span>

        <h3
          className={`mt-3 font-semibold leading-tight tracking-[-0.02em] text-[var(--amelia-ink)] transition-colors duration-200 line-clamp-2 ${
            featured ? "text-[1.4rem] font-display" : "font-display text-[1.55rem]"
          }`}
        >
          {post.title}
        </h3>

        <p className="mt-2 text-sm font-light leading-relaxed text-[var(--amelia-body)] line-clamp-2">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-[var(--amelia-line)] pt-3 text-[11px] text-[var(--amelia-muted)]">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime} de leitura</span>
        </div>
      </div>
    </Link>
  );
}
