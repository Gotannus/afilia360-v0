"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import {
  Crown,
  GraduationCap,
  Percent,
  Sparkles,
  Zap,
  TrendingUp,
  ArrowLeft,
  Check,
  Star,
  Rocket,
  Award,
  Users,
  Lock,
  ChevronRight,
} from "lucide-react"

export default function VipBenefitsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isVip, setIsVip] = useState(false)

  useEffect(() => {
    checkVipStatus()
  }, [])

  async function checkVipStatus() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase.from("affiliates").select("is_vip").eq("user_id", user.id).single()

      if (data?.is_vip) {
        setIsVip(true)
        router.push("/") // Redirecionar para home se já for VIP
      }
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-amber-950/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 blur-3xl -z-10" />

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full px-6 py-2 mb-6 shadow-lg shadow-amber-500/20">
            <Crown className="h-5 w-5 text-black" />
            <span className="text-sm font-bold text-black tracking-wide">PLANO VIP</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent leading-tight">
            Desbloqueie as Funções
            <br />
            VIP da Plataforma
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
            Desbloqueie todos os recursos premium, aumente suas comissões em{" "}
            <strong className="text-amber-500">+5%</strong> e tenha acesso exclusivo às ferramentas que os afiliados de
            elite utilizam
          </p>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 border-2 border-background flex items-center justify-center"
                >
                  <Users className="h-5 w-5 text-black" />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">127 afiliados</strong> já são VIP
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          {/* Cursos Liberados */}
          <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-card via-amber-500/5 to-card hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">Todos os Cursos Liberados</h3>
                  <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                    Acesso completo e vitalício à toda biblioteca de cursos sobre tráfego pago, copywriting, vendas e
                    estratégias avançadas de marketing digital
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30">
                      <Check className="h-3 w-3 mr-1" />
                      Tráfego Pago
                    </Badge>
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30">
                      <Check className="h-3 w-3 mr-1" />
                      Copywriting
                    </Badge>
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30">
                      <Check className="h-3 w-3 mr-1" />
                      Funis de Venda
                    </Badge>
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30">
                      <Check className="h-3 w-3 mr-1" />
                      Estratégias
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* +5% de Comissão */}
          <Card className="border-2 border-green-500/30 bg-gradient-to-br from-card via-green-500/5 to-card hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <Percent className="h-8 w-8 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">+5% de Comissão Extra</h3>
                  <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                    Ganhe 5% a mais em TODAS as vendas dos produtos validados. Quanto mais você vende, mais você lucra!
                  </p>
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-sm font-bold text-green-500 mb-2">💰 Exemplo Prático:</p>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Comissão normal: <span className="line-through">R$ 100,00</span>
                      </p>
                      <p className="text-lg font-bold text-green-500">
                        Comissão VIP: R$ 105,00 <span className="text-xs">🔥</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ferramentas e IA */}
          <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-card via-blue-500/5 to-card hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">Todas as Ferramentas e IAs</h3>
                  <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                    Acesso ilimitado aos geradores de copy, criativos, análise de campanhas e todos os agentes de IA da
                    plataforma
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Gerador de Copy com IA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Análise de Campanhas Automática</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Criação de Criativos Ilimitada</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Agentes IA Especializados</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prioridade Novos Produtos */}
          <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-card via-purple-500/5 to-card hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <Rocket className="h-8 w-8 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">Prioridade em Novos Produtos</h3>
                  <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                    Seja o primeiro a afiliar novos produtos validados e pegue o melhor do tráfego antes dos outros
                    afiliados
                  </p>
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <Award className="h-6 w-6 text-purple-500" />
                      <div>
                        <p className="text-sm font-bold text-purple-500">Acesso Antecipado</p>
                        <p className="text-xs text-muted-foreground">Antes de todos os outros</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 text-center p-8 hover:scale-105 transition-transform">
            <Star className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-4xl font-black mb-2 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Acesso Total
            </p>
            <p className="text-sm text-muted-foreground">Biblioteca Completa de Cursos</p>
          </Card>
          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-center p-8 hover:scale-105 transition-transform">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-4xl font-black mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              +5%
            </p>
            <p className="text-sm text-muted-foreground">Comissão Extra Sempre</p>
          </Card>
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-center p-8 hover:scale-105 transition-transform">
            <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              ∞
            </p>
            <p className="text-sm text-muted-foreground">Ferramentas IA Ilimitadas</p>
          </Card>
        </div>

        <Card className="border-2 border-border mb-16 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              {/* Plano Gratuito */}
              <div className="p-8 bg-muted/30">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-xl font-bold text-muted-foreground">Plano Gratuito</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✕</span>
                    </div>
                    <span className="text-sm line-through">Cursos Premium</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✕</span>
                    </div>
                    <span className="text-sm line-through">Comissão Extra +5%</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✕</span>
                    </div>
                    <span className="text-sm line-through">Ferramentas IA Premium</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✕</span>
                    </div>
                    <span className="text-sm line-through">Acesso Prioritário</span>
                  </li>
                </ul>
              </div>

              {/* Plano VIP */}
              <div className="p-8 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-amber-500/10 border-l-2 border-amber-500/30">
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <h3 className="text-xl font-bold text-amber-500">Plano VIP</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-black" />
                    </div>
                    <span className="text-sm font-medium">Todos os Cursos Liberados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-black" />
                    </div>
                    <span className="text-sm font-medium">+5% de Comissão Extra</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-black" />
                    </div>
                    <span className="text-sm font-medium">Todas as Ferramentas IA</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-black" />
                    </div>
                    <span className="text-sm font-medium">Prioridade em Novos Produtos</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 shadow-2xl shadow-amber-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-yellow-500/10 to-amber-500/5 blur-3xl" />
          <CardContent className="p-12 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full px-4 py-1.5 mb-6 shadow-lg shadow-red-500/30">
              <span className="text-xs font-bold text-white tracking-wide animate-pulse">🔥 OFERTA ESPECIAL</span>
            </div>

            <Crown className="h-20 w-20 text-amber-500 mx-auto mb-6" />

            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Faça Upgrade Para VIP
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comece a lucrar mais hoje mesmo com acesso total aos cursos, +5% de comissão e todas as ferramentas
              premium desbloqueadas
            </p>

            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-2xl text-muted-foreground line-through">De R$ 197</span>
                <Badge className="bg-red-500 text-white border-0 px-3 py-1">-51% OFF</Badge>
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-6xl font-black bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                  R$ 97
                </span>
                <span className="text-2xl text-muted-foreground">/ano</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ou <strong className="text-foreground">12x de R$ 9,70</strong> sem juros
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold text-lg px-8 py-6 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 transition-all hover:scale-105 gap-3"
                onClick={() => window.open("https://pay.celetus.com/ZOXLWXI9", "_blank")}
              >
                <Crown className="h-5 w-5 mr-2" />
                Ativar Plano VIP Agora
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Ativação Imediata</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Acesso Vitalício</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancele Quando Quiser</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
