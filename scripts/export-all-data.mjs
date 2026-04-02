/**
 * export-all-data.mjs
 *
 * Exporta todos os dados do banco Supabase para um arquivo JSON estruturado.
 * Usa a service_role key para ignorar RLS e acessar todos os registros.
 *
 * Executar: node scripts/export-all-data.mjs
 * Saída:    scripts/export-output.json
 */

import { createClient } from "@supabase/supabase-js"
import { writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Variáveis de ambiente (disponíveis no ambiente Vercel/v0)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("[v0] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas.")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// Todas as tabelas públicas do schema
const TABLES = [
  "affiliates",
  "announcements",
  "avatars",
  "books",
  "celetus_config",
  "celetus_sales",
  "celetus_webhooks",
  "chapters",
  "comment_likes",
  "comments",
  "community_posts",
  "companies",
  "company_expenses",
  "company_goals",
  "course_categories",
  "course_lessons",
  "courses",
  "customer_ltv",
  "daily_devotionals",
  "daily_metrics_manual",
  "history_entries",
  "history_entries_versions",
  "journal_entries",
  "kv_store_756d8825",
  "lesson_progress",
  "lives",
  "marketplace_products",
  "member_plans",
  "monetizze_webhooks",
  "monthly_costs",
  "monthly_metrics",
  "monthly_rankings",
  "monthly_total_sales",
  "news_posts",
  "notifications",
  "page_views",
  "password_reset_tokens",
  "plan_course_access",
  "platforms",
  "post_likes",
  "products",
  "profiles",
  "push_subscriptions",
  "ranking_prizes",
  "reading_progress",
  "site_config",
  "system_settings",
  "user_books",
  "user_course_access",
  "user_lesson_progress",
]

async function fetchAll(table) {
  const PAGE_SIZE = 1000
  let allRows = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      console.warn(`[v0] Erro ao buscar "${table}": ${error.message}`)
      return { error: error.message, rows: [] }
    }

    allRows = allRows.concat(data || [])

    if (!data || data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return { rows: allRows, count: allRows.length }
}

async function main() {
  console.log("[v0] Iniciando exportação completa do banco de dados...")
  console.log(`[v0] Conectando em: ${SUPABASE_URL}`)
  console.log(`[v0] Total de tabelas: ${TABLES.length}\n`)

  const output = {
    exportedAt: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL,
    totalTables: TABLES.length,
    summary: {},
    data: {},
  }

  let totalRows = 0

  for (const table of TABLES) {
    process.stdout.write(`[v0] Exportando: ${table.padEnd(35)}`)
    const result = await fetchAll(table)
    output.data[table] = result.rows
    output.summary[table] = {
      count: result.rows.length,
      error: result.error || null,
    }
    totalRows += result.rows.length
    console.log(`${result.rows.length} registros ${result.error ? `(ERRO: ${result.error})` : "OK"}`)
  }

  output.totalRows = totalRows

  const outputPath = resolve(__dirname, "export-output.json")
  writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8")

  console.log("\n[v0] ===========================")
  console.log(`[v0] Exportacao concluida!`)
  console.log(`[v0] Total de registros: ${totalRows}`)
  console.log(`[v0] Arquivo salvo em: ${outputPath}`)
  console.log("[v0] ===========================\n")

  // Resumo por tabela
  console.log("[v0] Resumo:")
  for (const [table, info] of Object.entries(output.summary)) {
    if (info.count > 0 || info.error) {
      console.log(`  ${table}: ${info.count} registros${info.error ? ` | ERRO: ${info.error}` : ""}`)
    }
  }
}

main().catch((err) => {
  console.error("[v0] Erro fatal:", err)
  process.exit(1)
})
