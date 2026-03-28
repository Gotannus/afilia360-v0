import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Megaphone, ArrowRight, ArrowLeft, Clock3 } from "lucide-react"
import { fetchNoticePosts } from "@/lib/announcements-blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const typeLabel: Record<string, string> = {
  info: "Informação",
  promo: "Promoção",
  update: "Novidade",
  alert: "Alerta",
}

function getEstimatedReadingTime(content: string) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 220))
}

export default async function AvisosPage() {
  const posts = await fetchNoticePosts()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="brand-surface mb-8 overflow-hidden rounded-2xl p-6">
        <div className="brand-highlight mb-4 h-1 w-24 rounded-full" />
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para plataforma
        </Link>
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
          <Megaphone className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Blog de Avisos do Afilia360</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Todas as novidades da plataforma em um único lugar: atualizações, promoções, comunicados e alertas.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhum artigo publicado ainda.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="brand-surface overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-16px_rgba(0,0,0,0.65),0_0_0_1px_rgba(120,119,198,0.18),0_0_24px_-18px_rgba(129,140,248,0.65)] sm:p-5"
            >
              <div className="grid gap-4 md:grid-cols-[220px,1fr] md:gap-6">
                <Link
                  href={`/avisos/${post.slug}`}
                  className="group/image relative block h-48 overflow-hidden rounded-lg border border-border/70 bg-muted md:h-full md:min-h-[180px]"
                  aria-label={`Abrir artigo: ${post.title}`}
                >
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={`Capa do artigo ${post.title}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/image:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
                      Sem imagem de capa
                    </div>
                  )}
                </Link>

                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{typeLabel[post.category] || "Aviso"}</Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {getEstimatedReadingTime(post.content)} min de leitura
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold">
                    <Link href={`/avisos/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">{post.excerpt}</p>

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
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
