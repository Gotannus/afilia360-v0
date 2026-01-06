import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get("month") || "2025-12"

  const supabase = await createClient()

  const { data: metrics, error: metricsError } = await supabase
    .from("monthly_metrics")
    .select("*")
    .eq("month", month)
    .maybeSingle()

  if (metricsError) {
    return NextResponse.json({ error: metricsError.message }, { status: 500 })
  }

  // Buscar custos do mês
  const { data: costs, error: costsError } = await supabase
    .from("monthly_costs")
    .select("*")
    .eq("month", month)
    .order("category", { ascending: true })

  if (costsError) {
    return NextResponse.json({ error: costsError.message }, { status: 500 })
  }

  // Buscar métricas dos últimos 6 meses para gráfico
  const currentDate = new Date(month + "-01")
  const sixMonthsAgo = new Date(currentDate)
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)

  const { data: historicalMetrics, error: historicalError } = await supabase
    .from("monthly_metrics")
    .select("*")
    .gte("month", sixMonthsAgo.toISOString().slice(0, 7))
    .lte("month", month)
    .order("month", { ascending: true })

  return NextResponse.json({
    metrics: metrics || {
      month,
      revenue_app: 0,
      revenue_commissions: 0,
      total_costs: 0,
      profit: 0,
      sales_count: 0,
      basic_sales: 0,
      pro_sales: 0,
    },
    costs: costs || [],
    historicalMetrics: historicalMetrics || [],
  })
}
