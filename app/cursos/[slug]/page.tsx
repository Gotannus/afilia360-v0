"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { VideoPlayer } from "@/components/courses/video-player"
import { LessonList } from "@/components/courses/lesson-list"
import { LessonContent } from "@/components/courses/lesson-content"
import { LessonProgressButton } from "@/components/courses/lesson-progress-button"
import { UpgradeModal } from "@/components/courses/upgrade-modal"
import { useUserPlan } from "@/hooks/use-user-plan"
import {
  getCourseBySlug,
  getCourseLessons,
  getUserCourseProgress,
  saveLessonProgress,
  type Course,
  type CourseLesson,
  type UserLessonProgress,
} from "@/lib/courses-api"
import { getSession } from "@/lib/auth"
import { Loader2, Clock, BookOpen, User, ChevronRight, Lock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<CourseLesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null)
  const [progress, setProgress] = useState<UserLessonProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  const { plan, hasAccess: checkAccess, isVip, loading: planLoading } = useUserPlan()

  useEffect(() => {
    async function loadCourse() {
      try {
        const courseData = await getCourseBySlug(slug)
        if (!courseData) {
          router.push("/cursos")
          return
        }

        setCourse(courseData)

        const lessonsData = await getCourseLessons(courseData.id)
        setLessons(lessonsData)

        if (lessonsData.length > 0) {
          setCurrentLesson(lessonsData[0])
        }

        const session = getSession()
        if (session?.id) {
          const progressData = await getUserCourseProgress(session.id, courseData.id)
          setProgress(progressData)
        }
      } catch (error) {
        console.error("Erro ao carregar curso:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [slug, router])

  useEffect(() => {
    async function verifyAccess() {
      if (planLoading || !course) return

      if (isVip) {
        setHasAccess(true)
        return
      }

      const access = await checkAccess(course.id)
      setHasAccess(access)
    }

    verifyAccess()
  }, [course, planLoading, isVip, checkAccess])

  const handleSelectLesson = (lesson: CourseLesson) => {
    setCurrentLesson(lesson)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLessonProgress = async (percent: number) => {
    const session = getSession()
    if (!session?.id || !currentLesson || !course) return

    const isAutoComplete = percent >= 70
    await saveLessonProgress(session.id, currentLesson.id, course.id, Math.round(percent), isAutoComplete)

    if (isAutoComplete) {
      setProgress((prev) => {
        const existing = prev.find((p) => p.lesson_id === currentLesson.id)
        if (existing) {
          return prev.map((p) =>
            p.lesson_id === currentLesson.id ? { ...p, completed: true, progress_percent: Math.round(percent) } : p,
          )
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            user_id: session.id,
            lesson_id: currentLesson.id,
            course_id: course.id,
            completed: true,
            progress_percent: Math.round(percent),
            last_watched_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          },
        ]
      })
    }
  }

  const goToNextLesson = () => {
    if (!currentLesson) return
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id)
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1]
      setCurrentLesson(nextLesson)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleMarkComplete = async () => {
    const session = getSession()
    if (!session?.id || !currentLesson || !course) return

    await saveLessonProgress(session.id, currentLesson.id, course.id, 100, true)

    setProgress((prev) => {
      const existing = prev.find((p) => p.lesson_id === currentLesson.id)
      if (existing) {
        return prev.map((p) =>
          p.lesson_id === currentLesson.id ? { ...p, completed: true, progress_percent: 100 } : p,
        )
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          user_id: session.id,
          lesson_id: currentLesson.id,
          course_id: course.id,
          completed: true,
          progress_percent: 100,
          last_watched_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
      ]
    })

    setTimeout(() => goToNextLesson(), 500)
  }

  const handleLessonComplete = async () => {
    const session = getSession()
    if (!session?.id || !currentLesson || !course) return

    await saveLessonProgress(session.id, currentLesson.id, course.id, 100, true)

    setProgress((prev) => {
      const existing = prev.find((p) => p.lesson_id === currentLesson.id)
      if (existing) {
        return prev.map((p) =>
          p.lesson_id === currentLesson.id ? { ...p, completed: true, progress_percent: 100 } : p,
        )
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          user_id: session.id,
          lesson_id: currentLesson.id,
          course_id: course.id,
          completed: true,
          progress_percent: 100,
          last_watched_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
      ]
    })

    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id)
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1])
    }
  }

  const completedLessons = progress.filter((p) => p.completed).length
  const overallProgress = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0
  const currentLessonProgress = progress.find((p) => p.lesson_id === currentLesson?.id)

  const currentIndex = currentLesson ? lessons.findIndex((l) => l.id === currentLesson.id) : -1
  const hasNextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1

  if (loading || planLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className="border-b border-border bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-1 text-muted-foreground hover:text-foreground -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href="/cursos" className="text-muted-foreground hover:text-foreground transition-colors">
                Cursos
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium truncate">{course.title}</span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-4xl px-4 py-12">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30">
              <Lock className="h-12 w-12 text-red-500" />
            </div>

            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {course.title}
            </h1>

            <p className="text-foreground/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {course.description || "Este curso está disponível apenas para membros Super VIP"}
            </p>

            {course.cover_image && (
              <div className="relative aspect-video max-w-2xl mx-auto mb-8 rounded-xl overflow-hidden opacity-60 border-2 border-border">
                <Image
                  src={course.cover_image || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="flex items-center justify-center gap-6 text-base mb-10 flex-wrap">
              {course.instructor && (
                <span className="flex items-center gap-2 text-foreground/90 bg-card/50 px-4 py-2 rounded-full border border-border">
                  <User className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{course.instructor}</span>
                </span>
              )}
              {course.duration_hours > 0 && (
                <span className="flex items-center gap-2 text-foreground/90 bg-card/50 px-4 py-2 rounded-full border border-border">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{course.duration_hours}h</span>
                </span>
              )}
              {course.lessons_count > 0 && (
                <span className="flex items-center gap-2 text-foreground/90 bg-card/50 px-4 py-2 rounded-full border border-border">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">{course.lessons_count} aulas</span>
                </span>
              )}
            </div>

            <Button
              size="lg"
              onClick={() => setUpgradeModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Fazer Upgrade para Acessar
            </Button>

            <p className="mt-4 text-sm text-muted-foreground">Desbloqueie agora e comece a aprender em segundos</p>
          </div>
        </main>

        <UpgradeModal
          open={upgradeModalOpen}
          onOpenChange={setUpgradeModalOpen}
          currentPlan={plan}
          lockedCourseTitle={course.title}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-1 text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/cursos" className="text-muted-foreground hover:text-foreground transition-colors">
              Cursos
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium truncate">{course.title}</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {currentLesson && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h1 className="text-lg md:text-xl font-bold">{currentLesson.title}</h1>
              </div>
            )}

            {currentLesson?.video_url ? (
              <VideoPlayer
                videoUrl={currentLesson.video_url}
                videoType={currentLesson.video_type as any}
                title={currentLesson.title}
                onProgress={handleLessonProgress}
                onComplete={handleLessonComplete}
              />
            ) : (
              <div className="aspect-video rounded-xl bg-card border border-border flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Selecione uma aula para começar</p>
                </div>
              </div>
            )}

            {currentLesson && (
              <div className="rounded-xl border border-border bg-card p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-sm font-semibold text-muted-foreground">Descrição da Aula</h3>
                  <div className="flex items-center gap-2">
                    <LessonProgressButton
                      isCompleted={currentLessonProgress?.completed || false}
                      progressPercent={currentLessonProgress?.progress_percent}
                      onMarkComplete={handleMarkComplete}
                    />
                    {hasNextLesson && (
                      <Button variant="outline" size="sm" onClick={goToNextLesson} className="gap-1 bg-transparent">
                        Próxima
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {currentLesson.description && (
                  <div
                    className="text-sm md:text-base text-muted-foreground prose prose-sm max-w-none break-words overflow-hidden [&_a]:text-primary [&_a]:underline [&_a]:cursor-pointer [&_a]:pointer-events-auto [&_a]:hover:text-primary/80 [&_a]:transition-colors"
                    dangerouslySetInnerHTML={{ __html: currentLesson.description }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement
                      if (target.tagName === "A") {
                        const href = target.getAttribute("href")
                        if (href) {
                          e.preventDefault()
                          window.open(href, "_blank", "noopener,noreferrer")
                        }
                      }
                    }}
                  />
                )}
              </div>
            )}

            {currentLesson && (
              <LessonContent
                content={(currentLesson as any).content_text}
                contentHtml={(currentLesson as any).content_html}
                attachments={currentLesson.attachments}
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card overflow-hidden p-4">
              <h2 className="font-semibold mb-4">{course.title}</h2>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                {course.instructor && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {course.instructor}
                  </span>
                )}
                {course.duration_hours > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration_hours}h
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {completedLessons} de {lessons.length} aulas concluídas
                </p>
              </div>
            </div>

            <LessonList
              lessons={lessons}
              currentLessonId={currentLesson?.id}
              progress={progress}
              hasAccess={isVip || hasAccess}
              onSelectLesson={handleSelectLesson}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
