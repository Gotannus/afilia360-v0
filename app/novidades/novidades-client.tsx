"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Megaphone, Search } from "lucide-react"
import { Header } from "@/components/header"
import { NovidadesFeed } from "@/components/novidades-feed"
import { Input } from "@/components/ui/input"
import type { NoticePost } from "@/lib/announcements-blog"

export function NovidadesPageClient({ initialPosts }: { initialPosts: NoticePost[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return initialPosts
    return initialPosts.filter((post) => {
      const title = String(post.title || "").toLowerCase()
      const excerpt = String(post.excerpt || "").toLowerCase()
      const content = String(post.content || "").toLowerCase()
      return title.includes(normalizedQuery) || excerpt.includes(normalizedQuery) || content.includes(normalizedQuery)
    })
  }, [initialPosts, normalizedQuery])

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      <div className="premium-surface sticky top-0 z-40 border-x-0 border-t-0 px-4 py-3 md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="brand-highlight flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-primary-foreground">
              A
            </span>
            Afilia360
          </Link>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
            <Megaphone className="h-3.5 w-3.5" />
            Novidades
          </span>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar novidade..."
            className="h-9 rounded-full border-border/70 bg-background/80 pl-8 text-sm"
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6 sm:py-8">
        <NovidadesFeed posts={filteredPosts} />
      </main>
    </div>
  )
}
