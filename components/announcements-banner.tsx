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

async function fetchFromSupabase() {
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
  return data ?? []
}

export function AnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchFromSupabase().then((data) => {
      setAnnouncements(data)
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const lastDismissed = new Date(stored)
        const hasNew = data.some((a: Announcement) => new Date(a.created_at) > lastDismissed)
        if (!hasNew) setDismissed(true)
      }
    })
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, new Date().toISOString())
    setDismissed(true)
  }

  if (!mounted || announcements.length === 0 || dismissed) return null

  return (
    <div className="border-b border-border bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        {/* Cabeçalho */}
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

        {/* Grid de avisos */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => {
            const config = typeConfig[announcement.type]
            const Icon = config.icon
            return (
              <div
                key={announcement.id}
                className={`relative flex items-start gap-3 overflow-hidden rounded-lg border border-border bg-background/60 px-4 py-3 shadow-sm ${config.glowClass}`}
              >
                <div className={`absolute inset-y-0 left-0 w-0.5 rounded-full ${config.barClass}`} />
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${config.badgeClass}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge
                    variant="outline"
                    className={`mb-1.5 px-1.5 py-0 text-[10px] font-medium ${config.badgeClass}`}
                  >
                    {config.label}
                  </Badge>
                  <p className="text-xs leading-relaxed text-foreground/90">{announcement.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function useAnnouncements() {
  const [count, setCount] = useState(0)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    fetchFromSupabase().then((data) => {
      setAnnouncements(data)
      setCount(data.length)
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setHasNew(data.length > 0)
      } else {
        const lastDismissed = new Date(stored)
        setHasNew(data.some((a: Announcement) => new Date(a.created_at) > lastDismissed))
      }
    })
  }, [])

  return { count, announcements, hasNew }
}
