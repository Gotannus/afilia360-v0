"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  Crown,
  Percent,
  Bot,
  MessageCircle,
  Package,
  CheckCircle2,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { useUserPlan } from "@/hooks/use-user-plan"
import { useRouter } from "next/navigation"

const benefits = [
  {
    icon: Percent,
    title: "+5% de Comissão",
    description: "Ganhe 5% a mais em todas as suas vendas como afiliado VIP",
    highlight: true,
  },
  {
    icon: Bot,
    title: "Agentes IA Exclusivos",
    description: "Acesso a ferramentas de IA para criar copies, anúncios e estratégias",
    highlight: false,
  },
  {
    icon: MessageCircle,
    title: "Grupo WhatsApp VIP",
    description: "Networking exclusivo com os melhores afiliados e suporte direto",
    highlight: false,
  },
  {
    icon: Package,
    title: "Produtos Exclusivos",
    description: "Acesso antecipado a produtos validados de alta conversão",
    highlight: false,
  },
  {
    icon: Zap,
    title: "Cursos Premium",
    description: "Todos os cursos e treinamentos liberados sem restrição",
    highlight: false,
  },
  {
    icon: Shield,
    title: "Suporte Prioritário",
    description: "Atendimento prioritário para dúvidas e problemas",
    highlight: false,
  },
]

export default function SejaVipPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { isVip, loading } = useUserPlan()
  const router = useRouter()

  // Se já é VIP, redirecionar
  useEffect(() => {
    if (!loading && isVip) {
      router.push("/cursos")
    }
  }, [isVip, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (isVip) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-red-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Oferta Especial para Afiliados
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Ganhe{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              +5% de Comissão
            </span>
            <br />
            em Todas as Vendas
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Torne-se um afiliado VIP e desbloqueie benefícios exclusivos que vão acelerar seus resultados no marketing
            digital
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => window.open("https://pay.celetus.com/ZOXLWXI9", "_blank")}
            >
              <Crown className="h-5 w-5 mr-2" />
              Quero ser VIP Agora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Benefícios <span className="text-yellow-500">Exclusivos</span> para VIPs
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`rounded-2xl border p-6 transition-all hover:scale-105 ${
                benefit.highlight
                  ? "border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/5"
                  : "border-border bg-card"
              }`}
            >
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                  benefit.highlight
                    ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-black"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
              {benefit.highlight && (
                <div className="mt-4 flex items-center gap-2 text-yellow-500 text-sm font-medium">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  Benefício Principal
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Crown className="h-16 w-16 mx-auto mb-6 text-yellow-500" />
          <h2 className="text-3xl font-bold mb-4">Pronto para Aumentar seus Ganhos?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Entre agora para o grupo exclusivo de afiliados VIP e comece a ganhar mais
          </p>

          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg px-10 py-6 h-auto"
              onClick={() => window.open("https://pay.celetus.com/ZOXLWXI9", "_blank")}
            >
              <Crown className="h-5 w-5 mr-2" />
              Ativar Meu VIP
            </Button>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Acesso imediato
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Cancele quando quiser
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
