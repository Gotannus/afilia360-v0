import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido. Use PDF, JPG, PNG ou WebP." }, { status: 400 })
    }

    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Arquivo muito grande. Máximo de 20MB." }, { status: 400 })
    }

    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const pathname = `announcements/${timestamp}-${safeName}`

    const blob = await put(pathname, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url, name: file.name })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Falha no upload" }, { status: 500 })
  }
}
