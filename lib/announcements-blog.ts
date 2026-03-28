import { createClient } from "@/lib/supabase/server"

export type NoticePost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: "info" | "promo" | "update" | "alert"
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
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
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
