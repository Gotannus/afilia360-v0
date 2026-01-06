import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("system_settings").select("total_sales_count").eq("id", 1).single()

    if (error) throw error

    return NextResponse.json({ totalSales: data?.total_sales_count || 0 })
  } catch (error) {
    console.error("Error fetching total sales:", error)
    return NextResponse.json({ totalSales: 0 }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { totalSales } = await request.json()
    const supabase = await createClient()

    const { error } = await supabase
      .from("system_settings")
      .update({
        total_sales_count: totalSales,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating total sales:", error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
