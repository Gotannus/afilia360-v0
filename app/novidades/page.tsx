import { Suspense } from "react"
import { fetchNoticePosts } from "@/lib/announcements-blog"
import { NovidadesPageClient } from "./novidades-client"

export const metadata = {
  title: "Novidades | Afilia360",
  description: "Atualizações, aulas, lives e criativos validados da Afilia360",
}

export default async function NovidadesPage() {
  const posts = await fetchNoticePosts()

  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center text-muted-foreground">Carregando novidades...</div>}>
      <NovidadesPageClient initialPosts={posts} />
    </Suspense>
  )
}
