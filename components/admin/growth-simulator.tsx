"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Calculator, TrendingUp, DollarSign, Users, Target } from "lucide-react"

interface SimulatorInputs {
  marketingBudget: number
  expectedCAC: number
  growthPercentage: number
}

interface SimulatorResults {
  newAffiliates: number
  inactiveAffiliates: number
  activeAffiliates: number
  revenueFromPlans: number
  revenueFromCommissions: number
  totalRevenue: number
  totalCosts: number
  profit: number
  roi: number
}

export default function GrowthSimulator() {
  const [inputs, setInputs] = useState<SimulatorInputs>({
    marketingBudget: 5000,
    expectedCAC: 50,
    growthPercentage: 30,
  })

  const [historicalData, setHistoricalData] = useState({
    activationRate: 15, // 15% dos afiliados ficam ativos
    avgCommissionPerActive: 300,
    avgBasicRevenue: 17,
    avgProRevenue: 97,
    proConversionRate: 20, // 20% compram Pro, 80% Basic
  })

  const [results, setResults] = useState<SimulatorResults | null>(null)

  useEffect(() => {
    // Buscar dados históricos reais da API
    fetch("/api/business-metrics/ltv")
      .then((res) => res.json())
      .then((data) => {
        if (data.segments) {
          const totalActive = data.segments.reduce(
            (sum: number, seg: any) => (seg.segment.includes("Ativo") ? sum + seg.count : sum),
            0,
          )
          const totalInactive = data.segments.reduce(
            (sum: number, seg: any) => (seg.segment.includes("Inativo") ? sum + seg.count : sum),
            0,
          )
          const total = totalActive + totalInactive

          if (total > 0) {
            setHistoricalData((prev) => ({
              ...prev,
              activationRate: Math.round((totalActive / total) * 100),
              avgCommissionPerActive: data.metrics?.avgCommissionPerActive || 300,
            }))
          }
        }
      })
      .catch(console.error)
  }, [])

  const calculateProjection = () => {
    const newAffiliates = Math.floor(inputs.marketingBudget / inputs.expectedCAC)
    const activeAffiliates = Math.floor(newAffiliates * (historicalData.activationRate / 100))
    const inactiveAffiliates = newAffiliates - activeAffiliates

    // Receita dos planos
    const basicAffiliates = Math.floor(inactiveAffiliates * 0.8) // 80% Basic
    const proAffiliates = Math.floor(inactiveAffiliates * 0.2) // 20% Pro
    const revenueFromPlans =
      basicAffiliates * historicalData.avgBasicRevenue + proAffiliates * historicalData.avgProRevenue

    // Receita de comissões dos ativos
    const revenueFromCommissions = activeAffiliates * historicalData.avgCommissionPerActive

    const totalRevenue = revenueFromPlans + revenueFromCommissions
    const totalCosts = inputs.marketingBudget
    const profit = totalRevenue - totalCosts
    const roi = totalCosts > 0 ? (profit / totalCosts) * 100 : 0

    setResults({
      newAffiliates,
      inactiveAffiliates,
      activeAffiliates,
      revenueFromPlans,
      revenueFromCommissions,
      totalRevenue,
      totalCosts,
      profit,
      roi,
    })
  }

  useEffect(() => {
    calculateProjection()
  }, [inputs, historicalData])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Parâmetros da Simulação
            </CardTitle>
            <CardDescription>Ajuste os valores para simular diferentes cenários</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Investimento em Marketing</Label>
              <Input
                id="budget"
                type="number"
                value={inputs.marketingBudget}
                onChange={(e) => setInputs({ ...inputs, marketingBudget: Number(e.target.value) })}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">R$ {inputs.marketingBudget.toLocaleString("pt-BR")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cac">CAC Esperado (Custo por Afiliado)</Label>
              <Input
                id="cac"
                type="number"
                value={inputs.expectedCAC}
                onChange={(e) => setInputs({ ...inputs, expectedCAC: Number(e.target.value) })}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">R$ {inputs.expectedCAC.toLocaleString("pt-BR")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="growth">Cenário de Crescimento</Label>
              <Slider
                id="growth"
                value={[inputs.growthPercentage]}
                onValueChange={(value) => setInputs({ ...inputs, growthPercentage: value[0] })}
                min={-50}
                max={100}
                step={5}
                className="my-4"
              />
              <p className="text-sm text-muted-foreground">
                {inputs.growthPercentage > 0 ? "+" : ""}
                {inputs.growthPercentage}% sobre métricas atuais
              </p>
            </div>

            <Button onClick={calculateProjection} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Recalcular Projeção
            </Button>
          </CardContent>
        </Card>

        {/* Dados Históricos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Dados Históricos
            </CardTitle>
            <CardDescription>Baseado no desempenho real da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Taxa de Ativação</span>
              <span className="text-lg font-bold">{historicalData.activationRate}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Comissão Média (Ativo)</span>
              <span className="text-lg font-bold">R$ {historicalData.avgCommissionPerActive}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Valor Plano Basic</span>
              <span className="text-lg font-bold">R$ {historicalData.avgBasicRevenue}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Valor Plano Pro</span>
              <span className="text-lg font-bold">R$ {historicalData.avgProRevenue}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Conversão Pro</span>
              <span className="text-lg font-bold">{historicalData.proConversionRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Novos Afiliados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.newAffiliates}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {results.activeAffiliates} ativos, {results.inactiveAffiliates} inativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {results.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Planos + Comissões</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Lucro Projetado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${results.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  R$ {results.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">ROI: {results.roi.toFixed(1)}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${results.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {results.roi > 0 ? "+" : ""}
                  {results.roi.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Retorno sobre investimento</p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento da Projeção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Investimento em Marketing</span>
                    <span className="font-medium">
                      R$ {results.totalCosts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CAC por Afiliado</span>
                    <span className="font-medium">
                      R$ {inputs.expectedCAC.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Novos Afiliados Adquiridos</span>
                    <span className="font-medium">{results.newAffiliates}</span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Receita dos Planos (Inativos)</span>
                    <span className="font-medium text-green-600">
                      + R$ {results.revenueFromPlans.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Receita de Comissões (Ativos)</span>
                    <span className="font-medium text-green-600">
                      + R$ {results.revenueFromCommissions.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Receita Total</span>
                    <span className="text-green-600">
                      R$ {results.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Lucro Líquido</span>
                  <span className={results.profit >= 0 ? "text-green-600" : "text-red-600"}>
                    R$ {results.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-900">Insights da Simulação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-900">
              <p>
                • A cada <strong>R$ 100</strong> investidos em marketing, você pode esperar adquirir{" "}
                <strong>{Math.floor(100 / inputs.expectedCAC)}</strong> novos afiliados.
              </p>
              <p>
                • Desses, aproximadamente{" "}
                <strong>{Math.floor((100 / inputs.expectedCAC) * (historicalData.activationRate / 100))}</strong> (
                {historicalData.activationRate}%) se tornarão ativos e gerarão comissões.
              </p>
              <p>
                • Baseado no histórico, cada afiliado ativo gera em média{" "}
                <strong>R$ {historicalData.avgCommissionPerActive}</strong> em comissões.
              </p>
              <p>
                • Com um investimento de <strong>R$ {inputs.marketingBudget.toLocaleString("pt-BR")}</strong>, seu ROI
                esperado é de{" "}
                <strong>
                  {results.roi > 0 ? "+" : ""}
                  {results.roi.toFixed(1)}%
                </strong>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
