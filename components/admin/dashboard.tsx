"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, TrendingUp, DollarSign, ShoppingCart, Users, TrendingDown, Wallet } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ManualMetricsForm } from "./manual-metrics-form"
import { MetricsList } from "./metrics-list"

type Period = "today" | "yesterday" | "7days" | "15days" | "custom"

type DashboardData = {
  totalVendas: number
  receitaTotal: number
  receitaAfiliaBasic: number
  receitaAfiliaPro: number
  receitaAfiliados: number
  vendasAfiliaBasic: number
  vendasAfiliaPro: number
  vendasAfiliados: number
  despesasTotal: number
  lucroLiquido: number
  dailyData: Array<{
    date: string
    afiliaBasic: number
    afiliaPro: number
    afiliados: number
    despesas: number
    lucroLiquido: number
  }>
  productBreakdown?: Array<{ name: string; vendas: number; receita: number }>
}

export function Dashboard() {
  const [period, setPeriod] = useState<Period>("today")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [period, startDate, endDate])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ period })
      if (period === "custom" && startDate && endDate) {
        params.set("startDate", format(startDate, "yyyy-MM-dd"))
        params.set("endDate", format(endDate, "yyyy-MM-dd"))
      }

      const response = await fetch(`/api/dashboard/manual?${params}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = (data?.dailyData || []).map((item) => ({
    label: format(new Date(item.date), "dd/MM", { locale: ptBR }),
    "AFILIA360 BÁSICO": Number(item.afiliaBasic) || 0,
    "AFILIA360 PRO": Number(item.afiliaPro) || 0,
    Afiliados: Number(item.afiliados) || 0,
    Despesas: Number(item.despesas) || 0,
    "Lucro Líquido": Number(item.lucroLiquido) || 0,
    total: (Number(item.afiliaBasic) || 0) + (Number(item.afiliaPro) || 0) + (Number(item.afiliados) || 0),
  }))

  const handleEditDate = (date: string) => {
    const event = new CustomEvent("loadMetricsDate", { detail: { date } })
    window.dispatchEvent(event)

    // Aguarda um pouco e muda para a aba
    setTimeout(() => {
      const tabTrigger = document.querySelector('[value="add-data"]') as HTMLButtonElement
      if (tabTrigger) {
        tabTrigger.click()
      }
    }, 100)
  }

  return (
    <Tabs defaultValue="metrics" className="space-y-6">
      <TabsList>
        <TabsTrigger value="metrics">Métricas</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
        <TabsTrigger value="add-data">Adicionar Dados</TabsTrigger>
      </TabsList>

      <TabsContent value="metrics" className="space-y-6">
        {/* Period Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Período de Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="15days">Últimos 15 dias</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>

              {period === "custom" && (
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Data inicial"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Data final"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">R$ {(data?.receitaTotal || 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{data?.totalVendas || 0} vendas no período</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AFILIA360 BÁSICO</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">
                    R$ {(data?.receitaAfiliaBasic || 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{data?.vendasAfiliaBasic || 0} vendas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AFILIA360 PRO</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">
                    R$ {(data?.receitaAfiliaPro || 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{data?.vendasAfiliaPro || 0} vendas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vendas de Afiliados</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">R$ {(data?.receitaAfiliados || 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{data?.vendasAfiliados || 0} vendas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Despesas do Período</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">R$ {(data?.despesasTotal || 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Marketing, IA, Hospedagem...</p>
                </CardContent>
              </Card>
            </div>

            {/* Profit Card */}
            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">💰 Lucro Líquido do Período</CardTitle>
                <Wallet className="h-6 w-6 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-500">R$ {(data?.lucroLiquido || 0).toFixed(2)}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Receita Total: R$ {(data?.receitaTotal || 0).toFixed(2)} - Despesas: R${" "}
                  {(data?.despesasTotal || 0).toFixed(2)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${Math.min(100, ((data?.lucroLiquido || 0) / (data?.receitaTotal || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {(((data?.lucroLiquido || 0) / (data?.receitaTotal || 1)) * 100 || 0).toFixed(1)}% margem
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            {chartData.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução de Receita</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="label" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="AFILIA360 BÁSICO"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          name="AFILIA360 BÁSICO"
                        />
                        <Area
                          type="monotone"
                          dataKey="AFILIA360 PRO"
                          stackId="1"
                          stroke="#a855f7"
                          fill="#a855f7"
                          name="AFILIA360 PRO"
                        />
                        <Area
                          type="monotone"
                          dataKey="Afiliados"
                          stackId="1"
                          stroke="#22c55e"
                          fill="#22c55e"
                          name="Afiliados"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lucro Líquido vs Despesas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="label" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="Lucro Líquido" fill="#22c55e" name="Lucro Líquido" />
                        <Bar dataKey="Despesas" fill="#ef4444" name="Despesas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhuma venda no período selecionado</p>
                </CardContent>
              </Card>
            )}

            {/* Product Breakdown */}
            {data?.productBreakdown && data.productBreakdown.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Produto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.productBreakdown.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.vendas} vendas</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-500">R$ {product.receita.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            Média: R$ {(product.receita / product.vendas).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Relatório Detalhado de Lançamentos */}
            {chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Relatório Detalhado de Lançamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.dailyData.map((day) => {
                      const dayRevenue = day.afiliaBasic + day.afiliaPro + day.afiliados
                      if (dayRevenue === 0 && day.despesas === 0) return null

                      return (
                        <details key={day.date} className="group border rounded-lg overflow-hidden">
                          <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <span className="font-medium">
                                {format(new Date(day.date), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(day.date), "EEEE", { locale: ptBR })}
                              </span>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-500">R$ {dayRevenue.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">Receita</p>
                              </div>
                              {day.despesas > 0 && (
                                <div className="text-right">
                                  <p className="text-sm font-medium text-red-500">R$ {day.despesas.toFixed(2)}</p>
                                  <p className="text-xs text-muted-foreground">Despesas</p>
                                </div>
                              )}
                              <div className="text-right">
                                <p className="text-sm font-bold text-blue-500">R$ {day.lucroLiquido.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">Lucro</p>
                              </div>
                            </div>
                          </summary>
                          <div className="p-4 bg-muted/30 border-t space-y-3">
                            {day.afiliaBasic > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">AFILIA360 BÁSICO</span>
                                <span className="font-medium text-blue-500">R$ {day.afiliaBasic.toFixed(2)}</span>
                              </div>
                            )}
                            {day.afiliaPro > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">AFILIA360 PRO</span>
                                <span className="font-medium text-purple-500">R$ {day.afiliaPro.toFixed(2)}</span>
                              </div>
                            )}
                            {day.afiliados > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Vendas de Afiliados</span>
                                <span className="font-medium text-green-500">R$ {day.afiliados.toFixed(2)}</span>
                              </div>
                            )}
                            {day.despesas > 0 && (
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-medium text-red-500">Despesas do Dia</span>
                                <span className="font-medium text-red-500">- R$ {day.despesas.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="text-sm font-bold">Lucro Líquido</span>
                              <span className="font-bold text-blue-500">R$ {day.lucroLiquido.toFixed(2)}</span>
                            </div>
                          </div>
                        </details>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <MetricsList onEdit={handleEditDate} />
      </TabsContent>

      <TabsContent value="add-data" className="space-y-6">
        <ManualMetricsForm onSave={fetchData} />
      </TabsContent>
    </Tabs>
  )
}
