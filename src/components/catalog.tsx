"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { categories, type CategoryId } from "@/data/catalog"
import { brands, products } from "@/lib/loja"
import { cn } from "cn"

const pageSize = 24

const sorts = [
  { id: "destaque", label: "Destaques" },
  { id: "menor", label: "Menor preço" },
  { id: "maior", label: "Maior preço" },
  { id: "nome", label: "Nome" },
] as const

export function Catalog() {
  const params = useSearchParams()
  const router = useRouter()
  const category = params.get("categoria")
  const brand = params.get("marca")
  const sort = params.get("ordem") ?? "destaque"
  const query = (params.get("q") ?? "").trim().toLowerCase()

  const visible = useMemo(() => {
    let list = products.filter((product) => {
      if (category && product.category !== category) return false
      if (brand && product.brand !== brand) return false
      if (query) {
        const haystack = `${product.name} ${product.brand} ${product.caption}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
    if (sort === "menor") list = [...list].sort((a, b) => a.price - b.price)
    if (sort === "maior") list = [...list].sort((a, b) => b.price - a.price)
    if (sort === "nome") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    if (sort === "destaque") {
      list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    }
    return list
  }, [category, brand, sort, query])

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString())
    if (!value) next.delete(key)
    else next.set(key, value)
    const qs = next.toString()
    router.push(qs ? `/produtos?${qs}` : "/produtos")
  }

  const [shown, setShown] = useState(pageSize)

  useEffect(() => {
    setShown(pageSize)
  }, [category, brand, sort, query])

  const activeCategory = categories.find((item) => item.id === category)
  const page = visible.slice(0, shown)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-[0.68rem] tracking-[0.22em] text-muted-foreground uppercase">
        Coleção
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-heading text-4xl text-primary sm:text-5xl">
          {activeCategory ? activeCategory.name : "Todos os pares"}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {activeCategory
            ? activeCategory.blurb
            : "O que está no Instagram da Semelle, pronto para escolher cor e número."}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-y border-border py-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <FilterChip active={!category} onClick={() => update("categoria", null)}>
            Tudo
          </FilterChip>
          {categories.map((item) => (
            <FilterChip
              key={item.id}
              active={category === item.id}
              onClick={() =>
                update("categoria", category === item.id ? null : (item.id as CategoryId))
              }
            >
              {item.name}
            </FilterChip>
          ))}
          <span className="mx-1 hidden h-6 w-px self-center bg-border sm:block" />
          {brands.map((item) => (
            <FilterChip
              key={item}
              active={brand === item}
              onClick={() => update("marca", brand === item ? null : item)}
            >
              {item}
            </FilterChip>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Ordenar
          <select
            value={sort}
            onChange={(event) => update("ordem", event.target.value)}
            className="h-11 border border-input bg-background px-2 text-base text-foreground sm:h-9 sm:text-sm"
          >
            {sorts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="py-20">
          <p className="font-heading text-3xl text-primary">Nenhum par com esses filtros.</p>
          <button
            type="button"
            className="mt-4 text-sm underline"
            onClick={() => router.push("/produtos")}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-3">
            {page.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          {shown < visible.length ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {shown} de {visible.length} pares
              </p>
              <button
                type="button"
                className="h-11 border border-primary px-6 text-sm"
                onClick={() => setShown((count) => count + pageSize)}
              >
                Ver mais
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 shrink-0 border px-3 text-xs tracking-wide uppercase sm:h-8",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:border-primary",
      )}
    >
      {children}
    </button>
  )
}
