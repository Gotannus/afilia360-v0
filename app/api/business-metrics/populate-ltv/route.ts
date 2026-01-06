import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Endpoint para popular customer_ltv de todos os afiliados baseado no histórico
export async function POST(req: Request) {
  try {
    const { month } = await req.json()

    if (!month) {
      return NextResponse.json({ error: "Mês é obrigatório (formato: 2025-12)" }, { status: 400 })
    }

    const supabase = await createClient()

    // Buscar todos os afiliados
    const { data: affiliates, error: affiliatesError } = await supabase
      .from("affiliates")
      .select("id, email, nome_celetus, plan_purchased, total_commissions")

    if (affiliatesError || !affiliates) {
      return NextResponse.json({ error: "Erro ao buscar afiliados" }, { status: 500 })
    }

    let processed = 0
    const [year, monthNum] = month.split("-").map(Number)
    const startDate = `${month}-01`
    const endDate = `${year}-${String(monthNum + 1).padStart(2, "0")}-01`

    for (const affiliate of affiliates) {
      let planRevenue = 0
      let upgradeRevenue = 0
      let commissionRevenue = 0

      // Buscar vendas do afiliado no mês (compras de planos)
      const { data: purchases } = await supabase
        .from("celetus_sales")
        .select("raw_data, sale_date")
        .eq("customer_email", affiliate.email)
        .gte("sale_date", startDate)
        .lt("sale_date", endDate)

      if (purchases) {
        for (const purchase of purchases) {
          const items = purchase.raw_data?.items || []
          const hasBasic = items.some((item: any) => item.code === "FYGCVIHI")
          const hasPro = items.some((item: any) => item.code === "ZOXLWXI9")

          if (hasBasic) planRevenue += 17
          if (hasPro) {
            if (affiliate.plan_purchased === "basic") {
              upgradeRevenue += 80
            } else {
              planRevenue += 97
            }
          }
        }
      }

      // Buscar comissões do afiliado no mês
      const { data: sales } = await supabase
        .from("celetus_sales")
        .select("raw_data")
        .gte("sale_date", startDate)
        .lt("sale_date", endDate)

      if (sales) {
        for (const sale of sales) {
          const affiliated = sale.raw_data?.commission?.affiliated || []

          for (const aff of affiliated) {
            if (aff.type === "Principal" && aff.name === affiliate.nome_celetus) {
              commissionRevenue += Number.parseFloat(aff.value || 0)
            }
          }
        }
      }

      // Calcular LTV acumulado até este mês
      const { data: previousLtv } = await supabase
        .from("customer_ltv")
        .select("total_ltv")
        .eq("affiliate_id", affiliate.id)
        .lt("month", month)
        .order("month", { ascending: false })
        .limit(1)
        .single()

      const previousTotal = Number.parseFloat(previousLtv?.total_ltv || 0)
      const totalLtv = previousTotal + planRevenue + upgradeRevenue + commissionRevenue

      // Inserir ou atualizar customer_ltv
      const { error: ltvError } = await supabase.from("customer_ltv").upsert(
        {
          affiliate_id: affiliate.id,
          month,
          plan_revenue: planRevenue.toFixed(2),
          upgrade_revenue: upgradeRevenue.toFixed(2),
          commission_revenue: commissionRevenue.toFixed(2),
          total_ltv: totalLtv.toFixed(2),
        },
        {
          onConflict: "affiliate_id,month",
        },
      )

      if (!ltvError) {
        processed++
      }
    }

    return NextResponse.json({
      success: true,
      message: `LTV populado para ${processed} afiliados no mês ${month}`,
      processed,
      total: affiliates.length,
    })
  } catch (error) {
    console.error("Erro ao popular LTV:", error)
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Endpoint para popular customer_ltv de um mês específico",
    method: "POST",
    body: {
      month: "2025-12 (formato: YYYY-MM)",
    },
    example: {
      month: "2025-12",
    },
  })
}
