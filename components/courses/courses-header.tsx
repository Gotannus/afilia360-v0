"use client"

import Link from "next/link"
import { Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MemberPlan } from "@/lib/courses-api"

interface CoursesHeaderProps {
  userPlan?: MemberPlan | null
}

export function CoursesHeader({ userPlan }: CoursesHeaderProps) {
  const isVip = userPlan?.slug === "super-vip"

  if (!userPlan) {
    return null
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
        <div className="flex items-center justify-end gap-3">
          {/* Plan Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                isVip
                  ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {isVip ? <Crown className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              <span className="font-semibold">{userPlan.name}</span>
            </div>

            {!isVip && (
              <Link href="#upgrade">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10 bg-transparent"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade VIP
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
