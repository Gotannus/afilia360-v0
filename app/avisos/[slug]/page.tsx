import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, ChevronLeft, Clock3, ExternalLink, Tag } from "lucide-react"
import { fetchNoticePostBySlug } from "@/lib/announcements-blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const typeLabel: Record<string, string> = {
  info: "Informação",
  promo: "Promoção",
  update: "Novidade",
  alert: "Alerta",
}

function estimateReadingTime(content: string) {
  const wordsPerMinute = 220
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

  return `${minutes} min de leitura`
}

export default async function AvisoDetalhePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await fetchNoticePostBySlug(slug)

  if (!post) {
    notFound()
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

      <article className="premium-surface p-6 sm:p-8">
        <div className="brand-highlight mb-4 h-1 w-24 rounded-full" />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{typeLabel[post.category] || "Aviso"}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </section>

        <h1 className="premium-title-hero">{post.title}</h1>

        {post.coverImage && (
          <div className="relative mt-6 h-64 w-full overflow-hidden rounded-[var(--radius-premium)] border border-border sm:h-80">
            <Image src={post.coverImage || "/placeholder.jpg"} alt={post.title} fill className="object-cover" />
          </div>
        )}

          <header>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{post.title}</h1>

            <div className="mt-6 grid gap-3 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-100 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-cyan-300" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-violet-300" />
                <Badge variant="outline" className="border-white/20 bg-white/5 text-zinc-100">
                  {typeLabel[post.category] || "Aviso"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-emerald-300" />
                <span>{estimateReadingTime(post.content)}</span>
              </div>
            </div>
          </header>

          <div className="prose prose-invert prose-editorial mt-8 max-w-none whitespace-pre-line text-foreground/95">
            {post.content}
          </div>

          <footer className="mt-12 border-t border-white/10 pt-7">
            <div className="sticky bottom-4 rounded-2xl border border-white/10 bg-zinc-950/90 p-4 shadow-xl shadow-black/25 backdrop-blur-sm sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-5">
              <div>
                <p className="text-sm font-medium text-zinc-100">Curtiu este conteúdo?</p>
                <p className="text-xs text-zinc-400">Acesse o material complementar ou continue navegando nos avisos.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
                {post.externalUrl ? (
                  <a href={post.externalUrl} target="_blank" rel="noreferrer">
                    <Button className="gap-2">
                      Acessar material
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                ) : (
                  <Button variant="secondary" disabled>
                    Acessar material
                  </Button>
                )}
                <Link href="/avisos">
                  <Button variant="outline" className="border-white/20 bg-white/5 text-zinc-100 hover:bg-white/10">
                    Voltar aos avisos
                  </Button>
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </main>
  )
}
