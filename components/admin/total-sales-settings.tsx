"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Save, RefreshCw } from "lucide-react"

export function TotalSalesSettings() {
  const [totalSales, setTotalSales] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadTotalSales()
  }, [])

  const loadTotalSales = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/settings/total-sales")
      const data = await res.json()
      setTotalSales(data.totalSales)
    } catch (error) {
      console.error("Error loading total sales:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/settings/total-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalSales }),
      })

      if (res.ok) {
        alert("Total de vendas atualizado com sucesso!")
      }
    } catch (error) {
      console.error("Error saving total sales:", error)
      alert("Erro ao salvar. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <CardTitle>Vendas Totais do Ranking</CardTitle>
        </div>
        <CardDescription>Defina manualmente o número total de vendas que aparece no ranking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="totalSales" className="block text-sm font-medium mb-2">
              Total de Vendas
            </label>
            <Input
              id="totalSales"
              type="number"
              value={totalSales}
              onChange={(e) => setTotalSales(Number.parseInt(e.target.value) || 0)}
              disabled={isLoading}
              className="text-lg"
              min="0"
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Este valor será exibido no banner do ranking e na página de ranking
        </p>
      </CardContent>
    </Card>
  )
}
