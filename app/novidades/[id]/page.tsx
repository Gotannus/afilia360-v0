import { getNewsPost } from "@/lib/novidades-api"
import { fetchNoticePostBySlug } from "@/lib/announcements-blog"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import { NewsDetailClient } from "./news-detail-client"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, ChevronLeft, ExternalLink, FileDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { NoticePost } from "@/lib/announcements-blog"

const contentTypeLabel: Record<NoticePost["contentType"], string> = {
  blog: "Post blog",
  lesson: "Aula nova",
  live: "Live",
  creatives: "Criativos validados",
}

function AnnouncementDetail({ post }: { post: NoticePost }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/novidades">
        <Button variant="ghost" className="mb-4 gap-1 px-2">
          <ChevronLeft className="h-4 w-4" />
          Voltar para novidades
        </Button>
      </Link>

      <article className="rounded-[var(--radius-premium)] border border-border/60 bg-card p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{contentTypeLabel[post.contentType] || "Conteúdo"}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
          </span>
        </div>

        <h1 className="mb-4 text-2xl font-bold leading-snug text-foreground sm:text-3xl">{post.title}</h1>

        {post.coverImage && (
          <div className="relative mb-6 h-56 w-full overflow-hidden rounded-[var(--radius-premium)] border border-border sm:h-80">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {post.excerpt && post.excerpt !== post.content && (
          <p className="mb-6 text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}

        {post.content && (
          <div className="prose prose-invert mt-4 max-w-none whitespace-pre-line text-sm leading-7 text-foreground/90">
            {post.content}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {post.externalUrl && (
            <a href={post.externalUrl} target="_blank" rel="noreferrer">
              <Button className="gap-2">
                Acessar conteúdo
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
          {post.attachmentUrl && (
            <a href={post.attachmentUrl} target="_blank" rel="noreferrer" download={post.attachmentName || true}>
              <Button variant="outline" className="gap-2">
                <FileDown className="h-4 w-4" />
                {post.attachmentName || "Baixar anexo"}
              </Button>
            </a>
          )}
        </div>
      </article>
    </main>
  )
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // 1. Tenta na tabela news_posts (por ID ou slug)
  const newsPost = await getNewsPost(id)
  if (newsPost) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header searchQuery="" onSearchChange={() => {}} />
          <NewsDetailClient post={newsPost} />
        </div>
      </AuthGuard>
    )
  }

  // 2. Tenta na tabela announcements (por slug gerado)
  const noticePost = await fetchNoticePostBySlug(id)
  if (noticePost) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header searchQuery="" onSearchChange={() => {}} />
          <AnnouncementDetail post={noticePost} />
        </div>
      </AuthGuard>
    )
  }

  notFound()
}
