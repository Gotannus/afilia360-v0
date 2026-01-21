"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getUser } from "@/lib/auth"
import type { MemberPlan } from "@/lib/courses-api"

const BASIC_PLAN_ID = "80f64075-29b4-4fec-b824-1826bf5cc8fa"

interface UserPlan {
  plan: MemberPlan | null
  loading: boolean
  hasAccess: (courseId: string) => Promise<boolean>
  isExpired: boolean
  isVip: boolean
}

const accessCache: Record<string, boolean> = {}

export function useUserPlan(): UserPlan {
  const [plan, setPlan] = useState<MemberPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [planExpiresAt, setPlanExpiresAt] = useState<Date | null>(null)
  const [isVip, setIsVip] = useState(false)

  useEffect(() => {
    async function loadUserPlan() {
      const user = getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const supabase = createClient()

      const { data: userData } = await supabase
        .from("affiliates")
        .select("plan_id, plan_expires_at, is_vip")
        .eq("id", user.id)
        .single()

      if (userData?.is_vip) {
        setIsVip(true)
        setLoading(false)
        return
      }

      const planIdToUse = userData?.plan_id || BASIC_PLAN_ID

      // Buscar detalhes do plano
      const { data: planData } = await supabase.from("member_plans").select("*").eq("id", planIdToUse).single()

      setPlan(planData)
      setPlanExpiresAt(userData?.plan_expires_at ? new Date(userData.plan_expires_at) : null)
      setLoading(false)
    }

    loadUserPlan()
  }, [])

  const hasAccess = async (courseId: string): Promise<boolean> => {
    if (isVip) {
      return true
    }

    if (accessCache[courseId] !== undefined) {
      return accessCache[courseId]
    }

    const user = getUser()
    if (!user) {
      return false
    }

    const supabase = createClient()

    // PRIMEIRO: Verificar se tem acesso individual via orderbump
    const { data: orderbumpAccess } = await supabase
      .from("user_course_access")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle()

    if (orderbumpAccess) {
      console.log("[v0] Usuário tem acesso via orderbump ao curso:", courseId)
      accessCache[courseId] = true
      return true
    }

    const planIdToCheck = plan?.id || BASIC_PLAN_ID

    // Verificar se o plano expirou
    if (planExpiresAt && planExpiresAt < new Date()) {
      return false
    }

    // SEGUNDO: Verificar se o plano tem acesso ao curso
    const { data: access } = await supabase
      .from("plan_course_access")
      .select("id")
      .eq("plan_id", planIdToCheck)
      .eq("course_id", courseId)
      .maybeSingle()

    const hasAccess = !!access
    accessCache[courseId] = hasAccess
    return hasAccess
  }

  const isExpired = planExpiresAt ? planExpiresAt < new Date() : false

  return { plan, loading, hasAccess, isExpired, isVip }
}
