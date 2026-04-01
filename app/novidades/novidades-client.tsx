"use client"

import { useState } from "react"
import type { NewsPost } from "@/components/news-card"
import type { Live } from "@/components/live-card"
import { NewsCard } from "@/components/news-card"
import { LiveCard } from "@/components/live-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Megaphone, Palette, Radio, Sparkles, ChevronRight, LayoutGrid } from "lucide-react"
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

  const filteredPosts = activeTab === "todos" || activeTab === "lives"
    ? initialPosts
    : initialPosts.filter((p) => p.category === activeTab)

  const showLives = activeTab === "todos" || activeTab === "lives"
  const showPosts = activeTab !== "lives"

  // Featured = first post of the filtered set
  const featuredPost = filteredPosts[0]
  const restPosts = filteredPosts.slice(1)

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ── Hero banner (active live) ── */}
      {liveLive && (
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-red-500/30 bg-card">
          <div className="relative h-72 w-full overflow-hidden">
            {liveLive.cover_image ? (
              <img src={liveLive.cover_image} alt={liveLive.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-red-900/60 to-zinc-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:justify-center">
            <Badge variant="outline" className="mb-4 w-fit gap-1.5 border-red-500/50 bg-red-500/20 px-3 py-1 text-sm font-semibold text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Ao Vivo Agora
            </Badge>
            <h1 className="mb-2 max-w-xl text-3xl font-bold text-white text-balance">{liveLive.title}</h1>
            {liveLive.description && (
              <p className="mb-5 max-w-lg text-sm text-white/70 line-clamp-2">{liveLive.description}</p>
            )}
            <div className="flex items-center gap-3">
              {liveLive.stream_url && (
                <a href={liveLive.stream_url} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                    <Radio className="h-4 w-4 animate-pulse" />
                    Assistir Agora
                  </Button>
                </a>
              )}
              <Link href={`/novidades/live/${liveLive.id}`}>
                <Button variant="outline" className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20">
                  Materiais & Detalhes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="mb-8 flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1.5">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {key === "lives" && initialLives.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">
                {initialLives.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Lives section ── */}
      {showLives && initialLives.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-400" />
              <h2 className="text-lg font-semibold">Transmissões</h2>
            </div>
          </div>

          {/* Upcoming lives highlight */}
          {upcomingLives.length > 0 && (
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingLives.map((live) => <LiveCard key={live.id} live={live} featured />)}
            </div>
          )}

          {/* Live now or ended in compact list */}
          {endedLives.length > 0 && (
            <div className="space-y-2">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">Anteriores</p>
              {endedLives.slice(0, 4).map((live) => <LiveCard key={live.id} live={live} />)}
            </div>
          )}
        </section>
      )}

      {/* ── Posts section ── */}
      {showPosts && filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Sparkles className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">Nenhum conteúdo publicado ainda</p>
          <p className="mt-1 text-sm text-muted-foreground/60">Em breve novidades por aqui!</p>
        </div>
      )}

      {showPosts && filteredPosts.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary/70" />
              <h2 className="text-lg font-semibold">
                {activeTab === "todos" ? "Todas as Novidades" :
                 activeTab === "update" ? "Atualizações" :
                 activeTab === "lesson" ? "Novas Aulas" : "Criativos"}
              </h2>
              <span className="text-sm text-muted-foreground">({filteredPosts.length})</span>
            </div>
          </div>

          {/* Featured first post */}
          {featuredPost && (
            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <NewsCard post={featuredPost} featured />
              {/* Secondary featured alongside */}
              {restPosts[0] && <NewsCard post={restPosts[0]} featured />}
            </div>
          )}

          {/* Rest as compact list */}
          {restPosts.length > 1 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {restPosts.slice(1).map((post) => <NewsCard key={post.id} post={post} />)}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
