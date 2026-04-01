import { getNewsPost } from "@/lib/novidades-api"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import { NewsDetailClient } from "./news-detail-client"

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const post = await getNewsPost(params.id)
  if (!post) notFound()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header searchQuery="" onSearchChange={() => {}} />
        <NewsDetailClient post={post} />
      </div>
    </AuthGuard>
  )
}
