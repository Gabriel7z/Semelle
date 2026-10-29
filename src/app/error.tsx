"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
      <h1 className="font-heading text-4xl text-primary">A página não carregou.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Tente de novo. Se a sacola estava aberta, os pares continuam neste navegador.
      </p>
      <Button className="mt-6 h-11" onClick={() => reset()}>
        Tentar de novo
      </Button>
    </div>
  )
}
