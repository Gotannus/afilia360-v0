"use client"

import { useState } from "react"
import type { Live, LiveMaterial } from "@/components/live-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Radio, CalendarDays, ExternalLink, FileText, Globe, Link2, Download, X } from "lucide-react"
import Link from "next/link"

const statusConfig = {
  upcoming: { label: "Em Breve", badgeClass: "border-amber-500/40 bg-amber-500/15 text-amber-400", dotClass: "bg-amber-500", pulse: false },
  live: { label: "Ao Vivo", badgeClass: "border-red-500/40 bg-red-500/20 text-red-400", dotClass: "bg-red-500", pulse: true },
  ended: { label: "Encerrada", badgeClass: "border-zinc-500/40 bg-zinc-500/10 text-zinc-400", dotClass: "bg-zinc-500", pulse: false },
}

const materialIcon = { pdf: FileText, html: Globe, link: Link2 }
const materialLabel = { pdf: "PDF", html: "Página Web", link: "Link Externo" }
const materialColor = {
  pdf: "border-red-500/30 bg-red-500/10 text-red-400",
  html: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  link: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
}

export function LiveDetailClient({ live }: { live: Live }) {
  const cfg = statusConfig[live.status]
  const [htmlContent, setHtmlContent] = useState<{ name: string; url: string } | null>(null)

  const handleOpenMaterial = (mat: LiveMaterial) => {
    if (mat.type === "html") {
      setHtmlContent({ name: mat.name, url: mat.url })
    } else {
      window.open(mat.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Back */}
      <Link href="/novidades?tab=lives" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Voltar para Novidades
      </Link>

      {/* Hero cover */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-secondary">
        <div className="relative h-72 w-full sm:h-96">
          {live.cover_image ? (
            <img src={live.cover_image} alt={live.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-red-900/60 to-zinc-900 flex items-center justify-center">
              <Radio className="h-24 w-24 text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Status */}
          <div className="absolute left-5 top-5">
            <Badge variant="outline" className={`gap-1.5 px-3 py-1 text-sm font-semibold ${cfg.badgeClass}`}>
              <span className="relative flex h-2 w-2">
                {cfg.pulse && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dotClass} opacity-75`} />}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${cfg.dotClass}`} />
              </span>
              {cfg.label}
            </Badge>
          </div>

          {/* Title + CTA over image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl text-balance">{live.title}</h1>
            {live.scheduled_at && (
              <p className="mb-4 flex items-center gap-1.5 text-sm text-white/60">
                <CalendarDays className="h-4 w-4" />
                {new Date(live.scheduled_at).toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            {live.stream_url && live.status !== "upcoming" && (
              <a href={live.stream_url} target="_blank" rel="noopener noreferrer">
                <Button className={`gap-2 ${live.status === "live" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}>
                  {live.status === "live"
                    ? <><Radio className="h-4 w-4 animate-pulse" /> Assistir Agora</>
                    : <><ExternalLink className="h-4 w-4" /> Ver Gravação</>
                  }
                </Button>
              </a>
            )}
            {live.status === "upcoming" && live.stream_url && (
              <a href={live.stream_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20">
                  <ExternalLink className="h-4 w-4" />
                  Acessar Link da Live
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {live.description && (
        <p className="mb-8 text-base leading-relaxed text-muted-foreground">{live.description}</p>
      )}

      {/* Materials */}
      {live.materials.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary/70" />
            <h2 className="text-lg font-semibold">Materiais Complementares</h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {live.materials.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {live.materials.map((mat) => {
              const MatIcon = materialIcon[mat.type] ?? Link2
              return (
                <button
                  key={mat.id}
                  onClick={() => handleOpenMaterial(mat)}
                  className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition-all hover:brightness-110 hover:-translate-y-0.5 ${materialColor[mat.type]}`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${materialColor[mat.type]}`}>
                    <MatIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground line-clamp-1">{mat.name}</p>
                    <p className="text-xs text-muted-foreground">{materialLabel[mat.type]}</p>
                  </div>
                  {mat.type === "pdf" ? (
                    <Download className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100" />
                  ) : (
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100" />
                  )}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {live.materials.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border py-12 text-center">
          <FileText className="mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Nenhum material disponível para esta live</p>
        </div>
      )}

      {/* HTML Material Modal */}
      <Dialog open={!!htmlContent} onOpenChange={() => setHtmlContent(null)}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-3">
            <DialogTitle className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4 text-blue-400" />
              {htmlContent?.name}
            </DialogTitle>
          </DialogHeader>
          {htmlContent && (
            <iframe
              src={htmlContent.url}
              className="flex-1 w-full border-0 bg-white"
              title={htmlContent.name}
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
