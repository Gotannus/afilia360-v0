"use client"
import { Trophy, Medal, Crown, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useEffect, useState } from "react"

interface RankingUser {
  id: string
  name: string
  photo_url: string | null
  position: number
  sales_count: number
}

export function RankingBanner() {
  const [topUsers, setTopUsers] = useState<RankingUser[]>([])
  const [totalSales, setTotalSales] = useState(0)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRanking() {
      const supabase = createClient()
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const year = now.getFullYear()

      const startOfMonth = new Date(year, currentMonth - 1, 1).toISOString()
      const endOfMonth = new Date(year, currentMonth, 0, 23, 59, 59).toISOString()

      const [rankingResult, monthlySalesResult] = await Promise.all([
        supabase
          .from("monthly_rankings")
          .select(`
            *,
            affiliates (id, name, photo_url)
          `)
          .eq("month", currentMonth)
          .eq("year", year)
          .order("sales_count", { ascending: false })
          .limit(5),
        supabase
          .from("monthly_total_sales")
          .select("total_sales")
          .eq("month", currentMonth)
          .eq("year", year)
          .maybeSingle(),
      ])

      if (rankingResult.error || !rankingResult.data || rankingResult.data.length === 0) {
        setTopUsers([])
        setTotalSales(0)
        setMonth(currentMonth)
        setIsLoading(false)
        return
      }

      const users = rankingResult.data.map((r: any, index: number) => ({
        id: r.affiliates?.id || r.affiliate_id,
        name: r.affiliates?.name || "Afiliado",
        photo_url: r.affiliates?.photo_url || null,
        position: index + 1,
        sales_count: r.sales_count || 0,
      }))

      const totalManual = monthlySalesResult.data?.total_sales || 0

      setTopUsers(users)
      setTotalSales(totalManual)
      setMonth(currentMonth)
      setIsLoading(false)
    }

    fetchRanking()
  }, [])

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
  const monthName = monthNames[month - 1]

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-400" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-300" />
      case 3:
        return <Medal className="h-4 w-4 text-amber-600" />
      default:
        return null
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "border-yellow-500/50 bg-yellow-500/10"
      case 2:
        return "border-gray-400/50 bg-gray-400/10"
      case 3:
        return "border-amber-600/50 bg-amber-600/10"
      default:
        return "border-border bg-secondary/30"
    }
  }

  if (isLoading) return null
  if (topUsers.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-card via-card/95 to-card border-y border-border py-3 sm:py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex flex-col gap-3">
          {/* Header do ranking com total de vendas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  Ranking de {monthName}
                </p>
                <p className="text-sm sm:text-base font-bold">
                  <span className="text-primary">{totalSales.toLocaleString("pt-BR")}</span>
                  <span className="text-muted-foreground font-normal text-xs ml-1">vendas no mês</span>
                </p>
              </div>
            </div>

            <Link
              href="/ranking"
              className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs sm:text-sm font-medium transition-all"
            >
              <span className="hidden sm:inline">Ver Ranking</span>
              <span className="sm:hidden">Ver</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {topUsers.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg border ${getPositionColor(user.position)}`}
              >
                {/* Posição */}
                <div className="flex items-center gap-1">
                  {getPositionIcon(user.position)}
                  <span className="text-[10px] sm:text-xs font-bold">TOP {String(user.position).padStart(2, "0")}</span>
                </div>

                {/* Avatar */}
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-secondary border-2 border-border">
                  {user.photo_url ? (
                    <img
                      src={user.photo_url || "/placeholder.svg"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Nome */}
                <p className="text-[9px] sm:text-xs font-medium truncate max-w-full text-center">
                  {user.name.split(" ")[0]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
