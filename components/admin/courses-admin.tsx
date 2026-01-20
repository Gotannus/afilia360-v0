"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Pencil,
  Trash2,
  Video,
  BookOpen,
  GraduationCap,
  Users,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  GripVertical,
  LayoutGrid,
  Layers,
  Eye,
  EyeOff,
  Star,
  Move,
  Crown,
  FolderTree,
  PlayCircle,
  Settings,
  Save,
  CheckCircle,
  FolderOpen,
} from "lucide-react"
import {
  getCourses,
  getCategories,
  createCourse,
  updateCourse,
  deleteCourse,
  createCategory,
  updateCategory,
  deleteCategory,
  createLesson,
  updateLesson,
  deleteLesson,
  getPlans,
  getPlanCourseAccess,
  updatePlanCourseAccess,
} from "@/lib/courses-api"
import { createClient } from "@/lib/supabase/client"

// Assuming getLessonsByCourse is defined in "@/lib/courses-api" or a similar utility file.
// If not, you would need to define it or import it.
// For now, let's assume it's available.
import { getLessonsByCourse } from "@/lib/courses-api"
import { RichTextEditor } from "./rich-text-editor"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
}

// Interface for Course defined locally, but the API returns a type named Course.
// Renamed the local interface to avoid redeclaration.
interface LocalCourse {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image: string | null
  category_id: string | null
  instructor: string | null
  duration_hours: number
  lessons_count: number
  is_published: boolean
  is_featured: boolean
  sort_order: number
  is_orderbump?: boolean
  orderbump_price?: number
  orderbump_description?: string
  category?: Category
}

interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  video_url: string | null
  video_type: string
  duration_minutes: number
  sort_order: number
  is_free: boolean
  is_published: boolean
  attachments: any[]
}

interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  features: string[]
}

