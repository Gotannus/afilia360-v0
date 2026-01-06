"use client"

import { useState, useRef, useEffect } from "react"

interface VideoPlayerProps {
  videoUrl: string
  videoType: "youtube" | "vimeo" | "panda" | "external"
  title: string
  onProgress?: (percent: number) => void
  onComplete?: () => void
}

export function VideoPlayer({ videoUrl, videoType, title, onProgress, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && (e.key === "s" || e.key === "u")) || e.key === "F12") {
        e.preventDefault()
        return false
      }
    }

    container.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      container.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const getYouTubeId = (url: string) => {
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url
    }
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const getVimeoId = (url: string) => {
    if (/^\d+$/.test(url)) {
      return url
    }
    const regex = /vimeo\.com\/(?:video\/)?(\d+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const getPandaUrl = (url: string) => {
    if (url.includes("pandavideo.com") && url.includes("embed")) {
      return url
    }

    if (url.includes("pandavideo.com")) {
      const playerMatch = url.match(/(player-vz-[a-z0-9-]+\.tv\.pandavideo\.com\.br)/)
      const videoIdMatch = url.match(/[?&]v=([^&]+)/)

      if (playerMatch && videoIdMatch) {
        return `https://${playerMatch[1]}/embed/?v=${videoIdMatch[1]}`
      }

      return url
    }

    return `https://player-vz-7b5a8f1e-d88.tv.pandavideo.com.br/embed/?v=${url}`
  }

  const handlePlay = () => {
    setIsPlaying(true)
    setShowOverlay(false)
  }

  const renderEmbed = () => {
    if (videoType === "panda" || videoUrl.includes("pandavideo")) {
      const pandaUrl = getPandaUrl(videoUrl)

      return (
        <iframe
          src={pandaUrl}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen={true}
          className="h-full w-full"
          style={{ border: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      )
    }

    if (
      videoType === "youtube" ||
      videoUrl.includes("youtube") ||
      videoUrl.includes("youtu.be") ||
      /^[a-zA-Z0-9_-]{11}$/.test(videoUrl)
    ) {
      const videoId = getYouTubeId(videoUrl)
      if (!videoId) {
        return <div className="flex h-full items-center justify-center text-red-400">URL de vídeo inválida</div>
      }

      const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        showinfo: "0",
        iv_load_policy: "3",
        disablekb: "0",
        fs: "1",
        playsinline: "1",
        autoplay: isPlaying ? "1" : "0",
      })

      return (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen={true}
          className="h-full w-full"
          style={{ border: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      )
    }

    if (videoType === "vimeo" || videoUrl.includes("vimeo") || /^\d+$/.test(videoUrl)) {
      const videoId = getVimeoId(videoUrl)
      if (!videoId) {
        return <div className="flex h-full items-center justify-center text-red-400">URL de vídeo inválida</div>
      }

      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen={true}
          className="h-full w-full"
          style={{ border: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      )
    }

    return (
      <video
        src={videoUrl}
        controls
        controlsList="nodownload"
        className="h-full w-full"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        onTimeUpdate={(e) => {
          const video = e.target as HTMLVideoElement
          const percent = (video.currentTime / video.duration) * 100
          onProgress?.(percent)
        }}
        onEnded={() => onComplete?.()}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl bg-black select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="aspect-video w-full relative">{renderEmbed()}</div>

      <style jsx global>{`
        .ytp-youtube-button,
        .ytp-watermark,
        .ytp-title-channel,
        .ytp-title-link,
        .ytp-share-button,
        .ytp-watch-later-button {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  )
}
