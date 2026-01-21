"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Plus, Trash2, BookOpen, Loader2 } from "lucide-react"
import { getUserOrderbumps, addOrderbump as addOrderbumpAction, removeOrderbump as removeOrderbumpAction } from "@/app/actions/orderbumps"

interface Course {
  id: string
  title: string
}

interface UserOrderbump {
  id: string
  course_id: string
  notes: string
  created_at: string
  course: Course
}

interface UserOrderbumpsProps {
  userId: string
}

export function UserOrderbumps({ userId }: UserOrderbumpsProps) {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [userOrderbumps, setUserOrderbumps] = useState<UserOrderbump[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [userId])

  async function loadData() {
    try {
      const result = await getUserOrderbumps(userId)
      
      console.log("[v0] UserOrderbumps - Dados recebidos:", result)
      
      if (result.success) {
        setCourses(result.courses || [])
        setUserOrderbumps(result.userOrderbumps || [])
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao carregar orderbumps",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar orderbumps:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar orderbumps do usuário",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function addOrderbump() {
    if (!selectedCourse) {
      toast({
        title: "Atenção",
        description: "Selecione um curso para liberar",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const result = await addOrderbumpAction(userId, selectedCourse, notes)

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Orderbump liberado com sucesso!",
        })
        setSelectedCourse("")
        setNotes("")
        loadData()
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao adicionar orderbump",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Erro ao adicionar orderbump:", error)
      toast({
        title: "Erro",
        description: "Erro ao adicionar orderbump",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function removeOrderbump(courseId: string) {
    try {
      const result = await removeOrderbumpAction(userId, courseId)

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Orderbump removido com sucesso!",
        })
        loadData()
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao remover orderbump",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Erro ao remover orderbump:", error)
      toast({
        title: "Erro",
        description: "Erro ao remover orderbump",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const availableCourses = courses.filter(
    (course) => !userOrderbumps.some((ob) => ob.course_id === course.id),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BookOpen className="h-4 w-4" />
        <span>Orderbumps Liberados: {userOrderbumps.length}</span>
      </div>

      {/* Lista de Orderbumps Ativos */}
      {userOrderbumps.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Cursos com Acesso:</Label>
          <div className="space-y-2">
            {userOrderbumps.map((ob) => (
              <div key={ob.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{ob.course?.title || "Curso"}</p>
                  {ob.notes && <p className="text-xs text-muted-foreground mt-1">{ob.notes}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Liberado em: {new Date(ob.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => removeOrderbump(ob.course_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário para Adicionar Novo Orderbump */}
      {availableCourses.length > 0 ? (
        <div className="space-y-3 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4">
          <Label className="text-sm font-medium">Liberar Novo Orderbump</Label>
          
          <div className="space-y-2">
            <Label htmlFor="course-select" className="text-xs">
              Selecionar Curso ({availableCourses.length} disponíveis)
            </Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger id="course-select">
                <SelectValue placeholder="Escolha um curso orderbump" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs">
              Anotações (opcional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Ex: Comprou orderbump no checkout em 20/01/2025"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-sm h-20"
            />
          </div>

          <Button onClick={addOrderbump} disabled={!selectedCourse || saving} className="w-full" size="sm">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Liberar Curso
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            {courses.length === 0
              ? "Nenhum curso marcado como orderbump. Crie cursos orderbumps na aba Cursos."
              : "Todos os orderbumps disponíveis já foram liberados para este usuário."}
          </p>
        </div>
      )}
    </div>
  )
}
