"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GraduationCap, Play, Rocket, BookOpen, Trophy, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface IntroVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function IntroVideoModal({ open, onOpenChange, onComplete }: IntroVideoModalProps) {
  const [showVideo, setShowVideo] = useState(false)
  const [videoUrl, setVideoUrl] = useState("https://www.youtube-nocookie.com/embed/Q1qxV19v5nE")

  useEffect(() => {
    async function loadConfig() {
      const supabase = createClient()
      const { data } = await supabase.from("site_config").select("value").eq("key", "intro_video_url").single()

      if (data?.value) {
        setVideoUrl(data.value)
      }
    }
    loadConfig()
  }, [])

  const handleStartVideo = () => {
    setShowVideo(true)
  }

  const handleComplete = () => {
    localStorage.setItem("afilia360_intro_seen", "true")
    onComplete()
    onOpenChange(false)
  }

  const handleSkip = () => {
    localStorage.setItem("afilia360_intro_seen", "true")
    onComplete()
    onOpenChange(false)
  }

  // Converte URL do YouTube para embed
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`
    }
    if (url.includes("youtube-nocookie.com/embed") || url.includes("youtube.com/embed")) {
      return url.includes("?") ? url + "&autoplay=1" : url + "?autoplay=1&modestbranding=1&rel=0"
    }
    return url
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <GraduationCap className="h-6 w-6 text-primary" />
            Bem-vindo à Área de Cursos!
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {!showVideo ? (
            <div className="text-center py-4">
              {/* Ícone principal */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 mb-4">
                  <Rocket className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Antes de começar...</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Assista este vídeo rápido de introdução para entender como aproveitar ao máximo nossos cursos e
                  trilhas de aprendizado.
                </p>
              </div>

              {/* Benefícios */}
              <div className="grid grid-cols-3 gap-4 mb-6 px-4">
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                  <span className="text-xs text-gray-300 text-center">Cursos Exclusivos</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <span className="text-xs text-gray-300 text-center">Certificados</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <Users className="h-6 w-6 text-emerald-400" />
                  <span className="text-xs text-gray-300 text-center">Comunidade</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button size="lg" onClick={handleStartVideo} className="gap-2 bg-primary hover:bg-primary/90">
                  <Play className="h-5 w-5" />
                  Assistir Introdução
                </Button>
                <div>
                  <Button variant="ghost" size="sm" onClick={handleSkip} className="text-gray-500 hover:text-gray-300">
                    Pular por agora
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <iframe
                  src={getEmbedUrl(videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">Você pode assistir novamente na página de configurações.</p>
                <Button onClick={handleComplete} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  Entendi, vamos começar!
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
