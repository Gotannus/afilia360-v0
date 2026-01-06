"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, TrendingUp, DollarSign, Target, Clock } from "lucide-react"

interface LTVOverview {
  totalAffiliates: number
  activeAffiliates: number
  inactiveAffiliates: number
  activationRate: string
  avgLTV: string
  cac: string
  roi: string
  paybackMonths: string
}

interface Segment {
  segment: string
  count: number
  percentage: string
  ltv: string | number
  roi: string
}

interface LTVAnalysisProps {
  selectedMonth: string
}

export function LTVAnalysis({ selectedMonth }: LTVAnalysisProps) {
  const [data, setData] = useState<{
    overview: LTVOverview
    segmentation: Segment[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [selectedMonth])

  const loadData = async () => {
    setLoading(true)
    const res = await fetch(`/api/business-metrics/ltv?month=${selectedMonth}`)
    const result = await res.json()
    setData(result)
    setLoading(false)
  }

  if (loading) {
    return <div className="p-8">Carregando análise de LTV...</div>
  }

  const { overview, segmentation } = data!

  return (
    <div className="space-y-6">
      {/* Cards de KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">LTV Médio</p>
              <p className="text-2xl font-bold">R$ {overview.avgLTV}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taxa de Ativação</p>
              <p className="text-2xl font-bold">{overview.activationRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {overview.activeAffiliates}/{overview.totalAffiliates} ativos
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">CAC</p>
              <p className="text-2xl font-bold">R$ {overview.cac}</p>
              <p className="text-xs text-muted-foreground mt-1">Custo de aquisição</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ROI</p>
              <p className="text-2xl font-bold text-green-600">{overview.roi}%</p>
              <p className="text-xs text-muted-foreground mt-1">Retorno sobre CAC</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payback</p>
              <p className="text-2xl font-bold">{overview.paybackMonths} meses</p>
              <p className="text-xs text-muted-foreground mt-1">Tempo para recuperar CAC</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela de Segmentação */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Segmentação de Clientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Segmento</th>
                <th className="text-right py-3 px-4 font-semibold">Quantidade</th>
                <th className="text-right py-3 px-4 font-semibold">%</th>
                <th className="text-right py-3 px-4 font-semibold">LTV Médio</th>
                <th className="text-right py-3 px-4 font-semibold">ROI</th>
              </tr>
            </thead>
            <tbody>
              {segmentation.map((seg) => (
                <tr key={seg.segment} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{seg.segment}</td>
                  <td className="text-right py-3 px-4">{seg.count}</td>
                  <td className="text-right py-3 px-4">{seg.percentage}%</td>
                  <td className="text-right py-3 px-4">R$ {seg.ltv}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-semibold ${Number(seg.roi) > 0 ? "text-green-600" : "text-red-600"}`}>
                      {seg.roi}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-3">Insights</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>A cada 100 afiliados adquiridos:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              ~{Math.round((Number(segmentation[0].percentage) / 100) * 100)} serão Basic Inativos (receita: R${" "}
              {(Math.round((Number(segmentation[0].percentage) / 100) * 100) * 17).toFixed(2)})
            </li>
            <li>
              ~{Math.round((Number(segmentation[1].percentage) / 100) * 100)} serão Basic Ativos (receita: R${" "}
              {(Math.round((Number(segmentation[1].percentage) / 100) * 100) * Number(segmentation[1].ltv)).toFixed(2)})
            </li>
            <li>
              ~{Math.round((Number(segmentation[2].percentage) / 100) * 100)} serão Pro Inativos (receita: R${" "}
              {(Math.round((Number(segmentation[2].percentage) / 100) * 100) * 97).toFixed(2)})
            </li>
            <li>
              ~{Math.round((Number(segmentation[3].percentage) / 100) * 100)} serão Pro Ativos (receita: R${" "}
              {(Math.round((Number(segmentation[3].percentage) / 100) * 100) * Number(segmentation[3].ltv)).toFixed(2)})
            </li>
          </ul>
          <p className="pt-2 font-semibold">
            Receita Total Esperada: R${" "}
            {(
              Math.round((Number(segmentation[0].percentage) / 100) * 100) * 17 +
              Math.round((Number(segmentation[1].percentage) / 100) * 100) * Number(segmentation[1].ltv) +
              Math.round((Number(segmentation[2].percentage) / 100) * 100) * 97 +
              Math.round((Number(segmentation[3].percentage) / 100) * 100) * Number(segmentation[3].ltv)
            ).toFixed(2)}
          </p>
          <p>
            Custo de Aquisição: R$ {(100 * Number(overview.cac)).toFixed(2)} | Lucro: R${" "}
            {(
              Math.round((Number(segmentation[0].percentage) / 100) * 100) * 17 +
              Math.round((Number(segmentation[1].percentage) / 100) * 100) * Number(segmentation[1].ltv) +
              Math.round((Number(segmentation[2].percentage) / 100) * 100) * 97 +
              Math.round((Number(segmentation[3].percentage) / 100) * 100) * Number(segmentation[3].ltv) -
              100 * Number(overview.cac)
            ).toFixed(2)}
          </p>
        </div>
      </Card>
    </div>
  )
}
