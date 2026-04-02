import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthGuard } from "@/components/auth-guard"
import "./globals.css"

export const metadata: Metadata = {
  title: "AFILIA360 | Marketplace de Produtos Validados",
  description:
    "Marketplace de produtos validados para afiliados. Encontre os melhores produtos com métricas reais e comissões atrativas.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased">
        <AuthGuard>{children}</AuthGuard>
        <Analytics />
      </body>
    </html>
  )
}
