"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession, getAdminEmail } from "@/lib/auth"
import { Loader2, ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">("loading")
  const router = useRouter()

  useEffect(() => {
    const session = getSession()

    if (!session?.loggedIn) {
      router.push("/login")
      return
    }

    if (session.email !== getAdminEmail()) {
      setStatus("unauthorized")
      return
    }

    setStatus("authorized")
  }, [router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "unauthorized") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <ShieldX className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-muted-foreground max-w-md">
            Você não tem permissão para acessar esta página. Apenas administradores podem acessar o painel de
            administração.
          </p>
          <Link href="/">
            <Button>Voltar ao Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
