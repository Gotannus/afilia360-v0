"use client"

import { ExternalLink, Server, Copy, Check } from "lucide-react"
import { useState } from "react"

export function HostingerBanner() {
  const [copied, setCopied] = useState(false)

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("TANNUS10")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Server className="h-5 w-5 text-emerald-400" />
        <span className="text-sm font-semibold text-emerald-400">Parceiro</span>
      </div>
      <h4 className="mb-2 font-semibold text-foreground">Hospedagem Hostinger</h4>
      <p className="mb-3 text-xs text-muted-foreground">
        Até 75% OFF + Domínio Grátis. A melhor hospedagem para suas landing pages e estruturas próprias.
      </p>

      <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
        <p className="text-xs text-muted-foreground mb-2">Use o cupom na hora de pagar:</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-md bg-background/50 px-3 py-2 text-center">
            <span className="font-bold text-emerald-400 tracking-wider">TANNUS10</span>
          </div>
          <button
            onClick={handleCopyCoupon}
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
              copied ? "bg-emerald-500 text-white" : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      <a
        href="https://hostinger.com.br/tannus10"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Aproveitar Oferta
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
