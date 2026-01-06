"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Plus, Trash2, TrendingUp } from "lucide-react"

const MONTHS = [
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

interface MonthlySale {
  id: number
  month: number
  year: number
  total_sales: number
  created_at: string
  updated_at: string
}

export default function MonthlySalesManager() {
  const [history, setHistory] = useState<MonthlySale[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const currentDate = new Date()
  const [formData, setFormData] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    total_sales: 0,
  })

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/monthly-sales")
      const data = await res.json()
      setHistory(data)
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/monthly-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await loadHistory()
        setShowForm(false)
        setFormData({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          total_sales: 0,
        })
      }
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este registro?")) return

    try {
      await fetch(`/api/monthly-sales?id=${id}`, { method: "DELETE" })
      await loadHistory()
    } catch (error) {
      console.error("Erro ao excluir:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Botão para adicionar/editar vendas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vendas Totais do Mês
            </CardTitle>
            <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
              {showForm ? (
                "Cancelar"
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar/Atualizar
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {showForm && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="month">Mês</Label>
                <select
                  id="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: Number.parseInt(e.target.value) })}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                >
                  {MONTHS.map((name, idx) => (
                    <option key={idx} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="year">Ano</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                  min={2020}
                  max={2100}
                />
              </div>

              <div>
                <Label htmlFor="total_sales">Total de Vendas</Label>
                <Input
                  id="total_sales"
                  type="number"
                  value={formData.total_sales}
                  onChange={(e) => setFormData({ ...formData, total_sales: Number.parseInt(e.target.value) })}
                  min={0}
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum registro encontrado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold">
                      {MONTHS[record.month - 1]} {record.year}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {record.total_sales.toLocaleString("pt-BR")} vendas
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Atualizado em: {new Date(record.updated_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(record.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
