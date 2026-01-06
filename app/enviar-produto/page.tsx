"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  Package,
  CheckCircle2,
  XCircle,
  MessageCircle,
  TrendingUp,
  Shield,
  Clock,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"

const requirements = [
  {
    icon: TrendingUp,
    title: "Produto Validado",
    description: "O produto precisa estar vendendo todos os dias com lucro no tráfego pago ou orgânico",
    required: true,
  },
  {
    icon: Clock,
    title: "Histórico de Vendas",
    description: "Mínimo de 30 dias de vendas consistentes para comprovar a validação",
    required: true,
  },
  {
    icon: Shield,
    title: "Qualidade do Produto",
    description: "Produto de qualidade com boas avaliações e baixo índice de reembolso",
    required: true,
  },
]

const notAccepted = [
  "Produtos recém criados sem validação",
  "Produtos sem histórico de vendas comprovado",
  "Produtos com alto índice de reembolso",
  "Produtos que violam políticas de plataformas",
]

export default function EnviarProdutoPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const whatsappNumber = "5562981614462"
  const whatsappMessage = encodeURIComponent(
    "Olá Rodrigo! Gostaria de submeter meu produto para análise no AFILIA360. O produto está validado e vendendo diariamente.",
  )
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30">
            <Package className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Envie seu Produto</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tem um produto validado que está vendendo bem? Submeta para análise e faça parte do catálogo AFILIA360
          </p>
        </div>

        {/* Requirements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Requisitos Obrigatórios
          </h2>

          <div className="grid gap-4">
            {requirements.map((req, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl border border-green-500/30 bg-green-500/5"
              >
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <req.icon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{req.title}</h3>
                  <p className="text-sm text-muted-foreground">{req.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Not Accepted */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <XCircle className="h-6 w-6 text-red-500" />
            Não Aceitamos
          </h2>

          <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
            <ul className="space-y-3">
              {notAccepted.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Como Funciona</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Entre em Contato</h3>
              <p className="text-sm text-muted-foreground">Envie uma mensagem pelo WhatsApp com os dados do produto</p>
            </div>

            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Análise Detalhada</h3>
              <p className="text-sm text-muted-foreground">
                Rodrigo Tannus irá analisar se o produto se encaixa no perfil
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Aprovação</h3>
              <p className="text-sm text-muted-foreground">Se aprovado, seu produto entra no catálogo exclusivo</p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-12 p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2 text-yellow-500">Importante</h3>
              <p className="text-sm text-muted-foreground">
                Todos os produtos passam por uma análise criteriosa. Apenas produtos com histórico comprovado de vendas
                e validação real serão aceitos. Isso garante a qualidade do catálogo para todos os afiliados.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-10 py-6 h-auto shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Enviar Produto via WhatsApp
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </a>

          <p className="mt-4 text-sm text-muted-foreground">
            Você será redirecionado para o WhatsApp de Rodrigo Tannus
          </p>
        </div>
      </div>
    </div>
  )
}
