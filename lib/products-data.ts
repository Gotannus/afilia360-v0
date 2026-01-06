export interface Product {
  id: string
  title: string
  image: string
  tag?: "top" | "new" | "hot" | "opportunity" | "perfectpay" | "coming-soon"
  tagLabel?: string
  metrics?: {
    cpcMedio: string
    checkout: string
    cpaAlvo: string
  }
  nicho: string
  comissao: string
  ticket: string
  estrategia?: string
  plataforma?: string
  formato?: string
  aulas?: {
    title: string
    url: string
  }[]
  vendas?: number
  rating?: number
  badge?: "bestseller" | "novo" | "trending"
  affiliateUrl: string
  driveUrl?: string
  category?: string
  orderbumps?: number
  upsellStatus?: "sim" | "nao" | "em-breve"
  releaseDate?: string // formato ISO: "2025-01-15"
  vipOnly?: boolean // campo para produtos exclusivos VIP
  comingSoon?: boolean // campo para marcar produtos "em breve" com design de suspense
}

export interface RankingMember {
  id: string
  affiliateId: string // ID do usuário na tabela affiliates
  affiliateName?: string // Cache do nome para exibição
  affiliatePhoto?: string // Cache da foto para exibição
  sales: number
  week: string
}

export const products: Product[] = []

export const categories = [{ id: "all", label: "Todos", count: 0 }]

export const initialRanking: RankingMember[] = []
