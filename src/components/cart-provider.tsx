"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { toast } from "sonner"
import { unitsLeft } from "@/data/catalog"
import { getProduct } from "@/lib/loja"

export type CartLine = {
  key: string
  slug: string
  name: string
  brand: string
  colorId: string
  colorName: string
  size: string
  price: number
  image: string
  qty: number
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (open: boolean) => void
  ready: boolean
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "semelle-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const linesRef = useRef(lines)
  linesRef.current = lines

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const stored = JSON.parse(raw) as CartLine[]
        setLines((current) => (current.length > 0 ? current : stored))
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, ready])

  const add = useCallback((line: Omit<CartLine, "key" | "qty">, qty = 1) => {
    const product = getProduct(line.slug)
    const available = product ? unitsLeft(product, line.colorId, line.size) : 0
    const key = `${line.slug}-${line.colorId}-${line.size}`
    const current = linesRef.current
    const existing = current.find((item) => item.key === key)
    const nextQty = (existing?.qty ?? 0) + qty
    if (nextQty > available) {
      toast.error(
        available > 0
          ? `Só temos ${available} neste número.`
          : "Este número esgotou.",
      )
      return
    }
    const next = existing
      ? current.map((item) =>
          item.key === key ? { ...item, qty: nextQty } : item,
        )
      : [...current, { ...line, key, qty }]
    linesRef.current = next
    setLines(next)
    setOpen(true)
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    const current = linesRef.current
    const line = current.find((item) => item.key === key)
    if (!line) return
    const product = getProduct(line.slug)
    const available = product
      ? unitsLeft(product, line.colorId, line.size)
      : line.qty
    if (qty > available) {
      toast.error(`Só temos ${available} neste número.`)
      return
    }
    const next =
      qty < 1
        ? current.filter((item) => item.key !== key)
        : current.map((item) => (item.key === key ? { ...item, qty } : item))
    linesRef.current = next
    setLines(next)
  }, [])

  const remove = useCallback((key: string) => {
    const next = linesRef.current.filter((item) => item.key !== key)
    linesRef.current = next
    setLines(next)
  }, [])

  const clear = useCallback(() => {
    linesRef.current = []
    setLines([])
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0)
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0)
    return {
      lines,
      count,
      subtotal,
      open,
      setOpen,
      ready,
      add,
      setQty,
      remove,
      clear,
    }
  }, [lines, open, ready, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart precisa estar dentro de CartProvider")
  }
  return context
}
