import { createClient } from "@/lib/supabase/client"

export interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image: string | null
  category_id: string | null
  instructor: string | null
  duration_hours: number
  lessons_count: number
  is_published: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  category?: CourseCategory
}

export interface CourseCategory {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
}

export interface CourseLesson {
  id: string
  course_id: string
  title: string
  description: string | null
  video_url: string | null
  video_type: string
  duration_minutes: number
  sort_order: number
  is_free: boolean
  is_published: boolean
  attachments: { name: string; url: string; type: string }[]
}

export interface MemberPlan {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  features: string[]
  is_active: boolean
  sort_order: number
}

export interface UserLessonProgress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  completed: boolean
  progress_percent: number
  last_watched_at: string
  completed_at: string | null
}

// Buscar todas as categorias
export async function getCategories(): Promise<CourseCategory[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("course_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }
  return data || []
}

// Buscar cursos por categoria
export async function getCoursesByCategory(categorySlug?: string): Promise<Course[]> {
  const supabase = createClient()
  let query = supabase
    .from("courses")
    .select(`
      *,
      category:course_categories(*)
    `)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })

  if (categorySlug) {
    const { data: category, error: catError } = await supabase
      .from("course_categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle()

    if (catError) {
      console.error("Erro ao buscar categoria:", catError)
    } else if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error("Erro ao buscar cursos:", error)
    return []
  }
  return data || []
}

// Buscar cursos agrupados por categoria
export async function getCoursesGroupedByCategory(): Promise<{ category: CourseCategory; courses: Course[] }[]> {
  const categories = await getCategories()
  const supabase = createClient()

  const { data: allCourses, error } = await supabase
    .from("courses")
    .select(`
      *,
      category:course_categories(*)
    `)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Erro ao buscar cursos:", error)
    return []
  }

  return categories
    .map((category) => ({
      category,
      courses: (allCourses || [])
        .filter((course) => course.category_id === category.id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    }))
    .filter((group) => group.courses.length > 0)
}

// Buscar curso por slug
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      category:course_categories(*)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Erro ao buscar curso:", error)
    return null
  }
  return data
}

// Buscar aulas de um curso
export async function getCourseLessons(courseId: string): Promise<CourseLesson[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("course_lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Erro ao buscar aulas:", error)
    return []
  }
  return data || []
}

// Buscar planos
export async function getPlans(): Promise<MemberPlan[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("member_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Erro ao buscar planos:", error)
    return []
  }
  return data || []
}

// Verificar acesso do usuário a um curso
export async function checkCourseAccess(userId: string, courseId: string): Promise<boolean> {
  const supabase = createClient()

  // Primeiro verifica se tem acesso individual (orderbump)
  const { data: individualAccess, error: individualError } = await supabase
    .from("user_course_access")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle()

  if (individualError) {
    console.error("Erro ao verificar acesso individual:", individualError)
  }

  // Se tem acesso individual, retorna true
  if (individualAccess) return true

  // Caso contrário, verifica acesso por plano
  const { data: user, error: userError } = await supabase
    .from("affiliates")
    .select("plan_id")
    .eq("id", userId)
    .maybeSingle()

  if (userError) {
    console.error("Erro ao buscar usuário:", userError)
    return false
  }

  if (!user?.plan_id) return false

  const { data: access, error: accessError } = await supabase
    .from("plan_course_access")
    .select("id")
    .eq("plan_id", user.plan_id)
    .eq("course_id", courseId)
    .maybeSingle()

  if (accessError) {
    console.error("Erro ao verificar acesso:", accessError)
    return false
  }

  return !!access
}

// Salvar progresso da aula
export async function saveLessonProgress(
  userId: string,
  lessonId: string,
  courseId: string,
  progressPercent: number,
  completed: boolean,
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("user_lesson_progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      course_id: courseId,
      progress_percent: progressPercent,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      last_watched_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,lesson_id",
    },
  )

  if (error) {
    console.error("Erro ao salvar progresso:", error)
  }
}

// Buscar progresso do usuário em um curso
export async function getUserCourseProgress(userId: string, courseId: string): Promise<UserLessonProgress[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)

  if (error) {
    console.error("Erro ao buscar progresso:", error)
    return []
  }
  return data || []
}

// Admin: Adicionar curso
export async function addCourse(course: Partial<Course>): Promise<Course | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("courses").insert([course]).select().single()

  if (error) {
    console.error("Erro ao adicionar curso:", error)
    return null
  }
  return data
}

// Admin: Atualizar curso
export async function updateCourse(id: string, course: Partial<Course>): Promise<Course | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("courses")
    .update({ ...course, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar curso:", error)
    return null
  }
  return data
}

// Admin: Deletar curso
export async function deleteCourse(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("courses").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar curso:", error)
    return false
  }
  return true
}

