import { createClient } from "@supabase/supabase-js"

export type NoticePost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  contentType: "blog" | "lesson" | "live" | "creatives"
  category: "info" | "promo" | "update" | "alert"
  publishedAt: string
  coverImage: string | null
  externalUrl: string | null
  htmlContent: string | null
  materials: Array<{ label: string; url: string; type: "html" | "pdf" | "link"; html?: string | null }>
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
  const normalizedType = String(row.content_type || row.post_type || row.kind || row.type || "blog").toLowerCase()
  const contentType: NoticePost["contentType"] =
    normalizedType === "lesson" || normalizedType === "aula" || normalizedType === "aula_nova"
      ? "lesson"
      : normalizedType === "live"
        ? "live"
        : normalizedType === "creative" || normalizedType === "creatives" || normalizedType === "criativos_validados"
          ? "creatives"
          : "blog"
  const parseMaterials = () => {
    if (Array.isArray(row.materials)) return row.materials
    if (typeof row.materials === "string") {
      try {
        const parsed = JSON.parse(row.materials)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  }
  const inferMaterialType = (url: string, explicitType?: string): "html" | "pdf" | "link" => {
    const normalized = (explicitType || "").toLowerCase()
    if (normalized === "html" || normalized === "pdf") return normalized
    if (url.match(/\.pdf($|\?)/i)) return "pdf"
    if (url.match(/\.html?($|\?)/i)) return "html"
    return "link"
  }
  const rawMaterials = parseMaterials()
  const materials = rawMaterials
    .map((material: any) => ({
      label: material?.label || material?.title || "Material complementar",
      url: material?.url || material?.href || "",
      type: inferMaterialType(material?.url || material?.href || "", material?.type),
      html: typeof material?.html === "string" ? material.html : null,
    }))
    .filter((material: { label: string; url: string; type: "html" | "pdf" | "link"; html?: string | null }) => Boolean(material.url) || Boolean(material.html))
  const rawHtmlContent = row.html_content || row.html || null
  const htmlContent =
    typeof rawHtmlContent === "string" && rawHtmlContent.trim()
      ? rawHtmlContent
      : typeof content === "string" && /<html|<body|<div|<section|<!doctype/i.test(content)
        ? content
        : null

  return {
    id: String(row.id),
    slug: row.slug || `${slugify(title)}-${String(row.id).slice(0, 8)}`,
    title,
    excerpt,
    content,
    contentType,
    category: row.type || "info",
    publishedAt,
    coverImage: row.cover_url || row.image_url || null,
    externalUrl: row.link_url || row.cta_url || row.lesson_url || row.video_url || row.live_url || null,
    htmlContent,
    materials,
  }
}

export async function fetchNoticePosts(limit = 50): Promise<NoticePost[]> {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
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
