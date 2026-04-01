import { Suspense } from "react"
import { getNewsPosts } from "@/lib/novidades-api"
import { getLives } from "@/lib/novidades-api"
import { NovidadesClient } from "./novidades-client"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"

export const metadata = {
  title: "Novidades | Afilia360",
  description: "Atualizações, novas aulas, criativos e transmissões ao vivo da Afilia360",
}

export default async function NovidadesPage() {
  const [posts, lives] = await Promise.all([getNewsPosts(), getLives()])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header searchQuery="" onSearchChange={() => {}} />
        <Suspense fallback={<div className="flex h-96 items-center justify-center text-muted-foreground">Carregando...</div>}>
          <NovidadesClient initialPosts={posts} initialLives={lives} />
        </Suspense>
      </div>
    </AuthGuard>
  )
}