// Admin: Adicionar aula
export async function addLesson(lesson: Partial<CourseLesson>): Promise<CourseLesson | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("course_lessons").insert([lesson]).select().single()

  if (error) {
    console.error("Erro ao adicionar aula:", error)
    return null
  }
  return data
}

// Admin: Atualizar aula
export async function updateLesson(id: string, lesson: Partial<CourseLesson>): Promise<CourseLesson | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("course_lessons")
    .update({ ...lesson, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar aula:", error)
    return null
  }
  return data
}

// Admin: Deletar aula
export async function deleteLesson(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("course_lessons").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar aula:", error)
    return false
  }
  return true
}

// Admin: Buscar todos os cursos (incluindo não publicados)
export async function getCourses(): Promise<Course[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      category:course_categories(*)
    `)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Erro ao buscar cursos:", error)
    return []
  }
  return data || []
}

// Admin: Buscar cursos marcados como orderbump
export async function getOrderbumpCourses(): Promise<Course[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      category:course_categories(*)
    `)
    .eq("is_orderbump", true)
    .order("title", { ascending: true })

  if (error) {
    console.error("[v0] Erro ao buscar cursos orderbump:", error)
    return []
  }
  
  console.log("[v0] Cursos orderbump encontrados:", data?.length || 0)
  return data || []
}

// Admin: Criar curso
export async function createCourse(course: Partial<Course>): Promise<Course | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("courses").insert([course]).select().single()

  if (error) {
    console.error("Erro ao criar curso:", error)
    return null
  }
  return data
}

// Admin: Criar categoria
export async function createCategory(category: Partial<CourseCategory>): Promise<CourseCategory | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("course_categories").insert([category]).select().single()

  if (error) {
    console.error("Erro ao criar categoria:", error)
    return null
  }
  return data
}

// Admin: Atualizar categoria
export async function updateCategory(id: string, category: Partial<CourseCategory>): Promise<CourseCategory | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("course_categories").update(category).eq("id", id).select().single()

  if (error) {
    console.error("Erro ao atualizar categoria:", error)
    return null
  }
  return data
}

// Admin: Deletar categoria
export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("course_categories").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar categoria:", error)
    return false
  }
  return true
}

// Admin: Buscar aulas por curso (incluindo não publicadas)
export async function getLessonsByCourse(courseId: string): Promise<CourseLesson[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("course_lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Erro ao buscar aulas:", error)
    return []
  }
  return data || []
}

// Admin: Criar aula
export async function createLesson(courseId: string, lesson: Partial<CourseLesson>): Promise<CourseLesson | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("course_lessons")
    .insert([{ ...lesson, course_id: courseId }])
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar aula:", error)
    return null
  }
  return data
}

// Admin: Buscar acessos de um plano
export async function getPlanCourseAccess(planId: string): Promise<any[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("plan_course_access").select("*").eq("plan_id", planId)

  if (error) {
    console.error("Erro ao buscar acessos do plano:", error)
    return []
  }
  return data || []
}

// Admin: Atualizar acessos de um plano
export async function updatePlanCourseAccess(planId: string, courseIds: string[]): Promise<boolean> {
  const supabase = createClient()

  // Deletar acessos antigos
  await supabase.from("plan_course_access").delete().eq("plan_id", planId)

  // Inserir novos acessos
  if (courseIds.length > 0) {
    const { error } = await supabase
      .from("plan_course_access")
      .insert(courseIds.map((courseId) => ({ plan_id: planId, course_id: courseId })))

    if (error) {
      console.error("Erro ao atualizar acessos:", error)
      return false
    }
  }

  return true
}

// Admin: Listar todos os orderbumps (acessos individuais)
export async function getUserCourseAccessList(): Promise<any[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("user_course_access")
    .select(`
      *,
      user:affiliates(id, name, email),
      course:courses(id, title, slug)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar orderbumps:", error)
    return []
  }
  return data || []
}

// Admin: Adicionar orderbump (liberar curso para usuário)
export async function addUserCourseAccess(
  userId: string,
  courseId: string,
  grantedBy: string = "manual",
  notes: string = "",
): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("user_course_access").insert([
    {
      user_id: userId,
      course_id: courseId,
      granted_by: grantedBy,
      notes: notes,
    },
  ])

  if (error) {
    console.error("Erro ao adicionar orderbump:", error)
    return false
  }
  return true
}

// Admin: Remover orderbump (remover acesso individual)
export async function removeUserCourseAccess(userId: string, courseId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from("user_course_access")
    .delete()
    .eq("user_id", userId)
    .eq("course_id", courseId)

  if (error) {
    console.error("Erro ao remover orderbump:", error)
    return false
  }
  return true
}

// Admin: Buscar todos os usuários
export async function getUsers(): Promise<any[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("affiliates").select("id, name, email, plan_id").order("name")

  if (error) {
    console.error("Erro ao buscar usuários:", error)
    return []
  }
  return data || []
}
