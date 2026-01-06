import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (affiliateError) {
      console.error("Erro ao buscar afiliado:", affiliateError)
      return NextResponse.json({ error: "Erro ao verificar email. Tente novamente." }, { status: 500 })
    }

    if (!affiliate) {
      return NextResponse.json({ error: "Email não encontrado. Faça seu cadastro primeiro." }, { status: 404 })
    }

    if (affiliate.status === "pending") {
      return NextResponse.json(
        { error: "Seu cadastro ainda está aguardando aprovação do administrador." },
        { status: 403 },
      )
    }

    if (affiliate.status === "rejected") {
      return NextResponse.json({ error: "Seu cadastro foi recusado. Entre em contato com o suporte." }, { status: 403 })
    }

    if (affiliate.status === "paused") {
      return NextResponse.json(
        { error: "Sua conta foi pausada temporariamente. Entre em contato com o suporte." },
        { status: 403 },
      )
    }

    const storedPassword = affiliate.password || affiliate.password_hash
    if (!storedPassword) {
      return NextResponse.json({ error: "Erro no cadastro. Entre em contato com o suporte." }, { status: 500 })
    }

    let passwordMatch = false

    if (storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2a$")) {
      // Senha hasheada com bcrypt - comparar com bcrypt
      passwordMatch = await bcrypt.compare(password, storedPassword)
    } else {
      // Senha em texto puro - comparação direta
      passwordMatch = storedPassword === password
    }

    if (!passwordMatch) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        isAdmin: affiliate.is_admin || false,
        photoUrl: affiliate.photo_url || null,
        onboardingCompleted: affiliate.onboarding_completed || false,
      },
    })
  } catch (err) {
    console.error("Erro no login:", err)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
