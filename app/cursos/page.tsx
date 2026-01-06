"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CoursesHeader } from "@/components/courses/courses-header"
import { CourseCarousel } from "@/components/courses/course-carousel"
import { UpgradeModal } from "@/components/courses/upgrade-modal"
import { RankingBanner } from "@/components/ranking/ranking-banner"
import { IntroVideoModal } from "@/components/courses/intro-video-modal"
import { useUserPlan } from "@/hooks/use-user-plan"
import { getCoursesGroupedByCategory, type Course, type CourseCategory } from "@/lib/courses-api"
import { Loader2, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CursosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [courseGroups, setCourseGroups] = useState<{ category: CourseCategory; courses: Course[] }[]>([])
  const [loading, setLoading] = useState(true)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [lockedCourse, setLockedCourse] = useState<string>()
  const [introModalOpen, setIntroModalOpen] = useState(false)
  const [hasSeenIntro, setHasSeenIntro] = useState(true)

  const { plan, loading: planLoading } = useUserPlan()

  useEffect(() => {
    async function loadData() {
      try {
        const groupsData = await getCoursesGroupedByCategory()
        setCourseGroups(groupsData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const introSeen = localStorage.getItem("afilia360_intro_seen")
    if (!introSeen) {
      setHasSeenIntro(false)
      setIntroModalOpen(true)
    }
  }, [])

  const handleLockedCourse = (courseTitle: string) => {
    setLockedCourse(courseTitle)
    setUpgradeModalOpen(true)
  }

  const handleIntroComplete = () => {
    setHasSeenIntro(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <RankingBanner />

      <CoursesHeader userPlan={plan} />

      <main className="py-8 space-y-8">
        {loading || planLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : courseGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum curso disponível</h2>
            <p className="text-muted-foreground mb-6">Os cursos estão sendo preparados. Volte em breve!</p>
            <Link href="/">
              <Button>Voltar ao Marketplace</Button>
            </Link>
          </div>
        ) : (
          // Carrosséis por categoria (trilha)
          courseGroups.map((group) => (
            <CourseCarousel
              key={group.category.id}
              category={group.category}
              courses={group.courses}
              userPlan={plan}
              onLockedCourse={handleLockedCourse}
            />
          ))
        )}
      </main>

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        currentPlan={plan}
        lockedCourseTitle={lockedCourse}
      />

      <IntroVideoModal open={introModalOpen} onOpenChange={setIntroModalOpen} onComplete={handleIntroComplete} />
    </div>
  )
}
