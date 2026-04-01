"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Palette, Megaphone, CalendarDays, ArrowUpRight } from "lucide-react"

export type NewsPost = {
  id: string
  title: string
  description: string | null
  content: string | null
  cover_image: string | null
  category: "update" | "lesson" | "creative"
  tags: string[] | null
  published: boolean
  created_at: string
}

const categoryConfig = {
  update: {
    label: "Atualização",
    icon: Megaphone,
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-400",
    accentBorder: "border-blue-500/25",
    bar: "bg-blue-500",
    placeholder: "from-blue-950 to-zinc-900",
  },
  lesson: {
    label: "Nova Aula",
    icon: BookOpen,
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-400",
    accentBorder: "border-violet-500/25",
    bar: "bg-violet-500",
    placeholder: "from-violet-950 to-zinc-900",
  },
  creative: {
    label: "Criativo",
    icon: Palette,
    accentBg: "bg-amber-500/10",
    accentText: "text-amber-400",
    accentBorder: "border-amber-500/25",
    bar: "bg-amber-500",
    placeholder: "from-amber-950 to-zinc-900",
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

interface NewsCardProps {
  post: NewsPost
  featured?: boolean
}

export function NewsCard({ post, featured = false }: NewsCardProps) {
  const cfg = categoryConfig[post.category]
  const Icon = cfg.icon

  if (featured) {
    return (
      <Link href={`/novidades/${post.id}`} className="group block">
        <article className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
          {/* Cover image */}
          <div className="relative h-52 w-full overflow-hidden bg-secondary">
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${cfg.placeholder} flex items-center justify-center`}>
                <Icon className="h-14 w-14 text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Category accent bar */}
            <div className={`absolute left-0 top-0 h-full w-[3px] ${cfg.bar}`} />
            {/* Category badge over image */}
            <div className="absolute left-4 top-4">
              <Badge
                variant="outline"
                className={`gap-1.5 border px-2 py-0.5 text-[11px] font-semibold ${cfg.accentBorder} ${cfg.accentBg} ${cfg.accentText}`}
              >
                <Icon className="h-3 w-3" />
                {cfg.label}
              </Badge>
            </div>
          </div>

          {/* Body */}
          <div className="p-5">
            <h3 className="mb-1.5 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-white line-clamp-2 text-balance">
              {post.title}
            </h3>
            {post.description && (
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">{post.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <CalendarDays className="h-3 w-3" />
                {formatDate(post.created_at)}
              </span>
              <span className={`flex items-center gap-1 text-xs font-medium transition-opacity opacity-0 group-hover:opacity-100 ${cfg.accentText}`}>
                Ler mais <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </Link>
    )
  }

  // Compact horizontal card
  return (
    <Link href={`/novidades/${post.id}`} className="group block">
      <article className="relative flex items-center gap-4 overflow-hidden rounded-lg border border-border bg-card/70 p-4 transition-all duration-150 hover:border-white/12 hover:bg-card">
        {/* Accent bar */}
        <div className={`absolute inset-y-0 left-0 w-[3px] rounded-r-full ${cfg.bar} opacity-60`} />

        {/* Thumbnail */}
        <div className="relative ml-1.5 h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
          {post.cover_image ? (
            <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${cfg.placeholder} flex items-center justify-center`}>
              <Icon className="h-5 w-5 text-white/20" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase tracking-wide ${cfg.accentText}`}>
              {cfg.label}
            </span>
            <span className="text-[10px] text-muted-foreground/60">{formatDate(post.created_at)}</span>
          </div>
          <p className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-white line-clamp-1">
            {post.title}
          </p>
          {post.description && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{post.description}</p>
          )}
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-all group-hover:text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </article>
    </Link>
  )
}
