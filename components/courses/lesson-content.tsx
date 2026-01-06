"use client"

import { FileText, Download, ExternalLink, FileImage, FileArchive, File, LinkIcon } from "lucide-react"

interface Attachment {
  name: string
  url: string
  type: string
}

interface LessonContentProps {
  content?: string
  contentHtml?: string
  attachments?: Attachment[]
}

export function LessonContent({ content, contentHtml, attachments = [] }: LessonContentProps) {
  const links = attachments.filter((a) => a.type === "link")
  const files = attachments.filter((a) => a.type !== "link")

  if (!content && !contentHtml && attachments.length === 0) {
    return null
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
    if (type.includes("image")) return <FileImage className="h-5 w-5 text-blue-500" />
    if (type.includes("zip") || type.includes("rar")) return <FileArchive className="h-5 w-5 text-yellow-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      {/* Texto da Aula / Resumo */}
      {(content || contentHtml) && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Resumo da Aula
          </h3>
          {contentHtml ? (
            <div
              className="prose prose-invert max-w-none text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{content}</p>
          )}
        </div>
      )}

      {links.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-blue-500" />
            Links Importantes
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all group"
              >
                <LinkIcon className="h-5 w-5 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-blue-400 transition-colors">{link.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Materiais para Download */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Download className="h-5 w-5 text-green-500" />
            Materiais de Apoio
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {files.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-all group"
              >
                {getFileIcon(attachment.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-primary transition-colors">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">{attachment.type.split("/").pop()}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
