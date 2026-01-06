"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Zap, CheckCircle2, Star, Sparkles, Shield, Clock } from "lucide-react"

export default function AulaGratuitaPage() {
  const [showOffer, setShowOffer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos em segundos

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOffer(true)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showOffer && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [showOffer, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-950/10">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-emerald-500 transition-colors">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-semibold">Voltar</span>
          </Link>
          <Link href="/" className="text-xl md:text-2xl font-bold">
            <span className="text-primary">AFILIA</span>
            <span className="text-emerald-500">360</span>
          </Link>
          <div className="w-12 md:w-20" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Hero com CTA urgente */}
        <div className="text-center space-y-4 md:space-y-6 py-6 md:py-12 mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/50 text-red-500 font-bold text-sm md:text-lg mb-4 animate-pulse shadow-lg shadow-red-500/20">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            DISPONÍVEL AGORA
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-balance leading-tight px-2">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
              ASSISTA ANTES
              <br />
              QUE SAIA DO AR
            </span>
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance font-medium px-4">
            Descubra o método exato para começar no marketing de afiliados mesmo sendo iniciante
          </p>
        </div>

        {/* Video Player */}
        <div className="max-w-5xl mx-auto mb-8 md:mb-12">
          <Card className="overflow-hidden border-2 md:border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/N74yXWo_h7E?autoplay=1"
                title="Aula Gratuita AFILIA360"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </Card>
        </div>

        {/* Offer Section - Appears after 10 seconds */}
        {showOffer && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Card className="p-4 sm:p-6 md:p-8 lg:p-12 border-2 md:border-4 border-emerald-500 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background shadow-2xl shadow-emerald-500/20">
              <div className="text-center space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm md:text-xl shadow-lg animate-pulse">
                  <Clock className="w-4 h-4 md:w-6 md:h-6" />
                  <span className="whitespace-nowrap">Expira em: {formatTime(timeLeft)}</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-500 text-xs md:text-sm font-bold">
                  <Star className="w-3 h-3 md:w-4 md:h-4" />
                  OFERTA ESPECIAL EXCLUSIVA
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-balance px-2">
                  Acesso Completo ao{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                    AFILIA360
                  </span>
                </h2>

                <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium px-4">
                  Entre agora e tenha acesso imediato a produtos validados, comunidade exclusiva e todo suporte para
                  começar hoje mesmo
                </p>

                {/* Price - Destaque maior */}
                <div className="py-4 md:py-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 rounded-3xl blur-2xl" />
                  <div className="relative">
                    <div className="text-muted-foreground line-through text-lg md:text-2xl mb-2">De R$ 97,00</div>
                    <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-2">
                      R$ 17
                    </div>
                    <div className="text-xs md:text-lg text-muted-foreground font-semibold px-4">
                      Apenas para quem assistiu a aula completa
                    </div>
                  </div>
                </div>

                {/* Benefits com cores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-left max-w-2xl mx-auto">
                  {[
                    "Acesso vitalício à plataforma",
                    "Produtos validados diariamente",
                    "Comunidade exclusiva de afiliados",
                    "Materiais de divulgação prontos",
                    "Suporte especializado em vendas",
                    "Atualizações semanais de produtos",
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm md:text-base font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA pulsante */}
                <div className="space-y-3 md:space-y-4 pt-4 md:pt-6">
                  <Link href="/cadastro" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-black px-6 sm:px-8 md:px-16 py-6 md:py-10 shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-transform"
                    >
                      <Zap className="w-5 h-5 md:w-7 md:h-7 mr-2 md:mr-3 flex-shrink-0" />
                      <span className="leading-tight">COMEÇAR AGORA POR R$ 17</span>
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground px-4">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 flex-shrink-0" />
                    <span className="font-medium">Pagamento 100% seguro • Garantia de 7 dias</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Testimonials com mais cor */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 px-4">O que nossos membros dizem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-background hover:border-emerald-500 transition-all hover:scale-105">
              <div className="flex gap-1 mb-3 md:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                "Melhor investimento que fiz! Em 2 semanas consegui minhas primeiras vendas. Os produtos são realmente
                validados e a plataforma funciona!"
              </p>
              <div className="text-sm md:text-base font-bold text-emerald-500">— Julia Martins, SP</div>
            </Card>

            <Card className="p-4 md:p-6 border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-background hover:border-emerald-500 transition-all hover:scale-105">
              <div className="flex gap-1 mb-3 md:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                "Finalmente uma plataforma séria! Os R$ 17 são ridículos perto do valor que recebi. Já recuperei o
                investimento na primeira venda!"
              </p>
              <div className="text-sm md:text-base font-bold text-emerald-500">— Pedro Costa, RJ</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 md:py-8 px-4 mt-12 md:mt-20 bg-card/30">
        <div className="container mx-auto text-center text-xs md:text-sm text-muted-foreground">
          <p>© 2025 AFILIA360. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
