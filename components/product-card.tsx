"use client"

import {
  ExternalLink,
  Star,
  Sparkles,
  FolderOpen,
  ShoppingBag,
  Zap,
  Clock,
  Lightbulb,
  Flame,
  Crown,
  UserPlus,
  Link2,
  PlayCircle,
  Lock,
} from "lucide-react"
import type { Product } from "@/lib/products-data"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isPerfectpay = product.tag === "perfectpay"
  const isComingSoon = product.comingSoon === true
  const isVipOnly = product.vipOnly === true
  const [strategyOpen, setStrategyOpen] = useState(false)
  const [affiliatePopupOpen, setAffiliatePopupOpen] = useState(false)

  const renderBadge = () => {
    if (isComingSoon) return null

    const badgeConfig = {
      bestseller: {
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        text: "text-white",
        icon: Crown,
        label: "MAIS VENDIDO",
      },
      novo: {
        bg: "bg-gradient-to-r from-emerald-500 to-green-500",
        text: "text-white",
        icon: Sparkles,
        label: "NOVO",
      },
      trending: {
        bg: "bg-gradient-to-r from-rose-500 to-pink-500",
        text: "text-white",
        icon: Flame,
        label: "EM ALTA",
      },
    }

    const config = badgeConfig[product.badge as keyof typeof badgeConfig]
    if (config) {
      const Icon = config.icon
      return (
        <div
          className={cn(
            "absolute -left-1 top-4 z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold shadow-lg",
            config.bg,
            config.text,
          )}
          style={{
            clipPath: "polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%)",
          }}
        >
          <Icon className="h-3.5 w-3.5" />
          <span>{config.label}</span>
        </div>
      )
    }

    if (isPerfectpay) {
      return (
        <div
          className="absolute -left-1 top-4 z-10 flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-violet-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg"
          style={{
            clipPath: "polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%)",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>PERFECTPAY</span>
        </div>
      )
    }

    return null
  }

  if (isComingSoon) {
    return (
      <div className="group relative flex flex-col overflow-hidden rounded-xl border-2 border-dashed border-amber-500/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {/* Badge EM BREVE piscante */}
        <div className="absolute -left-1 top-4 z-10">
          <div
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg animate-pulse"
            style={{
              clipPath: "polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%)",
            }}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>EM BREVE</span>
          </div>
        </div>

        {/* Área central com cadeado e mensagem */}
        <div
          className="relative w-full flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border-b border-amber-500/20"
          style={{ aspectRatio: "4/5" }}
        >
          {/* Cadeado animado */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/20" />
            <div className="relative rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-8 backdrop-blur-sm">
              <Lock className="h-20 w-20 text-amber-400" />
            </div>
          </div>

          {/* Mensagem EM BREVE */}
          <div className="text-center px-6">
            <h3 className="text-3xl font-bold text-amber-400 mb-3 animate-pulse">EM BREVE</h3>
            <p className="text-sm text-amber-300/70 uppercase tracking-wider">Novo Produto Chegando</p>
          </div>
        </div>

        {/* Conteúdo com apenas o NICHO */}
        <div className="flex flex-1 flex-col p-6 items-center justify-center text-center">
          <span className="mb-4 w-fit rounded-full bg-amber-500/20 border border-amber-500/40 px-4 py-2 text-sm font-semibold text-amber-400 uppercase tracking-wider">
            {product.nicho}
          </span>

          <p className="text-xs text-amber-300/50 italic max-w-[200px]">
            Aguarde... algo incrível está por vir neste nicho!
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5",
          isComingSoon && "opacity-80 border-dashed border-yellow-500/50",
        )}
      >
        {renderBadge()}

        {/* VIP badge ribbon */}
        {isVipOnly && (
          <div className="absolute right-0 top-0 z-10">
            <div
              className="relative flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-4 py-1.5 pr-6 text-xs font-bold text-white shadow-xl"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 8% 100%)",
              }}
            >
              <Crown className="h-3.5 w-3.5" />
              <span>EXCLUSIVO VIP</span>
            </div>
          </div>
        )}

        {/* Image Container */}
        <div
          className="relative w-full overflow-hidden bg-secondary flex items-center justify-center"
          style={{ aspectRatio: "4/5" }}
        >
          {/* VIP diagonal ribbon overlay */}

          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className={cn(
              "w-full h-full object-contain transition-transform duration-500 group-hover:scale-105",
              isComingSoon && "grayscale",
            )}
          />

          {isComingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="flex flex-col items-center gap-2 text-center">
                <Clock className="h-10 w-10 text-yellow-400 animate-pulse" />
                <span className="text-xl font-bold text-yellow-400">EM BREVE</span>
                <span className="text-sm text-white/80">Aguarde novidades!</span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <span className="mb-2 w-fit rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {product.nicho}
          </span>

          <h3 className="mb-3 line-clamp-2 text-base font-semibold leading-tight text-foreground">{product.title}</h3>

          {product.metrics && !isComingSoon && (
            <div className="mb-3 rounded-lg border border-border bg-secondary/50 p-3">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-accent">Live Metrics</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-muted-foreground">CPC</div>
                  <div className="text-sm font-semibold text-foreground">{product.metrics.cpcMedio}</div>
                </div>
                <div className="border-x border-border">
                  <div className="text-[10px] text-muted-foreground">Checkout</div>
                  <div className="text-sm font-semibold text-foreground">{product.metrics.checkout}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">CPA</div>
                  <div className="text-sm font-semibold text-amber-400">{product.metrics.cpaAlvo}</div>
                </div>
              </div>
            </div>
          )}

          {product.estrategia && !isComingSoon && (
            <button
              onClick={() => setStrategyOpen(true)}
              className="mb-3 w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-left transition-all hover:bg-emerald-500/20 hover:border-emerald-500/50"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                  Estratégia Recomendada
                </span>
              </div>
              <p className="mt-1 text-xs text-emerald-300/70 line-clamp-1">Clique para ver a estratégia completa</p>
            </button>
          )}

          {(product.orderbumps !== undefined && product.orderbumps > 0) ||
          product.upsellStatus === "sim" ||
          product.upsellStatus === "em-breve" ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {product.orderbumps !== undefined && product.orderbumps > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-400">
                  <ShoppingBag className="h-3 w-3" />
                  {product.orderbumps} Orderbump{product.orderbumps > 1 ? "s" : ""}
                </span>
              )}
              {product.upsellStatus === "sim" && (
                <span className="flex items-center gap-1 rounded-full bg-pink-500/10 px-2 py-1 text-xs text-pink-400">
                  <Zap className="h-3 w-3" />
                  Upsell Ativo
                </span>
              )}
              {product.upsellStatus === "em-breve" && (
                <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
                  <Clock className="h-3 w-3" />
                  Upsell Em Breve
                </span>
              )}
            </div>
          ) : null}

          {isPerfectpay && !product.metrics && !isComingSoon && (
            <div className="mb-3 rounded-lg border border-purple-500/30 bg-purple-500/5 p-3 text-center">
              <div className="text-xs text-purple-400">Métricas em coleta...</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Nova oportunidade</div>
            </div>
          )}

          {!isComingSoon && (
            <div className="mb-3 flex items-center gap-4 text-sm">
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{product.rating}</span>
                </div>
              )}
              {product.vendas && (
                <span className="text-muted-foreground">{product.vendas.toLocaleString("pt-BR")} vendas</span>
              )}
            </div>
          )}

          {/* Price & Commission */}
          <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
            <div>
              <span className="block text-xs text-muted-foreground">Ticket</span>
              <span className="text-lg font-bold text-foreground">{product.ticket}</span>
            </div>
            <div className="text-right">
              <span className="block text-xs text-muted-foreground">Comissão</span>
              <span className="text-lg font-bold text-emerald-400">{product.comissao}</span>
            </div>
          </div>

          {isComingSoon ? (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-yellow-500/10 py-3 text-sm font-medium text-yellow-400">
              <Clock className="h-4 w-4" />
              Em breve disponível
            </div>
          ) : (
            <div className="mt-4">
              <button
                onClick={() => setAffiliatePopupOpen(true)}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all hover:opacity-90",
                  isPerfectpay ? "bg-purple-500 text-white" : "bg-primary text-primary-foreground",
                )}
              >
                Divulgar Agora
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dialog da Estratégia */}
      <Dialog open={strategyOpen} onOpenChange={setStrategyOpen}>
        <DialogContent className="max-w-lg bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Lightbulb className="h-5 w-5 text-emerald-400" />
              Estratégia Recomendada
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="mb-4 flex items-center gap-3">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-white">{product.title}</h4>
                <p className="text-sm text-gray-400">{product.nicho}</p>
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800/50 p-4 border border-zinc-700">
              <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                {product.estrategia || "Nenhuma estratégia definida."}
              </p>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-xs text-emerald-400">
                Dica: Siga esta estratégia para maximizar suas conversões com este produto.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={affiliatePopupOpen} onOpenChange={setAffiliatePopupOpen}>
        <DialogContent className="max-w-md bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <UserPlus className="h-5 w-5 text-primary" />
              Afiliar-se a {product.title}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            {/* Opção 1: Criar conta */}
            <a
              href="https://dash.celetus.com/signup?inid=EZC8J2034G9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <UserPlus className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">Não tem conta na Celetus?</h4>
                <p className="text-sm text-gray-400">Crie sua conta gratuita aqui</p>
              </div>
              <ExternalLink className="h-4 w-4 text-emerald-400" />
            </a>

            {/* Opção 2: Já tem conta - afiliar */}
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border border-primary/30 bg-primary/10 p-4 transition-all hover:bg-primary/20 hover:border-primary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">Já tem conta na Celetus?</h4>
                <p className="text-sm text-gray-400">Afiliar-se ao produto agora!</p>
              </div>
              <ExternalLink className="h-4 w-4 text-primary" />
            </a>

            {/* Divisor */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-zinc-900 px-3 text-xs text-gray-500">MATERIAIS</span>
              </div>
            </div>

            {/* Opção 3: Drive criativos */}
            {product.driveUrl && (
              <a
                href={product.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 transition-all hover:bg-amber-500/20 hover:border-amber-500/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                  <FolderOpen className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">Drive de Criativos</h4>
                  <p className="text-sm text-gray-400">Acesse criativos e página de vendas</p>
                </div>
                <ExternalLink className="h-4 w-4 text-amber-400" />
              </a>
            )}

            {/* Opção 4: Aula passo a passo */}
            <a
              href="/cursos/como-subir-campanha"
              className="flex items-center gap-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 transition-all hover:bg-blue-500/20 hover:border-blue-500/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                <PlayCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">Aula Passo a Passo</h4>
                <p className="text-sm text-gray-400">Aprenda a subir sua campanha</p>
              </div>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
