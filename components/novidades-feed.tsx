"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarDays,
  ArrowRight,
  ExternalLink,
  Video,
  Rocket,
  BookOpen,
  PlayCircle,
  FileDown,
} from "lucide-react"
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

const contentTypePalette: Record<NoticePost["contentType"], { bar: string; badge: string; badgeText: string }> = {
  blog: { bar: "bg-indigo-500", badge: "border-indigo-500/40 bg-indigo-500/10", badgeText: "text-indigo-300" },
  lesson: { bar: "bg-violet-500", badge: "border-violet-500/40 bg-violet-500/10", badgeText: "text-violet-300" },
  live: { bar: "bg-sky-500", badge: "border-sky-500/40 bg-sky-500/10", badgeText: "text-sky-300" },
  creatives: { bar: "bg-amber-500", badge: "border-amber-500/40 bg-amber-500/10", badgeText: "text-amber-300" },
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
  const [typeFilter, setTypeFilter] = useState<NoticePost["contentType"] | "all">("all")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = typeFilter === "all" ? [...posts] : posts.filter((p) => p.contentType === typeFilter)
    return filtered.sort((a, b) => {
      const diff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      return sortOrder === "desc" ? diff : -diff
    })
  }, [posts, sortOrder, typeFilter])

  const featuredPost = useMemo(() => {
    const now = new Date()
    return filteredAndSortedPosts.find((post) => {
      const d = new Date(post.publishedAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }, [filteredAndSortedPosts])

  const groupedPosts = useMemo(() => {
    return filteredAndSortedPosts.reduce<Record<string, NoticePost[]>>((acc, post) => {
      const key = monthLabel.format(new Date(post.publishedAt))
      acc[key] = acc[key] ? [...acc[key], post] : [post]
      return acc
    }, {})
  }, [filteredAndSortedPosts])

  const openModal = (post: NoticePost) => {
    setActivePost(post)
    setOpen(true)
  }

  return (
    <>
      {/* Destaque do mês */}
      {featuredPost && (
        <section className="premium-hero mb-6 overflow-hidden rounded-[var(--radius-premium)] p-0 sm:mb-8">
          <div className="relative h-52 w-full sm:h-64 md:h-72">
            {featuredPost.coverImage ? (
              <Image src={featuredPost.coverImage} alt={featuredPost.title} fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-[image:var(--gradient-hero-premium)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/90">
                Destaque do mês
              </p>
              <h2 className="premium-title-section text-balance text-white">{featuredPost.title}</h2>
              {featuredPost.excerpt && (
                <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm text-white/70">{featuredPost.excerpt}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {(featuredPost.contentType === "lesson" || featuredPost.contentType === "live") && featuredPost.externalUrl ? (
                  <Button size="sm" className="gap-2" onClick={() => openModal(featuredPost)}>
                    Abrir destaque
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Link href={`/novidades/${featuredPost.slug}`}>
                    <Button size="sm" className="gap-2">
                      Ver destaque
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtros e ordenação */}
      <div className="mb-5 rounded-[var(--radius-premium)] border border-border/60 bg-black/15 p-2.5 sm:mb-6 sm:p-3">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {(["all", "blog", "lesson", "live", "creatives"] as const).map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={typeFilter === filter ? "default" : "outline"}
              onClick={() => setTypeFilter(filter)}
              className="h-8 shrink-0 rounded-full px-3 text-xs"
            >
              {filter === "all" ? "Todos" : filter === "blog" ? "Blog" : filter === "lesson" ? "Aula" : filter === "live" ? "Live" : "Criativos"}
            </Button>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          <span className="text-[11px] text-muted-foreground">Ordem</span>
          <Button size="sm" variant={sortOrder === "desc" ? "default" : "outline"} onClick={() => setSortOrder("desc")} className="h-7 rounded-full px-3 text-xs">
            Recente
          </Button>
          <Button size="sm" variant={sortOrder === "asc" ? "default" : "outline"} onClick={() => setSortOrder("asc")} className="h-7 rounded-full px-3 text-xs">
            Antigo
          </Button>
        </div>
      </div>

      {/* Lista agrupada por mês */}
      <div className="space-y-10">
        {Object.keys(groupedPosts).length === 0 && (
          <div className="rounded-[var(--radius-premium)] border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
            Nenhuma novidade encontrada para o filtro selecionado.
          </div>
        )}
        {Object.entries(groupedPosts).map(([month, monthPosts]) => (
          <section key={month}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="premium-title-section capitalize">{month}</h2>
              <span className="rounded-full border border-border/60 bg-card px-2.5 py-0.5 text-xs text-muted-foreground">
                {monthPosts.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {monthPosts.map((post) => {
                const TypeIcon = contentTypeIcon[post.contentType]
                const palette = contentTypePalette[post.contentType]
                const isImmersive = post.contentType === "lesson" || post.contentType === "live"

                return (
                  <article
                    key={post.id}
                    className="group premium-surface flex flex-col overflow-hidden p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lux-lg)]"
                  >
                    {/* Capa */}
                    <div className="relative h-36 w-full shrink-0 sm:h-44">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-full w-full bg-[image:var(--gradient-hero-premium)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {/* Barra de cor do tipo */}
                      <div className={`absolute inset-y-0 left-0 w-1 rounded-r-sm ${palette.bar}`} />
                      <div className="absolute left-3 top-3">
                        <Badge
                          variant="outline"
                          className={`gap-1 border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${palette.badge} ${palette.badgeText}`}
                        >
                          <TypeIcon className="h-3 w-3" />
                          {contentTypeLabel[post.contentType]}
                        </Badge>
                      </div>
                      {isImmersive && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40 backdrop-blur-sm">
                            <PlayCircle className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Corpo */}
                    <div className="flex flex-1 flex-col p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                      </span>
                      <h3 className="premium-title-card mt-1.5 line-clamp-2 text-balance">{post.title}</h3>
                      {post.excerpt && (
                        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {isImmersive && post.externalUrl ? (
                          <Button size="sm" className="gap-1.5" onClick={() => openModal(post)}>
                            Abrir
                            <PlayCircle className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <Link href={`/novidades/${post.slug}`}>
                            <Button size="sm" className="gap-1.5">
                              Ver
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        )}

                        {post.externalUrl && !isImmersive && (
                          <a href={post.externalUrl} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline" className="gap-1.5">
                              Link
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        )}

                        {post.attachmentUrl && (
                          <a href={post.attachmentUrl} target="_blank" rel="noreferrer" download={post.attachmentName || true}>
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <FileDown className="h-3.5 w-3.5" />
                              PDF
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

      {/* Modal imersivo */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="h-[98vh] w-[99vw] max-w-none border-border/70 bg-background/95 p-2 sm:h-[95vh] sm:w-[97vw] sm:p-4"
          showCloseButton
        >
          <DialogTitle className="sr-only">{activePost?.title || "Conteúdo"}</DialogTitle>
          {!activePost?.externalUrl && !activePost?.htmlContent ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Esse conteúdo não possui link para reprodução.
            </div>
          ) : activePost.externalUrl ? (
            <iframe
              src={toEmbedUrl(activePost.externalUrl)}
              title={activePost.title}
              className="h-full w-full rounded-[var(--radius-premium)] border border-border bg-black"
              allow="autoplay; fullscreen; picture-in-picture"
            />
          ) : (
            <iframe
              srcDoc={activePost.htmlContent || ""}
              title={activePost.title}
              className="h-full w-full rounded-[var(--radius-premium)] border border-border bg-white"
              sandbox="allow-scripts allow-popups allow-forms"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}


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
  const [activeMaterialHtml, setActiveMaterialHtml] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<NoticePost["contentType"] | "all">("all")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const filteredAndSortedPosts = useMemo(() => {
    const filtered = typeFilter === "all" ? [...posts] : posts.filter((post) => post.contentType === typeFilter)
    return filtered.sort((a, b) => {
      const diff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      return sortOrder === "desc" ? diff : -diff
    })
  }, [posts, sortOrder, typeFilter])
  const featuredPost = useMemo(() => {
    const now = new Date()
    return filteredAndSortedPosts.find((post) => {
      const postDate = new Date(post.publishedAt)
      return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
    })
  }, [filteredAndSortedPosts])
  const groupedPosts = useMemo(() => {
    return filteredAndSortedPosts.reduce<Record<string, NoticePost[]>>((acc, post) => {
      const monthKey = monthLabel.format(new Date(post.publishedAt))
      acc[monthKey] = acc[monthKey] ? [...acc[monthKey], post] : [post]
      return acc
    }, {})
  }, [filteredAndSortedPosts])

  const openImmersiveModal = (post: NoticePost) => {
    setActivePost(post)
    setActiveMaterialUrl(null)
    setActiveMaterialHtml(null)
    setOpen(true)
  }

  return (
    <>
      {featuredPost && (
        <section className="premium-hero mb-6 overflow-hidden p-4 sm:mb-8 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Destaque do mês</p>
          <h2 className="premium-title-section mt-2">{featuredPost.title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{featuredPost.excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(featuredPost.contentType === "lesson" || featuredPost.contentType === "live") && featuredPost.externalUrl ? (
              <Button size="sm" className="gap-2" onClick={() => openImmersiveModal(featuredPost)}>
                Abrir destaque
                <PlayCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Link href={`/novidades/${featuredPost.slug}`}>
                <Button size="sm" className="gap-2">
                  Ver destaque
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </section>
      )}

      <div className="mb-5 rounded-[var(--radius-premium)] border border-border/60 bg-black/15 p-2.5 sm:mb-6 sm:p-3">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {(["all", "blog", "lesson", "live", "creatives"] as const).map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={typeFilter === filter ? "default" : "outline"}
              onClick={() => setTypeFilter(filter)}
              className="h-8 shrink-0 rounded-full px-3 text-xs"
            >
              {filter === "all"
                ? "Todos"
                : filter === "blog"
                  ? "Blog"
                  : filter === "lesson"
                    ? "Aula"
                    : filter === "live"
                      ? "Live"
                      : "Criativos"}
            </Button>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-end gap-2">
          <span className="text-[11px] text-muted-foreground">Ordem</span>
          <Button size="sm" variant={sortOrder === "desc" ? "default" : "outline"} onClick={() => setSortOrder("desc")} className="h-7 rounded-full px-3 text-xs">
            Recente
          </Button>
          <Button size="sm" variant={sortOrder === "asc" ? "default" : "outline"} onClick={() => setSortOrder("asc")} className="h-7 rounded-full px-3 text-xs">
            Antigo
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {Object.keys(groupedPosts).length === 0 && (
          <div className="rounded-[var(--radius-premium)] border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
            Nenhuma novidade encontrada para o filtro selecionado.
          </div>
        )}
        {Object.entries(groupedPosts).map(([month, monthPosts]) => (
          <section key={month}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="premium-title-section capitalize">{month}</h2>
              <span className="text-xs text-muted-foreground">{monthPosts.length} novidades</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {monthPosts.map((post) => {
                const TypeIcon = contentTypeIcon[post.contentType]
                const immersiveType = post.contentType === "lesson" || post.contentType === "live"
                return (
                  <article
                    key={post.id}
                    className="premium-surface overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lux-lg)]"
                  >
                    <div className="relative h-32 sm:h-40">
                      {post.coverImage ? (
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full bg-[image:var(--gradient-hero-premium)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                      <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3">
                        <Badge variant="outline" className="gap-1 border-white/35 bg-black/30 text-white">
                          <TypeIcon className="h-3.5 w-3.5" />
                          {contentTypeLabel[post.contentType]}
                        </Badge>
                      </div>
                      {(post.contentType === "lesson" || post.contentType === "live") && (
                        <PlayCircle className="absolute right-2.5 bottom-2.5 h-7 w-7 text-white drop-shadow-md sm:right-3 sm:bottom-3 sm:h-8 sm:w-8" />
                      )}
                    </div>

                    <div className="p-3.5 sm:p-4">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                      </span>
                      <h3 className="premium-title-card mt-1.5 line-clamp-2">{post.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground sm:line-clamp-3">{post.excerpt}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {immersiveType && post.externalUrl ? (
                          <Button size="sm" className="gap-2" onClick={() => openImmersiveModal(post)}>
                            Abrir em tela cheia
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Link href={`/novidades/${post.slug}`}>
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
        <DialogContent className="h-[98vh] w-[99vw] max-w-none border-border/70 bg-background/95 p-2 sm:h-[95vh] sm:w-[97vw] sm:p-4" showCloseButton>
          <DialogTitle className="sr-only">{activePost?.title || "Conteúdo"}</DialogTitle>
          {!activePost?.externalUrl && !activePost?.htmlContent ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Esse conteúdo não possui link para reprodução.
            </div>
          ) : (
            <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3">
              {activePost.externalUrl ? (
                <iframe
                  src={toEmbedUrl(activePost.externalUrl)}
                  title={activePost.title}
                  className="h-full w-full rounded-[var(--radius-premium)] border border-border bg-black"
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              ) : (
                <iframe
                  srcDoc={activePost.htmlContent || ""}
                  title={activePost.title}
                  className="h-full w-full rounded-[var(--radius-premium)] border border-border bg-white"
                  sandbox="allow-scripts allow-popups allow-forms"
                />
              )}

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
                            if (material.type === "html" && material.html) {
                              setActiveMaterialHtml(material.html)
                              setActiveMaterialUrl(null)
                            } else if (material.type === "html" || material.type === "pdf") {
                              setActiveMaterialHtml(null)
                              setActiveMaterialUrl(material.url)
                            } else {
                              setActiveMaterialHtml(null)
                              setActiveMaterialUrl(null)
                              window.open(material.url, "_blank", "noreferrer")
                            }
                          }}
                        >
                          {material.label}
                        </Button>
                      ))}
                    </div>
                    {activeMaterialHtml && (
                      <iframe
                        srcDoc={activeMaterialHtml}
                        title="Material HTML"
                        className="h-52 w-full rounded-[var(--radius-premium)] border border-border bg-white"
                        sandbox="allow-scripts allow-popups allow-forms"
                      />
                    )}
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
