import { getLive } from "@/lib/novidades-api"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import { LiveDetailClient } from "./live-detail-client"

export default async function LiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const live = await getLive(id)
  if (!live) notFound()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header searchQuery="" onSearchChange={() => {}} />
        <LiveDetailClient live={live} />
      </div>
    </AuthGuard>
  )
}
