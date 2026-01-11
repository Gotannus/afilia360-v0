"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Crown, Lock, Zap } from "lucide-react"
import type { MemberPlan } from "@/lib/courses-api"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan?: MemberPlan | null
  lockedCourseTitle?: string
}

export function UpgradeModal({ open, onOpenChange, currentPlan, lockedCourseTitle }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    window.open("https://pay.celetus.com/ZOXLWXI9", "_blank")
    setTimeout(() => {
      setLoading(false)
      onOpenChange(false)
    }, 500)
  }

  const superVipFeatures = [
    "Acesso a TODOS os cursos",
    "TODOS os produtos validados",
    "Agentes IA exclusivos",
    "Imersões gravadas completas",
    "Mentoria Sala de Guerra",
    "Suporte prioritário",
    "Novos cursos adicionados mensalmente",
    "Comunidade exclusiva",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg">
            <Crown className="h-10 w-10 text-white drop-shadow-md" />
          </div>
          <DialogTitle className="text-center text-2xl">
            {lockedCourseTitle ? `Desbloqueie "${lockedCourseTitle}"` : "Upgrade para Super VIP"}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {currentPlan ? (
              <>
                Você está no plano <span className="font-semibold text-foreground">{currentPlan.name}</span>. Faça
                upgrade para acessar todos os cursos!
              </>
            ) : (
              "Escolha um plano para começar a aprender"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border-2 border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-foreground">Super VIP</h3>
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-sm text-foreground/70 font-medium">Acesso completo ilimitado</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">R$ 97</div>
                <div className="text-xs text-muted-foreground font-medium">por mês</div>
              </div>
            </div>

            <ul className="mb-6 space-y-2.5">
              {superVipFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              size="lg"
            >
              {loading ? "Processando..." : "🔥 Fazer Upgrade Agora"}
            </Button>
          </div>

          <p className="text-center text-sm text-foreground/70 flex items-center justify-center gap-2">
            <Lock className="h-4 w-4 text-green-500" />
            <span className="font-medium">Pagamento 100% seguro. Cancele quando quiser.</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
