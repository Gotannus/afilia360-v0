"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LessonProgressButtonProps {
  isCompleted: boolean
  progressPercent?: number
  onMarkComplete: () => Promise<void>
  onMarkIncomplete?: () => Promise<void>
}

export function LessonProgressButton({
  isCompleted,
  progressPercent = 0,
  onMarkComplete,
  onMarkIncomplete,
}: LessonProgressButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      if (isCompleted && onMarkIncomplete) {
        await onMarkIncomplete()
      } else {
        await onMarkComplete()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isCompleted ? "outline" : "default"}
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "gap-2 transition-all",
        isCompleted
          ? "border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400"
          : "bg-green-600 hover:bg-green-700 text-white",
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {isCompleted ? "Aula Concluída" : "Marcar como Concluída"}
    </Button>
  )
}
