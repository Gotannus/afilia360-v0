"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Loader2 } from "lucide-react"

const publicRoutes = ["/login", "/cadastro", "/admin", "/aula-gratuita", "/sobre", "/enviar-produto", "/avisos"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const session = getSession()
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

    if (!session?.loggedIn && !isPublicRoute) {
      router.push("/login")
    } else if (session?.loggedIn && (pathname === "/login" || pathname === "/cadastro")) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }

    setIsChecking(false)
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  if (!isAuthenticated && !isPublicRoute) {
    return null
  }

  return <>{children}</>
}
