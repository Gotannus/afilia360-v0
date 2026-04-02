"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { CalendarDays, ArrowRight, ExternalLink, Video, Rocket, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { NoticePost } from "@/lib/announcements-blog"

const contentTypeLabel: Record<NoticePost["contentType"], string> = {
  blog: "Post blog",
  lesson: "Aula nova",
  live: "Live",
  creatives: "Criativos validados",
}

const contentTypeIcon = {
  blog: BookOpen,
  lesson: Video,
  live: Rocket,
  creatives: SparklesIcon,
}

function SparklesIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M5 16l.9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9L5 16z" />
      <path d="M19 14l.7 1.3L21 16l-1.3.7L19 18l-.7-1.3L17 16l1.3-.7L19 14z" />
    </svg>
  )
}

export function NovidadesFeed({ posts }: { posts: NoticePost[] }) {
  const [lessonOpen, setLessonOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<NoticePost | null>(null)
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [posts],
  )

  const openLessonModal = (post: NoticePost) => {
    setSelectedLesson(post)
    setLessonOpen(true)
  }

  return (
    <>
      <div className="space-y-4">
        {sortedPosts.map((post) => {
          const TypeIcon = contentTypeIcon[post.contentType]
          return (
            <article
              key={post.id}
              className="premium-surface p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lux-lg)]"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <TypeIcon className="h-3.5 w-3.5" />
                  {contentTypeLabel[post.contentType]}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <h2 className="premium-title-card">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {post.contentType === "lesson" && post.externalUrl ? (
                  <Button size="sm" className="gap-2" onClick={() => openLessonModal(post)}>
                    Abrir aula
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Link href={`/avisos/${post.slug}`}>
                    <Button size="sm" className="gap-2">
                      Ver conteúdo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}

                {(post.contentType === "live" || post.contentType === "creatives") && post.externalUrl && (
                  <a href={post.externalUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="gap-2">
                      Acessar link
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}

                {post.contentType === "blog" && post.externalUrl && (
                  <a href={post.externalUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">
                      Link relacionado
                    </Button>
                  </a>
                )}
              </div>

              {post.materials.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.materials.map((material) => (
                    <a key={`${post.id}-${material.url}`} href={material.url} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="ghost" className="h-8 rounded-full border border-border/70 px-3 text-xs">
                        {material.label}
                      </Button>
                    </a>
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>

      <Dialog open={lessonOpen} onOpenChange={setLessonOpen}>
        <DialogContent
          className="h-[92vh] w-[96vw] max-w-none border-border/70 bg-background/95 p-2 sm:p-3"
          showCloseButton
        >
          <DialogTitle className="sr-only">{selectedLesson?.title || "Aula"}</DialogTitle>
          {selectedLesson?.externalUrl ? (
            <iframe
              src={selectedLesson.externalUrl}
              title={selectedLesson.title}
              className="h-full w-full rounded-[var(--radius-premium)] border border-border"
              allow="autoplay; fullscreen; picture-in-picture"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Essa aula ainda não possui URL configurada.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
