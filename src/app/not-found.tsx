import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { store } from "@/data/catalog"
import { defaultShareImage } from "@/lib/seo"
import { cn } from "cn"

export const metadata = {
  title: "Página não encontrada",
  description: "O endereço não corresponde a uma página da Use Semelle.",
  robots: { index: false, follow: true },
  alternates: {},
  openGraph: {
    siteName: store.name,
    locale: "pt_BR" as const,
    type: "website" as const,
    images: [defaultShareImage],
  },
}

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">404</p>
      <h1 className="font-heading mt-3 text-4xl leading-[1.05] text-primary sm:text-[3.5rem]">Esse par não está na vitrine.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        O endereço não corresponde a uma página da Use Semelle. A coleção continua no mesmo lugar.
      </p>
      <Link href="/produtos" className={cn(buttonVariants(), "mt-6 inline-flex h-11 px-5")}>
        Ver a coleção
      </Link>
    </div>
  )
}
