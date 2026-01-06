"use client"

import { Play, CheckCircle2, Lock, Clock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CourseLesson, UserLessonProgress } from "@/lib/courses-api"

interface LessonListProps {
  lessons: CourseLesson[]
  currentLessonId?: string
  progress?: UserLessonProgress[]
  hasAccess?: boolean
  onSelectLesson: (lesson: CourseLesson) => void
}

export function LessonList({
  lessons,
  currentLessonId,
  progress = [],
  hasAccess = true,
  onSelectLesson,
}: LessonListProps) {
  const getLessonProgress = (lessonId: string) => {
    return progress.find((p) => p.lesson_id === lessonId)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4 bg-gradient-to-r from-card to-card/50">
        <h3 className="font-semibold text-foreground">Conteúdo do Curso</h3>
        <p className="text-sm text-muted-foreground">{lessons.length} aulas</p>
      </div>

      <div className="divide-y divide-border">
        {lessons.map((lesson, index) => {
          const lessonProgress = getLessonProgress(lesson.id)
          const isCompleted = lessonProgress?.completed
          const isCurrent = lesson.id === currentLessonId
          const canAccess = hasAccess || lesson.is_free

          return (
            <button
              key={lesson.id}
              onClick={() => canAccess && onSelectLesson(lesson)}
              disabled={!canAccess}
              className={cn(
                "flex w-full items-start gap-3 p-4 text-left transition-colors",
                isCurrent && "bg-primary/10",
                canAccess && !isCurrent && "hover:bg-secondary/50",
                !canAccess && "cursor-not-allowed opacity-50",
              )}
            >
              {/* Number / Status Icon */}
              <div
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium",
                  isCompleted
                    ? "bg-green-500/20 text-green-500 border border-green-500/30"
                    : isCurrent
                      ? "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md"
                      : !canAccess
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "bg-secondary text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : !canAccess ? (
                  <Lock className="h-4 w-4" />
                ) : isCurrent ? (
                  <Play className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={cn(
                      "text-sm font-medium line-clamp-2",
                      isCurrent && "text-primary font-semibold",
                      !canAccess && "text-muted-foreground",
                    )}
                  >
                    {lesson.title}
                  </h4>
                  {/* Badge "Grátis" */}
                  {lesson.is_free && !hasAccess && (
                    <span className="flex-shrink-0 rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-bold text-green-500 border border-green-500/30">
                      Grátis
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  {lesson.duration_minutes > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      {formatDuration(lesson.duration_minutes)}
                    </span>
                  )}
                  {lesson.attachments && lesson.attachments.length > 0 && (
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-purple-500" />
                      {lesson.attachments.length} anexo(s)
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                {lessonProgress && !isCompleted && lessonProgress.progress_percent > 0 && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all shadow-sm"
                      style={{ width: `${lessonProgress.progress_percent}%` }}
                    />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
