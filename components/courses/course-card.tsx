"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Play, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Course } from "@/lib/courses-api"

interface CourseCardProps {
  course: Course
  hasAccess?: boolean
  progress?: number
  onLockedClick?: () => void
}

export function CourseCard({ course, hasAccess = true, progress = 0, onLockedClick }: CourseCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!hasAccess) {
      e.preventDefault()
      onLockedClick?.()
    }
  }

  return (
    <Link
      href={hasAccess ? `/cursos/${course.slug}` : "#"}
      onClick={handleClick}
      className={cn(
        "group relative block aspect-[3/4] w-[60vw] max-w-[200px] md:w-[180px] flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300",
        hasAccess ? "cursor-pointer hover:scale-105 hover:z-10" : "cursor-not-allowed opacity-70",
      )}
    >
      {/* Cover Image */}
      <div className="absolute inset-0">
        {course.cover_image ? (
          <Image
            src={course.cover_image || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-contain bg-black/20"
            sizes="(max-width: 768px) 60vw, 180px"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
      </div>

      {/* Lock Overlay with more vibrant red gradient */}
      {!hasAccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-950/80 to-black/80">
          <div className="rounded-full bg-red-600/30 p-4 backdrop-blur-sm border-2 border-red-500/50">
            <Lock className="h-7 w-7 text-red-400" />
          </div>
        </div>
      )}

      {/* Progress Bar with more vibrant color */}
      {hasAccess && progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted/50">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all shadow-lg shadow-green-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Play Button with more vibrant color */}
      {hasAccess && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-gradient-to-br from-red-600 to-red-700 p-4 shadow-xl shadow-red-600/50">
            <Play className="h-6 w-6 fill-white text-white" />
          </div>
        </div>
      )}
    </Link>
  )
}
