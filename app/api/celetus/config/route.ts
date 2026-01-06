import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Buscar configuração atual
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("celetus_config")
      .select("id, last_sync, is_active, created_at")
      .maybeSingle()

    if (error) {
      throw error
    }

    return NextResponse.json({ config: data })
  } catch (error) {
    console.error("[v0] Config GET error:", error)
    return NextResponse.json({ error: "Erro ao buscar configuração" }, { status: 500 })
  }
}

// POST - Salvar API Key
export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API Key é obrigatória" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: existing } = await supabase.from("celetus_config").select("id").maybeSingle()

    if (existing) {
      // Atualizar
      const { error } = await supabase
        .from("celetus_config")
        .update({ api_key: apiKey, is_active: true })
        .eq("id", existing.id)

      if (error) throw error
    } else {
      // Inserir
      const { error } = await supabase.from("celetus_config").insert({ api_key: apiKey, is_active: true })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Config POST error:", error)
    return NextResponse.json({ error: "Erro ao salvar configuração" }, { status: 500 })
  }
}
