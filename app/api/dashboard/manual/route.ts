import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { subDays, startOfDay, endOfDay, eachDayOfInterval, format } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "today"
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")

    let startDate: Date
    let endDate: Date = new Date()

    // Calculate date range based on period
    switch (period) {
      case "today":
        startDate = startOfDay(new Date())
        endDate = endOfDay(new Date())
        break
      case "yesterday":
        startDate = startOfDay(subDays(new Date(), 1))
        endDate = endOfDay(subDays(new Date(), 1))
        break
      case "7days":
        startDate = startOfDay(subDays(new Date(), 6))
        endDate = endOfDay(new Date())
        break
      case "15days":
        startDate = startOfDay(subDays(new Date(), 14))
        endDate = endOfDay(new Date())
        break
      case "custom":
        if (!startDateParam || !endDateParam) {
          return NextResponse.json({ error: "Start and end dates required for custom period" }, { status: 400 })
        }
        startDate = startOfDay(new Date(startDateParam))
        endDate = endOfDay(new Date(endDateParam))
        break
      default:
        startDate = startOfDay(new Date())
        endDate = endOfDay(new Date())
    }

    // Fetch manual metrics from database
    const { data: metrics, error } = await supabase
      .from("daily_metrics_manual")
      .select("*")
      .gte("date", format(startDate, "yyyy-MM-dd"))
      .lte("date", format(endDate, "yyyy-MM-dd"))
      .order("date", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching manual metrics:", error)
      throw error
    }

    const totalMetrics = (metrics || []).reduce(
      (acc, day) => ({
        totalVendas:
          acc.totalVendas + (day.afilia_basic_qty || 0) + (day.afilia_pro_qty || 0) + (day.affiliate_qty || 0),
        receitaTotal:
          acc.receitaTotal +
          Number(day.afilia_basic_revenue || 0) +
          Number(day.afilia_pro_revenue || 0) +
          Number(day.affiliate_revenue || 0),
        receitaAfiliaBasic: acc.receitaAfiliaBasic + Number(day.afilia_basic_revenue || 0),
        receitaAfiliaPro: acc.receitaAfiliaPro + Number(day.afilia_pro_revenue || 0),
        receitaAfiliados: acc.receitaAfiliados + Number(day.affiliate_revenue || 0),
        vendasAfiliaBasic: acc.vendasAfiliaBasic + (day.afilia_basic_qty || 0),
        vendasAfiliaPro: acc.vendasAfiliaPro + (day.afilia_pro_qty || 0),
        vendasAfiliados: acc.vendasAfiliados + (day.affiliate_qty || 0),
        despesasTotal: acc.despesasTotal + Number(day.daily_expenses || 0),
      }),
      {
        totalVendas: 0,
        receitaTotal: 0,
        receitaAfiliaBasic: 0,
        receitaAfiliaPro: 0,
        receitaAfiliados: 0,
        vendasAfiliaBasic: 0,
        vendasAfiliaPro: 0,
        vendasAfiliados: 0,
        despesasTotal: 0,
      },
    )

    const allDays = eachDayOfInterval({ start: startDate, end: endDate })
    const dailyData = allDays.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd")
      const dayMetrics = metrics?.find((m) => m.date === dayStr)

      const basicRevenue = Number(dayMetrics?.afilia_basic_revenue || 0)
      const proRevenue = Number(dayMetrics?.afilia_pro_revenue || 0)
      const affiliateRevenue = Number(dayMetrics?.affiliate_revenue || 0)
      const expenses = Number(dayMetrics?.daily_expenses || 0)
      const totalRevenue = basicRevenue + proRevenue + affiliateRevenue

      return {
        date: dayStr,
        afiliaBasic: basicRevenue,
        afiliaPro: proRevenue,
        afiliados: affiliateRevenue,
        despesas: expenses,
        lucroLiquido: totalRevenue - expenses,
      }
    })

    const lucroLiquido = totalMetrics.receitaTotal - totalMetrics.despesasTotal

    return NextResponse.json({
      totalVendas: totalMetrics.totalVendas,
      receitaTotal: totalMetrics.receitaTotal,
      receitaAfiliaBasic: totalMetrics.receitaAfiliaBasic,
      receitaAfiliaPro: totalMetrics.receitaAfiliaPro,
      receitaAfiliados: totalMetrics.receitaAfiliados,
      vendasAfiliaBasic: totalMetrics.vendasAfiliaBasic,
      vendasAfiliaPro: totalMetrics.vendasAfiliaPro,
      vendasAfiliados: totalMetrics.vendasAfiliados,
      despesasTotal: totalMetrics.despesasTotal,
      lucroLiquido: lucroLiquido,
      dailyData,
      productBreakdown: [
        {
          name: "AFILIA360 BÁSICO",
          vendas: totalMetrics.vendasAfiliaBasic,
          receita: totalMetrics.receitaAfiliaBasic,
        },
        {
          name: "AFILIA360 PRO",
          vendas: totalMetrics.vendasAfiliaPro,
          receita: totalMetrics.receitaAfiliaPro,
        },
        {
          name: "Vendas de Afiliados",
          vendas: totalMetrics.vendasAfiliados,
          receita: totalMetrics.receitaAfiliados,
        },
      ].filter((p) => p.vendas > 0),
    })
  } catch (error) {
    console.error("[v0] Error in dashboard manual API:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
