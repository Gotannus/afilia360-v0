"use client"

import { useEffect, useState } from "react"
import { Megaphone, Gift, Sparkles, AlertTriangle } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

type Announcement = {
  id: string
  text: string
  type: "info" | "promo" | "update" | "alert"
  active: boolean
}

const typeConfig = {
  info: { icon: Megaphone, color: "text-blue-400" },
  promo: { icon: Gift, color: "text-emerald-400" },
  update: { icon: Sparkles, color: "text-amber-400" },
  alert: { icon: AlertTriangle, color: "text-red-400" },
}

export function AnnouncementsTicker() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
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
    }
  }

  if (!mounted) return null

  if (announcements.length === 0) return null

  return (
    <div className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center">
        {/* Label fixo */}
        <div className="z-10 flex shrink-0 items-center gap-2 border-r border-border bg-primary px-4 py-2">
          <Megaphone className="h-4 w-4 text-primary-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground">Novidades</span>
        </div>

        <div className="relative flex-1 overflow-hidden py-2">
          <div
            className="flex gap-12 whitespace-nowrap"
            style={{
              animation: "ticker 30s linear infinite",
            }}
          >
            {/* Duplicar para criar loop infinito */}
            {[...announcements, ...announcements, ...announcements].map((announcement, index) => {
              const config = typeConfig[announcement.type]
              const Icon = config.icon
              return (
                <div key={`${announcement.id}-${index}`} className="flex shrink-0 items-center gap-2">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <span className="text-sm text-foreground">{announcement.text}</span>
                  <span className="text-muted-foreground">•</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </div>
  )
}
