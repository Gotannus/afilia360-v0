import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getUserCourseAccessList,
  addUserCourseAccess,
  removeUserCourseAccess,
  getUsers,
  getOrderbumpCourses,
  getCourses, // Declared the getCourses function here
} from "@/lib/courses-api"

export async function GET(request: Request) {
  try {
    console.log("[v0] API Orderbumps GET - Iniciando")
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] API Orderbumps GET - User:", user?.id, "Error:", authError)

    if (!user) {
      console.log("[v0] API Orderbumps GET - Usuário não autenticado")
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Verificar se é admin
    const { data: affiliate } = await supabase.from("affiliates").select("is_admin").eq("id", user.id).single()

    if (!affiliate?.is_admin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Se userId foi fornecido, buscar apenas os orderbumps daquele usuário
    if (userId) {
      const { data: userOrderbumps, error } = await supabase
        .from("user_course_access")
        .select(`
          *,
          course:courses(id, title)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      const courses = await getOrderbumpCourses()

      console.log("[v0] API Orderbumps - Orderbumps do usuário:", userOrderbumps?.length || 0)
      console.log("[v0] API Orderbumps - Cursos disponíveis:", courses.length)

      return NextResponse.json({
        userOrderbumps: userOrderbumps || [],
        courses,
      })
    }

    // Caso contrário, buscar todos os orderbumps (para listagem geral)
    const orderbumps = await getUserCourseAccessList()
    const users = await getUsers()
    const courses = await getOrderbumpCourses()

    console.log("[v0] API Orderbumps - Usuários:", users.length)
    console.log("[v0] API Orderbumps - Cursos:", courses.length)
    console.log("[v0] API Orderbumps - Orderbumps ativos:", orderbumps.length)

    return NextResponse.json({ orderbumps, users, courses })
  } catch (error) {
    console.error("Erro ao buscar orderbumps:", error)
    return NextResponse.json({ error: "Erro ao buscar orderbumps" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Verificar se é admin
    const { data: affiliate } = await supabase.from("affiliates").select("is_admin").eq("id", user.id).single()

    if (!affiliate?.is_admin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { userId, courseId, notes } = await request.json()

    if (!userId || !courseId) {
      return NextResponse.json({ error: "userId e courseId são obrigatórios" }, { status: 400 })
    }

    const success = await addUserCourseAccess(userId, courseId, "manual", notes || "")

    if (!success) {
      return NextResponse.json({ error: "Erro ao adicionar orderbump" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao adicionar orderbump:", error)
    return NextResponse.json({ error: "Erro ao adicionar orderbump" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Verificar se é admin
    const { data: affiliate } = await supabase.from("affiliates").select("is_admin").eq("id", user.id).single()

    if (!affiliate?.is_admin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const courseId = searchParams.get("courseId")

    if (!userId || !courseId) {
      return NextResponse.json({ error: "userId e courseId são obrigatórios" }, { status: 400 })
    }

    const success = await removeUserCourseAccess(userId, courseId)

    if (!success) {
      return NextResponse.json({ error: "Erro ao remover orderbump" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao remover orderbump:", error)
    return NextResponse.json({ error: "Erro ao remover orderbump" }, { status: 500 })
  }
}
