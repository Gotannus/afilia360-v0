"use server"

import { createClient } from "@/lib/supabase/server"
import { getOrderbumpCourses, addUserCourseAccess, removeUserCourseAccess } from "@/lib/courses-api"

export async function getUserOrderbumps(userId: string) {
  try {
    console.log("[v0] getUserOrderbumps - userId:", userId)
    const supabase = await createClient()

    // Buscar orderbumps do usuário
    const { data: userOrderbumps, error } = await supabase
      .from("user_course_access")
      .select(`
        *,
        course:courses(id, title, slug)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Erro ao buscar orderbumps do usuário:", error)
      return { success: false, error: error.message }
    }

    // Buscar cursos disponíveis como orderbump
    const courses = await getOrderbumpCourses()

    console.log("[v0] getUserOrderbumps - Orderbumps:", userOrderbumps?.length || 0)
    console.log("[v0] getUserOrderbumps - Cursos disponíveis:", courses.length)

    return {
      success: true,
      userOrderbumps: userOrderbumps || [],
      courses,
    }
  } catch (error) {
    console.error("[v0] Erro em getUserOrderbumps:", error)
    return { success: false, error: String(error) }
  }
}

export async function addOrderbump(userId: string, courseId: string, notes: string) {
  try {
    console.log("[v0] addOrderbump - userId:", userId, "courseId:", courseId)
    const success = await addUserCourseAccess(userId, courseId, "manual", notes)
    return { success }
  } catch (error) {
    console.error("[v0] Erro em addOrderbump:", error)
    return { success: false, error: String(error) }
  }
}

export async function removeOrderbump(userId: string, courseId: string) {
  try {
    console.log("[v0] removeOrderbump - userId:", userId, "courseId:", courseId)
    const success = await removeUserCourseAccess(userId, courseId)
    return { success }
  } catch (error) {
    console.error("[v0] Erro em removeOrderbump:", error)
    return { success: false, error: String(error) }
  }
}
