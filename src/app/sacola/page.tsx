import type { Metadata } from "next"
import { BagPage } from "@/components/bag-page"

export const metadata: Metadata = {
  title: "Sacola",
}

export default function SacolaPage() {
  return <BagPage />
}
