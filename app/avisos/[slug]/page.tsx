import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, ChevronLeft, ExternalLink } from "lucide-react"
import { fetchNoticePostBySlug } from "@/lib/announcements-blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const typeLabel: Record<string, string> = {
  info: "Informação",
  promo: "Promoção",
  update: "Novidade",
  alert: "Alerta",
}

export default async function AvisoDetalhePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await fetchNoticePostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/avisos">
        <Button variant="ghost" className="mb-4 gap-1 px-2">
          <ChevronLeft className="h-4 w-4" />
          Voltar para avisos
        </Button>
      </Link>

      <article className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{typeLabel[post.category] || "Aviso"}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

        {post.coverImage && (
          <div className="relative mt-6 h-64 w-full overflow-hidden rounded-xl border border-border sm:h-80">
            <Image src={post.coverImage || "/placeholder.jpg"} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <div className="prose prose-invert mt-6 max-w-none whitespace-pre-line text-sm leading-7 text-foreground/95">
          {post.content}
        </div>

        {post.externalUrl && (
          <div className="mt-8">
            <a href={post.externalUrl} target="_blank" rel="noreferrer">
              <Button className="gap-2">
                Acessar link relacionado
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        )}
      </article>
    </main>
  )
}
