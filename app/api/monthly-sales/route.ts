import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const month = searchParams.get("month")
  const year = searchParams.get("year")

  if (month && year) {
    // Buscar vendas de um mês específico
    const { data, error } = await supabase
      .from("monthly_total_sales")
      .select("*")
      .eq("month", Number.parseInt(month))
      .eq("year", Number.parseInt(year))
      .single()

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || { total_sales: 0 })
  }

  // Buscar histórico completo
  const { data, error } = await supabase
    .from("monthly_total_sales")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { month, year, total_sales } = await request.json()

  const { data, error } = await supabase
    .from("monthly_total_sales")
    .upsert({ month, year, total_sales, updated_at: new Date().toISOString() }, { onConflict: "month,year" })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  const { error } = await supabase.from("monthly_total_sales").delete().eq("id", Number.parseInt(id))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
