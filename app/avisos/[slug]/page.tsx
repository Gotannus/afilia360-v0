import { redirect } from "next/navigation"

export default async function AvisoSlugRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/novidades/${slug}`)
}
