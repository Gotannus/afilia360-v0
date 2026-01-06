import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("daily_metrics_manual")
      .select("*")
      .order("date", { ascending: false })
      .limit(30)

    if (error) throw error

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("[v0] Error listing manual metrics:", error)
    return NextResponse.json({ error: "Failed to list metrics" }, { status: 500 })
  }
}
