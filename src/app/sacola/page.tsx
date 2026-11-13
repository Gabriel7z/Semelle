import { BagPage } from "@/components/bag-page"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Sacola",
  description: "Pares reservados neste navegador. A Use Semelle confirma estoque e pagamento no WhatsApp.",
  path: "/sacola",
  index: false,
})

export default function SacolaPage() {
  return <BagPage />
}
