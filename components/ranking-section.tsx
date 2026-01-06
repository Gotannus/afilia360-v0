"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface RankingAffiliate {
  id: string
  name: string
  photo: string | null
  sales: number
}

export function RankingSection() {
  const [topAffiliates, setTopAffiliates] = useState<RankingAffiliate[]>([])
  const [loading, setLoading] = useState(true)

  const formatName = (fullName: string) => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

    const parts = fullName
      .trim()
      .split(" ")
      .filter((p) => p.length > 0)
    if (parts.length === 0) return "Afiliado"
    if (parts.length === 1) return capitalize(parts[0])

    const firstName = capitalize(parts[0])
    const lastName = capitalize(parts[parts.length - 1])
    return `${firstName} ${lastName}`
  }

  useEffect(() => {
    async function fetchRanking() {
      try {
        const supabase = createClient()
        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear()

        // Buscar ranking do mês atual
        const { data: rankingData } = await supabase
          .from("affiliate_ranking")
          .select(`
            affiliate_id,
            sales_count,
            affiliates (
              id,
              name,
              photo
            )
          `)
          .eq("month", currentMonth)
          .eq("year", currentYear)
          .order("sales_count", { ascending: false })
          .limit(5)

        if (rankingData && rankingData.length > 0) {
          const affiliates = rankingData.map((item: any) => ({
            id: item.affiliate_id,
            name: formatName(item.affiliates?.name || "Afiliado"),
            photo: item.affiliates?.photo || null,
            sales: item.sales_count || 0,
          }))
          setTopAffiliates(affiliates)
        }
      } catch (error) {
        console.error("Erro ao buscar ranking:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRanking()
  }, [])

  // Não mostrar se não há dados ou está carregando
  if (loading || topAffiliates.length === 0) return null

  const now = new Date()
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]
  const currentMonth = monthNames[now.getMonth()]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h3 className="font-semibold text-foreground">Top 5 Afiliados</h3>
        </div>
        <span className="text-xs text-muted-foreground">{currentMonth}</span>
      </div>

      <div className="space-y-3">
        {topAffiliates.map((member, index) => {
          const position = index + 1
          return (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="relative">
                <img
                  src={member.photo || "/placeholder.svg?height=40&width=40&query=avatar"}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border">
                  {position === 1 && <Trophy className="h-3 w-3 text-amber-400" />}
                  {position === 2 && <Medal className="h-3 w-3 text-gray-400" />}
                  {position === 3 && <Award className="h-3 w-3 text-amber-600" />}
                  {position > 3 && <span className="text-[10px] font-bold text-muted-foreground">{position}</span>}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{formatName(member.name)}</p>
                <p className="text-xs text-muted-foreground">#{position} do mês</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
