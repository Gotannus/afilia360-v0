import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Erro: Variáveis de ambiente do Supabase não configuradas")
    console.error("[v0] NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "definida" : "não definida")
    console.error("[v0] NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "definida" : "não definida")
    throw new Error("Variáveis de ambiente do Supabase não configuradas")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
