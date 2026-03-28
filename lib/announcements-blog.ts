import type { LucideIcon } from "lucide-react"
import { BellRing, CircleAlert, Info, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export type NoticeCategory = "info" | "promo" | "update" | "alert"

export type NoticeTheme = {
  label: string
  badgeClassName: string
  detailClassName: string
  cardClassName: string
  icon: LucideIcon
}

export const noticeThemeByCategory: Record<NoticeCategory, NoticeTheme> = {
  info: {
    label: "Informação",
    badgeClassName: "border-sky-400/40 bg-sky-500/15 text-sky-200",
    detailClassName: "border-sky-400/40",
    cardClassName: "border border-sky-500/15 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent",
    icon: Info,
  },
  promo: {
    label: "Promoção",
    badgeClassName: "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200",
    detailClassName: "border-fuchsia-400/40",
    cardClassName: "border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-transparent",
    icon: Sparkles,
  },
  update: {
    label: "Novidade",
    badgeClassName: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
    detailClassName: "border-emerald-400/40",
    cardClassName: "border border-emerald-500/15 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent",
    icon: BellRing,
  },
  alert: {
    label: "Alerta",
    badgeClassName: "border-amber-400/40 bg-amber-500/15 text-amber-200",
    detailClassName: "border-amber-400/40",
    cardClassName: "border border-amber-500/15 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent",
    icon: CircleAlert,
  },
}

export const defaultNoticeTheme: NoticeTheme = {
  label: "Aviso",
  badgeClassName: "border-border bg-muted/40 text-foreground",
  detailClassName: "border-border",
  cardClassName: "border border-border bg-gradient-to-br from-muted/30 via-transparent to-transparent",
  icon: Info,
}

export function getNoticeTheme(category?: string): NoticeTheme {
  return noticeThemeByCategory[category as NoticeCategory] || defaultNoticeTheme
}

export type NoticePost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: NoticeCategory
  publishedAt: string
  coverImage: string | null
  externalUrl: string | null
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function mapNoticePost(row: any): NoticePost {
  const title = row.title || row.text || "Aviso"
  const content = row.content || row.body || row.text || ""
  const excerpt = row.excerpt || row.summary || row.text || content.slice(0, 160)
  const publishedAt = row.published_at || row.created_at || new Date().toISOString()

  return {
    id: String(row.id),
    slug: row.slug || `${slugify(title)}-${String(row.id).slice(0, 8)}`,
    title,
    excerpt,
    content,
    category: row.type || "info",
    publishedAt,
    coverImage: row.cover_url || row.image_url || null,
    externalUrl: row.link_url || row.cta_url || null,
  }
}

export async function fetchNoticePosts(limit = 50): Promise<NoticePost[]> {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("active", true)
    .eq("publication_status", "published")
    .lte("published_at", now)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error || !data) {
    return []
  }

  return data.map(mapNoticePost)
}

export async function fetchNoticePostBySlug(slug: string): Promise<NoticePost | null> {
  const posts = await fetchNoticePosts(200)
  return posts.find((post) => post.slug === slug) ?? null
}
