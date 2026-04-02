"use client"

import { useEffect, useState } from "react"
import type { NewsPost } from "@/components/news-card"
import { isFullHtml } from "@/components/news-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Megaphone, Palette, CalendarDays, Tag, Maximize2, PlayCircle } from "lucide-react"
import Link from "next/link"

const categoryConfig = {
  update: {
    label: "Atualização",
    icon: Megaphone,
    gradient: "from-blue-950 to-zinc-900",
    badge: "border-blue-500/40 bg-blue-500/15 text-blue-400",
    bar: "bg-blue-500",
  },
  lesson: {
    label: "Nova Aula",
    icon: PlayCircle,
    gradient: "from-violet-950 to-zinc-900",
    badge: "border-violet-500/40 bg-violet-500/15 text-violet-400",
    bar: "bg-violet-500",
  },
  creative: {
    label: "Criativo",
    icon: Palette,
    gradient: "from-amber-950 to-zinc-900",
    badge: "border-amber-500/40 bg-amber-500/15 text-amber-400",
    bar: "bg-amber-500",
  },
}

export function NewsDetailClient({ post }: { post: NewsPost }) {
  const cfg = categoryConfig[post.category]
  const Icon = cfg.icon
  const isHtml = isFullHtml(post.content)
  const [fullscreen, setFullscreen] = useState(false)

  // Scroll to top ao montar
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }) }, [])

  // Fecha fullscreen com Escape
  useEffect(() => {
    if (!fullscreen) return
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setFullscreen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [fullscreen])

  // Se for HTML completo e fullscreen estiver ativo
  if (fullscreen && isHtml && post.content) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-black" role="dialog" aria-modal="true" aria-label={post.title}>
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/80 px-4 py-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-semibold ${cfg.badge}`}>
              {cfg.label}
            </Badge>
            <span className="max-w-xs truncate text-sm font-medium text-white/80">{post.title}</span>
          </div>
          <button
            onClick={() => setFullscreen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fechar fullscreen"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <iframe
          srcDoc={post.content}
          title={post.title}
          className="h-full w-full flex-1 border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Voltar */}
      <Link
        href="/novidades"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Novidades
      </Link>

      {/* Capa */}
      <div className="relative mb-8 w-full overflow-hidden rounded-2xl border border-border bg-secondary" style={{ aspectRatio: "16/9" }}>
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${cfg.gradient}`}>
            <Icon className="h-24 w-24 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Accent bar */}
        <div className={`absolute left-0 top-0 h-full w-1 ${cfg.bar}`} />
      </div>

      {/* Meta */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Badge variant="outline" className={`gap-1.5 px-2.5 py-1 text-xs font-medium ${cfg.badge}`}>
          <Icon className="h-3 w-3" />
          {cfg.label}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          {new Date(post.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </span>
        {isHtml && (
          <Badge variant="outline" className="border-white/15 bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            Conteúdo HTML
          </Badge>
        )}
      </div>

      {/* Título */}
      <h1 className="mb-3 text-3xl font-bold leading-snug text-foreground text-pretty">{post.title}</h1>

      {/* Descrição */}
      {post.description && (
        <p className="mb-6 text-base leading-relaxed text-muted-foreground">{post.description}</p>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-muted-foreground/60" />
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Botão abrir fullscreen para HTML completo */}
      {isHtml && post.content && (
        <div className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
                <PlayCircle className="h-4.5 w-4.5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Esta aula contém conteúdo interativo</p>
                <p className="text-xs text-muted-foreground">Abre em tela cheia para melhor experiência</p>
              </div>
            </div>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => setFullscreen(true)}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Abrir Aula
            </Button>
          </div>

          {/* Preview compacto */}
          <div className="border-t border-border">
            <iframe
              srcDoc={post.content}
              title={post.title}
              className="h-64 w-full border-0 sm:h-80"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      )}

      {/* Conteúdo HTML de blog (não fullscreen) */}
      {post.content && !isHtml && (
        <div
          className="prose prose-invert prose-sm max-w-none leading-relaxed text-foreground/90 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-medium [&_p]:mb-4 [&_p]:leading-7 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_a]:text-primary [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-secondary [&_pre]:p-4 [&_hr]:my-8 [&_hr]:border-border [&_img]:rounded-xl [&_table]:w-full [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:p-2"
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
