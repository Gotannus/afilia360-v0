"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bold, Italic, Link, List, ListOrdered, Undo, Redo, FileText, Loader2, Archive, Palette } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkPopover, setShowLinkPopover] = useState(false)
  const [showColorPopover, setShowColorPopover] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingZip, setUploadingZip] = useState(false)
  const initializedRef = useRef(false)
  const savedSelectionRef = useRef<Range | null>(null)

  useEffect(() => {
    if (editorRef.current && !initializedRef.current && value) {
      editorRef.current.innerHTML = value
      initializedRef.current = true
    }
  }, [value])

  useEffect(() => {
    if (editorRef.current && !initializedRef.current) {
      editorRef.current.innerHTML = value || ""
      initializedRef.current = true
    }
  }, [])

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
      editorRef.current?.focus()
    },
    [onChange],
  )

  const handleBold = () => execCommand("bold")
  const handleItalic = () => execCommand("italic")
  const handleUnorderedList = () => execCommand("insertUnorderedList")
  const handleOrderedList = () => execCommand("insertOrderedList")
  const handleUndo = () => execCommand("undo")
  const handleRedo = () => execCommand("redo")

  const handleLinkPopoverOpen = (open: boolean) => {
    if (open) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange()
      }
    }
    setShowLinkPopover(open)
  }

  const handleLink = () => {
    if (linkUrl && savedSelectionRef.current) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedSelectionRef.current)
      }

      const selectedText = savedSelectionRef.current.toString()
      if (selectedText) {
        document.execCommand("delete", false)
        const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-primary underline">${selectedText}</a>`
        document.execCommand("insertHTML", false, linkHtml)
      } else {
        const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-primary underline">${linkUrl}</a>`
        document.execCommand("insertHTML", false, linkHtml)
      }

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }

      setLinkUrl("")
      setShowLinkPopover(false)
      savedSelectionRef.current = null
      editorRef.current?.focus()
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      alert("Por favor, selecione um arquivo PDF")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao fazer upload")
      }

      const data = await response.json()

      const pdfHtml = `<a href="${data.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors">📄 ${file.name}</a>&nbsp;`

      editorRef.current?.focus()
      document.execCommand("insertHTML", false, pdfHtml)

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    } catch (error) {
      console.error("Erro no upload:", error)
      alert(error instanceof Error ? error.message : "Erro ao fazer upload do PDF")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = ["application/zip", "application/x-zip-compressed", "application/x-zip"]
    if (!validTypes.includes(file.type) && !file.name.endsWith(".zip")) {
      alert("Por favor, selecione um arquivo ZIP")
      return
    }

    setUploadingZip(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao fazer upload")
      }

      const data = await response.json()

      const zipHtml = `<a href="${data.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 bg-green-500/10 text-green-500 rounded-md hover:bg-green-500/20 transition-colors">📦 ${file.name}</a>&nbsp;`

      editorRef.current?.focus()
      document.execCommand("insertHTML", false, zipHtml)

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    } catch (error) {
      console.error("Erro no upload:", error)
      alert(error instanceof Error ? error.message : "Erro ao fazer upload do ZIP")
    } finally {
      setUploadingZip(false)
      if (zipInputRef.current) {
        zipInputRef.current.value = ""
      }
    }
  }

  const handleColorChange = (color: string) => {
    editorRef.current?.focus()
    document.execCommand("foreColor", false, color)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
    setShowColorPopover(false)
  }

  const colors = [
    { name: "Branco", value: "#FFFFFF" },
    { name: "Preto", value: "#000000" },
    { name: "Cinza", value: "#6B7280" },
    { name: "Vermelho", value: "#EF4444" },
    { name: "Laranja", value: "#F97316" },
    { name: "Amarelo", value: "#EAB308" },
    { name: "Verde", value: "#22C55E" },
    { name: "Azul", value: "#3B82F6" },
    { name: "Roxo", value: "#8B5CF6" },
    { name: "Rosa", value: "#EC4899" },
    { name: "Dourado", value: "#D4A03C" },
    { name: "Ciano", value: "#06B6D4" },
  ]

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/50 flex-wrap">
        <Button type="button" variant="ghost" size="sm" onClick={handleBold} className="h-8 w-8 p-0" title="Negrito">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleItalic} className="h-8 w-8 p-0" title="Itálico">
          <Italic className="h-4 w-4" />
        </Button>

        <Popover open={showColorPopover} onOpenChange={setShowColorPopover}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Cor do Texto">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="grid grid-cols-4 gap-1">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showLinkPopover} onOpenChange={handleLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Inserir Link">
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Selecione o texto primeiro, depois cole a URL:</p>
              <Input
                placeholder="https://exemplo.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLink()}
              />
              <Button size="sm" onClick={handleLink} className="w-full">
                Inserir Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Inserir PDF"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handlePdfUpload}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Inserir ZIP"
          onClick={() => zipInputRef.current?.click()}
          disabled={uploadingZip}
        >
          {uploadingZip ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
        </Button>
        <input
          ref={zipInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden"
          onChange={handleZipUpload}
        />

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUnorderedList}
          className="h-8 w-8 p-0"
          title="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleOrderedList}
          className="h-8 w-8 p-0"
          title="Lista Numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button type="button" variant="ghost" size="sm" onClick={handleUndo} className="h-8 w-8 p-0" title="Desfazer">
          <Undo className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleRedo} className="h-8 w-8 p-0" title="Refazer">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="min-h-[250px] p-3 focus:outline-none prose prose-sm dark:prose-invert max-w-none [&_a]:text-primary [&_a]:underline [&_a]:cursor-pointer"
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{
          minHeight: "250px",
        }}
      />

      <style jsx>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
