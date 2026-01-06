import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { isTestSale, isAFILIA360Product } from "@/lib/products"

// Token de segurança da Celetus
const CELETUS_TOKEN = "EZC8J2034G9"

// Webhook para receber vendas da Celetus em tempo real
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "") || req.headers.get("x-celetus-token")

    if (token !== CELETUS_TOKEN) {
      console.log("[v0] Token inválido recebido:", token)
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 })
    }

    const body = await req.json()

    console.log("[v0] Webhook Celetus recebido:", JSON.stringify(body, null, 2))

    const items = body.items || []
    const firstItem = items[0] || {}
    const productCode = firstItem.code
    const productName = firstItem.name

    if (isTestSale(productCode, productName)) {
      console.log(`[v0] ⚠️ Venda de TESTE ignorada: ${productCode} - ${productName}`)
      return NextResponse.json({
        success: true,
        message: "Venda de teste ignorada",
        test_sale: true,
      })
    }

    const supabase = await createClient()

    const commission = body.commission || {}
    const customer = body.customer || {}

    const affiliated = commission.affiliated || []
    const affiliateName = affiliated.length > 0 ? affiliated[0].name : null

    // Salvar os dados brutos para análise
    const saleData = {
      celetus_sale_id: body.id || body.order_id || `webhook_${Date.now()}`,
      seller_name: affiliateName || body.seller || null,
      seller_email: null,
      customer_name: customer.name || null,
      customer_email: customer.email || null,
      customer_phone: customer.phone || null,
      product_id: productCode || null,
      product_name: productName || null,
      total_value: Number.parseFloat(commission.userCommission || commission.totalPrice || 0),
      status: body.order_status || body.charge?.status || "approved",
      sale_date: body.approved_date || body.created_date || new Date().toISOString(),
      raw_data: body,
    }

    console.log("[v0] ✅ Dados extraídos (venda válida):", {
      id: saleData.celetus_sale_id,
      afiliado: saleData.seller_name,
      produto: saleData.product_name,
      codigo: productCode,
      valor: saleData.total_value,
      cliente: saleData.customer_email,
      isAFILIA360: isAFILIA360Product(productCode),
    })

    const { error } = await supabase.from("celetus_sales").upsert(saleData, {
      onConflict: "celetus_sale_id",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("[v0] Erro ao salvar venda:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    await processAffiliateLTV(supabase, body, saleData.sale_date)

    console.log("[v0] Venda salva com sucesso:", saleData.celetus_sale_id)

    return NextResponse.json({
      success: true,
      message: "Venda recebida e salva com sucesso",
      sale_id: saleData.celetus_sale_id,
    })
  } catch (error) {
    console.error("[v0] Erro no webhook:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar webhook",
      },
      { status: 500 },
    )
  }
}

async function processAffiliateLTV(supabase: any, webhookData: any, saleDate: string) {
  try {
    const items = webhookData.items || []
    const commission = webhookData.commission || {}
    const affiliated = commission.affiliated || []
    const totalPrice = Number.parseFloat(commission.totalPrice || 0)

    // Identificar se é venda do AFILIA360
    const isAfiliaBasic = items.some((item: any) => item.code === "FYGCVIHI")
    const isAfiliaPro = items.some((item: any) => item.code === "ZOXLWXI9")
    const isAfiliaSale = isAfiliaBasic || isAfiliaPro

    if (isAfiliaSale) {
      const customerEmail = webhookData.customer?.email || webhookData.cliente?.email

      if (customerEmail) {
        // Buscar se o comprador é um afiliado cadastrado
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("id, plan_purchased, nome_celetus")
          .eq("email", customerEmail)
          .maybeSingle()

        if (affiliate) {
          const planPurchased = isAfiliaPro ? "pro" : "basic"
          const isUpgrade = affiliate.plan_purchased === "basic" && isAfiliaPro

          // Atualizar plano do afiliado
          await supabase
            .from("affiliates")
            .update({
              plan_purchased: planPurchased,
              upgraded_at: isUpgrade ? new Date().toISOString() : null,
            })
            .eq("id", affiliate.id)

          // Registrar no customer_ltv
          const month = saleDate.substring(0, 7) // formato: 2025-12
          const planRevenue = isUpgrade ? 80 : isAfiliaPro ? 97 : 17

          await supabase.from("customer_ltv").upsert(
            {
              affiliate_id: affiliate.id,
              month,
              plan_revenue: planRevenue,
              upgrade_revenue: isUpgrade ? 80 : 0,
            },
            {
              onConflict: "affiliate_id,month",
            },
          )

          console.log(
            `[v0] Afiliado ${affiliate.nome_celetus || customerEmail} comprou ${planPurchased}${isUpgrade ? " (upgrade)" : ""}`,
          )
        } else {
          console.log(`[v0] Comprador ${customerEmail} não é afiliado cadastrado`)
        }
      }
    }

    if (Array.isArray(affiliated) && affiliated.length > 0) {
      for (const aff of affiliated) {
        const affiliateName = aff.name // Campo correto do webhook
        const commissionValue = Number.parseFloat(aff.commissionValue || 0) // Campo correto

        if (!affiliateName || commissionValue <= 0) continue

        // Normalizar nome para busca (remover espaços extras, maiúsculas)
        const normalizedName = affiliateName.trim()

        // Buscar afiliado pelo nome da Celetus
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("id, is_active, first_sale_date, total_commissions, nome_celetus, email")
          .eq("nome_celetus", normalizedName)
          .maybeSingle()

        if (affiliate) {
          const isFirstSale = !affiliate.is_active
          const newTotalCommissions = (Number.parseFloat(affiliate.total_commissions || 0) + commissionValue).toFixed(2)

          // Atualizar status e comissões do afiliado
          await supabase
            .from("affiliates")
            .update({
              is_active: true,
              first_sale_date: isFirstSale ? saleDate : affiliate.first_sale_date,
              total_commissions: newTotalCommissions,
            })
            .eq("id", affiliate.id)

          // Registrar comissão no customer_ltv
          const month = saleDate.substring(0, 7)

          // Buscar LTV existente do mês
          const { data: existingLtv } = await supabase
            .from("customer_ltv")
            .select("commission_revenue")
            .eq("affiliate_id", affiliate.id)
            .eq("month", month)
            .maybeSingle()

          const currentCommissions = Number.parseFloat(existingLtv?.commission_revenue || 0)
          const newCommissionRevenue = (currentCommissions + commissionValue).toFixed(2)

          await supabase.from("customer_ltv").upsert(
            {
              affiliate_id: affiliate.id,
              month,
              commission_revenue: newCommissionRevenue,
            },
            {
              onConflict: "affiliate_id,month",
            },
          )

          console.log(
            `[v0] Afiliado ${affiliate.nome_celetus} ${isFirstSale ? "ativado" : "atualizou comissões"}: +R$${commissionValue}`,
          )
        } else {
          console.log(`[v0] Afiliado "${normalizedName}" não encontrado na tabela affiliates`)
        }
      }
    }

    // Atualizar métricas mensais
    await updateMonthlyMetrics(supabase, saleDate)
  } catch (error) {
    console.error("[v0] Erro ao processar LTV:", error)
  }
}

