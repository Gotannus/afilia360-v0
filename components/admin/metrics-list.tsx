"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type MetricEntry = {
  date: string
  afilia_basic_qty: number
  afilia_basic_revenue: number
  afilia_pro_qty: number
  afilia_pro_revenue: number
  affiliate_qty: number
  affiliate_revenue: number
  expenses: number
}

export function MetricsList({ onEdit }: { onEdit: (date: string) => void }) {
  const [entries, setEntries] = useState<MetricEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())
  const [deleteDate, setDeleteDate] = useState<string | null>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const response = await fetch("/api/metrics/manual/list")
      const result = await response.json()
      setEntries(result.data || [])
    } catch (error) {
      console.error("Error loading entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDate) return

    try {
      const response = await fetch(`/api/metrics/manual?date=${deleteDate}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadEntries()
        setDeleteDate(null)
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
    }
  }

  const toggleExpanded = (date: string) => {
    const newExpanded = new Set(expandedDates)
    if (newExpanded.has(date)) {
      newExpanded.delete(date)
    } else {
      newExpanded.add(date)
    }
    setExpandedDates(newExpanded)
  }

  const calculateTotal = (entry: MetricEntry) => {
    return (
      Number(entry.afilia_basic_revenue || 0) +
      Number(entry.afilia_pro_revenue || 0) +
      Number(entry.affiliate_revenue || 0)
    )
  }

  const calculateProfit = (entry: MetricEntry) => {
    return calculateTotal(entry) - Number(entry.expenses || 0)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-center mt-4 text-muted-foreground">Carregando lançamentos...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Lançamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum lançamento encontrado</p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div key={entry.date} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(entry.date)}
                        className="h-8 w-8 p-0"
                      >
                        {expandedDates.has(entry.date) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <p className="font-medium">
                          {format(new Date(entry.date + "T00:00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(entry.afilia_basic_qty || 0) + (entry.afilia_pro_qty || 0) + (entry.affiliate_qty || 0)}{" "}
                          vendas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Receita</p>
                        <p className="font-bold text-green-500">R$ {calculateTotal(entry).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Lucro</p>
                        <p className="font-bold text-blue-500">R$ {calculateProfit(entry).toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(entry.date)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteDate(entry.date)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {expandedDates.has(entry.date) && (
                    <div className="p-4 bg-background border-t space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">AFILIA360 BÁSICO</p>
                          <p className="font-semibold">{entry.afilia_basic_qty || 0} vendas</p>
                          <p className="text-sm text-blue-500">
                            R$ {Number(entry.afilia_basic_revenue || 0).toFixed(2)}
                          </p>
                        </div>

                        <div className="p-3 bg-purple-500/10 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">AFILIA360 PRO</p>
                          <p className="font-semibold">{entry.afilia_pro_qty || 0} vendas</p>
                          <p className="text-sm text-purple-500">
                            R$ {Number(entry.afilia_pro_revenue || 0).toFixed(2)}
                          </p>
                        </div>

                        <div className="p-3 bg-green-500/10 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Afiliados</p>
                          <p className="font-semibold">{entry.affiliate_qty || 0} vendas</p>
                          <p className="text-sm text-green-500">R$ {Number(entry.affiliate_revenue || 0).toFixed(2)}</p>
                        </div>

                        <div className="p-3 bg-red-500/10 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Despesas</p>
                          <p className="text-sm text-red-500">R$ {Number(entry.expenses || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteDate} onOpenChange={() => setDeleteDate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o lançamento do dia{" "}
              {deleteDate && format(new Date(deleteDate + "T00:00:00"), "dd/MM/yyyy")}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
