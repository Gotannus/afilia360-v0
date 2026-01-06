import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verificar se o email existe
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id, name, email")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (affiliateError || !affiliate) {
      // Retornar sucesso mesmo se email não existe (segurança)
      return NextResponse.json({
        success: true,
        message: "Se o email existir, você receberá instruções de recuperação",
      })
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Deletar tokens antigos do usuário
    await supabase.from("password_reset_tokens").delete().eq("affiliate_id", affiliate.id)

    // Salvar novo token
    const { error: tokenError } = await supabase.from("password_reset_tokens").insert({
      affiliate_id: affiliate.id,
      token,
      expires_at: expiresAt.toISOString(),
    })

    if (tokenError) {
      console.error("Erro ao salvar token:", tokenError)
      return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
    }

    // Em produção, aqui enviaria o email com o link
    // Por enquanto, vamos retornar o token para teste
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/redefinir-senha?token=${token}`

    console.log(`[Recuperar Senha] Link para ${email}: ${resetLink}`)

    return NextResponse.json({
      success: true,
      message: "Se o email existir, você receberá instruções de recuperação",
      // Remover em produção - apenas para teste
      debug: { resetLink },
    })
  } catch (error) {
    console.error("Erro na recuperação de senha:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
