import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Todas as tabelas conhecidas do schema
const TABLES = [
  "affiliates",
  "announcements",
  "categories",
  "commissions",
  "conversion_events",
  "course_categories",
  "course_lessons",
  "course_modules",
  "courses",
  "events",
  "member_plans",
  "members",
  "news_posts",
  "notifications",
  "order_items",
  "orders",
  "platform_settings",
  "products",
  "profiles",
  "rankings",
  "referrals",
  "settings",
  "subscriptions",
  "user_courses",
  "user_roles",
  "users",
  "validations",
  "webhooks",
]

async function fetchTable(table) {
  let allRows = []
  let from = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, from + pageSize - 1)

    if (error) {
      console.log(`[v0] Tabela "${table}" erro ou não existe: ${error.message}`)
      return null
    }

    if (!data || data.length === 0) break
    allRows = allRows.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }

  return allRows
}

async function main() {
  console.log("[v0] Iniciando exportação completa do banco...")

  const output = {
    exportedAt: new Date().toISOString(),
    supabaseUrl,
    tables: {},
    summary: {},
  }

  for (const table of TABLES) {
    console.log(`[v0] Exportando tabela: ${table}`)
    const rows = await fetchTable(table)
    if (rows !== null) {
      output.tables[table] = rows
      output.summary[table] = rows.length
      console.log(`[v0]   -> ${rows.length} registros`)
    }
  }

  const outputPath = path.join(process.cwd(), "scripts", "export-output.json")
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8")

  console.log("\n[v0] === RESUMO DA EXPORTAÇÃO ===")
  for (const [table, count] of Object.entries(output.summary)) {
    console.log(`[v0]   ${table}: ${count} registros`)
  }
  const total = Object.values(output.summary).reduce((a, b) => a + b, 0)
  console.log(`[v0] Total de registros exportados: ${total}`)
  console.log(`[v0] Arquivo gerado: scripts/export-output.json`)
}

main().catch((err) => {
  console.error("[v0] Erro fatal:", err)
  process.exit(1)
})
