import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getUserCourseAccessList,
  addUserCourseAccess,
  removeUserCourseAccess,
  getUsers,
  getCourses,
} from "@/lib/courses-api"

export async function GET() {
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

    const orderbumps = await getUserCourseAccessList()
    const users = await getUsers()
    const courses = await getCourses()

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
