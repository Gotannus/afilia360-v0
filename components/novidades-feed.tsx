"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, ArrowRight, ExternalLink, Video, Rocket, BookOpen, PlayCircle } from "lucide-react"
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

const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })

function SparklesIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M5 16l.9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9L5 16z" />
      <path d="M19 14l.7 1.3L21 16l-1.3.7L19 18l-.7-1.3L17 16l1.3-.7L19 14z" />
    </svg>
  )
}

function toEmbedUrl(url: string) {
  if (url.includes("youtube.com/watch")) {
    const parsed = new URL(url)
    const videoId = parsed.searchParams.get("v")
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }
  return url
}

export function NovidadesFeed({ posts }: { posts: NoticePost[] }) {
  const [open, setOpen] = useState(false)
  const [activePost, setActivePost] = useState<NoticePost | null>(null)
  const [activeMaterialUrl, setActiveMaterialUrl] = useState<string | null>(null)
  const groupedPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    return sorted.reduce<Record<string, NoticePost[]>>((acc, post) => {
      const monthKey = monthLabel.format(new Date(post.publishedAt))
      acc[monthKey] = acc[monthKey] ? [...acc[monthKey], post] : [post]
      return acc
    }, {})
  }, [posts])

  const openImmersiveModal = (post: NoticePost) => {
    setActivePost(post)
    setActiveMaterialUrl(null)
    setOpen(true)
  }

  return (
    <>
      <div className="space-y-10">
        {Object.entries(groupedPosts).map(([month, monthPosts]) => (
          <section key={month}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="premium-title-section capitalize">{month}</h2>
              <span className="text-xs text-muted-foreground">{monthPosts.length} novidades</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {monthPosts.map((post) => {
                const TypeIcon = contentTypeIcon[post.contentType]
                const immersiveType = post.contentType === "lesson" || post.contentType === "live"
                return (
                  <article
                    key={post.id}
                    className="premium-surface overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lux-lg)]"
                  >
                    <div className="relative h-40">
                      {post.coverImage ? (
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full bg-[image:var(--gradient-hero-premium)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                      <div className="absolute left-3 top-3">
                        <Badge variant="outline" className="gap-1 border-white/35 bg-black/30 text-white">
                          <TypeIcon className="h-3.5 w-3.5" />
                          {contentTypeLabel[post.contentType]}
                        </Badge>
                      </div>
                      {(post.contentType === "lesson" || post.contentType === "live") && (
                        <PlayCircle className="absolute right-3 bottom-3 h-8 w-8 text-white drop-shadow-md" />
                      )}
                    </div>

                    <div className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                      </span>
                      <h3 className="premium-title-card mt-2 line-clamp-2">{post.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {immersiveType && post.externalUrl ? (
                          <Button size="sm" className="gap-2" onClick={() => openImmersiveModal(post)}>
                            Abrir em tela cheia
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
                              Link externo
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[95vh] w-[97vw] max-w-none border-border/70 bg-background/95 p-3 sm:p-4" showCloseButton>
          <DialogTitle className="sr-only">{activePost?.title || "Conteúdo"}</DialogTitle>
          {!activePost?.externalUrl ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Esse conteúdo não possui link para reprodução.
            </div>
          ) : (
            <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3">
              <iframe
                src={toEmbedUrl(activePost.externalUrl)}
                title={activePost.title}
                className="h-full w-full rounded-[var(--radius-premium)] border border-border bg-black"
                allow="autoplay; fullscreen; picture-in-picture"
              />

              <div className="rounded-[var(--radius-premium)] border border-border/70 bg-black/10 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Materiais da novidade
                </div>
                {activePost.materials.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhum material complementar cadastrado.</p>
                ) : (
                  <>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {activePost.materials.map((material) => (
                        <Button
                          key={`${activePost.id}-${material.url}`}
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-full px-3 text-xs"
                          onClick={() => {
                            if (material.type === "html" || material.type === "pdf") {
                              setActiveMaterialUrl(material.url)
                            } else {
                              window.open(material.url, "_blank", "noreferrer")
                            }
                          }}
                        >
                          {material.label}
                        </Button>
                      ))}
                    </div>
                    {activeMaterialUrl && (
                      <iframe
                        src={activeMaterialUrl}
                        title="Material complementar"
                        className="h-52 w-full rounded-[var(--radius-premium)] border border-border bg-white"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
