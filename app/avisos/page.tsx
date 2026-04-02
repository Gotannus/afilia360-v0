import Link from "next/link"
import { Megaphone, ArrowLeft } from "lucide-react"
import { fetchNoticePosts } from "@/lib/announcements-blog"
import { NovidadesFeed } from "@/components/novidades-feed"

export default async function AvisosPage() {
  const posts = await fetchNoticePosts()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="premium-hero mb-8 overflow-hidden p-6 sm:p-8">
        <div className="brand-highlight mb-4 h-1 w-24 rounded-full" />
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para plataforma
        </Link>
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
          <Megaphone className="h-5 w-5 text-primary" />
        </div>
        <h1 className="premium-title-hero">Canal de Novidades Afilia360</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Um único feed para post blog, aula nova, live com materiais e criativos validados em ordem cronológica.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhuma novidade publicada ainda.
        </div>
      ) : (
        <NovidadesFeed posts={posts} />
      )}
    </main>
  )
}
