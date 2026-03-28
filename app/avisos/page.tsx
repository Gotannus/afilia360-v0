import Link from "next/link"
import { CalendarDays, Megaphone, ArrowRight, ArrowLeft } from "lucide-react"
import { fetchNoticePosts } from "@/lib/announcements-blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const typeLabel: Record<string, string> = {
  info: "Informação",
  promo: "Promoção",
  update: "Novidade",
  alert: "Alerta",
}

export default async function AvisosPage() {
  const posts = await fetchNoticePosts()
  const featuredPost = posts[0] ?? null

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="brand-surface brand-hero relative mb-8 overflow-hidden rounded-2xl border border-white/10">
        {featuredPost?.coverImage && (
          <img
            src={featuredPost.coverImage}
            alt={featuredPost.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/25" />
        <div className="relative z-10 p-6 sm:p-8">
          <Link href="/" className="mb-5 inline-flex items-center gap-1 text-xs text-white/75 transition-colors hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para plataforma
          </Link>
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-white/90">
              <Megaphone className="h-3.5 w-3.5 text-white/85" />
              Novidades Afilia360
            </span>
            <div className="brand-highlight h-1 w-16 rounded-full" />
          </div>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Blog de Avisos Afilia360
            <span className="mt-1 block text-white/85">Atualizações importantes para você vender mais</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            Todas as novidades da plataforma em um único lugar: atualizações, promoções, comunicados e alertas.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={featuredPost ? `/avisos/${featuredPost.slug}` : "#lista-avisos"}>
              <Button size="sm" className="gap-2">
                Ler destaque
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#lista-avisos">
              <Button size="sm" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                Ver todos os avisos
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhum artigo publicado ainda.
        </div>
      ) : (
        <div id="lista-avisos" className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="brand-surface rounded-xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{typeLabel[post.category] || "Aviso"}</Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/avisos/${post.slug}`}>
                  <Button size="sm" className="gap-2">
                    Ler artigo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {post.externalUrl && (
                  <a href={post.externalUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">
                      Link relacionado
                    </Button>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
