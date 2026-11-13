import { CheckoutForm } from "@/components/checkout-form"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Fechar pedido",
  description: "Reserve seu par na Use Semelle. A confirmação e o PIX seguem pelo WhatsApp.",
  path: "/checkout",
  index: false,
})

export default function CheckoutPage() {
  return <CheckoutForm />
}
