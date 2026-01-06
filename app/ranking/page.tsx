"use client"

import { useState, useEffect } from "react"
import {
  Trophy,
  Medal,
  Crown,
  Calendar,
  Star,
  Gift,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { Header } from "@/components/header"
import { createClient } from "@/lib/supabase/client"
import { getSession } from "@/lib/auth"

interface RankingUser {
  id: string
  affiliate_id: string
  name: string
  photo_url: string | null
  sales_count: number
  position: number
  previousPosition: number | null
  positionChange: "up" | "down" | "same" | "new" | null
}

interface Prize {
  position: number
  prize_description: string
}

export default function RankingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ranking, setRanking] = useState<RankingUser[]>([])
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserPosition, setCurrentUserPosition] = useState<number | null>(null)
  const [totalSales, setTotalSales] = useState(0)
  const [showPrizes, setShowPrizes] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return { month: now.getMonth() + 1, year: now.getFullYear() }
  })

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
    async function loadRanking() {
      setLoading(true)
      const supabase = createClient()

      const startOfMonth = new Date(selectedMonth.year, selectedMonth.month - 1, 1).toISOString()
      const endOfMonth = new Date(selectedMonth.year, selectedMonth.month, 0, 23, 59, 59).toISOString()

      const prevMonth = selectedMonth.month === 1 ? 12 : selectedMonth.month - 1
      const prevYear = selectedMonth.month === 1 ? selectedMonth.year - 1 : selectedMonth.year

      const [rankingResult, previousRankingResult, prizesResult, monthlySalesResult] = await Promise.all([
        supabase
          .from("monthly_rankings")
          .select(`
            *,
            affiliates (id, name, photo_url)
          `)
          .eq("month", selectedMonth.month)
          .eq("year", selectedMonth.year)
          .order("sales_count", { ascending: false }),
        supabase
          .from("monthly_rankings")
          .select("affiliate_id, sales_count")
          .eq("month", prevMonth)
          .eq("year", prevYear)
          .order("sales_count", { ascending: false }),
        supabase
          .from("ranking_prizes")
          .select("position, prize_description")
          .eq("month", selectedMonth.month)
          .eq("year", selectedMonth.year)
          .order("position", { ascending: true }),
        supabase
          .from("monthly_total_sales")
          .select("total_sales")
          .eq("month", selectedMonth.month)
          .eq("year", selectedMonth.year)
          .maybeSingle(),
      ])

      const previousPositions = new Map<string, number>()
      if (!previousRankingResult.error && previousRankingResult.data) {
        previousRankingResult.data.forEach((r: any, index: number) => {
          previousPositions.set(r.affiliate_id, index + 1)
        })
      }

      if (!rankingResult.error && rankingResult.data) {
        const formattedRanking = rankingResult.data.map((r: any, index: number) => {
          const currentPosition = index + 1
          const prevPosition = previousPositions.get(r.affiliates?.id || r.affiliate_id) || null

          let positionChange: "up" | "down" | "same" | "new" | null = null
          if (prevPosition !== null) {
            if (prevPosition > currentPosition) {
              positionChange = "up"
            } else if (prevPosition < currentPosition) {
              positionChange = "down"
            } else {
              positionChange = "same"
            }
          }

          return {
            id: r.id,
            affiliate_id: r.affiliates?.id || r.affiliate_id,
            name: formatName(r.affiliates?.name || "Afiliado"),
            photo_url: r.affiliates?.photo_url,
            sales_count: r.sales_count,
            position: currentPosition,
            previousPosition: prevPosition,
            positionChange: r.position_change || positionChange,
          }
        })
        setRanking(formattedRanking)

        const session = getSession()
        if (session?.id) {
          const userRank = formattedRanking.find((r) => r.affiliate_id === session.id)
          setCurrentUserPosition(userRank?.position || null)
        }
      }

      if (!prizesResult.error && prizesResult.data) {
        setPrizes(prizesResult.data)
      }

      const totalManual = monthlySalesResult.data?.total_sales || 0
      setTotalSales(totalManual)
      setLoading(false)
    }

    loadRanking()
  }, [selectedMonth])

  const getPositionStyle = (position: number) => {
    switch (position) {
      case 1:
        return {
          bg: "bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-transparent",
          border: "border-yellow-500/50",
          icon: <Crown className="h-5 w-5 md:h-8 md:w-8 text-yellow-400" />,
          badge: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black",
        }
      case 2:
        return {
          bg: "bg-gradient-to-r from-gray-400/20 via-gray-300/10 to-transparent",
          border: "border-gray-400/50",
          icon: <Medal className="h-5 w-5 md:h-7 md:w-7 text-gray-300" />,
          badge: "bg-gradient-to-r from-gray-400 to-gray-500 text-black",
        }
      case 3:
        return {
          bg: "bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-transparent",
          border: "border-amber-600/50",
          icon: <Medal className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />,
          badge: "bg-gradient-to-r from-amber-600 to-amber-700 text-black",
        }
      default:
        return {
          bg: "bg-card",
          border: "border-border",
          icon: null,
          badge: "bg-secondary text-foreground",
        }
    }
  }

  const getPrizeForPosition = (position: number): string | null => {
    const prize = prizes.find((p) => p.position === position)
    return prize?.prize_description || null
  }

  const monthLabel = `${monthNames[selectedMonth.month - 1]} ${selectedMonth.year}`

  const renderPositionChange = (user: RankingUser) => {
    if (!user.positionChange || user.positionChange === "same") {
      return (
        <div className="flex items-center text-muted-foreground" title="Manteve posição">
          <Minus className="h-3 w-3 md:h-4 md:w-4" />
        </div>
      )
    }

    if (user.positionChange === "up") {
      return (
        <div className="flex items-center gap-0.5 text-green-500" title="Subiu posições">
          <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
        </div>
      )
    }

    if (user.positionChange === "down") {
      return (
        <div className="flex items-center gap-0.5 text-red-500" title="Desceu posições">
          <TrendingDown className="h-3 w-3 md:h-4 md:w-4" />
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="mx-auto max-w-4xl px-3 md:px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8 text-center">
          <div className="mx-auto mb-3 md:mb-4 flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-2 border-yellow-500/50">
            <Trophy className="h-7 w-7 md:h-10 md:w-10 text-yellow-400" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Ranking Mensal
          </h1>
          <p className="mt-1 md:mt-2 text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>{monthLabel}</span>
          </p>
        </div>

        <div className="mb-6 md:mb-8 p-4 md:p-6 rounded-xl border border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5 text-center">
          <p className="text-xs md:text-sm text-muted-foreground mb-1">Total de Vendas no Mês</p>
          <p className="text-3xl md:text-5xl font-bold text-primary">{totalSales.toLocaleString("pt-BR")}</p>
        </div>

        {prizes.length > 0 && (
          <div className="mb-6 md:mb-8 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 overflow-hidden">
            <button
              onClick={() => setShowPrizes(!showPrizes)}
              className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-yellow-500/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                <span className="font-bold text-sm md:text-base text-yellow-500">Premiações do Mês</span>
                <span className="text-xs md:text-sm text-muted-foreground">({prizes.length} prêmios)</span>
              </div>
              {showPrizes ? (
                <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
              ) : (
                <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
              )}
            </button>

            {showPrizes && (
              <div className="px-3 md:px-4 pb-3 md:pb-4 space-y-2 border-t border-yellow-500/20 pt-3 md:pt-4">
                {prizes.map((prize) => (
                  <div
                    key={prize.position}
                    className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg ${
                      prize.position === 1
                        ? "bg-yellow-500/20 border border-yellow-500/30"
                        : prize.position === 2
                          ? "bg-gray-400/20 border border-gray-400/30"
                          : prize.position === 3
                            ? "bg-amber-600/20 border border-amber-600/30"
                            : "bg-secondary/50 border border-border"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full font-bold text-xs md:text-sm flex-shrink-0 ${
                        prize.position === 1
                          ? "bg-yellow-500 text-black"
                          : prize.position === 2
                            ? "bg-gray-400 text-black"
                            : prize.position === 3
                              ? "bg-amber-700 text-white"
                              : "bg-secondary text-foreground"
                      }`}
                    >
                      {prize.position}º
                    </div>
                    <p className="font-medium text-xs md:text-sm">{prize.prize_description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentUserPosition && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-xl border border-yellow-500/50 bg-yellow-500/10 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Sua posição no ranking</p>
            <p className="text-2xl md:text-3xl font-bold text-yellow-500">
              TOP {String(currentUserPosition).padStart(2, "0")}
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 md:h-20 rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : ranking.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 md:p-12 text-center">
            <Trophy className="mx-auto mb-4 h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            <h3 className="text-base md:text-lg font-medium">Ranking ainda não disponível</h3>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              O ranking será atualizado conforme as vendas forem realizadas
            </p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {ranking.slice(0, 5).map((user) => {
              const style = getPositionStyle(user.position)
              const prize = getPrizeForPosition(user.position)
              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-2 md:gap-4 rounded-xl border ${style.border} ${style.bg} p-2 md:p-4 transition-all hover:scale-[1.01]`}
                >
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <div
                      className={`px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold ${style.badge} min-w-[55px] md:min-w-[80px] text-center`}
                    >
                      TOP {String(user.position).padStart(2, "0")}
                    </div>
                    {renderPositionChange(user)}
                  </div>

                  <div className="hidden sm:flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-secondary/50 flex-shrink-0">
                    {style.icon || (
                      <span className="text-lg md:text-xl font-bold text-muted-foreground">{user.position}</span>
                    )}
                  </div>

                  <div className="relative flex-shrink-0">
                    <div className="h-10 w-10 md:h-14 md:w-14 rounded-full overflow-hidden border-2 border-border bg-secondary">
                      {user.photo_url ? (
                        <img
                          src={user.photo_url || "/placeholder.svg"}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-sm md:text-lg font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {user.position <= 3 && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 md:h-6 md:w-6 rounded-full bg-background flex items-center justify-center">
                        <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-sm md:text-lg font-semibold truncate">{formatName(user.name)}</p>
                    {prize && (
                      <p className="text-xs md:text-sm text-yellow-500 flex items-center gap-1 mt-0.5">
                        <Gift className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{prize}</span>
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
