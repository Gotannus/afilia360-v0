import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // Buscar API Key configurada
    const { data: config } = await supabase.from("celetus_config").select("*").eq("is_active", true).single()

    if (!config?.api_key) {
      return NextResponse.json({ error: "API Key não configurada" }, { status: 400 })
    }

    // Buscar vendas da Celetus
    const response = await fetch("https://api.celetus.com/api/sales?rowsPerPage=100&pageNumber=1", {
      headers: {
        "X-api-key": config.api_key,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Celetus API error:", response.status, errorText)
      return NextResponse.json(
        { error: `Erro na API Celetus: ${response.status}`, details: errorText },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("[v0] Celetus raw response:", JSON.stringify(data, null, 2))

    // Retornar dados brutos para análise
    return NextResponse.json({
      success: true,
      raw_response: data,
      message: "Dados recebidos da Celetus - verifique a estrutura no console",
    })
  } catch (error) {
    console.error("[v0] Sync error:", error)
    return NextResponse.json({ error: "Erro ao sincronizar", details: String(error) }, { status: 500 })
  }
}
