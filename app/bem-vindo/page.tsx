"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Rocket, GraduationCap, ArrowRight, Play, CheckCircle, Sparkles, Target, Zap } from "lucide-react"
import { Header } from "@/components/header"
import { getSession, setSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"

export default function WelcomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showVideo, setShowVideo] = useState(false)
  const [videoWatched, setVideoWatched] = useState(false)
  const [introVideoUrl, setIntroVideoUrl] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadConfig() {
      const supabase = createClient()
      const { data } = await supabase.from("site_config").select("value").eq("key", "intro_video_url").single()

      if (data?.value) {
        setIntroVideoUrl(data.value)
      }
    }
    loadConfig()
  }, [])

  const handlePathChoice = async (path: "iniciante" | "experiente") => {
    const session = getSession()
    if (session) {
      // Marcar que o usuário já viu o guia
      const supabase = createClient()
      await supabase.from("affiliates").update({ onboarding_completed: true }).eq("id", session.id)

      // Atualizar sessão local
      setSession({ ...session, onboarding_completed: true })
    }

    if (path === "iniciante") {
      router.push("/cursos/metodo-afilia360")
    } else {
      router.push("/")
    }
  }

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be") ? url.split("/").pop() : new URL(url).searchParams.get("v")
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    if (url.includes("pandavideo")) {
      return url
    }
    return url
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Header de Boas-vindas */}
        <div className="text-center mb-8 md:mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-amber-500/30 border-2 border-primary/50">
            <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Bem-vindo ao AFILIA360!</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Estamos muito felizes em ter você aqui. Antes de começar, assista o vídeo de boas-vindas e escolha a trilha
            ideal para o seu nível de experiência.
          </p>
        </div>

        {/* Vídeo de Boas-vindas */}
        <div className="mb-8 md:mb-12">
          <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-amber-500/5 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Play className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Vídeo de Boas-vindas</h2>
              {videoWatched && (
                <span className="ml-auto flex items-center gap-1 text-emerald-500 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Assistido
                </span>
              )}
            </div>

            {!showVideo ? (
              <button
                onClick={() => {
                  setShowVideo(true)
                  setTimeout(() => setVideoWatched(true), 5000) // Marca como assistido após 5s
                }}
                className="relative w-full aspect-video rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden group"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Play className="h-8 w-8 md:h-10 md:w-10 text-primary fill-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Clique para assistir</span>
                  </div>
                </div>
              </button>
            ) : (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                {introVideoUrl && (
                  <iframe
                    src={getVideoEmbedUrl(introVideoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Escolha de Trilha */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">Escolha sua Trilha</h2>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Selecione o caminho que melhor se encaixa no seu momento atual
          </p>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Opção Iniciante */}
            <button
              onClick={() => handlePathChoice("iniciante")}
              className="group relative rounded-xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-6 text-left transition-all hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <GraduationCap className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Estou Começando do Zero</h3>
                  <p className="text-xs text-emerald-400">Curso: Método AFILIA360</p>
                </div>
              </div>

              <ul className="space-y-2 mb-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  Nunca trabalhei com tráfego pago
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  Não tenho conta em plataformas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  Preciso aprender desde o básico
                </li>
              </ul>

              <div className="flex items-center gap-2 text-emerald-400 font-medium group-hover:gap-3 transition-all">
                Começar do Zero
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            {/* Opção Experiente */}
            <button
              onClick={() => handlePathChoice("experiente")}
              className="group relative rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-600/5 p-6 text-left transition-all hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                  <Rocket className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Já Tenho Experiência</h3>
                  <p className="text-xs text-amber-400">Ir para o Marketplace</p>
                </div>
              </div>

              <ul className="space-y-2 mb-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  Já tenho BM ou conta de anúncios
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  Entendo o básico de hospedagem
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  Quero ir direto para as campanhas
                </li>
              </ul>

              <div className="flex items-center gap-2 text-amber-400 font-medium group-hover:gap-3 transition-all">
                Ir para Campanhas
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>

        {/* Info adicional */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold text-sm mb-1">Produtos Validados</h4>
            <p className="text-xs text-muted-foreground">Acesse produtos testados e aprovados</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Zap className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm mb-1">Estratégias Prontas</h4>
            <p className="text-xs text-muted-foreground">Receba estratégias para cada produto</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <GraduationCap className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-semibold text-sm mb-1">Cursos Completos</h4>
            <p className="text-xs text-muted-foreground">Aprenda passo a passo do zero</p>
          </div>
        </div>

        {/* Botão para pular */}
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Pular e ir para o Marketplace
          </button>
        </div>
      </div>
    </div>
  )
}
