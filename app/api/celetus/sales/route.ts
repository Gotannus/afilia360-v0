import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: sales, error } = await supabase
      .from("celetus_sales")
      .select("*")
      .order("sale_date", { ascending: false })
      .limit(100)

    if (error) {
      console.error("Erro ao buscar vendas:", error)
      return NextResponse.json({ error: "Erro ao buscar vendas" }, { status: 500 })
    }

    return NextResponse.json({ sales: sales || [] })
  } catch (error) {
    console.error("Erro:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
