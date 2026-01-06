"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ProductsGrid } from "@/components/products-grid"
import { AnnouncementsTicker } from "@/components/announcements-ticker"
import { RankingBanner } from "@/components/ranking/ranking-banner"

export type SortOption = "relevancia" | "mais-vendidos" | "mais-recentes" | "maior-comissao" | "melhor-avaliados"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("relevancia")

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <AnnouncementsTicker />
      <RankingBanner />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-8">
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <ProductsGrid
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>
    </div>
  )
}
