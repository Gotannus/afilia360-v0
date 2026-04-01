"use client"

import type { NewsPost } from "@/components/news-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Megaphone, Palette, CalendarDays, Tag } from "lucide-react"
import Link from "next/link"

const categoryConfig = {
  update: { label: "Atualização", icon: Megaphone, gradient: "from-blue-600/80 to-blue-900/60", badge: "border-blue-500/40 bg-blue-500/15 text-blue-400" },
  lesson: { label: "Nova Aula", icon: BookOpen, gradient: "from-violet-600/80 to-violet-900/60", badge: "border-violet-500/40 bg-violet-500/15 text-violet-400" },
  creative: { label: "Criativo", icon: Palette, gradient: "from-amber-600/80 to-amber-900/60", badge: "border-amber-500/40 bg-amber-500/15 text-amber-400" },
}

export function NewsDetailClient({ post }: { post: NewsPost }) {
  const cfg = categoryConfig[post.category]
  const Icon = cfg.icon

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Back */}
      <Link href="/novidades" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Voltar para Novidades
      </Link>

      {/* Cover */}
      <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl border border-border bg-secondary sm:h-80">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
            <Icon className="h-20 w-20 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Meta */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Badge variant="outline" className={`gap-1.5 px-2.5 py-1 text-xs font-medium ${cfg.badge}`}>
          <Icon className="h-3 w-3" />
          {cfg.label}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          {new Date(post.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-3 text-3xl font-bold leading-snug text-foreground text-pretty">{post.title}</h1>

      {/* Description */}
      {post.description && (
        <p className="mb-6 text-base leading-relaxed text-muted-foreground">{post.description}</p>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      {post.content && (
        <div
          className="prose prose-invert prose-sm max-w-none leading-relaxed text-foreground/90 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-medium [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-secondary [&_pre]:p-4 [&_hr]:border-border"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      <div className="mt-12 border-t border-border pt-6">
        <Link href="/novidades">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Ver mais novidades
          </Button>
        </Link>
      </div>
    </main>
  )
}
