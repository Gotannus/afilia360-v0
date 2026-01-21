"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Trash2, Plus, Users, Search } from "lucide-react"

interface Orderbump {
  id: string
  user_id: string
  course_id: string
  granted_by: string
  notes: string
  created_at: string
  user: { id: string; name: string; email: string }
  course: { id: string; title: string; slug: string }
}

interface User {
  id: string
  name: string
  email: string
}

interface Course {
  id: string
  title: string
  slug: string
}

export function OrderbumpsManager() {
  const [orderbumps, setOrderbumps] = useState<Orderbump[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [userSearch, setUserSearch] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const response = await fetch("/api/orderbumps")
      const data = await response.json()
      
      console.log("[v0] Dados recebidos da API:", {
        orderbumps: data.orderbumps?.length || 0,
        users: data.users?.length || 0,
        courses: data.courses?.length || 0,
      })
      
      setOrderbumps(data.orderbumps || [])
      setUsers(data.users || [])
      setCourses(data.courses || [])
    } catch (error) {
      console.error("[v0] Erro ao carregar orderbumps:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar orderbumps",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    if (!selectedUser || !selectedCourse) {
      toast({
        title: "Atenção",
        description: "Selecione um usuário e um curso",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/orderbumps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          courseId: selectedCourse,
          notes: notes,
        }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Orderbump adicionado com sucesso",
        })
        setSelectedUser("")
        setSelectedCourse("")
        setNotes("")
        loadData()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao adicionar orderbump",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar orderbump:", error)
      toast({
        title: "Erro",
        description: "Erro ao adicionar orderbump",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(userId: string, courseId: string) {
    if (!confirm("Tem certeza que deseja remover este orderbump?")) return

    try {
      const response = await fetch(`/api/orderbumps?userId=${userId}&courseId=${courseId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Orderbump removido com sucesso",
        })
        loadData()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao remover orderbump",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao remover orderbump:", error)
      toast({
        title: "Erro",
        description: "Erro ao remover orderbump",
        variant: "destructive",
      })
    }
  }

  // Filtrar usuários com base na busca
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()),
  )

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Orderbump
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user">Usuário ({filteredUsers.length} encontrados)</Label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {filteredUsers.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">Nenhum usuário encontrado</div>
                  ) : (
                    filteredUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Anotações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Comprou orderbump no checkout"
              rows={3}
            />
          </div>

          <Button onClick={handleAdd} disabled={saving} className="w-full md:w-auto">
            {saving ? "Salvando..." : "Adicionar Orderbump"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Orderbumps Ativos ({orderbumps.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orderbumps.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Nenhum orderbump cadastrado</div>
          ) : (
            <div className="space-y-4">
              {orderbumps.map((orderbump) => (
                <div key={orderbump.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex-1">
                    <div className="font-medium">{orderbump.user.name}</div>
                    <div className="text-sm text-muted-foreground">{orderbump.user.email}</div>
                    <div className="text-sm font-medium text-primary mt-1">{orderbump.course.title}</div>
                    {orderbump.notes && (
                      <div className="text-xs text-muted-foreground mt-1">📝 {orderbump.notes}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Adicionado em {new Date(orderbump.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(orderbump.user_id, orderbump.course_id)}
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
