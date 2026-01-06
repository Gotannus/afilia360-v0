import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { affiliateId } = await request.json()

    if (!affiliateId) {
      return NextResponse.json({ error: "ID do afiliado é obrigatório" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("affiliates").update({ onboarding_completed: true }).eq("id", affiliateId)

    if (error) {
      console.error("Erro ao atualizar onboarding:", error)
      return NextResponse.json({ error: "Erro ao completar onboarding" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Erro no onboarding:", err)
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}
