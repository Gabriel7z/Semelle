import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { categoryName } from "@/data/catalog"
import type { Product } from "@/lib/loja"
import { formatBRL } from "@/lib/format"

export function ProductCard({ product }: { product: Product }) {
  const image = product.colors[0]?.images[0]
  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-[#efe8dc]">
        {image ? (
          <Image
            src={image}
            alt={`${product.name} ${product.brand}`}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        {product.badge ? (
          <Badge className="absolute top-3 left-3 bg-background/90 text-primary">
            {product.badge}
          </Badge>
        ) : null}
      </div>
      <div className="pt-3">
        <p className="truncate text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase sm:tracking-[0.18em]">
          {product.brand} · {categoryName(product.category)}
        </p>
        <div className="mt-1 flex flex-col gap-1">
          <h3 className="line-clamp-2 font-heading text-lg leading-tight text-primary group-hover:underline sm:text-xl">
            {product.name}
          </h3>
          <p className="text-sm">{formatBRL(product.price)}</p>
        </div>
        <div className="mt-2 flex gap-1.5">
          {product.colors.map((color) => (
            <span
              key={color.id}
              title={color.name}
              className="size-3 rounded-full border border-black/10"
              style={{ backgroundColor: color.swatch }}
            />
          ))}
        </div>
      </div>
    </Link>
  )
}
