"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "semelle-aviso-desconto"

export function EntryNotice() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) setOpen(true)
  }, [])

  function confirm() {
    sessionStorage.setItem(STORAGE_KEY, "1")
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-black/40 px-4 py-6 sm:place-items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aviso-desconto-titulo"
    >
      <div className="w-full max-w-md bg-background p-6">
        <p className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">Aviso</p>
        <h2 id="aviso-desconto-titulo" className="font-heading mt-2 text-3xl text-primary">
          Desconto de primeira compra
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Itens em promoção não têm o desconto de 20%. Ele vale só para os pares fora da promoção, na primeira compra, à vista no PIX.
        </p>
        <Button className="mt-6 h-11 w-full" onClick={confirm}>
          Confirmar
        </Button>
      </div>
    </div>
  )
}
