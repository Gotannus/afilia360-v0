"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Radio, CalendarDays, ExternalLink, FileText, PlayCircle, ArrowUpRight } from "lucide-react"

export type Live = {
  id: string
  title: string
  description: string | null
  cover_image: string | null
  stream_url: string | null
  scheduled_at: string | null
  status: "upcoming" | "live" | "ended"
  materials: LiveMaterial[]
  created_at: string
}

export type LiveMaterial = {
  id: string
  name: string
  url: string
  type: "pdf" | "html" | "link"
}

const statusConfig = {
  upcoming: {
    label: "Em Breve",
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    dotClass: "bg-amber-500",
    pulse: false,
  },
  live: {
    label: "Ao Vivo",
    badgeClass: "border-red-500/30 bg-red-500/15 text-red-400",
    dotClass: "bg-red-500",
    pulse: true,
  },
  ended: {
    label: "Encerrada",
    badgeClass: "border-zinc-600/30 bg-zinc-700/20 text-zinc-500",
    dotClass: "bg-zinc-500",
    pulse: false,
  },
}

function formatDateTime(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface LiveCardProps {
  live: Live
  featured?: boolean
}

export function LiveCard({ live, featured = false }: LiveCardProps) {
  const cfg = statusConfig[live.status]

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
        {/* Cover */}
        <div className="relative h-52 w-full overflow-hidden bg-secondary">
          {live.cover_image ? (
            <img
              src={live.cover_image}
              alt={live.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-red-950 to-zinc-900 flex items-center justify-center">
              <Radio className="h-16 w-16 text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Status badge */}
          <div className="absolute left-4 top-4">
            <Badge
              variant="outline"
              className={`gap-1.5 px-2.5 py-1 text-[11px] font-semibold ${cfg.badgeClass}`}
            >
              <span className="relative flex h-2 w-2">
                {cfg.pulse && (
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dotClass} opacity-75`} />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${cfg.dotClass}`} />
              </span>
              {cfg.label}
            </Badge>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-lg font-bold leading-snug text-white line-clamp-2 text-balance">
              {live.title}
            </h3>
            {live.scheduled_at && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                <CalendarDays className="h-3 w-3" />
                {formatDateTime(live.scheduled_at)}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {live.description && (
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {live.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {live.stream_url && live.status !== "upcoming" ? (
              <a href={live.stream_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" className="w-full gap-2">
                  {live.status === "live" ? (
                    <>
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      Assistir Agora
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-3.5 w-3.5" />
                      Ver Gravação
                    </>
                  )}
                </Button>
              </a>
            ) : live.status === "upcoming" ? (
              <Button variant="outline" size="sm" className="flex-1 gap-2" disabled>
                <CalendarDays className="h-3.5 w-3.5" />
                Em breve
              </Button>
            ) : null}

            <Link href={`/novidades/live/${live.id}`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                {live.materials.length > 0 ? (
                  <>
                    <FileText className="h-3.5 w-3.5" />
                    {live.materials.length} {live.materials.length === 1 ? "material" : "materiais"}
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-3.5 w-3.5" />
                    Detalhes
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // Compact card
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card/70 transition-all duration-150 hover:border-white/12 hover:bg-card">
      <div className="flex items-center gap-4 p-4">
        {/* Accent bar */}
        <div className={`absolute inset-y-0 left-0 w-[3px] rounded-r-full ${cfg.dotClass} opacity-40`} />

        {/* Thumbnail */}
        <div className="relative ml-1.5 h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
          {live.cover_image ? (
            <img src={live.cover_image} alt={live.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-red-950 to-zinc-900 flex items-center justify-center">
              <Radio className="h-5 w-5 text-white/20" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <Badge
              variant="outline"
              className={`gap-1 px-1.5 py-0 text-[10px] ${cfg.badgeClass}`}
            >
              {cfg.label}
            </Badge>
            {live.scheduled_at && (
              <span className="text-[10px] text-muted-foreground/60">{formatDateTime(live.scheduled_at)}</span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground transition-colors group-hover:text-white line-clamp-1">
            {live.title}
          </p>
          {live.materials.length > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground/60">
              {live.materials.length} {live.materials.length === 1 ? "material" : "materiais"}
            </p>
          )}
        </div>

        <Link href={`/novidades/live/${live.id}`} className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-muted-foreground">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
