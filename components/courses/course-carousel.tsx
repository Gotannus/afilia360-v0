"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseCard } from "./course-card"
import type { Course, CourseCategory, MemberPlan } from "@/lib/courses-api"

interface CourseCarouselProps {
  category: CourseCategory
  courses: Course[]
  userPlan?: MemberPlan | null
  onLockedCourse?: (courseTitle: string) => void
}

export function CourseCarousel({ category, courses, userPlan, onLockedCourse }: CourseCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (courses.length === 0) return null

  return (
    <section className="relative group">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-4 md:px-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
          {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 z-10 hidden h-full w-12 -translate-y-1/2 rounded-none bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity group-hover:opacity-100 md:flex"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        {/* Scrollable Area */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide md:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              hasAccess={true}
              onLockedClick={() => onLockedCourse?.(course.title)}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 z-10 hidden h-full w-12 -translate-y-1/2 rounded-none bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity group-hover:opacity-100 md:flex"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </section>
  )
}
