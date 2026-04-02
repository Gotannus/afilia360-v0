"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Palette, Megaphone, CalendarDays, PlayCircle, ArrowUpRight } from "lucide-react"

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

/** Retorna true se o conteúdo for HTML completo (aula/Netflix) */
export function isFullHtml(content: string | null): boolean {
  if (!content) return false
  const trimmed = content.trimStart().toLowerCase()
  return trimmed.startsWith("<!doctype") || trimmed.startsWith("<html")
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
    hoverRing: "group-hover:ring-blue-500/30",
  },
  lesson: {
    label: "Nova Aula",
    icon: PlayCircle,
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-400",
    accentBorder: "border-violet-500/25",
    bar: "bg-violet-500",
    placeholder: "from-violet-950 to-zinc-900",
    hoverRing: "group-hover:ring-violet-500/30",
  },
  creative: {
    label: "Criativos",
    icon: Palette,
    accentBg: "bg-amber-500/10",
    accentText: "text-amber-400",
    accentBorder: "border-amber-500/25",
    bar: "bg-amber-500",
    placeholder: "from-amber-950 to-zinc-900",
    hoverRing: "group-hover:ring-amber-500/30",
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
  /** Chamado quando o post tem HTML completo e deve abrir em modal */
  onOpenHtml?: (post: NewsPost) => void
}

export function NewsCard({ post, featured = false, onOpenHtml }: NewsCardProps) {
  const cfg = categoryConfig[post.category]
  const Icon = cfg.icon
  const isHtml = isFullHtml(post.content)
  const isLesson = post.category === "lesson"

  function handleClick(e: React.MouseEvent) {
    if (isHtml && onOpenHtml) {
      e.preventDefault()
      onOpenHtml(post)
    }
  }

  if (featured) {
    return (
      <Link href={`/novidades/${post.id}`} onClick={handleClick} className="group block">
        <article
          className={`relative overflow-hidden rounded-xl border border-border bg-card ring-1 ring-transparent transition-all duration-200 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 ${cfg.hoverRing}`}
        >
          {/* Cover */}
          <div className="relative aspect-video w-full overflow-hidden bg-secondary">
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${cfg.placeholder}`}>
                <Icon className="h-16 w-16 text-white/10" />
              </div>
            )}

            {/* Overlay escuro on hover para lessons */}
            {isLesson && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/50">
                <div className="flex scale-75 flex-col items-center gap-2 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40 backdrop-blur-sm">
                    <PlayCircle className="h-7 w-7 text-white" />
                  </div>
                  {isHtml ? (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      Abrir Aula
                    </span>
                  ) : null}
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Left accent bar */}
            <div className={`absolute left-0 top-0 h-full w-[3px] ${cfg.bar}`} />

            {/* Category badge */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Badge
                variant="outline"
                className={`gap-1.5 border px-2 py-0.5 text-[11px] font-semibold ${cfg.accentBorder} ${cfg.accentBg} ${cfg.accentText}`}
              >
                <Icon className="h-3 w-3" />
                {cfg.label}
              </Badge>
              {isHtml && (
                <Badge variant="outline" className="border-white/15 bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white/70 backdrop-blur-sm">
                  HTML
                </Badge>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-5">
            <h3 className="mb-1.5 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-white text-balance">
              {post.title}
            </h3>
            {post.description && (
              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <CalendarDays className="h-3 w-3" />
                {formatDate(post.created_at)}
              </span>
              <span className={`flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 ${cfg.accentText}`}>
                {isLesson && isHtml ? "Abrir Aula" : "Ler mais"} <ArrowUpRight className="h-3 w-3" />
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
    <Link href={`/novidades/${post.id}`} onClick={handleClick} className="group block">
      <article className="relative flex items-center gap-4 overflow-hidden rounded-lg border border-border bg-card/70 p-4 transition-all duration-150 hover:border-white/12 hover:bg-card">
        {/* Accent bar */}
        <div className={`absolute inset-y-0 left-0 w-[3px] rounded-r-full opacity-60 ${cfg.bar}`} />

        {/* Thumbnail */}
        <div className="relative ml-1.5 h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
          {post.cover_image ? (
            <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${cfg.placeholder}`}>
              {isLesson ? (
                <PlayCircle className="h-5 w-5 text-white/30" />
              ) : (
                <Icon className="h-5 w-5 text-white/20" />
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase tracking-wide ${cfg.accentText}`}>
              {cfg.label}
            </span>
            <span className="text-[10px] text-muted-foreground/60">{formatDate(post.created_at)}</span>
            {isHtml && (
              <span className="rounded bg-secondary px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground/50">
                HTML
              </span>
            )}
          </div>
          <p className="line-clamp-1 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-white">
            {post.title}
          </p>
          {post.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{post.description}</p>
          )}
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
      </article>
    </Link>
  )
}
