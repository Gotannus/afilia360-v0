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
    validated: true, // Define como validado por padrão
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketplace_products")
    .select("*")
    .eq("validated", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }

  console.log(
    "[v0] Produtos carregados do banco:",
    data.map((p) => ({ title: p.title, display_order: p.display_order })),
  )

  return data.map(dbToProduct)
}

export async function addProductToDb(product: Omit<Product, "id">): Promise<Product | null> {
  console.log("[v0] Tentando adicionar produto:", product.title)
  const supabase = createClient()
  const productData = productToDb(product)
  console.log("[v0] Dados do produto convertidos para DB:", productData)
  
  const { data, error } = await supabase.from("marketplace_products").insert(productData).select().single()

  if (error) {
    console.error("[v0] Erro ao adicionar produto:", error)
    console.error("[v0] Detalhes do erro:", JSON.stringify(error, null, 2))
    return null
  }

  console.log("[v0] Produto adicionado com sucesso!")
  return dbToProduct(data)
}

export async function updateProductInDb(id: string, product: Partial<Product>): Promise<Product | null> {
  console.log("[v0] Tentando atualizar produto:", id, product.title)
  const supabase = createClient()
  const productData = productToDb(product as Product)
  console.log("[v0] Dados do produto convertidos para atualização:", productData)
  
  const { data, error } = await supabase
    .from("marketplace_products")
    .update(productData)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Erro ao atualizar produto:", error)
    console.error("[v0] Detalhes do erro:", JSON.stringify(error, null, 2))
    return null
  }

  console.log("[v0] Produto atualizado com sucesso!")
  return dbToProduct(data)
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  console.log("[v0] Tentando deletar produto:", id)
  const supabase = createClient()
  const { error } = await supabase.from("marketplace_products").delete().eq("id", id)

  if (error) {
    console.error("[v0] Erro ao deletar produto:", error)
    console.error("[v0] Detalhes do erro:", JSON.stringify(error, null, 2))
    return false
  }

  console.log("[v0] Produto deletado com sucesso!")
  return true
}
