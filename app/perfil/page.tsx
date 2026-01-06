"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Camera,
  Check,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { createClient } from "@/lib/supabase/client"
import { getUser, setUser } from "@/lib/auth"

export default function PerfilPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [photoPreview, setPhotoPreview] = useState("")

  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showPhotoEditor, setShowPhotoEditor] = useState(false)
  const [tempPhoto, setTempPhoto] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase.from("affiliates").select("*").eq("email", user.email).single()

      if (!error && data) {
        setUserId(data.id)
        setName(data.name)
        setEmail(data.email)
        setWhatsapp(data.whatsapp || "")
        setPhotoUrl(data.photo_url || "")
        setPhotoPreview(data.photo_url || "")
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [router, supabase])

  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value)
    setWhatsapp(formatted)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setTempPhoto(base64)
        setZoom(1)
        setPosition({ x: 0, y: 0 })
        setShowPhotoEditor(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      const maxOffset = (zoom - 1) * 50
      const newX = Math.max(-maxOffset, Math.min(maxOffset, e.clientX - dragStart.x))
      const newY = Math.max(-maxOffset, Math.min(maxOffset, e.clientY - dragStart.y))
      setPosition({ x: newX, y: newY })
    },
    [isDragging, dragStart, zoom],
  )

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSavePhoto = () => {
    setPhotoPreview(tempPhoto)
    setShowPhotoEditor(false)
  }

  const handleCancelPhoto = () => {
    setTempPhoto("")
    setShowPhotoEditor(false)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSuccessMessage("")
    setErrorMessage("")

    const user = getUser()
    if (!user || !userId) {
      setErrorMessage("Usuário não encontrado")
      setIsSaving(false)
      return
    }

    const whatsappNumbers = whatsapp.replace(/\D/g, "")

    const { error } = await supabase
      .from("affiliates")
      .update({
        name,
        whatsapp: whatsappNumbers,
        photo_url: photoPreview || null,
      })
      .eq("id", userId)

    if (!error) {
      setUser({ ...user, name, photoUrl: photoPreview })
      setSuccessMessage("Perfil atualizado com sucesso!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } else {
      setErrorMessage("Erro ao salvar: " + error.message)
    }

    setIsSaving(false)
  }

  const handleChangePassword = async () => {
    setPasswordError("")

    if (!currentPassword) {
      setPasswordError("Digite sua senha atual")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem")
      return
    }

    setIsChangingPassword(true)

    const user = getUser()
    if (!user || !userId) return

    const { data: userData } = await supabase.from("affiliates").select("password").eq("id", userId).single()

    if (userData?.password !== currentPassword) {
      setPasswordError("Senha atual incorreta")
      setIsChangingPassword(false)
      return
    }

    const { error } = await supabase.from("affiliates").update({ password: newPassword }).eq("id", userId)

    if (!error) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSuccessMessage("Senha alterada com sucesso!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } else {
      setPasswordError("Erro ao alterar senha")
    }

    setIsChangingPassword(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold">Meu Perfil</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-400">
            <Check className="h-5 w-5" />
            {successMessage}
          </div>
        )}

        {/* Mensagem de erro */}
        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Foto de Perfil */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-muted">
              {photoPreview ? (
                <Image
                  src={photoPreview || "/placeholder.svg"}
                  alt="Foto de perfil"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Clique no ícone para alterar a foto</p>
        </div>

        {showPhotoEditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Ajustar Foto</h3>

              {/* Preview com zoom */}
              <div
                className="relative mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full border-2 border-primary bg-muted cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={tempPhoto || "/placeholder.svg"}
                  alt="Preview"
                  className="absolute h-full w-full object-cover transition-transform"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  }}
                  draggable={false}
                />
              </div>

              <p className="text-xs text-muted-foreground text-center mb-4 flex items-center justify-center gap-1">
                <Move className="h-3 w-3" />
                Arraste para reposicionar
              </p>

              {/* Controle de Zoom */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <ZoomOut className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={1}
                    max={3}
                    step={0.1}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">Zoom: {Math.round(zoom * 100)}%</p>
              </div>

              {/* Botões */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCancelPhoto} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button onClick={handleSavePhoto} className="flex-1">
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Informações do Perfil */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Informações Pessoais</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" value={email} disabled className="pl-10 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  className="pl-10"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Alterações
            </Button>
          </div>
        </div>

        {/* Alterar Senha */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Alterar Senha</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Digite sua senha atual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Digite a nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>

            {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}

            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              variant="outline"
              className="w-full gap-2 bg-transparent"
            >
              {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Alterar Senha
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