function ConfigTab() {
  const [introVideoUrl, setIntroVideoUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadConfig() {
      const supabase = createClient()
      const { data } = await supabase.from("site_config").select("value").eq("key", "intro_video_url").single()

      if (data?.value) {
        setIntroVideoUrl(data.value)
      }
      setLoading(false)
    }
    loadConfig()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    // Tenta atualizar, se não existir, insere
    const { error } = await supabase.from("site_config").upsert(
      {
        key: "intro_video_url",
        value: introVideoUrl,
      },
      {
        onConflict: "key",
      },
    )

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Vídeo de Introdução
          </CardTitle>
          <CardDescription>
            Configure o vídeo que aparece para novos usuários ao acessar a área de cursos pela primeira vez.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intro-video">URL do Vídeo (YouTube)</Label>
            <Input
              id="intro-video"
              value={introVideoUrl}
              onChange={(e) => setIntroVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-muted-foreground">
              Cole o link do YouTube. Aceita formatos: youtube.com/watch?v=..., youtu.be/... ou link de embed.
            </p>
          </div>

          {introVideoUrl && (
            <div className="space-y-2">
              <Label>Pré-visualização</Label>
              <div className="aspect-video bg-black rounded-lg overflow-hidden max-w-md">
                <iframe
                  src={
                    introVideoUrl.includes("youtube.com/watch")
                      ? `https://www.youtube-nocookie.com/embed/${introVideoUrl.split("v=")[1]?.split("&")[0]}`
                      : introVideoUrl.includes("youtu.be/")
                        ? `https://www.youtube-nocookie.com/embed/${introVideoUrl.split("youtu.be/")[1]?.split("?")[0]}`
                        : introVideoUrl
                  }
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Salvo!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {saving ? "Salvando..." : "Salvar Configuração"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function CoursesAdmin() {
  return (
    <Tabs defaultValue="organizar" className="space-y-6">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="organizar">
          <FolderTree className="h-4 w-4 mr-2" />
          Organizar
        </TabsTrigger>
        <TabsTrigger value="vitrines">
          <LayoutGrid className="h-4 w-4 mr-2" />
          Vitrines
        </TabsTrigger>
        <TabsTrigger value="courses">
          <Video className="h-4 w-4 mr-2" />
          Cursos
        </TabsTrigger>
        <TabsTrigger value="categories">
          <Layers className="h-4 w-4 mr-2" />
          Trilhas
        </TabsTrigger>
        <TabsTrigger value="lessons">
          <GraduationCap className="h-4 w-4 mr-2" />
          Aulas
        </TabsTrigger>
        <TabsTrigger value="plans">
          <Users className="h-4 w-4 mr-2" />
          Planos
        </TabsTrigger>
        <TabsTrigger value="config">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="organizar">
        <OrganizarTab />
      </TabsContent>

      <TabsContent value="vitrines">
        <VitrinesTab />
      </TabsContent>

      <TabsContent value="courses">
        <CoursesTab />
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesTab />
      </TabsContent>

      <TabsContent value="lessons">
        <LessonsTab />
      </TabsContent>

      <TabsContent value="plans">
        <PlansTab />
      </TabsContent>

      <TabsContent value="config">
        <ConfigTab />
      </TabsContent>
    </Tabs>
  )
}

function OrganizarTab() {
  const [courses, setCourses] = useState<LocalCourse[]>([]) // Used LocalCourse interface here
  const [categories, setCategories] = useState<Category[]>([])
  const [lessons, setLessons] = useState<{ [courseId: string]: Lesson[] }>({})
  const [loading, setLoading] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedCourses, setExpandedCourses] = useState<string[]>([])
  const [movingCourse, setMovingCourse] = useState<LocalCourse | null>(null) // Used LocalCourse interface here

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [coursesData, categoriesData] = await Promise.all([getCourses(), getCategories()])
    setCourses(coursesData)
    setCategories(categoriesData.sort((a: Category, b: Category) => a.sort_order - b.sort_order))
    setLoading(false)
  }

  async function loadLessonsForCourse(courseId: string) {
    if (lessons[courseId]) return
    // Fixed: Call getLessonsByCourse correctly
    const lessonsData = await getLessonsByCourse(courseId)
    setLessons((prev) => ({
      ...prev,
      [courseId]: lessonsData.sort((a: Lesson, b: Lesson) => a.sort_order - b.sort_order),
    }))
  }

  function toggleCategory(categoryId: string) {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  function toggleCourse(courseId: string) {
    if (!expandedCourses.includes(courseId)) {
      loadLessonsForCourse(courseId)
    }
    setExpandedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  function getCoursesByCategory(categoryId: string) {
    return courses.filter((c) => c.category_id === categoryId).sort((a, b) => a.sort_order - b.sort_order)
  }

  function getUncategorizedCourses() {
    return courses.filter((c) => !c.category_id).sort((a, b) => a.sort_order - b.sort_order)
  }

  // Funções de ordenação de TRILHAS
  async function moveCategoryUp(category: Category) {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (currentIndex <= 0) return
    const newOrder = categories[currentIndex - 1].sort_order
    const prevOrder = category.sort_order
    await updateCategory(category.id, { sort_order: newOrder })
    await updateCategory(categories[currentIndex - 1].id, { sort_order: prevOrder })
    await loadData()
  }

  async function moveCategoryDown(category: Category) {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (currentIndex >= categories.length - 1) return
    const newOrder = categories[currentIndex + 1].sort_order
    const nextOrder = category.sort_order
    await updateCategory(category.id, { sort_order: newOrder })
    await updateCategory(categories[currentIndex + 1].id, { sort_order: nextOrder })
    await loadData()
  }

  async function toggleCategoryActive(category: Category) {
    await updateCategory(category.id, { is_active: !category.is_active })
    await loadData()
  }

  // Funções de ordenação de CURSOS
  async function moveCourseUp(course: LocalCourse) {
    // Used LocalCourse interface here
    const categoryCourses = course.category_id ? getCoursesByCategory(course.category_id) : getUncategorizedCourses()
    const currentIndex = categoryCourses.findIndex((c) => c.id === course.id)
    if (currentIndex <= 0) return
    const newOrder = categoryCourses[currentIndex - 1].sort_order
    const prevOrder = course.sort_order
    await updateCourse(course.id, { sort_order: newOrder })
    await updateCourse(categoryCourses[currentIndex - 1].id, { sort_order: prevOrder })
    await loadData()
  }

  async function moveCourseDown(course: LocalCourse) {
    // Used LocalCourse interface here
    const categoryCourses = course.category_id ? getCoursesByCategory(course.category_id) : getUncategorizedCourses()
    const currentIndex = categoryCourses.findIndex((c) => c.id === course.id)
    if (currentIndex >= categoryCourses.length - 1) return
    const newOrder = categoryCourses[currentIndex + 1].sort_order
    const nextOrder = course.sort_order
    await updateCourse(course.id, { sort_order: newOrder })
    await updateCourse(categoryCourses[currentIndex + 1].id, { sort_order: nextOrder })
    await loadData()
  }

  async function toggleCoursePublished(course: LocalCourse) {
    // Used LocalCourse interface here
    await updateCourse(course.id, { is_published: !course.is_published })
    await loadData()
  }

  async function toggleCourseFeatured(course: LocalCourse) {
    // Used LocalCourse interface here
    await updateCourse(course.id, { is_featured: !course.is_featured })
    await loadData()
  }

  async function moveCourseToCategory(course: LocalCourse, newCategoryId: string | null) {
    // Used LocalCourse interface here
    const coursesInNewCategory = newCategoryId ? getCoursesByCategory(newCategoryId) : getUncategorizedCourses()
    const newSortOrder =
      coursesInNewCategory.length > 0 ? Math.max(...coursesInNewCategory.map((c) => c.sort_order)) + 1 : 1
    await updateCourse(course.id, { category_id: newCategoryId, sort_order: newSortOrder })
    setMovingCourse(null)
    await loadData()
  }

  // Funções de ordenação de AULAS
  async function moveLessonUp(lesson: Lesson) {
    const courseLessons = lessons[lesson.course_id] || []
    const currentIndex = courseLessons.findIndex((l) => l.id === lesson.id)
    if (currentIndex <= 0) return
    const newOrder = courseLessons[currentIndex - 1].sort_order
    const prevOrder = lesson.sort_order
    await updateLesson(lesson.id, { sort_order: newOrder })
    await updateLesson(courseLessons[currentIndex - 1].id, { sort_order: prevOrder })
    const lessonsData = await getLessonsByCourse(lesson.course_id)
    setLessons((prev) => ({
      ...prev,
      [lesson.course_id]: lessonsData.sort((a: Lesson, b: Lesson) => a.sort_order - b.sort_order),
    }))
  }

  async function moveLessonDown(lesson: Lesson) {
    const courseLessons = lessons[lesson.course_id] || []
    const currentIndex = courseLessons.findIndex((l) => l.id === lesson.id)
    if (currentIndex >= courseLessons.length - 1) return
    const newOrder = courseLessons[currentIndex + 1].sort_order
    const nextOrder = lesson.sort_order
    await updateLesson(lesson.id, { sort_order: newOrder })
    await updateLesson(courseLessons[currentIndex + 1].id, { sort_order: nextOrder })
    const lessonsData = await getLessonsByCourse(lesson.course_id)
    setLessons((prev) => ({
      ...prev,
      [lesson.course_id]: lessonsData.sort((a: Lesson, b: Lesson) => a.sort_order - b.sort_order),
    }))
  }

  async function toggleLessonPublished(lesson: Lesson) {
    await updateLesson(lesson.id, { is_published: !lesson.is_published })
    const lessonsData = await getLessonsByCourse(lesson.course_id)
    setLessons((prev) => ({
      ...prev,
      [lesson.course_id]: lessonsData.sort((a: Lesson, b: Lesson) => a.sort_order - b.sort_order),
    }))
  }

  async function toggleLessonFree(lesson: Lesson) {
    await updateLesson(lesson.id, { is_free: !lesson.is_free })
    const lessonsData = await getLessonsByCourse(lesson.course_id)
    setLessons((prev) => ({
      ...prev,
      [lesson.course_id]: lessonsData.sort((a: Lesson, b: Lesson) => a.sort_order - b.sort_order),
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-dashed border-2 border-emerald-500/30 bg-emerald-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <FolderTree className="h-5 w-5" />
            Organizar Trilhas, Cursos e Aulas
          </CardTitle>
          <CardDescription>Clique nas trilhas e cursos para expandir. Use as setas para reordenar.</CardDescription>
        </CardHeader>
      </Card>

      {/* Modal para mover curso */}
      {movingCourse && (
        <Dialog open={!!movingCourse} onOpenChange={() => setMovingCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mover Curso</DialogTitle>
              <DialogDescription>Escolha para qual trilha deseja mover "{movingCourse.title}"</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => moveCourseToCategory(movingCourse, null)}
              >
                <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                Sem Trilha
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant="outline"
                  className={`w-full justify-start ${movingCourse.category_id === cat.id ? "border-primary" : ""}`}
                  onClick={() => moveCourseToCategory(movingCourse, cat.id)}
                  disabled={movingCourse.category_id === cat.id}
                >
                  <Layers className="h-4 w-4 mr-2 text-primary" />
                  {cat.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Trilhas */}
      <div className="space-y-2">
        {categories.map((category, catIndex) => {
          const categoryCourses = getCoursesByCategory(category.id)
          const isExpanded = expandedCategories.includes(category.id)

          return (
            <Card key={category.id} className={`${!category.is_active ? "opacity-50" : ""}`}>
              <div
                className="flex items-center gap-2 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <ChevronRight className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                <Layers className="h-5 w-5 text-primary" />
                <span className="font-semibold flex-1">{category.name}</span>
                <Badge variant="secondary">{categoryCourses.length} cursos</Badge>

                {/* Controles da Trilha */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => moveCategoryUp(category)}
                    disabled={catIndex === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => moveCategoryDown(category)}
                    disabled={catIndex === categories.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={category.is_active ? "default" : "outline"}
                    className={`h-8 w-8 ${category.is_active ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                    onClick={() => toggleCategoryActive(category)}
                  >
                    {category.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border">
                  {categoryCourses.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground text-center">Nenhum curso nesta trilha</p>
                  ) : (
                    <div className="p-2 space-y-1">
                      {categoryCourses.map((course, courseIndex) => {
                        const courseLessons = lessons[course.id] || []
                        const isCourseExpanded = expandedCourses.includes(course.id)

                        return (
                          <div
                            key={course.id}
                            className={`rounded-lg border ${!course.is_published ? "opacity-50" : ""}`}
                          >
                            <div
                              className="flex items-center gap-2 p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                              onClick={() => toggleCourse(course.id)}
                            >
                              <ChevronRight
                                className={`h-4 w-4 transition-transform ${isCourseExpanded ? "rotate-90" : ""}`}
                              />
                              <Video className="h-4 w-4 text-blue-400" />
                              <span className="flex-1 text-sm">{course.title}</span>

                              {course.is_featured && <Crown className="h-4 w-4 text-yellow-500" />}

                              {/* Controles do Curso */}
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => moveCourseUp(course)}
                                  disabled={courseIndex === 0}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => moveCourseDown(course)}
                                  disabled={courseIndex === categoryCourses.length - 1}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant={course.is_published ? "default" : "outline"}
                                  className={`h-7 w-7 ${course.is_published ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                                  onClick={() => toggleCoursePublished(course)}
                                >
                                  {course.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </Button>
                                <Button
                                  size="icon"
                                  variant={course.is_featured ? "default" : "outline"}
                                  className={`h-7 w-7 ${course.is_featured ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
                                  onClick={() => toggleCourseFeatured(course)}
                                >
                                  <Crown className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7 bg-transparent"
                                  onClick={() => setMovingCourse(course)}
                                >
                                  <Move className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {isCourseExpanded && (
                              <div className="border-t border-border bg-accent/20 p-2 space-y-1">
                                {courseLessons.length === 0 ? (
                                  <p className="text-xs text-muted-foreground text-center py-2">
                                    Nenhuma aula neste curso
                                  </p>
                                ) : (
                                  courseLessons.map((lesson, lessonIndex) => (
                                    <div
                                      key={lesson.id}
                                      className={`flex items-center gap-2 p-2 rounded bg-background/50 ${!lesson.is_published ? "opacity-50" : ""}`}
                                    >
                                      <PlayCircle className="h-4 w-4 text-purple-400" />
                                      <span className="flex-1 text-xs">{lesson.title}</span>

                                      {lesson.is_free && (
                                        <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                                          Grátis
                                        </Badge>
                                      )}

                                      {/* Controles da Aula */}
                                      <div className="flex items-center gap-1">
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-6 w-6"
                                          onClick={() => moveLessonUp(lesson)}
                                          disabled={lessonIndex === 0}
                                        >
                                          <ChevronUp className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-6 w-6"
                                          onClick={() => moveLessonDown(lesson)}
                                          disabled={lessonIndex === courseLessons.length - 1}
                                        >
                                          <ChevronDown className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant={lesson.is_published ? "default" : "outline"}
                                          className={`h-6 w-6 ${lesson.is_published ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                                          onClick={() => toggleLessonPublished(lesson)}
                                        >
                                          {lesson.is_published ? (
                                            <Eye className="h-3 w-3" />
                                          ) : (
                                            <EyeOff className="h-3 w-3" />
                                          )}
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant={lesson.is_free ? "default" : "outline"}
                                          className={`h-6 w-6 ${lesson.is_free ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                                          onClick={() => toggleLessonFree(lesson)}
                                        >
                                          <Star className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}

        {/* Cursos sem trilha */}
        {getUncategorizedCourses().length > 0 && (
          <Card className="border-dashed">
            <div
              className="flex items-center gap-2 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => toggleCategory("uncategorized")}
            >
              <ChevronRight
                className={`h-5 w-5 transition-transform ${expandedCategories.includes("uncategorized") ? "rotate-90" : ""}`}
              />
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold flex-1 text-muted-foreground">Sem Trilha</span>
              <Badge variant="outline">{getUncategorizedCourses().length} cursos</Badge>
            </div>

            {expandedCategories.includes("uncategorized") && (
              <div className="border-t border-border p-2 space-y-1">
                {getUncategorizedCourses().map((course, courseIndex) => {
                  const courseLessons = lessons[course.id] || []
                  const isCourseExpanded = expandedCourses.includes(course.id)
                  const uncatCourses = getUncategorizedCourses()

                  return (
                    <div key={course.id} className={`rounded-lg border ${!course.is_published ? "opacity-50" : ""}`}>
                      <div
                        className="flex items-center gap-2 p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                        onClick={() => toggleCourse(course.id)}
                      >
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${isCourseExpanded ? "rotate-90" : ""}`}
                        />
                        <Video className="h-4 w-4 text-blue-400" />
                        <span className="flex-1 text-sm">{course.title}</span>

                        {course.is_featured && <Crown className="h-4 w-4 text-yellow-500" />}

                        {/* Controles do Curso */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => moveCourseUp(course)}
                            disabled={courseIndex === 0}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => moveCourseDown(course)}
                            disabled={courseIndex === uncatCourses.length - 1}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant={course.is_published ? "default" : "outline"}
                            className={`h-7 w-7 ${course.is_published ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                            onClick={() => toggleCoursePublished(course)}
                          >
                            {course.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          </Button>
                          <Button
                            size="icon"
                            variant={course.is_featured ? "default" : "outline"}
                            className={`h-7 w-7 ${course.is_featured ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
                            onClick={() => toggleCourseFeatured(course)}
                          >
                            <Crown className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => setMovingCourse(course)}
                          >
                            <Move className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {isCourseExpanded && (
                        <div className="border-t border-border bg-accent/20 p-2 space-y-1">
                          {courseLessons.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-2">Nenhuma aula neste curso</p>
                          ) : (
                            courseLessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className={`flex items-center gap-2 p-2 rounded bg-background/50 ${!lesson.is_published ? "opacity-50" : ""}`}
                              >
                                <PlayCircle className="h-4 w-4 text-purple-400" />
                                <span className="flex-1 text-xs">{lesson.title}</span>

                                {lesson.is_free && (
                                  <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                                    Grátis
                                  </Badge>
                                )}

                                {/* Controles da Aula */}
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => moveLessonUp(lesson)}
                                    disabled={lessonIndex === 0}
                                  >
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => moveLessonDown(lesson)}
                                    disabled={lessonIndex === courseLessons.length - 1}
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant={lesson.is_published ? "default" : "outline"}
                                    className={`h-6 w-6 ${lesson.is_published ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                                    onClick={() => toggleLessonPublished(lesson)}
                                  >
                                    {lesson.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant={lesson.is_free ? "default" : "outline"}
                                    className={`h-6 w-6 ${lesson.is_free ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                                    onClick={() => toggleLessonFree(lesson)}
                                  >
                                    <Star className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

function VitrinesTab() {
  const [courses, setCourses] = useState<LocalCourse[]>([]) // Used LocalCourse interface here
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [movingCourse, setMovingCourse] = useState<LocalCourse | null>(null) // Used LocalCourse interface here

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [coursesData, categoriesData] = await Promise.all([getCourses(), getCategories()])
    setCourses(coursesData)
    setCategories(categoriesData.sort((a: Category, b: Category) => a.sort_order - b.sort_order))
    setLoading(false)
  }

  function getCoursesByCategory(categoryId: string) {
    return courses.filter((c) => c.category_id === categoryId).sort((a, b) => a.sort_order - b.sort_order)
  }

  function getUncategorizedCourses() {
    return courses.filter((c) => !c.category_id).sort((a, b) => a.sort_order - b.sort_order)
  }

  async function moveCourseUp(course: LocalCourse) {
    // Used LocalCourse interface here
    const categoryCourses = getCoursesByCategory(course.category_id || "")
    const currentIndex = categoryCourses.findIndex((c) => c.id === course.id)
    if (currentIndex <= 0) return

    const newOrder = categoryCourses[currentIndex - 1].sort_order
    const prevOrder = course.sort_order

    await updateCourse(course.id, { sort_order: newOrder })
    await updateCourse(categoryCourses[currentIndex - 1].id, { sort_order: prevOrder })
    await loadData()
  }

  async function moveCourseDown(course: LocalCourse) {
    // Used LocalCourse interface here
    const categoryCourses = getCoursesByCategory(course.category_id || "")
    const currentIndex = categoryCourses.findIndex((c) => c.id === course.id)
    if (currentIndex >= categoryCourses.length - 1) return

    const newOrder = categoryCourses[currentIndex + 1].sort_order
    const nextOrder = course.sort_order

    await updateCourse(course.id, { sort_order: newOrder })
    await updateCourse(categoryCourses[currentIndex + 1].id, { sort_order: nextOrder })
    await loadData()
  }

  async function moveCategoryUp(category: Category) {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (currentIndex <= 0) return

    const newOrder = categories[currentIndex - 1].sort_order
    const prevOrder = category.sort_order

    await updateCategory(category.id, { sort_order: newOrder })
    await updateCategory(categories[currentIndex - 1].id, { sort_order: prevOrder })
    await loadData()
  }

  async function moveCategoryDown(category: Category) {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (currentIndex >= categories.length - 1) return

    const newOrder = categories[currentIndex + 1].sort_order
    const nextOrder = category.sort_order

    await updateCategory(category.id, { sort_order: newOrder })
    await updateCategory(categories[currentIndex + 1].id, { sort_order: nextOrder })
    await loadData()
  }

  async function moveCourseToCategory(course: LocalCourse, newCategoryId: string | null) {
    // Used LocalCourse interface here
    const coursesInNewCategory = newCategoryId ? getCoursesByCategory(newCategoryId) : getUncategorizedCourses()
    const newSortOrder =
      coursesInNewCategory.length > 0 ? Math.max(...coursesInNewCategory.map((c) => c.sort_order)) + 1 : 1

    await updateCourse(course.id, {
      category_id: newCategoryId,
      sort_order: newSortOrder,
    })
    setMovingCourse(null)
    await loadData()
  }

  async function togglePublished(course: LocalCourse) {
    // Used LocalCourse interface here
    await updateCourse(course.id, { is_published: !course.is_published })
    await loadData()
  }

  async function toggleFeatured(course: LocalCourse) {
    // Used LocalCourse interface here
    await updateCourse(course.id, { is_featured: !course.is_featured })
    await loadData()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <LayoutGrid className="h-5 w-5" />
            Organize suas Vitrines
          </CardTitle>
          <CardDescription>
            Arraste e organize os cursos em cada vitrine/trilha. Use as setas para reordenar.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Move Course Modal */}
      {movingCourse && (
        <Dialog open={!!movingCourse} onOpenChange={() => setMovingCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mover Curso</DialogTitle>
              <DialogDescription>Escolha para qual trilha deseja mover "{movingCourse.title}"</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => moveCourseToCategory(movingCourse, null)}
              >
                <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                Sem Trilha (Não categorizado)
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={movingCourse.category_id === cat.id ? "secondary" : "outline"}
                  className="w-full justify-start"
                  onClick={() => moveCourseToCategory(movingCourse, cat.id)}
                  disabled={movingCourse.category_id === cat.id}
                >
                  <Layers className="h-4 w-4 mr-2 text-blue-500" />
                  {cat.name}
                  {movingCourse.category_id === cat.id && (
                    <Badge className="ml-auto" variant="secondary">
                      Atual
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Categories/Vitrines */}
      {categories.map((category, catIndex) => (
        <Card key={category.id} className={!category.is_active ? "opacity-60" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => moveCategoryUp(category)}
                    disabled={catIndex === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => moveCategoryDown(category)}
                    disabled={catIndex === categories.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-500" />
                    {category.name}
                    {!category.is_active && <Badge variant="secondary">Inativa</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {getCoursesByCategory(category.id).length} curso(s) • Ordem: {category.sort_order}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Vitrine #{catIndex + 1}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {getCoursesByCategory(category.id).length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum curso nesta trilha</p>
                <p className="text-sm">Mova cursos para cá usando o botão de mover</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {getCoursesByCategory(category.id).map((course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    total={getCoursesByCategory(category.id).length}
                    onMoveUp={() => moveCourseUp(course)}
                    onMoveDown={() => moveCourseDown(course)}
                    onMove={() => setMovingCourse(course)}
                    onTogglePublished={() => togglePublished(course)}
                    onToggleFeatured={() => toggleFeatured(course)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Uncategorized Courses */}
      {getUncategorizedCourses().length > 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <BookOpen className="h-5 w-5" />
              Cursos Sem Trilha
            </CardTitle>
            <CardDescription>Estes cursos não estão em nenhuma trilha. Mova-os para uma vitrine.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {getUncategorizedCourses().map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  total={getUncategorizedCourses().length}
                  onMoveUp={() => moveCourseUp(course)}
                  onMoveDown={() => moveCourseDown(course)}
                  onMove={() => setMovingCourse(course)}
                  onTogglePublished={() => togglePublished(course)}
                  onToggleFeatured={() => toggleFeatured(course)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function CourseCard({
  course,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onMove,
  onTogglePublished,
  onToggleFeatured,
}: {
  course: LocalCourse // Used LocalCourse interface here
  index: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
  onMove: () => void
  onTogglePublished: () => void
  onToggleFeatured: () => void
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border bg-card transition-all hover:shadow-md ${
        !course.is_published ? "opacity-60 bg-muted/30" : ""
      } ${course.is_featured ? "border-yellow-500/50 bg-yellow-500/5" : ""}`}
    >
      {/* Reorder controls */}
      <div className="flex flex-col gap-0.5">
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onMoveUp} disabled={index === 0}>
          <ChevronUp className="h-3 w-3" />
        </Button>
        <div className="flex items-center justify-center h-6 w-6">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onMoveDown} disabled={index === total - 1}>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Cover image */}
      {course.cover_image ? (
        <img
          src={course.cover_image || "/placeholder.svg"}
          alt={course.title}
          className="w-12 h-16 object-cover rounded"
        />
      ) : (
        <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
          <Video className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      {/* Course info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{course.title}</h3>
          {course.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>{course.lessons_count} aulas</span>
          <span>•</span>
          <span>{course.duration_hours}h</span>
          <span>•</span>
          <span>Ordem: {course.sort_order}</span>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant={course.is_published ? "default" : "outline"}
          className={`h-8 ${course.is_published ? "bg-green-600 hover:bg-green-700" : ""}`}
          onClick={onTogglePublished}
        >
          {course.is_published ? (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Visível
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Oculto
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant={course.is_featured ? "default" : "outline"}
          className={`h-8 ${course.is_featured ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
          onClick={onToggleFeatured}
        >
          <Star className={`h-3 w-3 ${course.is_featured ? "fill-white" : ""}`} />
        </Button>
        <Button size="sm" variant="outline" className="h-8 bg-transparent" onClick={onMove}>
          <Move className="h-3 w-3 mr-1" />
          Mover
        </Button>
      </div>
    </div>
  )
}

function CoursesTab() {
  const [courses, setCourses] = useState<LocalCourse[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<LocalCourse | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    cover_image: "",
    category_id: "",
    instructor: "",
    duration_hours: 0,
    is_published: false,
    is_featured: false,
    is_orderbump: false,
    orderbump_price: 0,
    orderbump_description: "",
    sort_order: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [coursesData, categoriesData] = await Promise.all([getCourses(), getCategories()])
    setCourses(coursesData)
    setCategories(categoriesData)
  }

  function getCoursesByCategory(categoryId: string) {
    return courses.filter((c) => c.category_id === categoryId).sort((a, b) => a.sort_order - b.sort_order)
  }

  function getCoursesWithoutCategory() {
    return courses.filter((c) => !c.category_id).sort((a, b) => a.sort_order - b.sort_order)
  }

  function toggleCategory(categoryId: string) {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  async function moveCourseUp(course: LocalCourse, categoryCourses: LocalCourse[], index: number) {
    if (index <= 0) return
    const prevCourse = categoryCourses[index - 1]
    const newOrder = prevCourse.sort_order
    const prevOrder = course.sort_order

    await updateCourse(course.id, { sort_order: newOrder })
    await updateCourse(prevCourse.id, { sort_order: prevOrder })
    await loadData()
  }

  async function moveCourseDown(course: LocalCourse, categoryCourses: LocalCourse[], index: number) {
    if (index >= categoryCourses.length - 1) return
    const nextCourse = categoryCourses[index + 1]
    const newOrder = nextCourse.sort_order
    const nextOrder = course.sort_order

    await updateCourse(course.id, { sort_order: newOrder })
    await updateCourse(nextCourse.id, { sort_order: nextOrder })
    await loadData()
  }

  // ... existing code for togglePublished, toggleFeatured, openDialog, handleSubmit, handleDelete ...

  async function togglePublished(course: LocalCourse) {
    await updateCourse(course.id, { is_published: !course.is_published })
    await loadData()
  }

  async function toggleFeatured(course: LocalCourse) {
    await updateCourse(course.id, { is_featured: !course.is_featured })
    await loadData()
  }

  function openDialog(course?: LocalCourse) {
    if (course) {
      setEditingCourse(course)
      setFormData({
        title: course.title,
        slug: course.slug,
        description: course.description || "",
        cover_image: course.cover_image || "",
        category_id: course.category_id || "",
        instructor: course.instructor || "",
        duration_hours: course.duration_hours || 0,
        is_published: course.is_published,
        is_featured: course.is_featured || false,
        is_orderbump: course.is_orderbump || false,
        orderbump_price: course.orderbump_price || 0,
        orderbump_description: course.orderbump_description || "",
        sort_order: course.sort_order,
      })
    } else {
      setEditingCourse(null)
      setFormData({
        title: "",
        slug: "",
        description: "",
        cover_image: "",
        category_id: "",
        instructor: "",
        duration_hours: 0,
        is_published: false,
        is_featured: false,
        is_orderbump: false,
        orderbump_price: 0,
        orderbump_description: "",
        sort_order: courses.length,
      })
    }
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (editingCourse) {
      await updateCourse(editingCourse.id, formData)
    } else {
      await createCourse(formData)
    }
    await loadData()
    setIsDialogOpen(false)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      await deleteCourse(id)
      await loadData()
    }
  }

  function CourseItem({
    course,
    categoryCourses,
    index,
  }: { course: LocalCourse; categoryCourses: LocalCourse[]; index: number }) {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-md ${
          !course.is_published ? "opacity-60 bg-muted/30" : ""
        } ${course.is_featured ? "border-yellow-500/50 bg-yellow-500/5" : ""}`}
      >
        <div className="flex flex-col gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => moveCourseUp(course, categoryCourses, index)}
            disabled={index === 0}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <div className="flex items-center justify-center h-6 w-6 text-xs font-medium text-muted-foreground">
            {index + 1}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => moveCourseDown(course, categoryCourses, index)}
            disabled={index === categoryCourses.length - 1}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        {course.cover_image ? (
          <img
            src={course.cover_image || "/placeholder.svg"}
            alt={course.title}
            className="w-12 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
            <Video className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{course.title}</h3>
            {course.is_featured && <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant={course.is_published ? "default" : "outline"}
            className={`h-8 ${course.is_published ? "bg-green-600 hover:bg-green-700" : ""}`}
            onClick={() => togglePublished(course)}
          >
            {course.is_published ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Visível
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Oculto
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant={course.is_featured ? "default" : "outline"}
            className={`h-8 ${course.is_featured ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
            onClick={() => toggleFeatured(course)}
            title={course.is_featured ? "Somente VIP" : "Para todos"}
          >
            <Crown className={`h-3 w-3 ${course.is_featured ? "fill-white" : ""}`} />
          </Button>
          <Button size="sm" variant="outline" className="h-8 bg-transparent" onClick={() => openDialog(course)}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-red-500 hover:text-red-600 bg-transparent"
            onClick={() => handleDelete(course.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Cursos</CardTitle>
          <CardDescription>Organize seus cursos dentro de cada trilha</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Editar Curso" : "Novo Curso"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category_id">Trilha</Label>
                  <select
                    id="category_id"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    <option value="">Sem trilha</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image">URL da Capa</Label>
                <Input
                  id="cover_image"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição / Links</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  placeholder="Adicione a descrição e links (ex: Link de afiliação: https://...)&#10;Cada link em uma linha nova será clicável"
                />
                <p className="text-xs text-muted-foreground">Links serão automaticamente clicáveis na página da aula</p>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Publicado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Somente VIP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_orderbump"
                    checked={formData.is_orderbump}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_orderbump: checked })}
                  />
                  <Label htmlFor="is_orderbump" className="flex items-center gap-1">
                    <Crown className="h-3 w-3 text-yellow-500" />
                    Orderbump
                  </Label>
                </div>
              </div>

              {formData.is_orderbump && (
                <div className="p-4 border-2 border-yellow-500/30 bg-yellow-500/5 rounded-lg space-y-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                    Configurações de Orderbump - Este curso será vendido separadamente
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderbump_price">Preço (R$)</Label>
                      <Input
                        id="orderbump_price"
                        type="number"
                        step="0.01"
                        value={formData.orderbump_price}
                        onChange={(e) => setFormData({ ...formData, orderbump_price: parseFloat(e.target.value) || 0 })}
                        placeholder="97.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orderbump_description">Descrição do Orderbump</Label>
                      <Input
                        id="orderbump_description"
                        value={formData.orderbump_description}
                        onChange={(e) => setFormData({ ...formData, orderbump_description: e.target.value })}
                        placeholder="Ex: Bônus especial"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Trilhas com cursos */}
          {categories.map((category) => {
            const categoryCourses = getCoursesByCategory(category.id)
            const isExpanded = expandedCategories.has(category.id)

            return (
              <div key={category.id} className="border rounded-lg overflow-hidden">
                {/* Header da trilha - clicável */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted transition-colors text-left"
                >
                  <div className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {categoryCourses.length} {categoryCourses.length === 1 ? "curso" : "cursos"}
                    </p>
                  </div>
                  {!category.is_active && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">Oculta</span>
                  )}
                </button>

                {/* Lista de cursos dentro da trilha */}
                {isExpanded && (
                  <div className="p-3 space-y-2 bg-background">
                    {categoryCourses.length > 0 ? (
                      categoryCourses.map((course, index) => (
                        <CourseItem key={course.id} course={course} categoryCourses={categoryCourses} index={index} />
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">Nenhum curso nesta trilha</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Cursos sem trilha */}
          {getCoursesWithoutCategory().length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory("no-category")}
                className="w-full flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div className={`transition-transform ${expandedCategories.has("no-category") ? "rotate-90" : ""}`}>
                  <ChevronRight className="h-5 w-5" />
                </div>
                <FolderOpen className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <h3 className="font-semibold text-muted-foreground">Sem Trilha</h3>
                  <p className="text-sm text-muted-foreground">
                    {getCoursesWithoutCategory().length} {getCoursesWithoutCategory().length === 1 ? "curso" : "cursos"}
                  </p>
                </div>
              </button>

              {expandedCategories.has("no-category") && (
                <div className="p-3 space-y-2 bg-background">
                  {getCoursesWithoutCategory().map((course, index) => (
                    <CourseItem
                      key={course.id}
                      course={course}
                      categoryCourses={getCoursesWithoutCategory()}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {courses.length === 0 && categories.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Crie uma trilha primeiro e depois adicione cursos</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    sort_order: 0,
    is_active: true,
  })

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const data = await getCategories()
    setCategories(data.sort((a: Category, b: Category) => a.sort_order - b.sort_order))
  }

  async function moveCategoryUp(category: Category, index: number) {
    if (index <= 0) return
    const prevCategory = categories[index - 1]
    const newOrder = prevCategory.sort_order
    const prevOrder = category.sort_order

    await updateCategory(category.id, { sort_order: newOrder })
    await updateCategory(prevCategory.id, { sort_order: prevOrder })
    await loadCategories()
  }

  async function moveCategoryDown(category: Category, index: number) {
    if (index >= categories.length - 1) return
    const nextCategory = categories[index + 1]
    const newOrder = nextCategory.sort_order
    const nextOrder = category.sort_order

    await updateCategory(category.id, { sort_order: newOrder })
    await updateCategory(nextCategory.id, { sort_order: nextOrder })
    await loadCategories()
  }

  async function toggleActive(category: Category) {
    await updateCategory(category.id, { is_active: !category.is_active })
    await loadCategories()
  }

  function openDialog(category?: Category) {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        sort_order: category.sort_order,
        is_active: category.is_active,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: "",
        slug: "",
        description: "",
        sort_order: categories.length + 1,
        is_active: true,
      })
    }
    setIsDialogOpen(true)
  }

  function handleNameChange(name: string) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setFormData({ ...formData, name, slug })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData)
      } else {
        await createCategory(formData)
      }
      await loadCategories()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar trilha:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta trilha? Os cursos vinculados ficarão sem categoria.")) return
    setLoading(true)
    try {
      await deleteCategory(id)
      await loadCategories()
    } catch (error) {
      console.error("Erro ao excluir trilha:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciar Trilhas/Vitrines</CardTitle>
          <CardDescription>Crie trilhas para organizar seus cursos em seções</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Trilha
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Trilha" : "Nova Trilha"}</DialogTitle>
              <DialogDescription>
                Trilhas são como seções na área de cursos (ex: "Trilha do 0 a 10K", "Agentes IA", "Imersões")
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Trilha</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Trilha do 0 a 10K"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição da trilha"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Posição na Página</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number.parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">Trilhas com número menor aparecem primeiro</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Trilha Ativa</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-md ${
                !category.is_active ? "opacity-60 bg-muted/30" : ""
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => moveCategoryUp(category, index)}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <div className="flex items-center justify-center h-6 w-6">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => moveCategoryDown(category, index)}
                  disabled={index === categories.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>

              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Layers className="h-5 w-5 text-blue-500" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{category.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{category.description || "Sem descrição"}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant={category.is_active ? "default" : "outline"}
                  className={`h-8 ${category.is_active ? "bg-green-600 hover:bg-green-700" : ""}`}
                  onClick={() => toggleActive(category)}
                >
                  {category.is_active ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Visível
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Oculta
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" className="h-8 bg-transparent" onClick={() => openDialog(category)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-red-500 hover:text-red-600 bg-transparent"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma trilha criada</p>
              <p className="text-sm">Crie trilhas para organizar seus cursos em seções</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function LessonsTab() {
  const [courses, setCourses] = useState<LocalCourse[]>([]) // Used LocalCourse interface here
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(false)

  // Removed the links state and related functions as per the update
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    video_type: "youtube",
    duration_minutes: 0,
    sort_order: 1,
    is_free: false,
    is_published: true,
  })

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      loadLessons()
    }
  }, [selectedCourse])

  async function loadCourses() {
    const data = await getCourses()
    setCourses(data)
  }

  async function loadLessons() {
    if (!selectedCourse) return
    // Fixed: Call getLessonsByCourse correctly
    const data = await getLessonsByCourse(selectedCourse)
    setLessons(data.sort((a: Lesson, b: Lesson) => a.sort_order - b.sort_order))
  }

  async function moveLessonUp(lesson: Lesson, index: number) {
    if (index <= 0) return
    const prevLesson = lessons[index - 1]
    const newOrder = prevLesson.sort_order
    const prevOrder = lesson.sort_order

    await updateLesson(lesson.id, { sort_order: newOrder })
    await updateLesson(prevLesson.id, { sort_order: prevOrder })
    await loadLessons()
  }

  async function moveLessonDown(lesson: Lesson, index: number) {
    if (index >= lessons.length - 1) return
    const nextLesson = lessons[index + 1]
    const newOrder = nextLesson.sort_order
    const nextOrder = lesson.sort_order

    await updateLesson(lesson.id, { sort_order: newOrder })
    await updateLesson(nextLesson.id, { sort_order: nextOrder })
    await loadLessons()
  }

  async function togglePublished(lesson: Lesson) {
    await updateLesson(lesson.id, { is_published: !lesson.is_published })
    await loadLessons()
  }

  async function toggleFree(lesson: Lesson) {
    await updateLesson(lesson.id, { is_free: !lesson.is_free })
    await loadLessons()
  }

  function openDialog(lesson?: Lesson) {
    if (lesson) {
      setEditingLesson(lesson)
      setFormData({
        title: lesson.title,
        description: lesson.description || "",
        video_url: lesson.video_url || "",
        video_type: lesson.video_type,
        duration_minutes: lesson.duration_minutes,
        sort_order: lesson.sort_order,
        is_free: lesson.is_free,
        is_published: lesson.is_published,
      })
      // Removed link initialization
    } else {
      setEditingLesson(null)
      setFormData({
        title: "",
        description: "",
        video_url: "",
        video_type: "youtube",
        duration_minutes: 0,
        sort_order: lessons.length + 1,
        is_free: false,
        is_published: true,
      })
      // Removed link initialization
    }
    setIsDialogOpen(true)
  }

  // Removed addLink, removeLink functions

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Removed attachments logic
      const dataToSave = {
        ...formData,
      }

      if (editingLesson) {
        await updateLesson(editingLesson.id, dataToSave)
      } else {
        await createLesson(selectedCourse, dataToSave)
      }
      await loadLessons()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar aula:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) return
    setLoading(true)
    try {
      await deleteLesson(id)
      await loadLessons()
    } catch (error) {
      console.error("Erro ao excluir aula:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Gerenciar Aulas</CardTitle>
            <CardDescription>Selecione um curso e gerencie suas aulas</CardDescription>
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Selecione um curso..." />
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
      </CardHeader>
      <CardContent>
        {!selectedCourse ? (
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Selecione um curso para gerenciar suas aulas</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Aula
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingLesson ? "Editar Aula" : "Nova Aula"}</DialogTitle>
                    <DialogDescription>Preencha os dados da aula</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    {/* Substituir textarea por RichTextEditor no formulário de aulas */}
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <RichTextEditor
                        value={formData.description}
                        onChange={(value) => setFormData({ ...formData, description: value })}
                        placeholder="Digite a descrição da aula. Selecione texto para formatar ou adicionar links..."
                      />
                    </div>

                    {/* Remover a seção de Links (Afiliação, Drive, etc.) que foi adicionada anteriormente */}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="video_url">URL do Vídeo</Label>
                        <Input
                          id="video_url"
                          value={formData.video_url}
                          onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="video_type">Tipo de Vídeo</Label>
                        <Select
                          value={formData.video_type}
                          onValueChange={(value) => setFormData({ ...formData, video_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="vimeo">Vimeo</SelectItem>
                            <SelectItem value="panda">Panda Video</SelectItem>
                            <SelectItem value="external">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration_minutes">Duração (minutos)</Label>
                        <Input
                          id="duration_minutes"
                          type="number"
                          value={formData.duration_minutes}
                          onChange={(e) =>
                            setFormData({ ...formData, duration_minutes: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sort_order">Ordem</Label>
                        <Input
                          id="sort_order"
                          type="number"
                          value={formData.sort_order}
                          onChange={(e) =>
                            setFormData({ ...formData, sort_order: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_published"
                          checked={formData.is_published}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                        />
                        <Label htmlFor="is_published">Publicada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_free"
                          checked={formData.is_free}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
                        />
                        <Label htmlFor="is_free">Gratuita (acesso livre)</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-md ${
                    !lesson.is_published ? "opacity-60 bg-muted/30" : ""
                  } ${lesson.is_free ? "border-green-500/50 bg-green-500/5" : ""}`}
                >
                  <div className="flex flex-col gap-0.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => moveLessonUp(lesson, index)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <div className="flex items-center justify-center h-6 w-6">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => moveLessonDown(lesson, index)}
                      disabled={index === lessons.length - 1}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{lesson.title}</h3>
                      {lesson.is_free && <Badge className="bg-green-600 text-xs">Grátis</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{lesson.duration_minutes} min</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant={lesson.is_published ? "default" : "outline"}
                      className={`h-8 ${lesson.is_published ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() => togglePublished(lesson)}
                    >
                      {lesson.is_published ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Visível
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Oculta
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={lesson.is_free ? "default" : "outline"}
                      className={`h-8 ${lesson.is_free ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      onClick={() => toggleFree(lesson)}
                      title={lesson.is_free ? "Aula Gratuita" : "Aula Paga"}
                    >
                      <Star className={`h-3 w-3 ${lesson.is_free ? "fill-white" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 bg-transparent"
                      onClick={() => openDialog(lesson)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-red-500 hover:text-red-600 bg-transparent"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {lessons.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma aula cadastrada</p>
                  <p className="text-sm">Clique em "Nova Aula" para adicionar</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PlansTab() {
  const [plans, setPlans] = useState<Plan[]>([]) // Used LocalCourse interface here
  const [courses, setCourses] = useState<LocalCourse[]>([]) // Used LocalCourse interface here
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [planAccess, setPlanAccess] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedPlan) {
      loadPlanAccess()
    }
  }, [selectedPlan])

  async function loadData() {
    const [plansData, coursesData] = await Promise.all([getPlans(), getCourses()])
    setPlans(plansData)
    setCourses(coursesData)
  }

  async function loadPlanAccess() {
    if (!selectedPlan) return
    const access = await getPlanCourseAccess(selectedPlan)
    setPlanAccess(access.map((a: any) => a.course_id))
  }

  async function toggleCourseAccess(courseId: string) {
    setLoading(true)
    const newAccess = planAccess.includes(courseId)
      ? planAccess.filter((id) => id !== courseId)
      : [...planAccess, courseId]

    await updatePlanCourseAccess(selectedPlan, newAccess)
    setPlanAccess(newAccess)
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso por Plano</CardTitle>
        <CardDescription>Configure quais cursos cada plano pode acessar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
          <SelectTrigger className="w-full md:w-96">
            <SelectValue placeholder="Selecione um plano..." />
          </SelectTrigger>
          <SelectContent>
            {plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name} - R${plan.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedPlan && (
          <div className="space-y-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  planAccess.includes(course.id) ? "border-green-500/50 bg-green-500/5" : "hover:bg-muted/50"
                }`}
                onClick={() => toggleCourseAccess(course.id)}
              >
                <div className="flex items-center gap-3">
                  <Switch checked={planAccess.includes(course.id)} disabled={loading} />
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.category?.name || "Sem trilha"}</p>
                  </div>
                </div>
                {planAccess.includes(course.id) && (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/30">Liberado</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
