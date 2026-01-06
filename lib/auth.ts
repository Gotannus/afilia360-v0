"use client"

const ADMIN_EMAIL = "rtmacedo2@hotmail.com"

export interface AffiliateSession {
  id: string
  name: string
  email: string
  loggedIn: boolean
  isAdmin: boolean
  photoUrl?: string
}

export function getSession(): AffiliateSession | null {
  if (typeof window === "undefined") return null

  const session = localStorage.getItem("affiliate_session")
  if (!session) return null

  try {
    return JSON.parse(session) as AffiliateSession
  } catch {
    return null
  }
}

export function getUser(): AffiliateSession | null {
  return getSession()
}

export function setUser(user: AffiliateSession) {
  if (typeof window === "undefined") return
  localStorage.setItem("affiliate_session", JSON.stringify(user))
}

export function setSession(session: AffiliateSession) {
  setUser(session)
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem("affiliate_session")
  window.location.href = "/login"
}

export function isLoggedIn(): boolean {
  const session = getSession()
  return session?.loggedIn === true
}

export function isAdmin(): boolean {
  const session = getSession()
  return session?.email === ADMIN_EMAIL
}

export function getAdminEmail(): string {
  return ADMIN_EMAIL
}
