"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { TrendingUp, TrendingDown } from "lucide-react"

const CATEGORY_COLORS: Record<string, string> = {
  hospedagem: "#3b82f6",
  ia: "#8b5cf6",
  marketing: "#f59e0b",
  ferramentas: "#10b981",
  outros: "#6b7280",
}

const CATEGORY_LABELS: Record<string, string> = {
  hospedagem: "Hospedagem",
  ia: "IA & APIs",
  marketing: "Marketing",
  ferramentas: "Ferramentas",
  outros: "Outros",
}

export function MetricsCharts() {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    try {
      const res = await fetch("/api/business-metrics/charts?months=6")
      const data = await res.json()
      setChartData(data)
    } catch (error) {
      console.error("Error fetching chart data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando gráficos...</div>
  }

  if (!chartData) {
    return <div className="text-center py-8">Erro ao carregar dados</div>
  }

  const monthlyData = chartData.monthlyMetrics.map((m: any) => ({
    month: m.month,
    "Receita Total": Number.parseFloat(m.revenue_app || 0) + Number.parseFloat(m.revenue_commissions || 0),
    "Receita App": Number.parseFloat(m.revenue_app || 0),
    Comissões: Number.parseFloat(m.revenue_commissions || 0),
    Custos: Number.parseFloat(m.total_costs || 0),
    Lucro: Number.parseFloat(m.profit || 0),
  }))

  const costsDistribution = Object.entries(chartData.costsByCategory).map(([category, amount]) => ({
    name: CATEGORY_LABELS[category] || category,
    value: Number.parseFloat(amount as string),
    color: CATEGORY_COLORS[category] || "#6b7280",
  }))

  // Calcular crescimento mês a mês
  const calculateGrowth = () => {
    if (monthlyData.length < 2) return null
    const current = monthlyData[monthlyData.length - 1]
    const previous = monthlyData[monthlyData.length - 2]
    const growth = ((current.Lucro - previous.Lucro) / Math.abs(previous.Lucro)) * 100
    return {
      value: growth,
      isPositive: growth >= 0,
    }
  }

  const growth = calculateGrowth()

  return (
    <div className="space-y-6">
      {/* Indicador de Crescimento */}
      {growth && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3">
              {growth.isPositive ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Crescimento vs Mês Anterior</p>
                <p className={`text-2xl font-bold ${growth.isPositive ? "text-green-500" : "text-red-500"}`}>
                  {growth.isPositive ? "+" : ""}
                  {growth.value.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Evolução Financeira (Últimos 6 Meses) */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Financeira (Últimos 6 Meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => {
                  const [year, month] = value.split("-")
                  return `${month}/${year.slice(2)}`
                }}
              />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, ""]}
                labelFormatter={(label) => {
                  const [year, month] = label.split("-")
                  const monthNames = [
                    "Jan",
                    "Fev",
                    "Mar",
                    "Abr",
                    "Mai",
                    "Jun",
                    "Jul",
                    "Ago",
                    "Set",
                    "Out",
                    "Nov",
                    "Dez",
                  ]
                  return `${monthNames[Number.parseInt(month) - 1]}/${year}`
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Area
                type="monotone"
                dataKey="Lucro"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorLucro)"
              />
              <Area
                type="monotone"
                dataKey="Receita Total"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorReceita)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Barras: Composição da Receita */}
        <Card>
          <CardHeader>
            <CardTitle>Composição da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => {
                    const [year, month] = value.split("-")
                    return `${month}/${year.slice(2)}`
                  }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                    "",
                  ]}
                />
                <Legend />
                <Bar dataKey="Receita App" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Comissões" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {costsDistribution.map((item, index) => {
                const total = costsDistribution.reduce((sum, i) => sum + i.value, 0)
                const percentage = (item.value / total) * 100

                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Total de Custos</span>
                <span>
                  R${" "}
                  {costsDistribution
                    .reduce((sum, i) => sum + i.value, 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
