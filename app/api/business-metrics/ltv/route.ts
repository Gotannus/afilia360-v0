import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get("month") || "2025-12"

  const supabase = await createClient()

  // Buscar todos os afiliados com dados de ativação
  const { data: affiliates, error: affiliatesError } = await supabase
    .from("affiliates")
    .select("id, name, email, is_active, total_commissions, plan_purchased, first_sale_date")

  if (affiliatesError) {
    return NextResponse.json({ error: affiliatesError.message }, { status: 500 })
  }

  // Calcular segmentação
  const totalAffiliates = affiliates?.length || 0
  const activeAffiliates = affiliates?.filter((a) => a.is_active).length || 0
  const inactiveAffiliates = totalAffiliates - activeAffiliates

  // Segmentar por plano e atividade
  const basicInactive = affiliates?.filter((a) => a.plan_purchased === "basic" && !a.is_active).length || 0
  const basicActive = affiliates?.filter((a) => a.plan_purchased === "basic" && a.is_active).length || 0
  const proInactive = affiliates?.filter((a) => a.plan_purchased === "pro" && !a.is_active).length || 0
  const proActive = affiliates?.filter((a) => a.plan_purchased === "pro" && a.is_active).length || 0

  // Calcular LTV médio por segmento
  const activeAffiliatesData = affiliates?.filter((a) => a.is_active) || []
  const avgCommissionPerActive =
    activeAffiliatesData.length > 0
      ? activeAffiliatesData.reduce((sum, a) => sum + Number(a.total_commissions || 0), 0) / activeAffiliatesData.length
      : 0

  const basicActiveLTV = 17 + avgCommissionPerActive
  const proActiveLTV = 97 + avgCommissionPerActive

  // Calcular LTV médio ponderado
  const ltvWeighted =
    (basicInactive * 17 + basicActive * basicActiveLTV + proInactive * 97 + proActive * proActiveLTV) /
    (totalAffiliates || 1)

  // Taxa de ativação
  const activationRate = totalAffiliates > 0 ? (activeAffiliates / totalAffiliates) * 100 : 0

  // Buscar métricas do mês para calcular CAC
  const { data: metrics } = await supabase.from("monthly_metrics").select("*").eq("month", month).single()

  // Buscar custos de marketing
  const { data: marketingCosts } = await supabase
    .from("monthly_costs")
    .select("amount")
    .eq("month", month)
    .eq("category", "marketing")

  const totalMarketingCost = marketingCosts?.reduce((sum, cost) => sum + Number(cost.amount), 0) || 0

  // CAC = Custo de Marketing / Novos Clientes
  // Para simplificar, vamos usar sales_count como proxy
  const newCustomers = metrics?.basic_sales + metrics?.pro_sales || 1
  const cac = totalMarketingCost / newCustomers

  // ROI = (LTV - CAC) / CAC * 100
  const roi = cac > 0 ? ((ltvWeighted - cac) / cac) * 100 : 0

  // Payback em meses (assumindo receita mensal média)
  const avgMonthlyRevenue = ltvWeighted / 6 // Assumindo 6 meses de vida média
  const paybackMonths = cac > 0 ? cac / avgMonthlyRevenue : 0

  return NextResponse.json({
    overview: {
      totalAffiliates,
      activeAffiliates,
      inactiveAffiliates,
      activationRate: activationRate.toFixed(1),
      avgLTV: ltvWeighted.toFixed(2),
      cac: cac.toFixed(2),
      roi: roi.toFixed(1),
      paybackMonths: paybackMonths.toFixed(1),
    },
    segmentation: [
      {
        segment: "Basic Inativo",
        count: basicInactive,
        percentage: totalAffiliates > 0 ? ((basicInactive / totalAffiliates) * 100).toFixed(1) : 0,
        ltv: 17,
        roi: cac > 0 ? (((17 - cac) / cac) * 100).toFixed(1) : 0,
      },
      {
        segment: "Basic Ativo",
        count: basicActive,
        percentage: totalAffiliates > 0 ? ((basicActive / totalAffiliates) * 100).toFixed(1) : 0,
        ltv: basicActiveLTV.toFixed(2),
        roi: cac > 0 ? (((basicActiveLTV - cac) / cac) * 100).toFixed(1) : 0,
      },
      {
        segment: "Pro Inativo",
        count: proInactive,
        percentage: totalAffiliates > 0 ? ((proInactive / totalAffiliates) * 100).toFixed(1) : 0,
        ltv: 97,
        roi: cac > 0 ? (((97 - cac) / cac) * 100).toFixed(1) : 0,
      },
      {
        segment: "Pro Ativo",
        count: proActive,
        percentage: totalAffiliates > 0 ? ((proActive / totalAffiliates) * 100).toFixed(1) : 0,
        ltv: proActiveLTV.toFixed(2),
        roi: cac > 0 ? (((proActiveLTV - cac) / cac) * 100).toFixed(1) : 0,
      },
    ],
  })
}
