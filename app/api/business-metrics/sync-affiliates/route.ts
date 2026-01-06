import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()

  try {
    // 1. Buscar todas as vendas do webhook
    const { data: sales, error: salesError } = await supabase.from("celetus_sales").select("*")

    if (salesError) throw salesError

    console.log(`[v0] Processando ${sales.length} vendas do webhook`)

    // 2. Processar vendas do AFILIA360 (quem comprou o app) - VINCULAR POR EMAIL
    for (const sale of sales) {
      const items = sale.raw_data?.items || []
      const customer = sale.raw_data?.customer
      const customerEmail = customer?.email
      const customerName = customer?.name

      if (!customerEmail) continue

      // Verificar se tem AFILIA360 nos items
      const hasBasic = items.some((item: any) => item.code === "FYGCVIHI")
      const hasPro = items.some((item: any) => item.code === "ZOXLWXI9")

      if (hasBasic || hasPro) {
        const planPurchased = hasPro ? "pro" : "basic"

        console.log(`[v0] Cliente ${customerName} (${customerEmail}) comprou ${planPurchased}`)

        // Buscar ou criar afiliado por email
        const { data: existingAffiliate } = await supabase
          .from("affiliates")
          .select("*")
          .eq("email", customerEmail)
          .maybeSingle()

        if (existingAffiliate) {
          // Atualizar afiliado existente
          await supabase
            .from("affiliates")
            .update({
              plan_purchased: planPurchased,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingAffiliate.id)

          console.log(`[v0] Afiliado ${existingAffiliate.id} atualizado com plano ${planPurchased}`)
        }
      }
    }

    for (const sale of sales) {
      const affiliated = sale.raw_data?.commission?.affiliated

      if (!Array.isArray(affiliated) || affiliated.length === 0) continue

      for (const aff of affiliated) {
        const affName = aff.name
        const commissionValue = Number.parseFloat(aff.commissionValue || "0")

        if (!affName || commissionValue <= 0) continue

        console.log(`[v0] Processando comissão de ${affName}: R$ ${commissionValue}`)

        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("*")
          .eq("nome_celetus", affName.trim())
          .maybeSingle()

        if (affiliate) {
          // Atualizar comissões e marcar como ativo
          const newTotalCommissions = (affiliate.total_commissions || 0) + commissionValue
          const firstSaleDate = affiliate.first_sale_date || sale.sale_date

          await supabase
            .from("affiliates")
            .update({
              is_active: true,
              total_commissions: newTotalCommissions,
              first_sale_date: firstSaleDate,
              updated_at: new Date().toISOString(),
            })
            .eq("id", affiliate.id)

          console.log(`[v0] Afiliado ${affiliate.id} atualizado: total_commissions=${newTotalCommissions}`)
        } else {
          console.log(`[v0] Afiliado "${affName}" não encontrado na tabela - não criamos sem email`)
        }
      }
    }

    // 4. Calcular estatísticas finais
    const { data: stats } = await supabase.from("affiliates").select("plan_purchased, is_active, total_commissions")

    const totalAfiliados = stats?.length || 0
    const comBasic = stats?.filter((a) => a.plan_purchased === "basic").length || 0
    const comPro = stats?.filter((a) => a.plan_purchased === "pro").length || 0
    const ativos = stats?.filter((a) => a.is_active).length || 0
    const totalComissoes = stats?.reduce((sum, a) => sum + (a.total_commissions || 0), 0) || 0

    return NextResponse.json({
      success: true,
      message: "Sincronização concluída com sucesso",
      stats: {
        total_afiliados: totalAfiliados,
        com_basic: comBasic,
        com_pro: comPro,
        ativos: ativos,
        total_comissoes: totalComissoes.toFixed(2),
      },
    })
  } catch (error: any) {
    console.error("[v0] Erro na sincronização:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
