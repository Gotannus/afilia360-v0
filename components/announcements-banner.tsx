"use client"

import { useEffect, useState } from "react"
import { Megaphone, Gift, Sparkles, AlertTriangle, X, Bell } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { Badge } from "@/components/ui/badge"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

type Announcement = {
  id: string
  text: string
  type: "info" | "promo" | "update" | "alert"
  active: boolean
  created_at: string
}

const typeConfig = {
  info: {
    icon: Megaphone,
    label: "Informação",
    badgeClass: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    barClass: "bg-blue-500",
    glowClass: "shadow-blue-500/10",
  },
  promo: {
    icon: Gift,
    label: "Promoção",
    badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    barClass: "bg-emerald-500",
    glowClass: "shadow-emerald-500/10",
  },
  update: {
    icon: Sparkles,
    label: "Novidade",
    badgeClass: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    barClass: "bg-amber-500",
    glowClass: "shadow-amber-500/10",
  },
  alert: {
    icon: AlertTriangle,
    label: "Alerta",
    badgeClass: "border-red-500/40 bg-red-500/10 text-red-400",
    barClass: "bg-red-500",
    glowClass: "shadow-red-500/10",
  },
}

const STORAGE_KEY = "afilia360_announcements_dismissed"

export function AnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setAnnouncements(data)
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const lastDismissed = new Date(stored)
        const hasNew = data.some((a) => new Date(a.created_at) > lastDismissed)
        if (!hasNew) setDismissed(true)
      }
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, new Date().toISOString())
    setDismissed(true)
  }

  if (!mounted || announcements.length === 0 || dismissed) return null

  return (
    <div className="border-b border-border bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        {/* Cabeçalho da seção */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
              <Bell className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Novidades
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {announcements.length}
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dispensar"
          >
            <X className="h-3 w-3" />
            Fechar
          </button>
        </div>

        {/* Grid de avisos — máx 3 visíveis, depois scroll horizontal no mobile */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => {
            const config = typeConfig[announcement.type]
            const Icon = config.icon
            return (
              <div
                key={announcement.id}
                className={`relative flex items-start gap-3 overflow-hidden rounded-lg border border-border bg-background/60 px-4 py-3 shadow-sm ${config.glowClass}`}
              >
                {/* Barra colorida à esquerda */}
                <div className={`absolute inset-y-0 left-0 w-0.5 rounded-full ${config.barClass}`} />

                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${config.badgeClass}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <Badge
                    variant="outline"
                    className={`mb-1.5 px-1.5 py-0 text-[10px] font-medium ${config.badgeClass}`}
                  >
                    {config.label}
                  </Badge>
                  <p className="text-xs leading-relaxed text-foreground/90">
                    {announcement.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Exportar hook para usar no Header (sino)
export function useAnnouncements() {
  const [count, setCount] = useState(0)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })

      if (data) {
        setAnnouncements(data)
        setCount(data.length)
        const stored = sessionStorage.getItem(STORAGE_KEY)
        if (!stored) {
          setHasNew(data.length > 0)
        } else {
          const lastDismissed = new Date(stored)
          setHasNew(data.some((a) => new Date(a.created_at) > lastDismissed))
        }
      }
    }
    fetch()
  }, [])

  return { count, announcements, hasNew }
}


const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

type Announcement = {
  id: string
  text: string
  type: "info" | "promo" | "update" | "alert"
  active: boolean
  created_at: string
}

const typeConfig = {
  info: {
    icon: Megaphone,
    label: "Informação",
    badgeClass: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    dotClass: "bg-blue-400",
    lineClass: "bg-blue-500/30",
  },
  promo: {
    icon: Gift,
    label: "Promoção",
    badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    dotClass: "bg-emerald-400",
    lineClass: "bg-emerald-500/30",
  },
  update: {
    icon: Sparkles,
    label: "Novidade",
    badgeClass: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    dotClass: "bg-amber-400",
    lineClass: "bg-amber-500/30",
  },
  alert: {
    icon: AlertTriangle,
    label: "Alerta",
    badgeClass: "border-red-500/40 bg-red-500/10 text-red-400",
    dotClass: "bg-red-400",
    lineClass: "bg-red-500/30",
  },
}

const STORAGE_KEY = "afilia360_announcements_dismissed"

export function AnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setAnnouncements(data)

      // Verificar se há novos avisos desde que foi dispensado
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const lastDismissed = new Date(stored)
        const hasNew = data.some((a) => new Date(a.created_at) > lastDismissed)
        if (!hasNew) setDismissed(true)
      }
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, new Date().toISOString())
    setDismissed(true)
  }

  if (!mounted || announcements.length === 0 || dismissed) return null

  // Pegar o aviso mais recente para exibir no banner
  const latest = announcements[0]
  const latestConfig = typeConfig[latest.type]
  const LatestIcon = latestConfig.icon

  return (
    <>
      {/* Banner compacto */}
      <div
        className="relative cursor-pointer overflow-hidden border-b border-border bg-card/80 backdrop-blur-sm transition-colors hover:bg-card"
        onClick={() => setOpen(true)}
      >
        {/* Linha colorida no topo */}
        <div className={`absolute inset-x-0 top-0 h-0.5 ${latestConfig.lineClass}`} />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            {/* Pill "Novidades" */}
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Bell className="h-3 w-3" />
              {announcements.length > 1 ? `${announcements.length} avisos` : "Aviso"}
            </span>

            {/* Ícone do tipo */}
            <LatestIcon className={`h-4 w-4 shrink-0 ${latestConfig.badgeClass.split(" ").find((c) => c.startsWith("text-"))}`} />

            {/* Texto do aviso mais recente */}
            <p className="truncate text-sm font-medium text-foreground">
              {latest.text}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 pl-4">
            {announcements.length > 1 && (
              <span className="hidden text-xs text-muted-foreground sm:block">
                Ver todos ({announcements.length})
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDismiss()
              }}
              className="ml-1 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Dispensar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sheet lateral com todos os avisos */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          {/* Header */}
          <SheetHeader className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-base">Novidades do Mês</SheetTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {announcements.length} {announcements.length === 1 ? "aviso" : "avisos"} ativos
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Lista de avisos */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {announcements.map((announcement, index) => {
              const config = typeConfig[announcement.type]
              const Icon = config.icon
              return (
                <div
                  key={announcement.id}
                  className="group relative rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-card/80"
                >
                  {/* Indicador colorido lateral */}
                  <div className={`absolute inset-y-3 left-0 w-0.5 rounded-full ${config.dotClass}`} />

                  <div className="flex items-start gap-3 pl-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${config.badgeClass}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.badgeClass}`}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">
                        {announcement.text}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-6 py-4">
            <button
              onClick={() => {
                handleDismiss()
                setOpen(false)
              }}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Marcar como lido e fechar
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
