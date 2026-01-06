"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Bell,
  Settings,
  UserPlus,
  LogOut,
  User,
  GraduationCap,
  Menu,
  Package,
  Trophy,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getSession, logout, getAdminEmail, type AffiliateSession } from "@/lib/auth"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [session, setSession] = useState<AffiliateSession | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setSession(getSession())
  }, [])

  const isAdminUser = session?.email === getAdminEmail()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-8">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <span className="text-sm font-bold text-primary-foreground">A</span>
                    </div>
                    <span className="text-lg font-semibold tracking-tight">AFILIA360</span>
                  </Link>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    Marketplace
                  </Link>
                  <Link
                    href="/cursos"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <GraduationCap className="h-4 w-4" />
                    Cursos
                  </Link>
                  <Link
                    href="/ranking"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Trophy className="h-4 w-4" />
                    Ranking
                  </Link>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Suporte
                  </a>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">AFILIA360</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-foreground">
              Marketplace
            </Link>
            <Link
              href="/cursos"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Cursos
            </Link>
            <Link href="/ranking" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Ranking
            </Link>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Suporte
            </a>
            {isAdminUser && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Settings className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden w-64 lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 border-border bg-secondary pl-9 text-sm placeholder:text-muted-foreground"
            />
          </div>

          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
          </Button>

          {session?.loggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {session.photoUrl ? (
                      <Image
                        src={session.photoUrl || "/placeholder.svg"}
                        alt={session.name}
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      session.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:inline">{session.name.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session.name}</p>
                  <p className="text-xs text-muted-foreground">{session.email}</p>
                  {isAdminUser && (
                    <span className="inline-block mt-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                      Administrador
                    </span>
                  )}
                </div>
                <DropdownMenuSeparator />
                <Link href="/perfil">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                </Link>
                <Link href="/cursos">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <GraduationCap className="h-4 w-4" />
                    Meus Cursos
                  </DropdownMenuItem>
                </Link>
                {isAdminUser && (
                  <Link href="/admin">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      Administração
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="gap-2 text-red-400 focus:text-red-400 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:flex">
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Cadastrar</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
