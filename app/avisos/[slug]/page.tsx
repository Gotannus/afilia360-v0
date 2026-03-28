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

  return (
    <main className="pb-10">
      <section className="relative left-1/2 right-1/2 -mx-[50vw] mb-10 w-screen overflow-hidden">
        <div className="relative h-[44vh] min-h-[300px] w-full sm:h-[56vh] sm:min-h-[420px]">
          <Image src={post.coverImage || "/placeholder.jpg"} alt={post.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/45 to-background/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.20),transparent_42%),radial-gradient(circle_at_75%_18%,rgba(168,85,247,0.18),transparent_36%)]" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <Link href="/avisos">
          <Button variant="ghost" className="mb-4 gap-1 px-2">
            <ChevronLeft className="h-4 w-4" />
            Voltar para avisos
          </Button>
        </Link>

        <article className="brand-surface -mt-32 rounded-2xl p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-md sm:p-8">
          <div className="brand-highlight mb-5 h-1 w-24 rounded-full" />

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
