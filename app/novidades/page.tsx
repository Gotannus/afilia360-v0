import { NovidadesPageClient } from "./novidades-client"

export const metadata = {
    title: "Novidades | Afilia360",
    description: "Atualizações, aulas, lives e criativos validados da Afilia360",
}

export default function NovidadesPage() {
    return <NovidadesPageClient initialPosts={[]} />
}
