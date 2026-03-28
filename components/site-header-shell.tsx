"use client"

import { useState } from "react"
import { Header } from "@/components/header"

export function SiteHeaderShell() {
  const [searchQuery, setSearchQuery] = useState("")

  return <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
}
