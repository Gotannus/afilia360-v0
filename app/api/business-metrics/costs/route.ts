import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase.from("monthly_costs").insert([body]).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Atualizar total_costs e profit na monthly_metrics
  await updateMonthlyMetrics(supabase, body.month)

  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { id, ...updates } = body

  const { data, error } = await supabase.from("monthly_costs").update(updates).eq("id", id).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Atualizar total_costs e profit na monthly_metrics
  await updateMonthlyMetrics(supabase, data.month)

  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const month = searchParams.get("month")

  if (!id || !month) {
    return NextResponse.json({ error: "ID e mês são obrigatórios" }, { status: 400 })
  }

  const { error } = await supabase.from("monthly_costs").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Atualizar total_costs e profit na monthly_metrics
  await updateMonthlyMetrics(supabase, month)

  return NextResponse.json({ success: true })
}

async function updateMonthlyMetrics(supabase: any, month: string) {
  // Calcular total de custos
  const { data: costs } = await supabase.from("monthly_costs").select("amount").eq("month", month)

  const totalCosts = costs?.reduce((sum: number, cost: any) => sum + Number.parseFloat(cost.amount), 0) || 0

  // Buscar receitas
  const { data: metrics } = await supabase
    .from("monthly_metrics")
    .select("revenue_app, revenue_commissions")
    .eq("month", month)
    .single()

  if (metrics) {
    const profit = Number.parseFloat(metrics.revenue_app) + Number.parseFloat(metrics.revenue_commissions) - totalCosts

    await supabase.from("monthly_metrics").update({ total_costs: totalCosts, profit }).eq("month", month)
  }
}
