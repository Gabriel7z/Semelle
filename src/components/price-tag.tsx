import { formatBRL } from "@/lib/format"
import { cn } from "cn"

export function PriceTag({
  price,
  compareAt,
  size = "sm",
}: {
  price: number
  compareAt?: number | null
  size?: "sm" | "lg"
}) {
  const promocao = Boolean(compareAt && compareAt > price)

  if (!promocao) {
    return <p className={size === "lg" ? "font-heading text-3xl" : "text-sm"}>{formatBRL(price)}</p>
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <p
        className={cn(
          "text-muted-foreground line-through",
          size === "lg" ? "text-lg" : "text-xs",
        )}
      >
        {formatBRL(compareAt!)}
      </p>
      <p className={cn("text-primary", size === "lg" ? "font-heading text-3xl" : "text-sm font-medium")}>
        {formatBRL(price)}
      </p>
      <p className="text-[0.68rem] tracking-[0.12em] text-gold uppercase">Promoção</p>
    </div>
  )
}
