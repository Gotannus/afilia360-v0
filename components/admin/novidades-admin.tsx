"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus, Pencil, Trash2, Radio, BookOpen, Megaphone, Palette,
  Save, Eye, EyeOff, FileText, Globe, Link2, Upload, X, CheckCircle,
  Maximize2, SplitSquareHorizontal, Code2, PlayCircle
} from "lucide-react"
import {
  getAllNewsPostsAdmin, upsertNewsPost, deleteNewsPost,
  getLives, upsertLive, deleteLive,
} from "@/lib/novidades-api"
import type { NewsPost } from "@/components/news-card"
import { isFullHtml } from "@/components/news-card"
import type { Live, LiveMaterial } from "@/components/live-card"

const categoryOptions = [
  { value: "update", label: "Atualização", icon: Megaphone },
  { value: "lesson", label: "Nova Aula", icon: BookOpen },
  { value: "creative", label: "Criativo", icon: Palette },
]
const statusOptions = [
  { value: "upcoming", label: "Em Breve" },
  { value: "live", label: "Ao Vivo" },
  { value: "ended", label: "Encerrada" },
]
const categoryBadge: Record<string, string> = {
  update: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  lesson: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  creative: "border-amber-500/30 bg-amber-500/10 text-amber-400",
}
const statusBadge: Record<string, string> = {
  upcoming: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  live: "border-red-500/30 bg-red-500/10 text-red-400",
  ended: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function emptyPost(): Partial<NewsPost> {
  return { title: "", description: "", content: "", cover_image: "", category: "update", tags: [], published: false }
}
function emptyLive(): Partial<Live> {
  return { title: "", description: "", cover_image: "", stream_url: "", status: "upcoming", scheduled_at: "", materials: [] }
}

// ── HTML Preview Fullscreen ──────────────────────────────────────────────────

function HtmlPreviewFullscreen({ content, title, onClose }: { content: string; title: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black" role="dialog" aria-modal="true">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-violet-500/40 bg-violet-500/15 px-2 py-0.5 text-[10px] text-violet-400">
            Preview
          </Badge>
          <span className="text-sm text-white/60">{title || "Sem título"}</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
          aria-label="Fechar preview"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <iframe
        srcDoc={content}
        title="Preview fullscreen"
        className="h-full w-full flex-1 border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  )
}

// ── Content Editor com split-view ────────────────────────────────────────────

function ContentEditor({
  value,
  onChange,
  title,
}: {
  value: string
  onChange: (v: string) => void
  title: string
}) {
  const [mode, setMode] = useState<"code" | "split" | "preview">("code")
  const [fullscreenPreview, setFullscreenPreview] = useState(false)
  const isHtml = isFullHtml(value)

  return (
    <div className="col-span-2 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">
          Conteúdo
          {isHtml && (
            <Badge variant="outline" className="ml-2 border-violet-500/30 bg-violet-500/10 px-1.5 py-0 text-[10px] text-violet-400">
              HTML completo detectado
            </Badge>
          )}
        </Label>
        <div className="flex items-center gap-1">
          {/* Botões de modo */}
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
              mode === "code" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="h-3 w-3" />
            Código
          </button>
          <button
            type="button"
            onClick={() => setMode("split")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
              mode === "split" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SplitSquareHorizontal className="h-3 w-3" />
            Split
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
              mode === "preview" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3 w-3" />
            Preview
          </button>
          {value && (
            <button
              type="button"
              onClick={() => setFullscreenPreview(true)}
              className="ml-1 flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              title="Preview fullscreen"
            >
              <Maximize2 className="h-3 w-3" />
              Fullscreen
            </button>
          )}
        </div>
      </div>

      {/* Editor area */}
      <div
        className={`overflow-hidden rounded-lg border border-border ${
          mode === "split" ? "grid grid-cols-2 divide-x divide-border" : ""
        }`}
      >
        {/* Code panel */}
        {(mode === "code" || mode === "split") && (
          <Textarea
            rows={mode === "split" ? 16 : 12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`<p>Conteúdo do post em HTML...</p>\n\nOu cole um documento HTML completo:\n<!DOCTYPE html>\n<html lang="pt-BR">...`}
            className="resize-none rounded-none border-0 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}

        {/* Preview panel */}
        {(mode === "preview" || mode === "split") && (
          <div className={`${mode === "preview" ? "h-64 sm:h-80" : "h-64"} overflow-hidden bg-white`}>
            {value ? (
              isHtml ? (
                <iframe
                  srcDoc={value}
                  title="Preview"
                  className="h-full w-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              ) : (
                <div
                  className="h-full overflow-y-auto bg-white p-4 text-sm text-zinc-900"
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              )
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                Prévia aparece aqui
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dica de HTML */}
      {!isHtml && (
        <p className="text-[11px] text-muted-foreground/60">
          Para criar uma aula com estilo Netflix (HTML completo), inicie com{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[10px]">{"<!DOCTYPE html>"}</code> ou{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[10px]">{"<html"}</code>
        </p>
      )}

      {fullscreenPreview && (
        <HtmlPreviewFullscreen
          content={value}
          title={title}
          onClose={() => setFullscreenPreview(false)}
        />
      )}
    </div>
  )
}

// ── News Posts Admin ─────────────────────────────────────────────────────────

function NewsPostsAdmin() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [editing, setEditing] = useState<Partial<NewsPost> | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadPosts = async () => {
    const data = await getAllNewsPostsAdmin()
    setPosts(data)
  }

  useEffect(() => { loadPosts() }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const handleSave = async () => {
    if (!editing?.title) return
    setSaving(true)
    const saved = await upsertNewsPost(editing as NewsPost & { title: string })
    setSaving(false)
    if (saved) { setEditing(null); loadPosts(); showToast("Post salvo com sucesso!") }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este post?")) return
    await deleteNewsPost(id)
    loadPosts()
    showToast("Post excluído.")
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editing) return
    const fd = new FormData(); fd.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const json = await res.json()
    if (json.url) setEditing({ ...editing, cover_image: json.url })
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} posts no total</p>
        <Button size="sm" className="gap-2" onClick={() => setEditing(emptyPost())}>
          <Plus className="h-4 w-4" /> Novo Post
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            {post.cover_image && (
              <img src={post.cover_image} alt="" className="h-12 w-16 shrink-0 rounded object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={`px-1.5 py-0 text-[10px] ${categoryBadge[post.category]}`}>
                  {categoryOptions.find(c => c.value === post.category)?.label}
                </Badge>
                {post.published
                  ? <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0 text-[10px] text-emerald-400"><Eye className="mr-1 h-2.5 w-2.5" />Publicado</Badge>
                  : <Badge variant="outline" className="border-zinc-500/30 bg-zinc-500/10 px-1.5 py-0 text-[10px] text-zinc-400"><EyeOff className="mr-1 h-2.5 w-2.5" />Rascunho</Badge>
                }
                {isFullHtml(post.content) && (
                  <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 px-1.5 py-0 text-[10px] text-violet-400">
                    <PlayCircle className="mr-1 h-2.5 w-2.5" />HTML
                  </Badge>
                )}
              </div>
              <p className="truncate text-sm font-medium text-foreground">{post.title}</p>
              {post.description && <p className="truncate text-xs text-muted-foreground">{post.description}</p>}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(post)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive-foreground hover:text-red-400" onClick={() => handleDelete(post.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Nenhum post criado ainda
          </div>
        )}
      </div>

      {/* Edit Dialog — largura máxima extendida para split view */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar Post" : "Novo Post"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Título *</Label>
                  <Input
                    value={editing.title ?? ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Título do post"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Categoria</Label>
                  <Select
                    value={editing.category}
                    onValueChange={(v) => setEditing({ ...editing, category: v as NewsPost["category"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">Publicado</p>
                    <p className="text-xs text-muted-foreground">Visível para afiliados</p>
                  </div>
                  <Switch
                    checked={editing.published ?? false}
                    onCheckedChange={(v) => setEditing({ ...editing, published: v })}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Descrição</Label>
                  <Textarea
                    rows={2}
                    value={editing.description ?? ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Resumo breve do post"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Imagem de Capa</Label>
                  <div className="flex gap-2">
                    <Input
                      value={editing.cover_image ?? ""}
                      onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
                      placeholder="URL da imagem"
                    />
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    <Button variant="outline" size="icon" onClick={() => fileRef.current?.click()} title="Upload de imagem">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {editing.cover_image && (
                    <img src={editing.cover_image} alt="" className="mt-2 h-24 w-full rounded-md object-cover" />
                  )}
                </div>
                <div className="col-span-2">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Tags (separadas por vírgula)</Label>
                  <Input
                    value={(editing.tags ?? []).join(", ")}
                    onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                    placeholder="ex: tráfego pago, copywriting, leads"
                  />
                </div>

                {/* Editor com split-view e preview */}
                <ContentEditor
                  value={editing.content ?? ""}
                  onChange={(v) => setEditing({ ...editing, content: v })}
                  title={editing.title ?? ""}
                />
              </div>
              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar Post"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Lives Admin ───────────────────────────────────────────────────────────────

function LivesAdmin() {
  const [lives, setLives] = useState<Live[]>([])
  const [editing, setEditing] = useState<Partial<Live> | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [newMat, setNewMat] = useState<{ name: string; url: string; type: "pdf" | "html" | "link" }>({ name: "", url: "", type: "link" })
  const [uploadingMat, setUploadingMat] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)
  const matFileRef = useRef<HTMLInputElement>(null)

  const loadLives = async () => { setLives(await getLives()) }
  useEffect(() => { loadLives() }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const handleSave = async () => {
    if (!editing?.title) return
    setSaving(true)
    const saved = await upsertLive(editing as Live & { title: string })
    setSaving(false)
    if (saved) { setEditing(null); loadLives(); showToast("Live salva!") }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta live?")) return
    await deleteLive(id); loadLives(); showToast("Live excluída.")
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !editing) return
    const fd = new FormData(); fd.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const json = await res.json()
    if (json.url) setEditing({ ...editing, cover_image: json.url })
  }

  const handleMatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingMat(true)
    const fd = new FormData(); fd.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const json = await res.json()
    setUploadingMat(false)
    if (json.url) {
      const type = file.name.endsWith(".pdf") ? "pdf" : file.name.endsWith(".html") || file.name.endsWith(".htm") ? "html" : "link"
      setNewMat({ name: file.name.replace(/\.[^.]+$/, ""), url: json.url, type })
    }
  }

  const addMaterial = () => {
    if (!editing || !newMat.name || !newMat.url) return
    const mat: LiveMaterial = { id: crypto.randomUUID(), ...newMat }
    setEditing({ ...editing, materials: [...(editing.materials ?? []), mat] })
    setNewMat({ name: "", url: "", type: "link" })
  }

  const removeMaterial = (id: string) => {
    if (!editing) return
    setEditing({ ...editing, materials: (editing.materials ?? []).filter((m) => m.id !== id) })
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4" /> {toast}
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{lives.length} lives registradas</p>
        <Button size="sm" className="gap-2" onClick={() => setEditing(emptyLive())}>
          <Plus className="h-4 w-4" /> Nova Live
        </Button>
      </div>

      <div className="space-y-2">
        {lives.map((live) => (
          <div key={live.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            {live.cover_image && (
              <img src={live.cover_image} alt="" className="h-12 w-16 shrink-0 rounded object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap gap-2">
                <Badge variant="outline" className={`px-1.5 py-0 text-[10px] ${statusBadge[live.status]}`}>
                  {statusOptions.find(s => s.value === live.status)?.label}
                </Badge>
                {live.materials.length > 0 && (
                  <Badge variant="outline" className="border-zinc-500/30 bg-zinc-500/10 px-1.5 py-0 text-[10px] text-zinc-400">
                    {live.materials.length} {live.materials.length === 1 ? "material" : "materiais"}
                  </Badge>
                )}
              </div>
              <p className="truncate text-sm font-medium text-foreground">{live.title}</p>
              {live.scheduled_at && (
                <p className="text-xs text-muted-foreground">
                  {new Date(live.scheduled_at).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(live)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive-foreground hover:text-red-400" onClick={() => handleDelete(live.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {lives.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Nenhuma live criada ainda
          </div>
        )}
      </div>

      {/* Live Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar Live" : "Nova Live"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Título *</Label>
                  <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Nome da transmissão" />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as Live["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Data e Hora</Label>
                  <Input
                    type="datetime-local"
                    value={editing.scheduled_at ? editing.scheduled_at.slice(0, 16) : ""}
                    onChange={(e) => setEditing({ ...editing, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : "" })}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Link da Transmissão</Label>
                  <Input value={editing.stream_url ?? ""} onChange={(e) => setEditing({ ...editing, stream_url: e.target.value })} placeholder="https://youtube.com/live/..." />
                </div>
                <div className="col-span-2">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Descrição</Label>
                  <Textarea rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Sobre o que será esta live..." />
                </div>
                <div className="col-span-2">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Capa</Label>
                  <div className="flex gap-2">
                    <Input value={editing.cover_image ?? ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} placeholder="URL da imagem de capa" />
                    <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                    <Button variant="outline" size="icon" onClick={() => coverRef.current?.click()} title="Upload da capa">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {editing.cover_image && <img src={editing.cover_image} alt="" className="mt-2 h-24 w-full rounded-md object-cover" />}
                </div>
              </div>

              {/* Materials */}
              <div className="border-t border-border pt-4">
                <Label className="mb-3 block text-sm font-medium">Materiais Complementares</Label>
                <div className="mb-3 space-y-2">
                  {(editing.materials ?? []).map((mat) => {
                    const MatIcon = mat.type === "pdf" ? FileText : mat.type === "html" ? Globe : Link2
                    return (
                      <div key={mat.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-3 py-2">
                        <MatIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{mat.name}</p>
                          <p className="text-xs uppercase text-muted-foreground">{mat.type}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-400" onClick={() => removeMaterial(mat.id)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )
                  })}
                </div>

                {/* Add material */}
                <div className="space-y-3 rounded-lg border border-dashed border-border p-3">
                  <p className="text-xs font-medium text-muted-foreground">Adicionar material</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      className="col-span-2"
                      value={newMat.name}
                      onChange={(e) => setNewMat({ ...newMat, name: e.target.value })}
                      placeholder="Nome do material"
                    />
                    <Select value={newMat.type} onValueChange={(v) => setNewMat({ ...newMat, type: v as "pdf" | "html" | "link" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newMat.url}
                      onChange={(e) => setNewMat({ ...newMat, url: e.target.value })}
                      placeholder="URL do material"
                    />
                    <input ref={matFileRef} type="file" accept=".pdf,.html,.htm" className="hidden" onChange={handleMatFileUpload} />
                    <Button variant="outline" size="icon" onClick={() => matFileRef.current?.click()} disabled={uploadingMat} title="Upload de arquivo">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={addMaterial} disabled={!newMat.name || !newMat.url}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {uploadingMat && <p className="animate-pulse text-xs text-muted-foreground">Enviando arquivo...</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar Live"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function NovidadesAdmin() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Gerenciar Novidades</h2>
        <p className="text-sm text-muted-foreground">
          Crie posts, aulas em HTML, criativos validados e gerencie transmissões ao vivo
        </p>
      </div>
      <Tabs defaultValue="posts">
        <TabsList className="mb-4">
          <TabsTrigger value="posts" className="gap-2">
            <BookOpen className="h-3.5 w-3.5" /> Posts & Aulas
          </TabsTrigger>
          <TabsTrigger value="lives" className="gap-2">
            <Radio className="h-3.5 w-3.5" /> Lives
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts"><NewsPostsAdmin /></TabsContent>
        <TabsContent value="lives"><LivesAdmin /></TabsContent>
      </Tabs>
    </div>
  )
}
