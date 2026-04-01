"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Radio, CalendarDays, ExternalLink, FileText, PlayCircle } from "lucide-react"

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
    badgeClass: "border-amber-500/40 bg-amber-500/15 text-amber-400",
    dotClass: "bg-amber-500",
    pulse: false,
  },
  live: {
    label: "Ao Vivo",
    badgeClass: "border-red-500/40 bg-red-500/20 text-red-400",
    dotClass: "bg-red-500",
    pulse: true,
  },
  ended: {
    label: "Encerrada",
    badgeClass: "border-zinc-500/40 bg-zinc-500/10 text-zinc-400",
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
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40">
        {/* Cover */}
        <div className="relative h-64 w-full overflow-hidden bg-secondary">
          {live.cover_image ? (
            <img
              src={live.cover_image}
              alt={live.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-red-900/60 to-zinc-900 flex items-center justify-center">
              <Radio className="h-20 w-20 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Status badge overlaid on image */}
          <div className="absolute left-4 top-4">
            <Badge variant="outline" className={`gap-1.5 px-2.5 py-1 text-xs font-semibold ${cfg.badgeClass}`}>
              <span className={`relative flex h-2 w-2 items-center justify-center`}>
                {cfg.pulse && (
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dotClass} opacity-75`} />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${cfg.dotClass}`} />
              </span>
              {cfg.label}
            </Badge>
          </div>

          {/* Title over image */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-bold leading-snug text-white line-clamp-2">{live.title}</h3>
            {live.scheduled_at && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDateTime(live.scheduled_at)}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {live.description && (
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">{live.description}</p>
          )}
          <div className="flex items-center gap-3">
            {live.stream_url && live.status !== "upcoming" ? (
              <a href={live.stream_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full gap-2" size="sm">
                  {live.status === "live" ? (
                    <><Radio className="h-4 w-4 animate-pulse" /> Assistir Agora</>
                  ) : (
                    <><PlayCircle className="h-4 w-4" /> Ver Gravação</>
                  )}
                </Button>
              </a>
            ) : live.status === "upcoming" ? (
              <Button variant="outline" size="sm" className="flex-1 gap-2" disabled>
                <CalendarDays className="h-4 w-4" />
                Em breve
              </Button>
            ) : null}
            {live.materials.length > 0 && (
              <Link href={`/novidades/live/${live.id}`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <FileText className="h-4 w-4" />
                  {live.materials.length} {live.materials.length === 1 ? "material" : "materiais"}
                </Button>
              </Link>
            )}
            {live.materials.length === 0 && (
              <Link href={`/novidades/live/${live.id}`}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <ExternalLink className="h-4 w-4" />
                  Detalhes
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Compact card
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-white/20">
      <div className="flex items-center gap-4 p-4">
        {/* Thumb */}
        <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md bg-secondary">
          {live.cover_image ? (
            <img src={live.cover_image} alt={live.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-red-900/60 to-zinc-900 flex items-center justify-center">
              <Radio className="h-6 w-6 text-white/30" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="outline" className={`gap-1 px-1.5 py-0 text-[10px] ${cfg.badgeClass}`}>
              {cfg.label}
            </Badge>
            {live.scheduled_at && (
              <span className="text-[10px] text-muted-foreground">{formatDateTime(live.scheduled_at)}</span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground line-clamp-1">{live.title}</p>
          {live.materials.length > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {live.materials.length} {live.materials.length === 1 ? "material" : "materiais"} disponíveis
            </p>
          )}
        </div>

        <Link href={`/novidades/live/${live.id}`} className="shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
