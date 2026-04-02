"use client"

import { useState, useEffect, useCallback } from "react"
import type { NewsPost } from "@/components/news-card"
import { isFullHtml } from "@/components/news-card"
import type { Live } from "@/components/live-card"
import { NewsCard } from "@/components/news-card"
import { LiveCard } from "@/components/live-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen, Megaphone, Palette, Radio, Sparkles,
  LayoutGrid, X, Maximize2, Radio as RadioIcon,
  PlayCircle, ArrowRight,
} from "lucide-react"
import Link from "next/link"

type Tab = "todos" | "update" | "lesson" | "creative" | "lives"

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "todos", label: "Todos", icon: LayoutGrid },
  { key: "update", label: "Atualizações", icon: Megaphone },
  { key: "lesson", label: "Novas Aulas", icon: BookOpen },
  { key: "creative", label: "Criativos", icon: Palette },
  { key: "lives", label: "Lives", icon: Radio },
]

interface Props {
  initialPosts: NewsPost[]
  initialLives: Live[]
}

// ── Modal HTML fullscreen ─────────────────────────────────────────────────────

function HtmlModal({ post, onClose }: { post: NewsPost; onClose: () => void }) {
  // Fecha ao pressionar Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Cria blob URL a partir do conteúdo HTML
  const srcDoc = post.content ?? ""

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      {/* Barra superior */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/80 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-violet-500/40 bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold text-violet-400">
            {post.category === "lesson" ? "Aula" : post.category === "creative" ? "Criativo" : "Post"}
          </Badge>
          <span className="max-w-xs truncate text-sm font-medium text-white/80">{post.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/novidades/${post.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Abrir em nova aba
          </a>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* iframe fullscreen */}
      <iframe
        srcDoc={srcDoc}
        title={post.title}
        className="h-full w-full flex-1 border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  )
}

// ── Hero card (primeiro post em destaque) ─────────────────────────────────────

function HeroPost({ post, onOpenHtml }: { post: NewsPost; onOpenHtml: (p: NewsPost) => void }) {
  const isHtml = isFullHtml(post.content)
  const isLesson = post.category === "lesson"

  const categoryStyles = {
    update: { badge: "border-blue-500/40 bg-blue-500/15 text-blue-400", bar: "bg-blue-500", icon: Megaphone, label: "Atualização" },
    lesson: { badge: "border-violet-500/40 bg-violet-500/15 text-violet-400", bar: "bg-violet-500", icon: PlayCircle, label: "Nova Aula" },
    creative: { badge: "border-amber-500/40 bg-amber-500/15 text-amber-400", bar: "bg-amber-500", icon: Palette, label: "Criativo" },
  }
  const cfg = categoryStyles[post.category]
  const CatIcon = cfg.icon

  function handleClick(e: React.MouseEvent) {
    if (isHtml && onOpenHtml) {
      e.preventDefault()
      onOpenHtml(post)
    }
  }

  return (
    <Link href={`/novidades/${post.id}`} onClick={handleClick} className="group block">
      <article className="relative overflow-hidden rounded-2xl border border-border bg-card ring-1 ring-transparent transition-all duration-300 hover:ring-white/10">
        {/* Capa fullwidth */}
        <div className="relative h-[340px] w-full overflow-hidden sm:h-[420px]">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
              post.category === "lesson" ? "from-violet-950 via-violet-900/50 to-zinc-900"
              : post.category === "creative" ? "from-amber-950 via-amber-900/50 to-zinc-900"
              : "from-blue-950 via-blue-900/50 to-zinc-900"
            }`}>
              <CatIcon className="h-24 w-24 text-white/5" />
            </div>
          )}

          {/* Gradiente esquerda → direita estilo editorial */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
          {/* Gradiente extra bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Conteúdo sobre a capa */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:justify-center sm:p-10">
            <div className="max-w-lg">
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="outline" className={`gap-1.5 px-2.5 py-1 text-[11px] font-semibold ${cfg.badge}`}>
                  <CatIcon className="h-3 w-3" />
                  {cfg.label}
                </Badge>
                {isHtml && (
                  <Badge variant="outline" className="border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">
                    HTML
                  </Badge>
                )}
              </div>

              <h2 className="mb-3 text-2xl font-bold leading-tight text-white text-balance sm:text-3xl">
                {post.title}
              </h2>
              {post.description && (
                <p className="mb-5 text-sm leading-relaxed text-white/60 line-clamp-2 sm:text-base">
                  {post.description}
                </p>
              )}

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="gap-2 bg-white text-black hover:bg-white/90"
                >
                  {isLesson && isHtml ? (
                    <><PlayCircle className="h-3.5 w-3.5" /> Abrir Aula</>
                  ) : (
                    <><ArrowRight className="h-3.5 w-3.5" /> Ler agora</>
                  )}
                </Button>
                {post.tags && post.tags.length > 0 && (
                  <span className="text-xs text-white/40">
                    {post.tags.slice(0, 2).map(t => `#${t}`).join("  ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function NovidadesClient({ initialPosts, initialLives }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("todos")
  const [htmlModal, setHtmlModal] = useState<NewsPost | null>(null)

  const handleOpenHtml = useCallback((post: NewsPost) => setHtmlModal(post), [])
  const handleCloseModal = useCallback(() => setHtmlModal(null), [])

  const liveLive = initialLives.find((l) => l.status === "live")
  const upcomingLives = initialLives.filter((l) => l.status === "upcoming")
  const endedLives = initialLives.filter((l) => l.status === "ended")

  const filteredPosts =
    activeTab === "todos" || activeTab === "lives"
      ? initialPosts
      : initialPosts.filter((p) => p.category === activeTab)

  const showLives = activeTab === "todos" || activeTab === "lives"
  const showPosts = activeTab !== "lives"

  const heroPost = filteredPosts[0]
  const gridPosts = filteredPosts.slice(1, 5)
  const restPosts = filteredPosts.slice(5)

  return (
    <>
      {/* Modal HTML fullscreen */}
      {htmlModal && <HtmlModal post={htmlModal} onClose={handleCloseModal} />}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Canal de</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Novidades</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Aulas, criativos validados, transmissões e atualizações da plataforma
            </p>
          </div>
          {initialLives.some((l) => l.status === "live") && (
            <div className="mt-3 flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm text-red-400 sm:mt-0">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Live ao vivo agora
            </div>
          )}
        </div>

        {/* ── Active live banner ── */}
        {liveLive && (
          <div className="relative mb-8 overflow-hidden rounded-2xl border border-red-500/25 bg-card">
            <div className="relative h-64 w-full overflow-hidden sm:h-72">
              {liveLive.cover_image ? (
                <img src={liveLive.cover_image} alt={liveLive.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-red-950 to-zinc-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:justify-center sm:p-10">
              <Badge
                variant="outline"
                className="mb-4 w-fit gap-2 border-red-500/40 bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Ao Vivo Agora
              </Badge>
              <h2 className="mb-2 max-w-xl text-2xl font-bold leading-tight text-white text-balance sm:text-3xl">
                {liveLive.title}
              </h2>
              {liveLive.description && (
                <p className="mb-5 max-w-md text-sm leading-relaxed text-white/60 line-clamp-2">
                  {liveLive.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {liveLive.stream_url && (
                  <a href={liveLive.stream_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-2 bg-red-600 text-white hover:bg-red-700">
                      <RadioIcon className="h-3.5 w-3.5 animate-pulse" />
                      Assistir Agora
                    </Button>
                  </a>
                )}
                <Link href={`/novidades/live/${liveLive.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 border-white/15 bg-white/8 text-white/80 hover:bg-white/15 hover:text-white"
                  >
                    Materiais & Detalhes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="mb-8 flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-card/60 p-1 no-scrollbar">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                activeTab === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
              {key === "lives" && initialLives.length > 0 && (
                <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500/20 px-1 text-[10px] font-bold text-red-400">
                  {initialLives.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Lives section ── */}
        {showLives && initialLives.length > 0 && (
          <section className="mb-12">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/15">
                <Radio className="h-3.5 w-3.5 text-red-400" />
              </div>
              <h2 className="text-base font-semibold">Transmissões</h2>
              <span className="text-sm text-muted-foreground">({initialLives.length})</span>
            </div>

            {upcomingLives.length > 0 && (
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingLives.map((live) => (
                  <LiveCard key={live.id} live={live} featured />
                ))}
              </div>
            )}

            {endedLives.length > 0 && (
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Anteriores
                </p>
                <div className="space-y-2">
                  {endedLives.slice(0, 5).map((live) => (
                    <LiveCard key={live.id} live={live} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Empty state ── */}
        {showPosts && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
              <Sparkles className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-base font-medium text-muted-foreground">Nenhum conteúdo publicado ainda</p>
            <p className="mt-1.5 text-sm text-muted-foreground/50">Em breve novidades por aqui!</p>
          </div>
        )}

        {/* ── Posts section ── */}
        {showPosts && filteredPosts.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <h2 className="text-base font-semibold">
                {activeTab === "todos"
                  ? "Todas as Novidades"
                  : activeTab === "update"
                  ? "Atualizações"
                  : activeTab === "lesson"
                  ? "Novas Aulas"
                  : "Criativos"}
              </h2>
              <span className="text-sm text-muted-foreground">({filteredPosts.length})</span>
            </div>

            {/* Hero — primeiro post em destaque fullwidth */}
            {heroPost && (
              <div className="mb-6">
                <HeroPost post={heroPost} onOpenHtml={handleOpenHtml} />
              </div>
            )}

            {/* Grid 2 colunas — próximos 4 posts */}
            {gridPosts.length > 0 && (
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {gridPosts.map((post) => (
                  <NewsCard key={post.id} post={post} featured onOpenHtml={handleOpenHtml} />
                ))}
              </div>
            )}

            {/* Resto em lista compacta */}
            {restPosts.length > 0 && (
              <>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Mais novidades
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {restPosts.map((post) => (
                    <NewsCard key={post.id} post={post} onOpenHtml={handleOpenHtml} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </>
  )
}
