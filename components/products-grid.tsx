"use client"

import { useMemo, useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import type { SortOption } from "@/app/page"
import type { Product } from "@/lib/products-data"
import { fetchProducts } from "@/lib/products-api"
import { ChevronDown, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ProductsGridProps {
  selectedCategory: string
  searchQuery: string
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "mais-vendidos", label: "Mais Vendidos" },
  { value: "mais-recentes", label: "Mais Recentes" },
  { value: "maior-comissao", label: "Maior Comissão" },
  { value: "melhor-avaliados", label: "Melhor Avaliados" },
]

export function ProductsGrid({ selectedCategory, searchQuery, sortBy, onSortChange }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      const data = await fetchProducts()
      setProducts(data)
      setLoading(false)
    }
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = products

    const today = new Date().toISOString().split("T")[0]
    result = result.filter((p) => !p.releaseDate || p.releaseDate <= today)

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category === selectedCategory || p.nicho.toLowerCase() === selectedCategory.toLowerCase(),
      )
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(query) || p.nicho.toLowerCase().includes(query))
    }

    if (sortBy !== "relevancia") {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "mais-vendidos":
            return (b.vendas || 0) - (a.vendas || 0)
          case "mais-recentes":
            const aIsNew = a.tag === "new" || a.badge === "novo" ? 1 : 0
            const bIsNew = b.tag === "new" || b.badge === "novo" ? 1 : 0
            return bIsNew - aIsNew
          case "maior-comissao":
            const getMaxComissao = (comissao: string) => {
              const matches = comissao.match(/\d+/g)
              if (matches) {
                return Math.max(...matches.map(Number))
              }
              return 0
            }
            return getMaxComissao(b.comissao) - getMaxComissao(a.comissao)
          case "melhor-avaliados":
            return (b.rating || 0) - (a.rating || 0)
          default:
            return 0
        }
      })
    }
    return result
  }, [products, selectedCategory, searchQuery, sortBy])

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Relevância"

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex-1">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Produtos Validados</h1>
          <p className="mt-1 text-sm text-muted-foreground">Encontre os melhores produtos para promover</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Ordenar por:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[160px] justify-between bg-transparent">
                {currentSortLabel}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={sortBy === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
            {filteredProducts.length} produtos
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground">Nenhum produto encontrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">Tente ajustar os filtros ou a busca</p>
        </div>
      )}
    </div>
  )
}
