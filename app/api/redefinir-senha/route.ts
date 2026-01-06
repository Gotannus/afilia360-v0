import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token e senha são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verificar token
    const { data: tokenData, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("affiliate_id, expires_at")
      .eq("token", token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 })
    }

    // Verificar se token expirou
    if (new Date(tokenData.expires_at) < new Date()) {
      // Deletar token expirado
      await supabase.from("password_reset_tokens").delete().eq("token", token)

      return NextResponse.json({ error: "Token expirado. Solicite uma nova recuperação." }, { status: 400 })
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Atualizar senha do usuário
    const { error: updateError } = await supabase
      .from("affiliates")
      .update({ password: hashedPassword })
      .eq("id", tokenData.affiliate_id)

    if (updateError) {
      console.error("Erro ao atualizar senha:", updateError)
      return NextResponse.json({ error: "Erro ao atualizar senha" }, { status: 500 })
    }

    // Deletar token usado
    await supabase.from("password_reset_tokens").delete().eq("token", token)

    return NextResponse.json({
      success: true,
      message: "Senha alterada com sucesso!",
    })
  } catch (error) {
    console.error("Erro na redefinição de senha:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
