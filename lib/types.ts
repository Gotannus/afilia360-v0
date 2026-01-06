export interface Affiliate {
  id: string
  name: string
  email: string
  whatsapp: string
  status: "pending" | "approved" | "rejected" | "paused"
  photo_url?: string
  created_at: string
  approved_at?: string
  approved_by?: string
  is_vip?: boolean
  plan_id?: string
  nome_celetus?: string
  first_sale_date?: string
  total_commissions: number
  is_active: boolean
  plan_purchased?: "basic" | "pro"
  upgraded_at?: string
}

export interface MarketplaceProduct {
  id: string
  name: string
  niche: string
  image_url?: string
  affiliate_link?: string
  drive_link?: string
  commission: string
  platform: string
  sales: number
  cpc?: string
  checkout?: string
  cpa?: string
  strategy?: string
  badge?: string
  badge_color: string
  lessons: { title: string; url: string }[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AffiliateRanking {
  id: string
  name: string
  image_url?: string
  position: number
  week: string
  created_at: string
}

export interface MonthlyCost {
  id: string
  month: string
  category: "hospedagem" | "ia" | "marketing" | "ferramentas" | "outros"
  description: string
  amount: number
  is_recurring: boolean
  created_at: string
  updated_at: string
}

export interface MonthlyMetrics {
  id: string
  month: string
  revenue_app: number
  revenue_commissions: number
  total_costs: number
  profit: number
  sales_count: number
  basic_sales: number
  pro_sales: number
  created_at: string
  updated_at: string
}

export interface CustomerLTV {
  id: string
  affiliate_id: string
  month: string
  plan_revenue: number
  upgrade_revenue: number
  commission_revenue: number
  total_ltv: number
  created_at: string
  updated_at: string
}

export interface AffiliateExtended extends Affiliate {
  first_sale_date?: string
  total_commissions: number
  is_active: boolean
  plan_purchased?: "basic" | "pro"
  upgraded_at?: string
}
