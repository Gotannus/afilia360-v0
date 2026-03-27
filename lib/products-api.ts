import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/products-data"

// Converte do formato do banco para o formato do app
function dbToProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    image: row.image,
    tag: row.tag,
    tagLabel: row.tag_label,
    nicho: row.nicho,
    comissao: row.comissao,
    ticket: row.ticket,
    estrategia: row.estrategia,
    plataforma: row.plataforma,
    formato: row.formato,
    aulas: row.aulas || [],
    vendas: row.vendas,
    rating: Number(row.rating) || 0,
    badge: row.badge,
    affiliateUrl: row.affiliate_url,
    hotmartUrl: row.hotmart_url || undefined,
    driveUrl: row.drive_url,
    category: row.category,
    orderbumps: row.orderbumps || 0,
    upsellStatus: row.upsell_status || "nao",
    releaseDate: row.release_date,
    metrics: {
      cpcMedio: row.cpc_medio || "",
      checkout: row.checkout || "",
      cpaAlvo: row.cpa_alvo || "",
    },
    vipOnly: row.vip_only || false,
    comingSoon: row.coming_soon || false,
  }
}

// Converte do formato do app para o formato do banco
function productToDb(product: Omit<Product, "id"> & { id?: string }) {
  return {
    title: product.title,
    image: product.image,
    tag: product.tag || null,
    tag_label: product.tagLabel || null,
    nicho: product.nicho,
    comissao: product.comissao,
    ticket: product.ticket,
    estrategia: product.estrategia || null,
    plataforma: product.plataforma || null,
    formato: product.formato || null,
    aulas: product.aulas || [],
    vendas: product.vendas || 0,
    rating: product.rating || 0,
    badge: product.badge || null,
    affiliate_url: product.affiliateUrl,
    hotmart_url: product.hotmartUrl || null,
    drive_url: product.driveUrl || null,
    category: product.category || null,
    orderbumps: product.orderbumps || 0,
    upsell_status: product.upsellStatus || "nao",
    release_date: product.releaseDate || null,
    cpc_medio: product.metrics?.cpcMedio || null,
    checkout: product.metrics?.checkout || null,
    cpa_alvo: product.metrics?.cpaAlvo || null,
    vip_only: product.vipOnly || false,
    coming_soon: product.comingSoon || false,
  }
}

// Cache de produtos em memória (5 minutos)
let productsCache: { data: Product[]; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export async function fetchProducts(): Promise<Product[]> {
  // Verificar cache
  if (productsCache && Date.now() - productsCache.timestamp < CACHE_DURATION) {
    console.log("[v0] Usando produtos do cache")
    return productsCache.data
  }

  const supabase = createClient()
  
  // Selecionar apenas os campos necessários para reduzir egress
  const { data, error } = await supabase
    .from("marketplace_products")
    .select(`
      id,
      title,
      image,
      tag,
      tag_label,
      nicho,
      comissao,
      ticket,
      estrategia,
      plataforma,
      formato,
      aulas,
      vendas,
      rating,
      badge,
      affiliate_url,
      hotmart_url,
      drive_url,
      category,
      orderbumps,
      upsell_status,
      release_date,
      cpc_medio,
      checkout,
      cpa_alvo,
      vip_only,
      coming_soon,
      display_order
    `)
    .eq("validated", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Erro ao buscar produtos:", error.message)
    // Retornar cache antigo se disponível
    if (productsCache) {
      console.log("[v0] Usando cache antigo devido ao erro")
      return productsCache.data
    }
    return []
  }

  const products = data.map(dbToProduct)
  
  // Atualizar cache
  productsCache = {
    data: products,
    timestamp: Date.now()
  }

  console.log("[v0] Produtos carregados do banco:", products.length)

  return products
}

export async function addProductToDb(product: Omit<Product, "id">): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("marketplace_products").insert(productToDb(product)).select().single()

  if (error) {
    console.error("Erro ao adicionar produto:", error)
    return null
  }

  return dbToProduct(data)
}

export async function updateProductInDb(id: string, product: Partial<Product>): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketplace_products")
    .update(productToDb(product as Product))
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar produto:", error)
    return null
  }

  return dbToProduct(data)
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("marketplace_products").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar produto:", error)
    return false
  }

  return true
}
