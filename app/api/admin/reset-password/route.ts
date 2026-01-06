import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { affiliateId, newPassword } = await request.json()

    if (!affiliateId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const supabase = await createClient()

    // Senha padrão ou nova senha fornecida
    const password = newPassword || "123456"

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Atualizar senha do usuário
    const { error: updateError } = await supabase
      .from("affiliates")
      .update({ password: hashedPassword })
      .eq("id", affiliateId)

    if (updateError) {
      console.error("Erro ao resetar senha:", updateError)
      return NextResponse.json({ error: "Erro ao resetar senha" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Senha alterada para: ${password}`,
    })
  } catch (error) {
    console.error("Erro ao resetar senha:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
