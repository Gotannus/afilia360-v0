"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

interface ManualMetricsFormProps {
  onSave: () => void
}

export function ManualMetricsForm({ onSave }: ManualMetricsFormProps) {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)

  const [metrics, setMetrics] = useState({
    afilia_basic_qty: 0,
    afilia_basic_revenue: 0,
    afilia_pro_qty: 0,
    afilia_pro_revenue: 0,
    affiliate_qty: 0,
    affiliate_revenue: 0,
    expenses: 0,
  })

  useEffect(() => {
    const handleLoadDate = (event: CustomEvent) => {
      const { date: dateStr } = event.detail
      console.log("[v0] Loading metrics for date:", dateStr)
      const newDate = new Date(dateStr + "T00:00:00")
      setDate(newDate)
      loadMetrics(newDate)
    }

    window.addEventListener("loadMetricsDate", handleLoadDate as EventListener)
    return () => window.removeEventListener("loadMetricsDate", handleLoadDate as EventListener)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/metrics/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: format(date, "yyyy-MM-dd"),
          ...metrics,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Métricas salvas!",
        description: `Dados de ${format(date, "dd/MM/yyyy", { locale: ptBR })} salvos com sucesso.`,
      })

      onSave()
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as métricas. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMetrics = async (selectedDate: Date) => {
    try {
      const response = await fetch(`/api/metrics/manual?date=${format(selectedDate, "yyyy-MM-dd")}`)
      const result = await response.json()

      if (result.data) {
        setMetrics({
          afilia_basic_qty: result.data.afilia_basic_qty || 0,
          afilia_basic_revenue: Number(result.data.afilia_basic_revenue) || 0,
          afilia_pro_qty: result.data.afilia_pro_qty || 0,
          afilia_pro_revenue: Number(result.data.afilia_pro_revenue) || 0,
          affiliate_qty: result.data.affiliate_qty || 0,
          affiliate_revenue: Number(result.data.affiliate_revenue) || 0,
          expenses: Number(result.data.daily_expenses) || Number(result.data.expenses) || 0,
        })
      }
    } catch (error) {
      console.error("[v0] Error loading metrics:", error)
    }
  }

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      loadMetrics(newDate)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Métricas Manualmente</CardTitle>
        <CardDescription>Insira as vendas do dia para gerar o dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data */}
          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "dd/MM/yyyy", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={handleDateChange} locale={ptBR} />
              </PopoverContent>
            </Popover>
          </div>

          {/* AFILIA360 BÁSICO */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-blue-600">AFILIA360 BÁSICO</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="afilia_basic_qty">Quantidade de Vendas</Label>
                <Input
                  id="afilia_basic_qty"
                  type="number"
                  min="0"
                  value={metrics.afilia_basic_qty}
                  onChange={(e) => setMetrics({ ...metrics, afilia_basic_qty: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="afilia_basic_revenue">Faturamento (R$)</Label>
                <Input
                  id="afilia_basic_revenue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={metrics.afilia_basic_revenue}
                  onChange={(e) => setMetrics({ ...metrics, afilia_basic_revenue: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* AFILIA360 PRO */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-purple-600">AFILIA360 PRO</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="afilia_pro_qty">Quantidade de Vendas</Label>
                <Input
                  id="afilia_pro_qty"
                  type="number"
                  min="0"
                  value={metrics.afilia_pro_qty}
                  onChange={(e) => setMetrics({ ...metrics, afilia_pro_qty: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="afilia_pro_revenue">Faturamento (R$)</Label>
                <Input
                  id="afilia_pro_revenue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={metrics.afilia_pro_revenue}
                  onChange={(e) => setMetrics({ ...metrics, afilia_pro_revenue: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* AFILIADOS */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-green-600">VENDAS DE AFILIADOS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="affiliate_qty">Quantidade de Vendas</Label>
                <Input
                  id="affiliate_qty"
                  type="number"
                  min="0"
                  value={metrics.affiliate_qty}
                  onChange={(e) => setMetrics({ ...metrics, affiliate_qty: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="affiliate_revenue">Faturamento (R$)</Label>
                <Input
                  id="affiliate_revenue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={metrics.affiliate_revenue}
                  onChange={(e) => setMetrics({ ...metrics, affiliate_revenue: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* DESPESAS DO DIA */}
          <div className="space-y-4 p-4 border rounded-lg border-red-500/30 bg-red-500/5">
            <h3 className="font-semibold text-red-600">DESPESAS DO DIA</h3>
            <div className="space-y-2">
              <Label htmlFor="expenses">Total de Despesas (R$)</Label>
              <Input
                id="expenses"
                type="number"
                min="0"
                step="0.01"
                value={metrics.expenses}
                onChange={(e) => setMetrics({ ...metrics, expenses: Number(e.target.value) })}
                placeholder="Marketing, IA, Hospedagem, Contador, etc"
              />
              <p className="text-xs text-muted-foreground">
                Inclua: marketing, IA, hospedagem, contador e outras despesas operacionais
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Salvando..." : "Salvar Métricas"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
