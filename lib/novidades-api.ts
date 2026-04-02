import { createClient } from "@supabase/supabase-js"
import type { NewsPost } from "@/components/news-card"
import type { Live } from "@/components/live-card"

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ── News Posts ──────────────────────────────────────────────────────────────

export async function getNewsPosts(category?: string): Promise<NewsPost[]> {
  const supabase = getClient()
  let query = supabase
    .from("news_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
  if (category) query = query.eq("category", category)
  const { data, error } = await query
  if (error) { console.error("[novidades-api] getNewsPosts:", error); return [] }
  return (data ?? []) as NewsPost[]
}

export async function getNewsPost(id: string): Promise<NewsPost | null> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return data as NewsPost
}

export async function getAllNewsPostsAdmin(): Promise<NewsPost[]> {
  const supabase = getClient()
  const { data } = await supabase
    .from("news_posts")
    .select("*")
    .order("created_at", { ascending: false })
  return (data ?? []) as NewsPost[]
}

export async function upsertNewsPost(post: Partial<NewsPost> & { title: string }): Promise<NewsPost | null> {
  const supabase = getClient()
  const payload = { ...post, updated_at: new Date().toISOString() }
  const { data, error } = post.id
    ? await supabase.from("news_posts").update(payload).eq("id", post.id).select().single()
    : await supabase.from("news_posts").insert(payload).select().single()
  if (error) { console.error("[novidades-api] upsertNewsPost:", error); return null }
  return data as NewsPost
}

export async function deleteNewsPost(id: string): Promise<boolean> {
  const supabase = getClient()
  const { error } = await supabase.from("news_posts").delete().eq("id", id)
  return !error
}

// ── Lives ───────────────────────────────────────────────────────────────────

export async function getLives(): Promise<Live[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("lives")
    .select("*")
    .order("scheduled_at", { ascending: false })
  if (error) { console.error("[novidades-api] getLives:", error); return [] }
  return (data ?? []) as Live[]
}

export async function getLive(id: string): Promise<Live | null> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("lives")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return data as Live
}

export async function upsertLive(live: Partial<Live> & { title: string }): Promise<Live | null> {
  const supabase = getClient()
  const payload = { ...live, updated_at: new Date().toISOString() }
  const { data, error } = live.id
    ? await supabase.from("lives").update(payload).eq("id", live.id).select().single()
    : await supabase.from("lives").insert(payload).select().single()
  if (error) { console.error("[novidades-api] upsertLive:", error); return null }
  return data as Live
}

export async function deleteLive(id: string): Promise<boolean> {
  const supabase = getClient()
  const { error } = await supabase.from("lives").delete().eq("id", id)
  return !error
}