async function updateMonthlyMetrics(supabase: any, saleDate: string) {
  try {
    const month = saleDate.substring(0, 7)
    const [year, monthNum] = month.split("-").map(Number)

    // Calcular receitas do mês baseado nas vendas
    const { data: salesRaw } = await supabase
      .from("celetus_sales")
      .select("raw_data, sale_date")
      .gte("sale_date", `${month}-01`)
      .lt("sale_date", `${year}-${String(monthNum + 1).padStart(2, "0")}-01`)

    if (!salesRaw) return

    const uniqueMap = new Map()
    for (const sale of salesRaw) {
      const email = sale.raw_data?.customer?.email
      const userCommission = sale.raw_data?.commission?.userCommission
      const firstItemCode = sale.raw_data?.items?.[0]?.code
      const saleMinute = new Date(sale.sale_date).toISOString().substring(0, 16)
      const key = `${email}_${saleMinute}_${userCommission}_${firstItemCode}`

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, sale)
      }
    }
    const sales = Array.from(uniqueMap.values())

    let revenueApp = 0
    let revenueCommissions = 0
    let basicSales = 0
    let proSales = 0

    for (const sale of sales) {
      const items = sale.raw_data?.items || []
      const commission = sale.raw_data?.commission || {}
      const userCommission = Number.parseFloat(commission.userCommission || 0)
      const affiliated = commission.affiliated || []

      const hasBasic = items.some((item: any) => item.code === "FYGCVIHI")
      const hasPro = items.some((item: any) => item.code === "ZOXLWXI9")
      const isAfiliaProduct = hasBasic || hasPro
      const hasAffiliate = Array.isArray(affiliated) && affiliated.length > 0

      if (hasAffiliate) {
        revenueCommissions += userCommission
      } else if (isAfiliaProduct) {
        revenueApp += userCommission
        if (hasBasic) basicSales++
        if (hasPro) proSales++
      }
    }

    // Buscar custos do mês
    const { data: costs } = await supabase.from("monthly_costs").select("amount").eq("month", month)

    const totalCosts = costs?.reduce((sum: number, cost: any) => sum + Number.parseFloat(cost.amount || 0), 0) || 0
    const profit = revenueApp + revenueCommissions - totalCosts

    // Atualizar métricas
    await supabase.from("monthly_metrics").upsert(
      {
        month,
        revenue_app: revenueApp.toFixed(2),
        revenue_commissions: revenueCommissions.toFixed(2),
        total_costs: totalCosts.toFixed(2),
        profit: profit.toFixed(2),
        sales_count: sales.length,
        basic_sales: basicSales,
        pro_sales: proSales,
      },
      {
        onConflict: "month",
      },
    )

    console.log(`[v0] Métricas atualizadas para ${month}`)
  } catch (error) {
    console.error("[v0] Erro ao atualizar métricas:", error)
  }
}

// Permitir GET para verificar se o webhook está funcionando
export async function GET() {
  return NextResponse.json({
    status: "online",
    message: "Webhook Celetus ativo com rastreamento automático de LTV",
    endpoint: "/api/celetus/webhook",
    method: "POST",
    features: [
      "Rastreamento de vendas AFILIA360 (Basic e Pro)",
      "Detecção automática de upgrades",
      "Ativação de afiliados na primeira venda",
      "Cálculo automático de comissões",
      "Atualização de LTV por afiliado",
      "Métricas mensais em tempo real",
    ],
  })
}
