import Link from "next/link"
import { CalendarDays, Megaphone, ArrowRight, ArrowLeft } from "lucide-react"
import { fetchNoticePosts, getNoticeTheme } from "@/lib/announcements-blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const typeLabel: Record<string, string> = {
  info: "Informação",
  promo: "Promoção",
  update: "Novidade",
  alert: "Alerta",
}

const POSTS_PER_PAGE = 6

function parsePageParam(pageParam?: string) {
  const parsed = Number(pageParam)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }
  return Math.floor(parsed)
}

type AvisosPageProps = {
  searchParams?: Promise<{ page?: string }>
}

export default async function AvisosPage({ searchParams }: AvisosPageProps) {
  const params = searchParams ? await searchParams : undefined
  const page = parsePageParam(params?.page)
  const listOffset = (page - 1) * POSTS_PER_PAGE

  const [featuredPosts, listingSource] = await Promise.all([
    fetchNoticePosts(1),
    fetchNoticePosts(1 + listOffset + POSTS_PER_PAGE + 1),
  ])

  const featuredPost = featuredPosts[0] ?? null
  const listPosts = listingSource.slice(1 + listOffset, 1 + listOffset + POSTS_PER_PAGE)
  const hasPreviousPage = page > 1
  const hasNextPage = listingSource.length > 1 + listOffset + POSTS_PER_PAGE

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

      {!featuredPost && listPosts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhum artigo publicado ainda.
        </div>
      ) : (
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">Post em destaque</h2>
            {featuredPost ? (
              <article className="brand-surface rounded-xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{typeLabel[featuredPost.category] || "Aviso"}</Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(featuredPost.publishedAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">{featuredPost.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{featuredPost.excerpt}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/avisos/${featuredPost.slug}`}>
                    <Button size="sm" className="gap-2">
                      Ler artigo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {featuredPost.externalUrl && (
                    <a href={featuredPost.externalUrl} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline">
                        Link relacionado
                      </Button>
                    </a>
                  )}
                </div>
              </article>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                Ainda não há destaque disponível.
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Últimos avisos</h2>
            {listPosts.length > 0 ? (
              <div className="space-y-4">
                {listPosts.map((post) => (
                  <article key={post.id} className="brand-surface rounded-xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{typeLabel[post.category] || "Aviso"}</Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold">{post.title}</h3>
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
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                Não há mais avisos para esta página.
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {hasPreviousPage ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/avisos?page=${page - 1}`}>Página anterior</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Página anterior
                </Button>
              )}
              {hasNextPage ? (
                <Button asChild size="sm">
                  <Link href={`/avisos?page=${page + 1}`}>Carregar mais</Link>
                </Button>
              ) : (
                <Button size="sm" disabled>
                  Carregar mais
                </Button>
              )}
              <span className="text-xs text-muted-foreground">Página {page}</span>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
