import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata: Metadata = {
  title: "Fechar pedido",
  description: "Reserve seu par na Semelle. A confirmação e o PIX seguem pelo WhatsApp.",
}

export default function CheckoutPage() {
  return <CheckoutForm />
}
