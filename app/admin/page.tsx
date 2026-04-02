"use client"

import { useState, useEffect } from "react"
import Link from "next/link" // Import Link
import { AdminGuard } from "@/components/admin-guard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { createBrowserClient } from "@supabase/ssr" // Import added for Supabase client in announcements
import { addProductToDb, updateProductInDb, deleteProductFromDb } from "@/lib/products-api"
import type { Product } from "@/lib/products-data"
import type { Affiliate } from "@/lib/types"
import { CoursesAdmin } from "@/components/admin/courses-admin"
import { UserOrderbumps } from "@/components/admin/user-orderbumps"
import { NovidadesAdmin } from "@/components/admin/novidades-admin"
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Check,
  Pause,
  Play,
  UserX,
  Trophy,
  Megaphone,
  Users,
  Package,
  Loader2,
  GraduationCap,
  Crown,
  Pencil,
  RefreshCw,
  Flame,
  Sparkles,
  KeyRound,
  Zap,
  Eye,
  EyeOff,
  DollarSign,
  Link2,
  Copy,
  TrendingUp,
  Info,
  Clock,
  Search,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  GripVertical,
  ArrowLeft,
  Download,
  Newspaper,
} from "lucide-react"
import type React from "react" // Import React for JSXElement[]
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card" // Import Card components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components
import { Dashboard } from "@/components/admin/dashboard" // Import Dashboard component

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Painel Admin</h1>
              <p className="text-sm text-muted-foreground mt-1">Gerencie sua plataforma</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Plataforma
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="affiliates" className="space-y-4 md:space-y-6">
            <div className="relative">
              <TabsList className="inline-flex w-full overflow-x-auto overflow-y-hidden h-auto p-1 bg-muted rounded-lg no-scrollbar">
                <div className="flex gap-1 min-w-max">
                  <TabsTrigger value="affiliates" className="flex items-center gap-2 whitespace-nowrap px-3 py-2">
                    <Users className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm">Afiliados</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex items-center gap-2 whitespace-nowrap px-3 py-2">
                    <Package className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm">Produtos</span>
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="flex items-center gap-2 whitespace-nowrap px-3 py-2">
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm">Cursos</span>
                  </TabsTrigger>
                  <TabsTrigger value="ranking" className="flex items-center gap-2 whitespace-nowrap px-3 py-2">
                    <Trophy className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm">Ranking</span>
                  </TabsTrigger>
                  <TabsTrigger value="announcements" className="flex items-center gap-2 whitespace-nowrap px-3 py-2">
                    <Megaphone className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm">Avisos</span>
                  </TabsTrigger>
                  <TabsTrigger value="novidades" className="flex items-center gap-2 whitespace-nowrap px-3 py-2">
                    <Newspaper className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm">Novidades</span>
                  </TabsTrigger>
                  <TabsTrigger value="dashboard" className="flex items-center gap-2 whitespace-nowrap px-3 py-2">
                    <TrendingUp className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm">Dashboard</span>
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <TabsContent value="affiliates">
              <UsersAdmin />
            </TabsContent>

            <TabsContent value="products">
              <ProductsAdmin />
            </TabsContent>

            <TabsContent value="courses">
              <CoursesAdmin />
            </TabsContent>

            <TabsContent value="ranking">
              <RankingAdmin />
            </TabsContent>

            <TabsContent value="announcements">
              <AnnouncementsAdmin />
            </TabsContent>

            <TabsContent value="novidades">
              <NovidadesAdmin />
            </TabsContent>

            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>

            {/* <TabsContent value="settings">
              <div className="space-y-6">
                <TotalSalesSettings />
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  )
}

function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const moveProduct = async (index: number, direction: "up" | "down") => {
    const newProducts = [...products]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newProducts.length) return // Trocar posições
    ;[newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]]

    setProducts(newProducts)

    // Atualizar no banco
    await updateProductOrder(newProducts)
  }

  const updateProductOrder = async (orderedProducts: Product[]) => {
    const supabase = createClient()

    const updates = orderedProducts.map((product, index) => ({
      id: product.id,
      display_order: index + 1, // Começar de 1 ao invés de 0
    }))

    console.log(
      "[v0] Atualizando ordem dos produtos:",
      updates.map((u) => ({ id: u.id, display_order: u.display_order })),
    )

    for (const update of updates) {
      await supabase.from("marketplace_products").update({ display_order: update.display_order }).eq("id", update.id)
    }

    console.log("[v0] Ordem atualizada com sucesso!")
  }

  const emptyProduct: Omit<Product, "id"> = {
    title: "",
    image: "",
    nicho: "",
    comissao: "",
    ticket: "",
      affiliateUrl: "",
      hotmartUrl: "",
    driveUrl: "",
    vendas: 0,
    rating: 5,
    orderbumps: 0,
    upsellStatus: "nao",
    releaseDate: "",
    estrategia: "",
    badge: undefined,
    tag: undefined,
    validation_status: "disponivel",
    metrics: {
      cpcMedio: "",
      checkout: "",
      cpaAlvo: "",
    },
    vipOnly: false, // Corrigido vip_only para vipOnly (camelCase conforme tipo Product)
    display_order: 0, // Campo para reordenação
    comingSoon: false, // novo campo comingSoon
    // Novos campos adicionados ao tipo Product
    plataforma: undefined,
    formato: undefined,
    aulas: [],
    category: "",
    tagLabel: undefined,
  }

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>(emptyProduct)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  // Carregar produtos do Supabase
  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("marketplace_products")
      .select("*")
      .order("display_order", { ascending: true }) // Ordenar por display_order

    if (error) {
      console.error("Erro ao carregar produtos:", error)
      setLoading(false)
      return
    }

    const mappedProducts: Product[] = (data || []).map((product: any) => ({
      id: product.id,
      title: product.title || "",
      image: product.image || "",
      nicho: product.nicho || "",
      comissao: product.comissao || "",
      ticket: product.ticket || "",
      affiliateUrl: product.affiliate_url || "",
      hotmartUrl: product.hotmart_url || "",
      driveUrl: product.drive_url || "", // Corrigido de drive_link para drive_url
      vendas: product.vendas || 0,
      rating: product.rating || 5,
      orderbumps: product.orderbumps || 0,
      upsellStatus: product.upsell_status || "nao",
      releaseDate: product.release_date || "",
      estrategia: product.estrategia || "",
      badge: product.badge,
      tag: product.tag,
      plataforma: product.plataforma,
      formato: product.formato,
      aulas: product.aulas || [],
      category: product.category,
      tagLabel: product.tag_label,
      validation_status: product.coming_soon ? "em-breve" : "disponivel",
      metrics: {
        cpcMedio: product.cpc_medio || "", // Corrigido de avg_cpc para cpc_medio
        checkout: product.checkout || "", // Mantido checkout
        cpaAlvo: product.cpa_alvo || "", // Corrigido de target_cpa para cpa_alvo
      },
      vipOnly: product.vip_only || false,
      display_order: product.display_order || 0,
      comingSoon: product.coming_soon || false,
    }))

    console.log(
      "[v0] Produtos carregados do banco:",
      mappedProducts.map((p) => ({
        id: p.id,
        title: p.title,
        comingSoon: p.comingSoon,
        vipOnly: p.vipOnly,
        cpc: p.metrics?.cpcMedio,
      })),
    )

    setProducts(mappedProducts)
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!newProduct.title) {
      setErrorMessage("O título do produto é obrigatório")
      return
    }
    setErrorMessage(null)
    setSaving(true)
    console.log("[v0] Salvando produto:", {
      title: newProduct.title,
      comingSoon: newProduct.comingSoon,
    })
    const productToAdd = { ...newProduct }
    const added = await addProductToDb(productToAdd)
    if (added) {
      console.log("[v0] Produto adicionado com sucesso:", added)
      setProducts([added, ...products])
      setNewProduct(emptyProduct)
      setIsAdding(false)
    } else {
      console.error("[v0] Falha ao adicionar produto")
      setErrorMessage("Erro ao adicionar produto. Verifique o console para mais detalhes.")
    }
    setSaving(false)
  }

  const handleUpdate = async () => {
    if (!editProduct) return
    setErrorMessage(null)
    setSaving(true)
    console.log("[v0] Atualizando produto:", {
      id: editProduct.id,
      title: editProduct.title,
      comingSoon: editProduct.comingSoon,
    })
    const updated = await updateProductInDb(editProduct.id, editProduct)
    if (updated) {
      console.log("[v0] Produto atualizado com sucesso:", updated)
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)))
      setEditingId(null)
      setEditProduct(null)
    } else {
      console.error("[v0] Falha ao atualizar produto")
      setErrorMessage("Erro ao atualizar produto. Verifique o console para mais detalhes.")
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    setErrorMessage(null)
    const deleted = await deleteProductFromDb(id)
    if (deleted) {
      const remainingProducts = products.filter((p) => p.id !== id)
      setProducts(remainingProducts)
      // Reordenar os produtos restantes após a exclusão
      await updateProductOrder(remainingProducts)
    } else {
      setErrorMessage("Erro ao deletar produto. Verifique o console para mais detalhes.")
    }
  }

  const productsValidados = products.filter((p) => !p.comingSoon).length
  const productsEmBreve = products.filter((p) => p.comingSoon).length
  const productsEmValidacao = 0 // Remover contagem de validação já que não usamos mais

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {errorMessage && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-lg">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span className="truncate">Produtos Validados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{productsValidados}</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-yellow-600 flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              Em Breve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-yellow-600">{productsEmBreve}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-600 flex items-center gap-2">
              <Loader2 className="h-4 w-4 shrink-0" />
              Em Validação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{productsEmValidacao}</p>
          </CardContent>
        </Card>
      </div>

      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Adicionar Produto
        </Button>
      )}

      {isAdding && (
        <div className="mb-4 md:mb-6 rounded-xl border border-primary/30 bg-card p-4 md:p-6">
          <h3 className="mb-4 font-medium text-base md:text-lg">Novo Produto</h3>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Título</Label>
              <Input
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                placeholder="Nome do produto"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">URL da Imagem</Label>
              <Input
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                placeholder="https://..."
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Nicho</Label>
              <Input
                value={newProduct.nicho}
                onChange={(e) => setNewProduct({ ...newProduct, nicho: e.target.value })}
                placeholder="Ex: Relacionamento"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Comissão</Label>
              <Input
                value={newProduct.comissao}
                onChange={(e) => setNewProduct({ ...newProduct, comissao: e.target.value })}
                placeholder="Ex: 75% - 80%"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Ticket</Label>
              <Input
                value={newProduct.ticket}
                onChange={(e) => setNewProduct({ ...newProduct, ticket: e.target.value })}
                placeholder="R$ 17,00"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Vendas</Label>
              <Input
                type="number"
                value={newProduct.vendas || 0}
                onChange={(e) => setNewProduct({ ...newProduct, vendas: Number.parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1 block text-xs md:text-sm">Link de Afiliação (Celetus)</Label>
              <Input
                value={newProduct.affiliateUrl}
                onChange={(e) => setNewProduct({ ...newProduct, affiliateUrl: e.target.value })}
                placeholder="https://celetus.com/..."
                className="text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1 block text-xs md:text-sm">Link de Afiliação (Hotmart)</Label>
              <Input
                value={newProduct.hotmartUrl || ""}
                onChange={(e) => setNewProduct({ ...newProduct, hotmartUrl: e.target.value })}
                placeholder="https://hotmart.com/..."
                className="text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1 block text-xs md:text-sm">Link do Drive</Label>
              <Input
                value={newProduct.driveUrl || ""}
                onChange={(e) => setNewProduct({ ...newProduct, driveUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="text-sm"
              />
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <h4 className="mb-3 text-xs md:text-sm font-medium text-muted-foreground">Métricas</h4>
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <Label className="mb-1 block text-xs md:text-sm">CPC Médio</Label>
                <Input
                  value={newProduct.metrics?.cpcMedio || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      metrics: { ...newProduct.metrics!, cpcMedio: e.target.value },
                    })
                  }
                  placeholder="R$ 0,75"
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs md:text-sm">Checkout</Label>
                <Input
                  value={newProduct.metrics?.checkout || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      metrics: { ...newProduct.metrics!, checkout: e.target.value },
                    })
                  }
                  placeholder="R$ 3,47"
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs md:text-sm">CPA Alvo</Label>
                <Input
                  value={newProduct.metrics?.cpaAlvo || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      metrics: { ...newProduct.metrics!, cpaAlvo: e.target.value },
                    })
                  }
                  placeholder="R$ 11,00"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <h4 className="mb-3 text-xs md:text-sm font-medium text-muted-foreground">Funil</h4>
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <Label className="mb-1 block text-xs md:text-sm">Número de Orderbumps</Label>
                <Input
                  type="number"
                  min={0}
                  value={newProduct.orderbumps || 0}
                  onChange={(e) => setNewProduct({ ...newProduct, orderbumps: Number.parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="mb-2 block text-xs md:text-sm">Upsell</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    type="button"
                    size="sm"
                    variant={newProduct.upsellStatus === "sim" ? "default" : "outline"}
                    onClick={() => setNewProduct({ ...newProduct, upsellStatus: "sim" })}
                    className="text-xs"
                  >
                    Sim
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={newProduct.upsellStatus === "nao" ? "default" : "outline"}
                    onClick={() => setNewProduct({ ...newProduct, upsellStatus: "nao" })}
                    className="text-xs"
                  >
                    Não
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={newProduct.upsellStatus === "em-breve" ? "default" : "outline"}
                    className={
                      newProduct.upsellStatus === "em-breve" ? "bg-blue-600 hover:bg-blue-700 text-xs" : "text-xs"
                    }
                    onClick={() => setNewProduct({ ...newProduct, upsellStatus: "em-breve" })}
                  >
                    Em Breve
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <h4 className="mb-3 text-xs md:text-sm font-medium text-muted-foreground">Estratégia Recomendada</h4>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Texto da Estratégia</Label>
              <textarea
                value={newProduct.estrategia || ""}
                onChange={(e) => setNewProduct({ ...newProduct, estrategia: e.target.value })}
                placeholder="Descreva a estratégia recomendada para vender este produto..."
                className="w-full min-h-[80px] md:min-h-[100px] rounded-lg border border-border bg-background px-3 py-2 text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Este texto aparecerá no popup "Estratégia Recomendada" do produto.
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <h4 className="mb-3 text-xs md:text-sm font-medium text-muted-foreground">Status do Produto</h4>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={!newProduct.comingSoon ? "default" : "outline"}
                onClick={() => setNewProduct({ ...newProduct, comingSoon: false })}
                className="text-xs"
              >
                Ativo
              </Button>
              <Button
                type="button"
                size="sm"
                variant={newProduct.comingSoon ? "default" : "outline"}
                className={newProduct.comingSoon ? "bg-yellow-600 hover:bg-yellow-700 text-xs" : "text-xs"}
                onClick={() => setNewProduct({ ...newProduct, comingSoon: true })}
              >
                Em Breve
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Produtos "Em Breve" aparecem na vitrine mas não podem ser acessados ainda.
            </p>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <h4 className="mb-3 text-xs md:text-sm font-medium text-muted-foreground">Faixa de Destaque</h4>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={!newProduct.badge ? "default" : "outline"}
                onClick={() => setNewProduct({ ...newProduct, badge: undefined })}
                className="text-xs"
              >
                Nenhuma
              </Button>
              <Button
                type="button"
                size="sm"
                variant={newProduct.badge === "bestseller" ? "default" : "outline"}
                className={
                  newProduct.badge === "bestseller"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-xs"
                    : "text-xs"
                }
                onClick={() => setNewProduct({ ...newProduct, badge: "bestseller" })}
              >
                <Crown className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Mais Vendido</span>
                <span className="sm:hidden">Vendido</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant={newProduct.badge === "trending" ? "default" : "outline"}
                className={
                  newProduct.badge === "trending"
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 border-0 text-xs"
                    : "text-xs"
                }
                onClick={() => setNewProduct({ ...newProduct, badge: "trending" })}
              >
                <Flame className="h-3 w-3 mr-1" />
                Em Alta
              </Button>
              <Button
                type="button"
                size="sm"
                variant={newProduct.badge === "novo" ? "default" : "outline"}
                className={
                  newProduct.badge === "novo"
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 border-0 text-xs"
                    : "text-xs"
                }
                onClick={() => setNewProduct({ ...newProduct, badge: "novo" })}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Novo
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              A faixa aparece no canto superior esquerdo do card do produto.
            </p>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <h4 className="mb-3 text-xs md:text-sm font-medium text-muted-foreground">Liberação</h4>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Data de Liberação</Label>
              <Input
                type="date"
                value={newProduct.releaseDate || ""}
                onChange={(e) => setNewProduct({ ...newProduct, releaseDate: e.target.value })}
                className="text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Deixe em branco para liberar imediatamente. Produtos com data futura não aparecem para os usuários.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                id="new-vip-only"
                checked={newProduct.vipOnly} // Corrigido para usar vipOnly ao invés de vip_only
                onChange={(e) => setNewProduct({ ...newProduct, vipOnly: e.target.checked })}
                className="h-4 w-4 md:h-5 md:w-5 rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="new-vip-only" className="text-xs md:text-sm font-medium cursor-pointer">
                Produto exclusivo para VIP
              </Label>
            </div>
          </div>

          <div className="mt-4 flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={saving} className="gap-2 w-full sm:w-auto">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={product.id} className="rounded-lg border bg-card p-3 md:p-4">
            {editingId === product.id && editProduct ? (
              <div className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <Input
                    value={editProduct.title}
                    onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                    placeholder="Título"
                    className="text-sm"
                  />
                  <Input
                    value={editProduct.image}
                    onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                    placeholder="URL da Imagem"
                    className="text-sm"
                  />
                  <Input
                    value={editProduct.nicho}
                    onChange={(e) => setEditProduct({ ...editProduct, nicho: e.target.value })}
                    placeholder="Nicho"
                    className="text-sm"
                  />
                  <Input
                    value={editProduct.comissao}
                    onChange={(e) => setEditProduct({ ...editProduct, comissao: e.target.value })}
                    placeholder="Comissão"
                    className="text-sm"
                  />
                  <Input
                    value={editProduct.ticket}
                    onChange={(e) => setEditProduct({ ...editProduct, ticket: e.target.value })}
                    placeholder="Ticket"
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    value={editProduct.vendas || 0}
                    onChange={(e) => setEditProduct({ ...editProduct, vendas: Number.parseInt(e.target.value) || 0 })}
                    placeholder="Vendas"
                    className="text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="mb-1 block text-xs text-muted-foreground">Link Celetus</Label>
                  <Input
                    value={editProduct.affiliateUrl}
                    onChange={(e) => setEditProduct({ ...editProduct, affiliateUrl: e.target.value })}
                    placeholder="Link Afiliação Celetus"
                    className="text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="mb-1 block text-xs text-muted-foreground">Link Hotmart</Label>
                  <Input
                    value={editProduct.hotmartUrl || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, hotmartUrl: e.target.value })}
                    placeholder="Link Afiliação Hotmart"
                    className="text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    value={editProduct.driveUrl || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, driveUrl: e.target.value })}
                    placeholder="Link Drive"
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <Input
                    value={editProduct.metrics?.cpcMedio || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        metrics: { ...editProduct.metrics!, cpcMedio: e.target.value },
                      })
                    }
                    placeholder="CPC Médio"
                    className="text-sm"
                  />
                  <Input
                    value={editProduct.metrics?.checkout || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        metrics: { ...editProduct.metrics!, checkout: e.target.value },
                      })
                    }
                    placeholder="Checkout"
                    className="text-sm"
                  />
                  <Input
                    value={editProduct.metrics?.cpaAlvo || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        metrics: { ...editProduct.metrics!, cpaAlvo: e.target.value },
                      })
                    }
                    placeholder="CPA Alvo"
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <Label className="mb-1 block text-xs md:text-sm">Orderbumps</Label>
                    <Input
                      type="number"
                      min={0}
                      value={editProduct.orderbumps || 0}
                      onChange={(e) =>
                        setEditProduct({ ...editProduct, orderbumps: Number.parseInt(e.target.value) || 0 })
                      }
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-xs md:text-sm">Upsell</Label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        type="button"
                        size="sm"
                        variant={editProduct.upsellStatus === "sim" ? "default" : "outline"}
                        onClick={() => setEditProduct({ ...editProduct, upsellStatus: "sim" })}
                        className="text-xs"
                      >
                        Sim
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          editProduct.upsellStatus === "nao" || !editProduct.upsellStatus ? "default" : "outline"
                        }
                        onClick={() => setEditProduct({ ...editProduct, upsellStatus: "nao" })}
                        className="text-xs"
                      >
                        Não
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={editProduct.upsellStatus === "em-breve" ? "default" : "outline"}
                        className={
                          editProduct.upsellStatus === "em-breve" ? "bg-blue-600 hover:bg-blue-700 text-xs" : "text-xs"
                        }
                        onClick={() => setEditProduct({ ...editProduct, upsellStatus: "em-breve" })}
                      >
                        Em Breve
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block text-xs md:text-sm">Faixa de Destaque</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={!editProduct.badge ? "default" : "outline"}
                        onClick={() => setEditProduct({ ...editProduct, badge: undefined })}
                        className="text-xs"
                      >
                        Nenhuma
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={editProduct.badge === "bestseller" ? "default" : "outline"}
                        className={
                          editProduct.badge === "bestseller"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-xs"
                            : "text-xs"
                        }
                        onClick={() => setEditProduct({ ...editProduct, badge: "bestseller" })}
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Mais Vendido</span>
                        <span className="sm:hidden">Vendido</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={editProduct.badge === "trending" ? "default" : "outline"}
                        className={
                          editProduct.badge === "trending"
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 border-0 text-xs"
                            : "text-xs"
                        }
                        onClick={() => setEditProduct({ ...editProduct, badge: "trending" })}
                      >
                        <Flame className="h-3 w-3 mr-1" />
                        Em Alta
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={editProduct.badge === "novo" ? "default" : "outline"}
                        className={
                          editProduct.badge === "novo"
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 border-0 text-xs"
                            : "text-xs"
                        }
                        onClick={() => setEditProduct({ ...editProduct, badge: "novo" })}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Novo
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <Label className="mb-2 block text-xs md:text-sm">Status de Validação</Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        !editProduct.validation_status || editProduct.validation_status === "disponivel"
                          ? "default"
                          : "outline"
                      }
                      className={
                        !editProduct.validation_status || editProduct.validation_status === "disponivel"
                          ? "bg-green-600 hover:bg-green-700 text-xs"
                          : "text-xs"
                      }
                      onClick={() => setEditProduct({ ...editProduct, validation_status: "disponivel" })}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Disponível
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={editProduct.validation_status === "em-breve" ? "default" : "outline"}
                      className={
                        editProduct.validation_status === "em-breve"
                          ? "bg-yellow-600 hover:bg-yellow-700 text-xs"
                          : "text-xs"
                      }
                      onClick={() => setEditProduct({ ...editProduct, validation_status: "em-breve" })}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Em Breve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={editProduct.validation_status === "em-validacao" ? "default" : "outline"}
                      className={
                        editProduct.validation_status === "em-validacao"
                          ? "bg-blue-600 hover:bg-blue-700 text-xs"
                          : "text-xs"
                      }
                      onClick={() => setEditProduct({ ...editProduct, validation_status: "em-validacao" })}
                    >
                      <Loader2 className="h-3 w-3 mr-1" />
                      Em Validação
                    </Button>
                  </div>
                </div>

                <div className="col-span-2">
                  <Label className="mb-1 block text-xs md:text-sm">Estratégia Recomendada</Label>
                  <textarea
                    value={editProduct.estrategia || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, estrategia: e.target.value })}
                    placeholder="Descreva a estratégia recomendada..."
                    className="w-full min-h-[80px] rounded-lg border border-border bg-background px-3 py-2 text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-xs md:text-sm">Status</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={!editProduct.comingSoon ? "default" : "outline"}
                      onClick={() => setEditProduct({ ...editProduct, comingSoon: false })}
                      className="text-xs"
                    >
                      Ativo
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={editProduct.comingSoon ? "default" : "outline"}
                      className={editProduct.comingSoon ? "bg-yellow-600 hover:bg-yellow-700 text-xs" : "text-xs"}
                      onClick={() => setEditProduct({ ...editProduct, comingSoon: true })}
                    >
                      Em Breve
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3 col-span-full mt-2">
                  <input
                    type="checkbox"
                    id="edit-vip-only"
                    checked={editProduct.vipOnly || false} // Corrigido para usar vipOnly ao invés de vip_only
                    onChange={(e) => setEditProduct({ ...editProduct, vipOnly: e.target.checked })}
                    className="h-4 w-4 md:h-5 md:w-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="edit-vip-only" className="text-xs md:text-sm font-medium cursor-pointer">
                    Produto exclusivo para VIP
                  </Label>
                </div>

                <div className="mt-4 flex flex-col-reverse sm:flex-row justify-end gap-2 col-span-full">
                  <Button variant="outline" onClick={() => setEditingId(null)} className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate} disabled={saving} className="gap-2 w-full sm:w-auto">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 items-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => moveProduct(index, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => moveProduct(index, "down")}
                    disabled={index === products.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {product.badge && (
                  <div className="absolute top-2 left-2 z-10">
                    {product.badge === "bestseller" && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-black text-xs">
                        <Crown className="h-3.5 w-3.5 mr-1" /> Mais Vendido
                      </Badge>
                    )}
                    {product.badge === "trending" && (
                      <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 border-0 text-black text-xs">
                        <Flame className="h-3.5 w-3.5 mr-1" /> Em Alta
                      </Badge>
                    )}
                    {product.badge === "novo" && (
                      <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 border-0 text-black text-xs">
                        <Sparkles className="h-3.5 w-3.5 mr-1" /> Novo
                      </Badge>
                    )}
                  </div>
                )}
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.nicho} • {product.comissao} • {product.ticket}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    {product.metrics && (
                      <>
                        <span className="text-blue-400">CPC: {product.metrics.cpcMedio}</span>
                        <span className="text-green-400">Checkout: {product.metrics.checkout}</span>
                        <span className="text-amber-400">CPA: {product.metrics.cpaAlvo}</span>
                      </>
                    )}
                    {product.orderbumps !== undefined && product.orderbumps > 0 && (
                      <span className="text-orange-400">Orderbumps: {product.orderbumps}</span>
                    )}
                    {product.upsellStatus === "sim" && <span className="text-pink-400">Upsell Ativo</span>}
                    {product.upsellStatus === "em-breve" && <span className="text-blue-400">Upsell Em Breve</span>}
                    {product.releaseDate && (
                      <span className="text-purple-400">
                        Liberação: {new Date(product.releaseDate).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    {product.comingSoon && <Badge className="bg-yellow-600 text-black">Em Breve</Badge>}
                    {product.vipOnly && <Badge className="bg-indigo-600">VIP</Badge>}{" "}
                    {/* Corrigido para usar vipOnly */}
                    {product.validation_status === "em-breve" && (
                      <Badge className="bg-yellow-600 text-black">Em Breve</Badge>
                    )}
                    {product.validation_status === "em-validacao" && (
                      <Badge className="bg-blue-600">Em Validação</Badge>
                    )}
                    {(!product.validation_status || product.validation_status === "disponivel") && (
                      <Badge className="bg-green-600">Disponível</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(product.id)
                      setEditProduct({ ...product })
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function UsersAdmin() {
  const PAGE_SIZE = 20
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [avatars, setAvatars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [vipFilter, setVipFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("") // Campo de busca
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalAffiliatesCount, setTotalAffiliatesCount] = useState(0)
  const [editingUser, setEditingUser] = useState<Affiliate | null>(null)
  const [editForm, setEditForm] = useState({ name: "", email: "", nome_celetus: "" })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<Affiliate | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [userToResetPassword, setUserToResetPassword] = useState<Affiliate | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [resettingPassword, setResettingPassword] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  async function fetchAffiliates() {
    setLoading(true)
    const supabase = createClient()
    const from = (currentPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from("affiliates")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    if (vipFilter === "yes") {
      query = query.eq("is_vip", true)
    } else if (vipFilter === "no") {
      query = query.eq("is_vip", false)
    }

    if (debouncedSearchQuery) {
      query = query.or(`email.ilike.%${debouncedSearchQuery}%,name.ilike.%${debouncedSearchQuery}%`)
    }

    const { data, error, count } = await query.range(from, to)

    if (!error && data) {
      setAffiliates(data)
      setTotalAffiliatesCount(count || 0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAffiliates()
  }, [currentPage, statusFilter, vipFilter, debouncedSearchQuery])

  useEffect(() => {
    fetchAvatars()
  }, [])

  async function fetchAvatars() {
    const supabase = createClient()
    const { data } = await supabase.from("avatars").select("*").eq("is_used", false).limit(30)
    if (data) {
      setAvatars(data)
    }
  }

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    const { error } = await supabase.from("affiliates").update({ status }).eq("id", id)

    if (!error) {
      setAffiliates(affiliates.map((a) => (a.id === id ? { ...a, status } : a)))
    }
  }

  async function toggleVip(id: string, currentVip: boolean) {
    const supabase = createClient()
    const { error } = await supabase.from("affiliates").update({ is_vip: !currentVip }).eq("id", id)

    if (!error) {
      setAffiliates(affiliates.map((a) => (a.id === id ? { ...a, is_vip: !currentVip } : a)))
    }
  }

  async function assignRandomAvatar(affiliateId: string) {
    if (avatars.length === 0) return

    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]
    const supabase = createClient()

    // Atualizar o afiliado com a foto do avatar
    const { error: updateError } = await supabase
      .from("affiliates")
      .update({ photo_url: randomAvatar.image_url, avatar_id: randomAvatar.id })
      .eq("id", affiliateId)

    if (!updateError) {
      // Marcar avatar como usado
      await supabase.from("avatars").update({ is_used: true, used_by: affiliateId }).eq("id", randomAvatar.id)

      // Atualizar estado local
      setAffiliates(
        affiliates.map((a) =>
          a.id === affiliateId ? { ...a, photo_url: randomAvatar.image_url, avatar_id: randomAvatar.id } : a,
        ),
      )
      setAvatars(avatars.filter((av) => av.id !== randomAvatar.id))
    }
  }

  async function updateUserInfo(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("affiliates")
      .update({
        name: editForm.name,
        email: editForm.email,
        nome_celetus: editForm.nome_celetus || null,
      })
      .eq("id", id)

    if (!error) {
      setAffiliates(
        affiliates.map((a) =>
          a.id === id ? { ...a, name: editForm.name, email: editForm.email, nome_celetus: editForm.nome_celetus } : a,
        ),
      )
      setEditDialogOpen(false)
      setEditingUser(null)
    }
  }

  async function deleteUser(id: string) {
    setDeleting(true)
    const supabase = createClient()

    // Liberar avatar se o usuário tinha um
    const user = affiliates.find((a) => a.id === id)
    if (user?.avatar_id) {
      await supabase.from("avatars").update({ is_used: false, used_by: null }).eq("id", user.avatar_id)
    }

    const { error } = await supabase.from("affiliates").delete().eq("id", id)

    if (!error) {
      setAffiliates(affiliates.filter((a) => a.id !== id))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
    setDeleting(false)
  }

  async function resetPassword(affiliateId: string, customPassword?: string) {
    setResettingPassword(true)
    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateId,
          newPassword: customPassword || "123456",
        }),
      })

      const data = await response.json()
      if (response.ok) {
        alert("Senha resetada com sucesso! A nova senha é: 123456")
        setResettingPassword(false)
        setResetPasswordDialogOpen(false)
        setUserToResetPassword(null)
      } else {
        alert(`Erro ao resetar senha: ${data.error}`)
        setResettingPassword(false)
      }
    } catch (error) {
      alert("Erro de rede ao resetar senha.")
      setResettingPassword(false)
    }
  }

  const openEditDialog = (affiliate: Affiliate) => {
    setEditingUser(affiliate)
    setEditForm({
      name: affiliate.name || "",
      email: affiliate.email || "",
      nome_celetus: affiliate.nome_celetus || "",
    })
    setEditDialogOpen(true)
  }

  const openResetPasswordDialog = (affiliate: Affiliate) => {
    setUserToResetPassword(affiliate)
    setResetPasswordDialogOpen(true)
  }

  const totalUsers = totalAffiliatesCount
  const totalVip = affiliates.filter((a) => a.is_vip).length
  const totalPages = Math.max(1, Math.ceil(totalAffiliatesCount / PAGE_SIZE))

  const exportToCSV = () => {
    console.log("[v0] Iniciando exportação CSV de usuários")
    
    // Cabeçalhos do CSV
    const headers = [
      "Nome",
      "Email",
      "WhatsApp",
      "Status",
      "VIP",
      "Plano",
      "Nome Celetus",
      "Data de Cadastro",
      "Primeira Venda",
      "Total de Comissões",
      "Onboarding Completo"
    ]
    
    // Dados dos afiliados
    const rows = affiliates.map((affiliate) => [
      affiliate.name || "",
      affiliate.email || "",
      affiliate.whatsapp || "",
      affiliate.status || "",
      affiliate.is_vip ? "Sim" : "Não",
      affiliate.plan_purchased || "",
      affiliate.nome_celetus || "",
      affiliate.created_at ? new Date(affiliate.created_at).toLocaleDateString("pt-BR") : "",
      affiliate.first_sale_date ? new Date(affiliate.first_sale_date).toLocaleDateString("pt-BR") : "",
      affiliate.total_commissions ? `R$ ${Number(affiliate.total_commissions).toFixed(2)}` : "R$ 0,00",
      affiliate.onboarding_completed ? "Sim" : "Não"
    ])
    
    // Criar conteúdo CSV
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")
    
    // Criar blob e fazer download
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `afiliados_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log("[v0] Exportação CSV concluída:", rows.length, "usuários")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <strong className="text-foreground">{totalUsers}</strong> cadastrados
            </span>
            <span className="flex items-center gap-1">
              <Crown className="h-4 w-4 text-yellow-500" />
              <strong className="text-yellow-500">{totalVip}</strong> VIP na página
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button onClick={exportToCSV} variant="outline" className="gap-2 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Exportar Página ({affiliates.length})
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por email ou nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64 text-sm"
            />
          </div>
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">Todos os Status</option>
            <option value="approved">Aprovados</option>
            <option value="pending">Pendentes</option>
            <option value="rejected">Rejeitados</option>
            <option value="paused">Pausados</option>
          </select>
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={vipFilter}
            onChange={(e) => {
              setVipFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">Todos os VIPs</option>
            <option value="yes">VIPs</option>
            <option value="no">Não VIPs</option>
          </select>
        </div>
      </div>

      {/* Dialog de Edição */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Usuário: {editingUser?.name}</DialogTitle>
            <DialogDescription>Modifique as informações do usuário abaixo.</DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="orderbumps">Orderbumps</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name" className="mb-1 block text-sm">
                  Nome
                </Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="edit-email" className="mb-1 block text-sm">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nome-celetus" className="text-sm">
                  Nome no Checkout Celetus
                </Label>
                <Input
                  id="edit-nome-celetus"
                  value={editForm.nome_celetus}
                  onChange={(e) => setEditForm({ ...editForm, nome_celetus: e.target.value })}
                  placeholder="Ex: JSM MARKETING"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Copie <strong>EXATAMENTE</strong> o nome que aparece nas vendas da Celetus. Isso vincula as comissões
                  automaticamente.
                </p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => editingUser && updateUserInfo(editingUser.id)}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="orderbumps" className="py-4">
              {editingUser && <UserOrderbumps userId={editingUser.id} />}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário "{userToDelete?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => userToDelete && deleteUser(userToDelete.id)}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Resetar Senha */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar Senha</DialogTitle>
            <DialogDescription>
              Você deseja resetar a senha do usuário "{userToResetPassword?.name}"? A nova senha será "123456".
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => userToResetPassword && resetPassword(userToResetPassword.id)}
              disabled={resettingPassword}
            >
              {resettingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resetar Senha"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {affiliates.map((affiliate) => (
          <div key={affiliate.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-secondary border-2 border-border">
                    {affiliate.photo_url ? (
                      <img
                        src={affiliate.photo_url || "/placeholder.svg"}
                        alt={affiliate.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                        {affiliate.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {affiliate.is_vip && (
                    <div className="absolute -top-1 -right-1 rounded-full bg-amber-500 p-1">
                      <Crown className="h-3 w-3 text-black" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{affiliate.name}</p>
                    {affiliate.is_vip && <Badge className="bg-amber-500 text-black text-xs">VIP</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{affiliate.email}</p>
                  <p className="text-xs text-muted-foreground">WhatsApp: {affiliate.whatsapp}</p>
                  {affiliate.nome_celetus && (
                    <p className="text-xs text-muted-foreground">Celetus: {affiliate.nome_celetus}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Botão Editar */}
                <Button size="sm" variant="outline" onClick={() => openEditDialog(affiliate)}>
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10 bg-transparent"
                  onClick={() => {
                    setUserToDelete(affiliate)
                    setDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* Botão Atribuir Avatar */}
                {!affiliate.photo_url && avatars.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => assignRandomAvatar(affiliate.id)}
                    title="Atribuir avatar aleatório"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}

                {/* VIP Toggle */}
                <div className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                  <Crown className={`h-4 w-4 ${affiliate.is_vip ? "text-amber-500" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">VIP</span>
                  <Switch
                    checked={affiliate.is_vip || false}
                    onCheckedChange={() => toggleVip(affiliate.id, affiliate.is_vip || false)}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>

                <Badge
                  variant={
                    affiliate.status === "approved"
                      ? "default"
                      : affiliate.status === "pending"
                        ? "secondary"
                        : affiliate.status === "paused"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {affiliate.status === "approved"
                    ? "Aprovado"
                    : affiliate.status === "pending"
                      ? "Pendente"
                      : affiliate.status === "paused"
                        ? "Pausado"
                        : "Rejeitado"}
                </Badge>
                {affiliate.status === "pending" && (
                  <>
                    <Button size="sm" variant="default" onClick={() => updateStatus(affiliate.id, "approved")}>
                      <Check className="mr-1 h-4 w-4" />
                      Aprovar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(affiliate.id, "rejected")}>
                      <UserX className="mr-1 h-4 w-4" />
                      Rejeitar
                    </Button>
                  </>
                )}
                {affiliate.status === "approved" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(affiliate.id, "paused")}>
                    <Pause className="mr-1 h-4 w-4" />
                    Pausar
                  </Button>
                )}
                {affiliate.status === "paused" && (
                  <Button size="sm" variant="default" onClick={() => updateStatus(affiliate.id, "approved")}>
                    <Play className="mr-1 h-4 w-4" />
                    Reativar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openResetPasswordDialog(affiliate)}
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                  title="Resetar Senha"
                >
                  <KeyRound className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {affiliates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum usuário encontrado com os filtros selecionados.
        </div>
      )}

      {totalAffiliatesCount > PAGE_SIZE && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages} • {totalAffiliatesCount} usuários
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function RankingAdmin() {
  const [rankings, setRankings] = useState<any[]>([])
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [salesCount, setSalesCount] = useState(0)
  const [addPositionChange, setAddPositionChange] = useState<"up" | "down" | "same">("same")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editSales, setEditSales] = useState(0)
  const [editPositionChange, setEditPositionChange] = useState<"up" | "down" | "same">("same")
  const [loading, setLoading] = useState(true)
  const [prizes, setPrizes] = useState<{ position: number; prize_description: string }[]>([])
  const [showPrizes, setShowPrizes] = useState(false)
  const [newPrizes, setNewPrizes] = useState<{ [key: number]: string }>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [addMonth, setAddMonth] = useState(new Date().getMonth() + 1)
  const [addYear, setAddYear] = useState(new Date().getFullYear())

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  useEffect(() => {
    fetchData()
  }, [selectedMonth, selectedYear])

  async function fetchData() {
    setLoading(true)
    const supabase = createClient()

    // Buscar afiliados aprovados
    const { data: affiliatesData } = await supabase.from("affiliates").select("*").eq("status", "approved")

    if (affiliatesData) setAffiliates(affiliatesData)

    // Buscar ranking do mês selecionado
    const { data: rankingData } = await supabase
      .from("monthly_rankings")
      .select(`
        *,
        affiliates (
          id,
          name,
          email,
          photo_url
        )
      `)
      .eq("month", selectedMonth)
      .eq("year", selectedYear)
      .order("sales_count", { ascending: false })

    if (rankingData) setRankings(rankingData)

    const { data: prizesData } = await supabase
      .from("ranking_prizes")
      .select("*")
      .eq("month", selectedMonth)
      .eq("year", selectedYear)
      .order("position", { ascending: true })

    if (prizesData) {
      setPrizes(prizesData)
      const prizeMap: { [key: number]: string } = { 1: "", 2: "", 3: "", 4: "", 5: "" }
      prizesData.forEach((p) => {
        prizeMap[p.position] = p.prize_description
      })
      setNewPrizes(prizeMap)
    } else {
      setNewPrizes({ 1: "", 2: "", 3: "", 4: "", 5: "" })
    }

    setLoading(false)
  }

  const handleSavePrizes = async () => {
    const supabase = createClient()

    for (const position of [1, 2, 3, 4, 5]) {
      const description = newPrizes[position]
      if (description.trim()) {
        await supabase.from("ranking_prizes").upsert(
          {
            month: selectedMonth,
            year: selectedYear,
            position,
            prize_description: description.trim(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "month,year,position" },
        )
      } else {
        // Remove se estiver vazio
        await supabase
          .from("ranking_prizes")
          .delete()
          .eq("month", selectedMonth)
          .eq("year", selectedYear)
          .eq("position", position)
      }
    }

    fetchData()
    setShowPrizes(false)
  }

  const availableAffiliates = affiliates.filter((a) => {
    const matchesSearch =
      searchTerm === "" ||
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const notInRanking = !rankings.some((r) => r.affiliate_id === a.id)
    return matchesSearch && notInRanking
  })

  const handleAdd = async () => {
    if (!selectedUserId) return

    const supabase = createClient()
    const { error } = await supabase.from("monthly_rankings").insert({
      affiliate_id: selectedUserId,
      month: addMonth,
      year: addYear,
      sales_count: salesCount,
      sales_value: 0, // Assuming sales_value and points might be added later
      points: salesCount * 10,
      position: rankings.length + 1, // This might need adjustment after fetch
      position_change: addPositionChange,
    })

    if (!error) {
      fetchData() // Re-fetch to update rankings and availableAffiliates
      setSelectedUserId("")
      setSalesCount(0)
      setSearchTerm("") // Resetar termo de busca
      setIsAdding(false)
      setAddPositionChange("same") // Resetar o estado
    }
  }

  const handleUpdateSales = async (id: string) => {
    const supabase = createClient()
    await supabase
      .from("monthly_rankings")
      .update({
        sales_count: editSales,
        points: editSales * 10, // Update points based on new sales count
        position_change: editPositionChange,
      })
      .eq("id", id)

    fetchData() // Re-fetch to get updated data
    setEditingId(null)
    setEditPositionChange("same") // Resetar o estado
  }

  const handleRemove = async (id: string) => {
    const supabase = createClient()
    await supabase.from("monthly_rankings").delete().eq("id", id)
    fetchData() // Re-fetch to update rankings
  }

  // Gerar opções de meses (últimos 12 meses)
  const monthOptions = []
  for (let i = 0; i < 12; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    monthOptions.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
    })
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Ranking Mensal</h2>
        <div className="flex items-center gap-3">
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={`${selectedMonth}-${selectedYear}`}
            onChange={(e) => {
              const [m, y] = e.target.value.split("-")
              setSelectedMonth(Number.parseInt(m))
              setSelectedYear(Number.parseInt(y))
            }}
          >
            {monthOptions.map((opt) => (
              <option key={`${opt.month}-${opt.year}`} value={`${opt.month}-${opt.year}`}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={() => setShowPrizes(!showPrizes)} className="gap-2">
            <Trophy className="h-4 w-4" />
            Premiações
          </Button>
          <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>

      {showPrizes && (
        <div className="mb-6 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium">
              Premiações de {monthNames[selectedMonth - 1]} {selectedYear}
            </h3>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((position) => (
              <div key={position} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    position === 1
                      ? "bg-yellow-500 text-black"
                      : position === 2
                        ? "bg-gray-400 text-black"
                        : position === 3
                          ? "bg-amber-700 text-white"
                          : "bg-secondary text-foreground"
                  }`}
                >
                  {position}º
                </div>
                <Input
                  className="flex-1 text-sm"
                  placeholder={`Prêmio para o ${position}º lugar (ex: R$ 500,00, iPhone 15, etc.)`}
                  value={newPrizes[position]}
                  onChange={(e) => setNewPrizes({ ...newPrizes, [position]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPrizes(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePrizes} className="gap-2 bg-yellow-600 hover:bg-yellow-700">
              <Save className="h-4 w-4" />
              Salvar Premiações
            </Button>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-card p-6">
          <h3 className="mb-4 font-medium text-base md:text-lg">Adicionar ao Ranking</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="mb-1 block text-xs md:text-sm">Buscar Usuário (nome ou email)</Label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome ou email..."
                className="mb-2 text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Usuário</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Selecione um usuário</option>
                {availableAffiliates.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Número de Vendas</Label>
              <Input
                type="number"
                min={0}
                value={salesCount}
                onChange={(e) => setSalesCount(Number.parseInt(e.target.value) || 0)}
                placeholder="0"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Mês</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={addMonth}
                onChange={(e) => setAddMonth(Number.parseInt(e.target.value))}
              >
                {monthNames.map((name, index) => (
                  <option key={index} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Ano</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={addYear}
                onChange={(e) => setAddYear(Number.parseInt(e.target.value))}
              >
                {[2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block text-xs md:text-sm">Mudança de Posição</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={addPositionChange === "up" ? "default" : "outline"}
                  onClick={() => setAddPositionChange("up")}
                  className={addPositionChange === "up" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <TrendingUp className="h-4 w-4" /> Subiu
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={addPositionChange === "down" ? "default" : "outline"}
                  onClick={() => setAddPositionChange("down")}
                  className={addPositionChange === "down" ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  <TrendingUp className="h-4 w-4 rotate-180" /> Desceu
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={addPositionChange === "same" ? "default" : "outline"}
                  onClick={() => setAddPositionChange("same")}
                >
                  <Flame className="h-4 w-4" /> Sem Mudança
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={!selectedUserId}>
              <Save className="mr-1 h-4 w-4" />
              Salvar
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">Carregando...</div>
      ) : rankings.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          Nenhum afiliado no ranking de {monthNames[selectedMonth - 1]} {selectedYear}
        </div>
      ) : (
        <div className="space-y-4">
          {rankings.map((member, index) => (
            <div key={member.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                    index === 0
                      ? "bg-yellow-500 text-black"
                      : index === 1
                        ? "bg-gray-400 text-black"
                        : index === 2
                          ? "bg-amber-700 text-white"
                          : "bg-secondary text-foreground"
                  }`}
                >
                  {index + 1}º
                </div>
                <img
                  src={member.affiliates?.photo_url || "/placeholder.svg?height=48&width=48&query=avatar"}
                  alt={member.affiliates?.name || "Afiliado"}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{member.affiliates?.name || "Usuário"}</p>
                  <p className="text-xs text-muted-foreground">
                    {monthNames[selectedMonth - 1]} {selectedYear}
                  </p>
                </div>
                {editingId === member.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-20 text-sm"
                      value={editSales}
                      onChange={(e) => setEditSales(Number.parseInt(e.target.value) || 0)}
                    />
                    <select
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      value={editPositionChange}
                      onChange={(e) => setEditPositionChange(e.target.value as "up" | "down" | "same")}
                    >
                      <option value="same">= Manteve</option>
                      <option value="up">↑ Subiu</option>
                      <option value="down">↓ Desceu</option>
                    </select>
                    <Button size="sm" onClick={() => handleUpdateSales(member.id)}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {member.position_change === "up" && <span className="text-green-500 font-bold">↑</span>}
                    {member.position_change === "down" && <span className="text-red-500 font-bold">↓</span>}
                    {member.position_change === "same" && <span className="text-muted-foreground">-</span>}
                    <span className="font-semibold text-primary">{member.sales_count} vendas</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(member.id)
                        setEditSales(member.sales_count)
                        setEditPositionChange(member.position_change || "same")
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleRemove(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AnnouncementsAdmin() {
  type PublicationStatus = "draft" | "published"

  const formatDateTimeLocal = (value: Date) => {
    const offset = value.getTimezoneOffset()
    const localDate = new Date(value.getTime() - offset * 60 * 1000)
    return localDate.toISOString().slice(0, 16)
  }

  const slugifyAnnouncement = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")

  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedPostSlug, setSavedPostSlug] = useState<string | null>(null)
  const [savedPublicationStatus, setSavedPublicationStatus] = useState<PublicationStatus | null>(null)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    excerpt: "",
    content: "",
    coverUrl: "",
    linkUrl: "",
    materialsJson: "",
    slug: "",
    type: "info" as "info" | "promo" | "update" | "alert",
    contentType: "blog" as "blog" | "lesson" | "live" | "creatives",
    active: true,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  useEffect(() => {
    if (slugManuallyEdited) return

    setNewAnnouncement((prev) => ({
      ...prev,
      slug: slugifyAnnouncement(prev.title),
    }))
  }, [newAnnouncement.title, slugManuallyEdited])

  const fetchAnnouncements = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setAnnouncements(data)
    }
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!newAnnouncement.title && !newAnnouncement.message && !newAnnouncement.content) return

    const textFallback = newAnnouncement.message || newAnnouncement.excerpt || newAnnouncement.title
    let materials: Array<{ label: string; url: string; type?: string }> = []

    if (newAnnouncement.materialsJson.trim()) {
      try {
        const parsed = JSON.parse(newAnnouncement.materialsJson)
        if (Array.isArray(parsed)) {
          materials = parsed
        } else {
          window.alert("Materiais inválidos: use um array JSON.")
          return
        }
      } catch {
        window.alert("JSON de materiais inválido.")
        return
      }
    }

    const { error } = await supabase.from("announcements").insert({
      title: newAnnouncement.title || null,
      text: textFallback,
      excerpt: newAnnouncement.excerpt || null,
      content: newAnnouncement.content || null,
      cover_url: newAnnouncement.coverUrl || null,
      link_url: newAnnouncement.linkUrl || null,
      materials: materials.length > 0 ? materials : null,
      slug: newAnnouncement.slug || null,
      type: newAnnouncement.type,
      content_type: newAnnouncement.contentType,
      active: newAnnouncement.active,
    })

    if (!error) {
      setNewAnnouncement({
        title: "",
        message: "",
        excerpt: "",
        content: "",
        coverUrl: "",
        linkUrl: "",
        materialsJson: "",
        slug: "",
        type: "info",
        contentType: "blog",
        active: true,
      })
      setIsAdding(false)
      fetchAnnouncements()
    } else {
      setFormError(error.message)
    }

    setSaving(false)
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("announcements").update({ active: !currentActive }).eq("id", id)

    if (!error) {
      fetchAnnouncements()
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id)

    if (!error) {
      fetchAnnouncements()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gerenciar Canal de Novidades</h2>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Novidade
        </Button>
      </div>

      {savedPostSlug && savedPublicationStatus === "published" && (
        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-emerald-200">Post salvo com sucesso.</p>
            <Link href={`/avisos/${savedPostSlug}`} target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Eye className="h-4 w-4" />
                Visualizar no blog
              </Button>
            </Link>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-card p-6">
          <h3 className="mb-4 font-medium text-base md:text-lg">Nova Novidade</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Título do Post</Label>
              <Input
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="Ex: Nova atualização no ranking de afiliados"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Mensagem curta (banner)</Label>
              <Input
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                placeholder="Ex: 5 CRIATIVOS ADICIONADOS NO PRODUTO TAL"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Resumo</Label>
              <Input
                value={newAnnouncement.excerpt}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, excerpt: e.target.value })}
                placeholder="Uma chamada curta para a listagem do blog."
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Slug (opcional)</Label>
              <Input
                value={newAnnouncement.slug}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, slug: e.target.value })}
                placeholder="ex: manifesto-afilia360"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Imagem de capa URL</Label>
              <Input
                value={newAnnouncement.coverUrl}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, coverUrl: e.target.value })}
                placeholder="https://..."
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs md:text-sm">Link externo (opcional)</Label>
              <Input
                value={newAnnouncement.linkUrl}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, linkUrl: e.target.value })}
                placeholder="https://..."
                className="text-sm"
              />
            </div>
            <div>
              <Label className="mb-2 block text-xs md:text-sm">Tipo</Label>
              <div className="flex gap-2 flex-wrap">
                {(["info", "promo", "update", "alert"] as const).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={newAnnouncement.type === type ? "default" : "outline"}
                    onClick={() => setNewAnnouncement({ ...newAnnouncement, type })}
                    className={
                      newAnnouncement.type === type
                        ? type === "info"
                          ? "bg-blue-600"
                          : type === "promo"
                            ? "bg-green-600"
                            : type === "update"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                        : ""
                    }
                  >
                    {type === "info" ? "Info" : type === "promo" ? "Promoção" : type === "update" ? "Atualização" : "Alerta"}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-xs md:text-sm">Tipo de conteúdo do canal</Label>
              <div className="flex gap-2 flex-wrap">
                {(["blog", "lesson", "live", "creatives"] as const).map((contentType) => (
                  <Button
                    key={contentType}
                    size="sm"
                    variant={newAnnouncement.contentType === contentType ? "default" : "outline"}
                    onClick={() => setNewAnnouncement({ ...newAnnouncement, contentType })}
                  >
                    {contentType === "blog"
                      ? "Post blog"
                      : contentType === "lesson"
                        ? "Aula nova"
                        : contentType === "live"
                          ? "Live"
                          : "Criativos"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Label className="mb-1 block text-xs md:text-sm">Conteúdo completo do artigo</Label>
            <textarea
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              placeholder="Escreva aqui o conteúdo do artigo..."
              className="min-h-[180px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-4">
            <Label className="mb-1 block text-xs md:text-sm">Materiais (JSON opcional)</Label>
            <textarea
              value={newAnnouncement.materialsJson}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, materialsJson: e.target.value })}
              placeholder='[{"label":"Slides PDF","url":"https://.../slides.pdf","type":"pdf"},{"label":"Material HTML","url":"https://.../material.html","type":"html"}]'
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Dica: para Live + materiais, preencha o Link externo com URL do YouTube e adicione PDF/HTML neste campo.
            </p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd}>
              <Save className="mr-1 h-4 w-4" />
              Salvar
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Nenhuma novidade cadastrada
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {announcement.cover_url && (
                    <img
                      src={announcement.cover_url || "/placeholder.jpg"}
                      alt={announcement.title || announcement.text || "Aviso"}
                      className="h-16 w-24 rounded-md border border-border object-cover"
                    />
                  )}
                  <div>
                    <p className={`font-medium ${announcement.active ? "" : "text-muted-foreground line-through"}`}>
                      {announcement.title || "Sem título"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {announcement.excerpt || announcement.text}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString("pt-BR") : ""}
                    </p>
                    <p className="mt-1 text-xs text-primary/80">
                      Tipo do canal: {announcement.content_type || "blog"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      announcement.type === "info"
                        ? "border-blue-500 text-blue-500"
                        : announcement.type === "promo"
                          ? "border-green-500 text-green-500"
                          : announcement.type === "update"
                            ? "border-amber-500 text-amber-500"
                            : "border-red-500 text-red-500"
                    }
                  >
                    {announcement.type === "info"
                      ? "Info"
                      : announcement.type === "promo"
                        ? "Promo"
                        : announcement.type === "update"
                          ? "Update"
                          : "Alerta"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={announcement.active ? "default" : "outline"}
                    onClick={() => handleToggleActive(announcement.id, announcement.active)}
                  >
                    {announcement.active ? "Ativo" : "Inativo"}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function CeletusAdmin() {
  const [apiKey, setApiKey] = useState("")
  const [savedKey, setSavedKey] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [sales, setSales] = useState<any[]>([])
  const [loadingSales, setLoadingSales] = useState(false)
  const [copied, setCopied] = useState(false)
  const [dashboardMonth, setDashboardMonth] = useState(new Date().getMonth() + 1)
  const [dashboardYear, setDashboardYear] = useState(new Date().getFullYear())
  const [monthlyStats, setMonthlyStats] = useState<{
    currentMonth: number
    currentYear: number
    totalSales: number
    totalValue: number
    isRecord: boolean
    previousRecord: number
    previousRecordMonth: string
    // Comissão Afiliados
    faturamentoTotal: number
    comissaoAfiliado: number
    comissaoAfilia360: number
    qtdVendaPrincipal: number
    qtdOrderbump: number
    // Vendas App Afilia
    vendasBasic: number
    vendasPro: number
    faturamentoBasic: number
    faturamentoPro: number
    faturamentoAppTotal: number
  } | null>(null)

  const webhookUrl = "https://app.afilia360.com.br/api/celetus/webhook"
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  useEffect(() => {
    loadConfig()
    loadSales()
  }, [])

  useEffect(() => {
    loadMonthlyStats(dashboardMonth, dashboardYear)
  }, [dashboardMonth, dashboardYear])

  const loadMonthlyStats = async (month: number, year: number) => {
    const supabase = createClient()

    // Buscar total de vendas dos afiliados no mês selecionado (do ranking manual)
    const { data: currentRanking } = await supabase
      .from("monthly_rankings")
      .select("sales_count")
      .eq("month", month)
      .eq("year", year)

    const totalSales = currentRanking?.reduce((sum, r) => sum + (r.sales_count || 0), 0) || 0

    // Buscar vendas da Celetus do mês selecionado
    const startOfMonth = new Date(year, month - 1, 1).toISOString()
    const endOfMonth = new Date(year, month, 0, 23, 59, 59).toISOString()

    const { data: celetusSales } = await supabase
      .from("celetus_sales")
      .select("total_value, raw_data")
      .gte("sale_date", startOfMonth)
      .lte("sale_date", endOfMonth)

    let faturamentoTotal = 0
    let comissaoAfiliado = 0
    let comissaoAfilia360 = 0
    let qtdVendaPrincipal = 0
    let qtdOrderbump = 0

    let vendasBasic = 0
    let vendasPro = 0
    let faturamentoBasic = 0
    let faturamentoPro = 0

    const AFILIA_BASIC_CODE = "FYGCVIHI"
    const AFILIA_PRO_CODE = "ZOXLWXI9"

    celetusSales?.forEach((sale) => {
      const rawData = sale.raw_data as any
      const commission = rawData?.commission
      const items = rawData?.items || []

      if (commission) {
        const affiliatedArray = commission.affiliated
        const isAffiliateSale = Array.isArray(affiliatedArray) && affiliatedArray.length > 0

        // Só considerar vendas que vieram de afiliados para comissões
        if (isAffiliateSale) {
          faturamentoTotal += Number(commission.totalPrice) || 0
          comissaoAfilia360 += Number(commission.userCommission) || 0

          affiliatedArray.forEach((aff: any) => {
            comissaoAfiliado += Number(aff.commissionValue) || 0
          })

          items.forEach((item: any) => {
            if (item.item_type === "Principal") {
              qtdVendaPrincipal++
            } else if (item.item_type === "Orderbump") {
              qtdOrderbump++
            }
          })
        }
      }

      let isAfiliaBasic = false
      let isAfiliaPro = false

      items.forEach((item: any) => {
        const itemCode = item.code || ""
        if (itemCode === AFILIA_BASIC_CODE) {
          isAfiliaBasic = true
        } else if (itemCode === AFILIA_PRO_CODE) {
          isAfiliaPro = true
        }
      })

      const totalVenda = Number(commission?.totalPrice) || 0
      if (isAfiliaBasic) {
        vendasBasic++
        faturamentoBasic += totalVenda
      } else if (isAfiliaPro) {
        vendasPro++
        faturamentoPro += totalVenda
      }
    })

    // Buscar todos os meses anteriores para comparar
    const { data: allMonths } = await supabase
      .from("monthly_rankings")
      .select("month, year, sales_count")
      .or(`year.lt.${year},and(year.eq.${year},month.lt.${month})`)

    // Agrupar por mês/ano e somar
    const monthlyTotals: { [key: string]: { total: number; month: number; year: number } } = {}
    allMonths?.forEach((r) => {
      const key = `${r.year}-${r.month}`
      if (!monthlyTotals[key]) {
        monthlyTotals[key] = { total: 0, month: r.month, year: r.year }
      }
      monthlyTotals[key].total += r.sales_count || 0
    })

    // Encontrar o recorde anterior
    let previousRecord = 0
    let previousRecordMonth = ""
    const shortMonthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

    Object.values(monthlyTotals).forEach((m) => {
      if (m.total > previousRecord) {
        previousRecord = m.total
        previousRecordMonth = `${shortMonthNames[m.month - 1]}/${m.year}`
      }
    })

    setMonthlyStats({
      currentMonth: month,
      currentYear: year,
      totalSales,
      totalValue: faturamentoTotal,
      isRecord: totalSales > previousRecord && totalSales > 0,
      previousRecord,
      previousRecordMonth,
      faturamentoTotal,
      comissaoAfiliado,
      comissaoAfilia360,
      qtdVendaPrincipal,
      qtdOrderbump,
      // Vendas App Afilia
      vendasBasic,
      vendasPro,
      faturamentoBasic,
      faturamentoPro,
      faturamentoAppTotal: faturamentoBasic + faturamentoPro,
    })
  }

  const loadConfig = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/celetus/config")
      const data = await res.json()
      if (data.config) {
        setSavedKey(true)
      }
    } catch (err) {
      console.error("Erro ao carregar config:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadSales = async () => {
    setLoadingSales(true)
    try {
      const res = await fetch("/api/celetus/sales")
      const data = await res.json()
      if (data.sales) {
        setSales(data.sales)
      }
    } catch (err) {
      console.error("Erro ao carregar vendas:", err)
    } finally {
      setLoadingSales(false)
    }
  }

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      setError("Insira uma API Key válida")
      return
    }

    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/celetus/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      })

      if (res.ok) {
        setSavedKey(true)
        setApiKey("")
        setError("")
      } else {
        const data = await res.json()
        setError(data.error || "Erro ao salvar")
      }
    } catch (err) {
      setError("Erro ao salvar API Key")
    } finally {
      setLoading(false)
    }
  }

  const testSync = async () => {
    setSyncing(true)
    setSyncResult(null)
    setError("")
    try {
      const res = await fetch("/api/celetus/sync", { method: "POST" })
      const data = await res.json()

      if (res.ok) {
        setSyncResult(data)
        loadSales()
        loadMonthlyStats(dashboardMonth, dashboardYear) // Reload stats after sync
      } else {
        setError(data.error || "Erro na sincronização")
        if (data.details) {
          setSyncResult({ error_details: data.details })
        }
      }
    } catch (err) {
      setError("Erro ao conectar com a API")
    } finally {
      setSyncing(false)
    }
  }

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderJsonAsRows = (obj: any, prefix = ""): React.ReactNode[] => {
    const rows: React.ReactNode[] = []

    const processValue = (key: string, value: any, fullPath: string) => {
      if (value === null || value === undefined) {
        rows.push(
          <tr key={fullPath} className="border-b border-border/30 hover:bg-secondary/30">
            <td className="py-2 px-3 font-mono text-xs text-primary">{fullPath}</td>
            <td className="py-2 px-3 text-muted-foreground italic">null</td>
          </tr>,
        )
      } else if (typeof value === "object" && !Array.isArray(value)) {
        rows.push(
          <tr key={fullPath} className="border-b border-border/30 bg-secondary/40">
            <td colSpan={2} className="py-2 px-3 font-mono text-xs font-bold text-primary">
              {fullPath} (objeto)
            </td>
          </tr>,
        )
        Object.entries(value).forEach(([k, v]) => {
          processValue(k, v, `${fullPath}.${k}`)
        })
      } else if (Array.isArray(value)) {
        rows.push(
          <tr key={fullPath} className="border-b border-border/30 bg-secondary/40">
            <td colSpan={2} className="py-2 px-3 font-mono text-xs font-bold text-primary">
              {fullPath} (array com {value.length} itens)
            </td>
          </tr>,
        )
        value.forEach((item, idx) => {
          if (typeof item === "object" && item !== null) {
            Object.entries(item).forEach(([k, v]) => {
              processValue(k, v, `${fullPath}[${idx}].${k}`)
            })
          } else {
            rows.push(
              <tr key={`${fullPath}[${idx}]`} className="border-b border-border/30 hover:bg-secondary/30">
                <td className="py-2 px-3 font-mono text-xs text-primary">{`${fullPath}[${idx}]`}</td>
                <td className="py-2 px-3 break-all">
                  {typeof item === "boolean" ? (
                    <Badge variant={item ? "default" : "secondary"}>{String(item)}</Badge>
                  ) : (
                    String(item)
                  )}
                </td>
              </tr>,
            )
          }
        })
      } else {
        rows.push(
          <tr key={fullPath} className="border-b border-border/30 hover:bg-secondary/30">
            <td className="py-2 px-3 font-mono text-xs text-primary">{fullPath}</td>
            <td className="py-2 px-3 break-all">
              {typeof value === "boolean" ? (
                <Badge variant={value ? "default" : "secondary"}>{String(value)}</Badge>
              ) : (
                String(value)
              )}
            </td>
          </tr>,
        )
      }
    }

    Object.entries(obj).forEach(([key, value]) => {
      processValue(key, value, prefix ? `${prefix}.${key}` : key)
    })

    return rows
  }

  if (loading && !savedKey) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Card Dashboard de Vendas */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Dashboard de Vendas
              </CardTitle>
              <CardDescription>Resumo das vendas e comissões</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={dashboardMonth.toString()} onValueChange={(v) => setDashboardMonth(Number(v))}>
                <SelectTrigger className="w-[140px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((name, idx) => (
                    <SelectItem key={idx + 1} value={(idx + 1).toString()} className="text-sm">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dashboardYear.toString()} onValueChange={(v) => setDashboardYear(Number(v))}>
                <SelectTrigger className="w-[100px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024" className="text-sm">
                    2024
                  </SelectItem>
                  <SelectItem value="2025" className="text-sm">
                    2025
                  </SelectItem>
                  <SelectItem value="2026" className="text-sm">
                    2026
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {monthlyStats ? (
            <Tabs defaultValue="comissao" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="comissao" className="text-xs sm:text-sm">
                  Comissão Afiliados
                </TabsTrigger>
                <TabsTrigger value="vendas-app" className="text-xs sm:text-sm">
                  Vendas App Afilia
                </TabsTrigger>
              </TabsList>

              {/* Aba Comissão Afiliados */}
              <TabsContent value="comissao" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Faturamento Total */}
                  <div className="rounded-lg bg-background/80 border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Faturamento Total</p>
                    <p className="text-2xl font-bold text-yellow-500 mt-1">
                      R$ {monthlyStats.faturamentoTotal.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">bruto das vendas</p>
                  </div>

                  {/* Comissão Afiliados */}
                  <div className="rounded-lg bg-background/80 border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Comissão Afiliados</p>
                    <p className="text-2xl font-bold text-blue-500 mt-1">
                      R$ {monthlyStats.comissaoAfiliado.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">distribuído p/ afiliados</p>
                  </div>

                  {/* Comissão Afilia360 */}
                  <div className="rounded-lg bg-background/80 border border-border/50 p-4 text-center">
                    <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Comissão Afilia360</p>
                    <p className="text-2xl font-bold text-green-500 mt-1">
                      R$ {monthlyStats.comissaoAfilia360.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">nosso lucro</p>
                  </div>

                  {/* Qtd Venda Principal */}
                  <div className="rounded-lg bg-background/80 border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Vendas Principais</p>
                    <p className="text-3xl font-bold text-primary mt-1">{monthlyStats.qtdVendaPrincipal}</p>
                    <p className="text-xs text-muted-foreground">produtos principais</p>
                  </div>

                  {/* Qtd Orderbump */}
                  <div className="rounded-lg bg-background/80 border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Orderbumps</p>
                    <p className="text-3xl font-bold text-orange-500 mt-1">{monthlyStats.qtdOrderbump}</p>
                    <p className="text-xs text-muted-foreground">vendas adicionais</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vendas-app" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Vendas Basic */}
                  <div className="rounded-lg bg-background/80 border border-blue-500/30 p-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-xs font-medium mb-2">
                      BASIC
                    </div>
                    <p className="text-3xl font-bold text-blue-500">{monthlyStats.vendasBasic}</p>
                    <p className="text-xs text-muted-foreground">vendas (R$17)</p>
                    <p className="text-lg font-semibold text-blue-400 mt-1">
                      R$ {monthlyStats.faturamentoBasic.toFixed(2)}
                    </p>
                  </div>

                  {/* Vendas Pro */}
                  <div className="rounded-lg bg-background/80 border border-purple-500/30 p-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded text-xs font-medium mb-2">
                      PRO
                    </div>
                    <p className="text-3xl font-bold text-purple-500">{monthlyStats.vendasPro}</p>
                    <p className="text-xs text-muted-foreground">vendas (R$97)</p>
                    <p className="text-lg font-semibold text-purple-400 mt-1">
                      R$ {monthlyStats.faturamentoPro.toFixed(2)}
                    </p>
                  </div>

                  {/* Faturamento App */}
                  <div className="rounded-lg bg-background/80 border border-primary/30 p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Faturamento App</p>
                    <p className="text-2xl font-bold text-primary">R$ {monthlyStats.faturamentoAppTotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">vendas da plataforma</p>
                  </div>

                  {/* Comissão Afilia360 */}
                  <div className="rounded-lg bg-background/80 border border-green-500/30 p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Comissão Afilia360</p>
                    <p className="text-2xl font-bold text-green-500">R$ {monthlyStats.comissaoAfilia360.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">comissão dos afiliados</p>
                  </div>

                  {/* Lucro Total */}
                  <div className="rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 p-4 text-center">
                    <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Lucro Total</p>
                    <p className="text-2xl font-bold text-green-500 mt-1">
                      R$ {(monthlyStats.faturamentoAppTotal + monthlyStats.comissaoAfilia360).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">app + comissões</p>
                  </div>
                </div>

                {/* Resumo do Lucro */}
                <div className="rounded-lg bg-secondary/30 p-4">
                  <p className="text-sm font-medium mb-3 text-green-500">
                    Composição do Lucro - {monthNames[monthlyStats.currentMonth - 1]}/{monthlyStats.currentYear}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Vendas App</p>
                      <p className="text-lg font-bold">R$ {monthlyStats.faturamentoAppTotal.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-2xl text-muted-foreground">+</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Comissões</p>
                      <p className="text-lg font-bold">R$ {monthlyStats.comissaoAfilia360.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="border-t border-green-500/30 mt-3 pt-3 text-center">
                    <p className="text-xs text-muted-foreground">Total Afilia360</p>
                    <p className="text-2xl font-bold text-green-500">
                      R$ {(monthlyStats.faturamentoAppTotal + monthlyStats.comissaoAfilia360).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Distribuição por plano */}
                <div className="rounded-lg bg-secondary/30 p-4">
                  <p className="text-sm font-medium mb-3">Distribuição por Plano</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Basic (R$17)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                monthlyStats.vendasBasic + monthlyStats.vendasPro > 0
                                  ? (monthlyStats.vendasBasic / (monthlyStats.vendasBasic + monthlyStats.vendasPro)) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {monthlyStats.vendasBasic + monthlyStats.vendasPro > 0
                            ? (
                                (monthlyStats.vendasBasic / (monthlyStats.vendasBasic + monthlyStats.vendasPro)) *
                                100
                              ).toFixed(0)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pro (R$97)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{
                              width: `${
                                monthlyStats.vendasBasic + monthlyStats.vendasPro > 0
                                  ? (monthlyStats.vendasPro / (monthlyStats.vendasBasic + monthlyStats.vendasPro)) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {monthlyStats.vendasBasic + monthlyStats.vendasPro > 0
                            ? (
                                (monthlyStats.vendasPro / (monthlyStats.vendasBasic + monthlyStats.vendasPro)) *
                                100
                              ).toFixed(0)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Recorde - aparece em ambas as abas */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-6">
                <div>
                  {monthlyStats.isRecord ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-yellow-600">NOVO RECORDE!</p>
                        <p className="text-sm text-muted-foreground">
                          Recorde anterior: {monthlyStats.previousRecord} vendas em {monthlyStats.previousRecordMonth}
                        </p>
                      </div>
                    </div>
                  ) : monthlyStats.previousRecord > 0 ? (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Recorde atual: <span className="font-semibold">{monthlyStats.previousRecord} vendas</span> em{" "}
                        {monthlyStats.previousRecordMonth}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Faltam{" "}
                        <span className="font-semibold text-primary">
                          {monthlyStats.previousRecord - monthlyStats.totalSales + 1}
                        </span>{" "}
                        vendas para bater o recorde
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Primeiro mês de registro</p>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMonthlyStats(dashboardMonth, dashboardYear)}
                  className="bg-transparent"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook URL */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Webhook URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure esta URL no painel da Celetus para receber as vendas automaticamente em tempo real. Vá em{" "}
            <strong>Celetus → Configurações → Webhooks</strong> e adicione esta URL.
          </p>

          <div className="flex gap-2">
            <Input value={webhookUrl} readOnly className="font-mono text-sm bg-background" />
            <Button onClick={copyWebhookUrl} variant="outline">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">{copied ? "Copiado!" : "Copiar"}</span>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              • Método: <code className="bg-muted px-1 rounded">POST</code>
            </p>
            <p>• As vendas serão salvas automaticamente quando realizadas na Celetus</p>
          </div>
        </CardContent>
      </Card>

      {/* Card de Configuração */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API Key do Produtor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Insira sua API Key de produtor da Celetus para sincronizar as vendas dos seus afiliados. Você pode encontrar
            sua API Key no painel da Celetus em Configurações &gt; API.
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={savedKey ? "password" : "text"} // Use password if key is saved, text otherwise
                placeholder={savedKey ? "••••••••••••••••" : "Cole sua API Key aqui"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setSavedKey(!savedKey)} // Toggle savedKey to show/hide
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {savedKey ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            <Button onClick={saveApiKey} disabled={loading || !apiKey.trim()} className="hidden sm:inline-flex">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>
            <Button onClick={saveApiKey} disabled={loading || !apiKey.trim()} size="icon" className="sm:hidden">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            </Button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {savedKey && (
            <p className="text-xs text-muted-foreground">
              API Key configurada. Clique no ícone de olho para exibir/ocultar.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card de Teste */}
      {savedKey && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Sincronizar Vendas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Clique para buscar as vendas da Celetus. As vendas serão exibidas na tabela abaixo.
            </p>

            <Button onClick={testSync} disabled={syncing} variant="outline" className="w-full bg-transparent">
              {syncing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar Agora
                </>
              )}
            </Button>

            {syncResult && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm">Resposta da API (Debug):</h4>
                <pre className="bg-secondary/50 p-4 rounded-lg text-xs overflow-auto max-h-48 whitespace-pre-wrap">
                  {JSON.stringify(syncResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Como funciona a integração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Configure sua API Key de produtor da Celetus acima</li>
            <li>Configure o Webhook URL na Celetus para receber vendas em tempo real</li>
            <li>As vendas dos afiliados serão contabilizadas automaticamente no Dashboard</li>
            <li>O ranking de afiliados continua sendo alimentado manualmente</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper para obter semana do ano
declare global {
  interface Date {
    getWeek(): number
  }
}

Date.prototype.getWeek = function () {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
