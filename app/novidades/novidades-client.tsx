"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { NovidadesFeed } from "@/components/novidades-feed"
import type { NoticePost } from "@/lib/announcements-blog"

export function NovidadesPageClient({ initialPosts }: { initialPosts: NoticePost[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return initialPosts
    return initialPosts.filter((post) => {
      const title = post.title.toLowerCase()
      const excerpt = post.excerpt.toLowerCase()
      const content = post.content.toLowerCase()
      return title.includes(normalizedQuery) || excerpt.includes(normalizedQuery) || content.includes(normalizedQuery)
    })
  }, [initialPosts, normalizedQuery])

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <NovidadesFeed posts={filteredPosts} />
      </main>
    </div>
  )
}
