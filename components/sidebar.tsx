"use client"

import { cn } from "@/lib/utils"
import { categories } from "@/lib/products-data"
import { Search, Crown, Package, Trophy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RankingSection } from "@/components/ranking-section"
import { HostingerBanner } from "@/components/hostinger-banner"
import Link from "next/link"
import { useUserPlan } from "@/hooks/use-user-plan"

interface SidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function Sidebar({ selectedCategory, onCategoryChange, searchQuery, onSearchChange }: SidebarProps) {
  const { isVip } = useUserPlan()

  return (
    <aside className="sticky top-20 hidden h-fit w-72 shrink-0 space-y-6 lg:block">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 border-border bg-card pl-9 text-sm placeholder:text-muted-foreground"
        />
      </div>

      {!isVip && (
        <Link href="/seja-vip">
          <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 p-4 hover:border-yellow-500/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Crown className="h-5 w-5 text-black" />
              </div>
              <div>
                <h4 className="font-semibold text-yellow-500 group-hover:text-yellow-400 transition-colors">
                  Ganhe +5% de Comissão
                </h4>
                <p className="text-xs text-muted-foreground">Torne-se VIP agora</p>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Categories */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Categorias</h3>
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                selectedCategory === category.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <span>{category.label}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{category.count}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Ranking */}
      <RankingSection />

      <Link href="/ranking">
        <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
              <h4 className="font-medium text-sm">Ver Ranking Completo</h4>
              <p className="text-xs text-muted-foreground">Confira sua posição</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Hostinger Banner */}
      <HostingerBanner />

      <Link href="/enviar-produto">
        <div className="rounded-xl border border-border bg-card p-4 hover:border-green-500/50 transition-all cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Package className="h-4 w-4 text-green-500" />
            </div>
            <h4 className="text-sm font-medium">Quer listar seu produto?</h4>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Junte-se ao marketplace e alcance milhares de afiliados qualificados.
          </p>
          <div className="w-full rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white text-center hover:bg-green-700 transition-colors">
            Enviar Produto
          </div>
        </div>
      </Link>
    </aside>
  )
}
