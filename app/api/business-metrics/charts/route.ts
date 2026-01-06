import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const months = Number.parseInt(searchParams.get("months") || "6")

    // Buscar métricas mensais dos últimos N meses
    const { data: metricsData, error: metricsError } = await supabase
      .from("monthly_metrics")
      .select("*")
      .order("month", { ascending: true })
      .limit(months)

    if (metricsError) throw metricsError

    // Buscar distribuição de custos do mês atual
    const currentMonth = new Date().toISOString().slice(0, 7) // formato: 2025-12
    const { data: costsData, error: costsError } = await supabase
      .from("monthly_costs")
      .select("category, amount")
      .eq("month", currentMonth)

    if (costsError) throw costsError

    // Agregar custos por categoria
    const costsByCategory = costsData?.reduce((acc: any, cost) => {
      if (!acc[cost.category]) {
        acc[cost.category] = 0
      }
      acc[cost.category] += Number.parseFloat(cost.amount)
      return acc
    }, {})

    return NextResponse.json({
      monthlyMetrics: metricsData || [],
      costsByCategory: costsByCategory || {},
    })
  } catch (error: any) {
    console.error("Error fetching chart data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
