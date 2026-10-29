import { store } from "@/data/catalog"
import { formatBRL, formatWhen } from "@/lib/format"

export type OrderItem = {
  key: string
  slug: string
  name: string
  brand: string
  colorName: string
  size: string
  price: number
  image: string
  qty: number
}

export type Order = {
  id: string
  createdAt: string
  customer: {
    name: string
    whatsapp: string
    email: string
  }
  address: {
    cep: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  }
  shippingMethod: "entrega" | "retirada"
  shippingLabel: string
  shippingDays: string
  shippingPrice: number
  payment: "pix" | "combinar"
  note: string
  items: OrderItem[]
  subtotal: number
  total: number
}

const STORAGE_KEY = "semelle-orders"

export function newOrderId() {
  const now = new Date()
  const stamp = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
  const salt = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `SM${stamp}-${salt}`
}

export function saveOrder(order: Order) {
  const current = readOrders()
  current.unshift(order)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, 30)))
}

export function getOrder(id: string) {
  return readOrders().find((order) => order.id === id) ?? null
}

function readOrders(): Order[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

export function formatOrderText(order: Order) {
  const lines = [
    `Pedido ${order.id} — ${store.legalName}`,
    formatWhen(order.createdAt),
    "",
    ...order.items.map(
      (item) =>
        `• ${item.name} (${item.brand}) — ${item.colorName}, nº ${item.size} — ${item.qty}x ${formatBRL(item.price)}`,
    ),
    "",
    `Subtotal: ${formatBRL(order.subtotal)}`,
    `Frete: ${order.shippingPrice === 0 ? "grátis" : formatBRL(order.shippingPrice)} (${order.shippingLabel})`,
    `Total: ${formatBRL(order.total)}`,
    `Pagamento: ${order.payment === "pix" ? "PIX" : "combinar no atendimento"}`,
    "",
    `Nome: ${order.customer.name}`,
    `WhatsApp: ${order.customer.whatsapp}`,
  ]
  if (order.customer.email) lines.push(`E-mail: ${order.customer.email}`)
  if (order.shippingMethod === "entrega") {
    lines.push(
      `Endereço: ${order.address.street}, ${order.address.number}${order.address.complement ? ` — ${order.address.complement}` : ""}`,
      `${order.address.neighborhood} — ${order.address.city}/${order.address.state}`,
      `CEP ${order.address.cep}`,
    )
  } else {
    lines.push("Entrega: retirada em Brasília")
  }
  if (order.note) lines.push("", `Obs.: ${order.note}`)
  return lines.join("\n")
}
