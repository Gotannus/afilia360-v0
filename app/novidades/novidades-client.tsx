"use client"

import { useState } from "react"
import type { NewsPost } from "@/components/news-card"
import type { Live } from "@/components/live-card"
import { NewsCard } from "@/components/news-card"
import { LiveCard } from "@/components/live-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Megaphone, Palette, Radio, Sparkles, LayoutGrid, ArrowRight } from "lucide-react"
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

export function NovidadesClient({ initialPosts, initialLives }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("todos")

  const liveLive = initialLives.find((l) => l.status === "live")
  const upcomingLives = initialLives.filter((l) => l.status === "upcoming")
  const endedLives = initialLives.filter((l) => l.status === "ended")

  const filteredPosts =
    activeTab === "todos" || activeTab === "lives"
      ? initialPosts
      : initialPosts.filter((p) => p.category === activeTab)

  const showLives = activeTab === "todos" || activeTab === "lives"
  const showPosts = activeTab !== "lives"

  const featuredPost = filteredPosts[0]
  const secondPost = filteredPosts[1]
  const restPosts = filteredPosts.slice(2)

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ── Page header ── */}
      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Central de</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Novidades</h1>
          <p className="mt-1 text-sm text-muted-foreground">Fique por dentro das atualizações, aulas e criativos</p>
        </div>
        {initialLives.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground sm:mt-0">
            <span className="flex h-2 w-2 rounded-full bg-red-500" />
            <span>{initialLives.filter((l) => l.status === "live").length > 0 ? "Live agora" : `${initialLives.length} lives`}</span>
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
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
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
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/15">
                <Radio className="h-3.5 w-3.5 text-red-400" />
              </div>
              <h2 className="text-base font-semibold">Transmissões</h2>
              <span className="text-sm text-muted-foreground">({initialLives.length})</span>
            </div>
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
                {endedLives.slice(0, 4).map((live) => (
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
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
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
          </div>

          {/* Top 2 featured cards side by side */}
          {featuredPost && (
            <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <NewsCard post={featuredPost} featured />
              {secondPost && <NewsCard post={secondPost} featured />}
            </div>
          )}

          {/* Remaining as compact grid */}
          {restPosts.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {restPosts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
