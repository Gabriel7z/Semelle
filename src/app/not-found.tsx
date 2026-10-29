import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
      <p className="text-[0.68rem] tracking-[0.22em] text-muted-foreground uppercase">404</p>
      <h1 className="font-heading mt-3 text-5xl text-primary">Esse par não está na vitrine.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        O endereço não corresponde a uma página da Semelle. A coleção continua no mesmo lugar.
      </p>
      <Link href="/produtos" className={cn(buttonVariants(), "mt-6 inline-flex h-11 px-5")}>
        Ver a coleção
      </Link>
    </div>
  )
}
