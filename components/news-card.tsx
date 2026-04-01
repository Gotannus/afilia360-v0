"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Palette, Megaphone, CalendarDays } from "lucide-react"

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
    gradient: "from-blue-600/80 to-blue-900/60",
    badge: "border-blue-500/40 bg-blue-500/15 text-blue-400",
    bar: "bg-blue-500",
  },
  lesson: {
    label: "Nova Aula",
    icon: BookOpen,
    gradient: "from-violet-600/80 to-violet-900/60",
    badge: "border-violet-500/40 bg-violet-500/15 text-violet-400",
    bar: "bg-violet-500",
  },
  creative: {
    label: "Criativo",
    icon: Palette,
    gradient: "from-amber-600/80 to-amber-900/60",
    badge: "border-amber-500/40 bg-amber-500/15 text-amber-400",
    bar: "bg-amber-500",
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
        <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-0.5">
          {/* Cover */}
          <div className="relative h-56 w-full overflow-hidden bg-secondary">
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
                <Icon className="h-16 w-16 text-white/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className={`absolute left-0 top-0 h-full w-1 ${cfg.bar}`} />
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-xs ${cfg.badge}`}>
                <Icon className="h-3 w-3" />
                {cfg.label}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                {formatDate(post.created_at)}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground group-hover:text-white transition-colors line-clamp-2">
              {post.title}
            </h3>
            {post.description && (
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{post.description}</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Compact horizontal card
  return (
    <Link href={`/novidades/${post.id}`} className="group block">
      <div className="relative flex items-center gap-4 overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-white/20 hover:bg-secondary/50">
        <div className={`absolute inset-y-0 left-0 w-0.5 ${cfg.bar}`} />

        {/* Thumb */}
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-secondary">
          {post.cover_image ? (
            <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
              <Icon className="h-6 w-6 text-white/40" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="outline" className={`gap-1 px-1.5 py-0 text-[10px] ${cfg.badge}`}>
              <Icon className="h-2.5 w-2.5" />
              {cfg.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{formatDate(post.created_at)}</span>
          </div>
          <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-white transition-colors">
            {post.title}
          </p>
          {post.description && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{post.description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
