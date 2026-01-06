import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const { data, error } = await supabase.from("daily_metrics_manual").select("*").eq("date", date)

    if (error) {
      console.error("[v0] Error fetching manual metrics:", error)
      throw error
    }

    return NextResponse.json({
      data:
        data && data.length > 0
          ? data[0]
          : {
              date,
              afilia_basic_qty: 0,
              afilia_basic_revenue: 0,
              afilia_pro_qty: 0,
              afilia_pro_revenue: 0,
              affiliate_qty: 0,
              affiliate_revenue: 0,
              daily_expenses: 0,
            },
    })
  } catch (error) {
    console.error("[v0] Error fetching manual metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log("[v0] Salvando métricas:", {
      date: body.date,
      expenses: body.expenses,
      daily_expenses: body.daily_expenses,
    })

    const { data, error } = await supabase
      .from("daily_metrics_manual")
      .upsert({
        date: body.date,
        afilia_basic_qty: body.afilia_basic_qty || 0,
        afilia_basic_revenue: body.afilia_basic_revenue || 0,
        afilia_pro_qty: body.afilia_pro_qty || 0,
        afilia_pro_revenue: body.afilia_pro_revenue || 0,
        affiliate_qty: body.affiliate_qty || 0,
        affiliate_revenue: body.affiliate_revenue || 0,
        daily_expenses: body.expenses || body.daily_expenses || 0,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    console.log("[v0] Métricas salvas com sucesso:", data)

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Error saving manual metrics:", error)
    return NextResponse.json({ error: "Failed to save metrics" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter required" }, { status: 400 })
    }

    const { error } = await supabase.from("daily_metrics_manual").delete().eq("date", date)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting manual metrics:", error)
    return NextResponse.json({ error: "Failed to delete metrics" }, { status: 500 })
  }
}
