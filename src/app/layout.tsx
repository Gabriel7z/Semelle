import type { Metadata, Viewport } from "next"
import { Fraunces, Outfit } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { CartSheet } from "@/components/cart-sheet"
import { CartProvider } from "@/components/cart-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"
import { store } from "@/data/catalog"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: {
    default: `${store.legalName} · ${store.tagline}`,
    template: `%s · ${store.name}`,
  },
  description:
    "Calçados femininos em Brasília. Scarpins, rasteiras e papetes Vizzano e Beira Rio, com elegância e conforto. Enviamos para todo o Brasil.",
  openGraph: {
    title: `${store.legalName} · ${store.tagline}`,
    description:
      "Scarpins, rasteiras e papetes escolhidos em Brasília. O par perfeito para cada passo.",
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${outfit.variable} ${fraunces.variable} overflow-x-clip antialiased`}>
        <ThemeProvider forcedTheme="light" attribute="class" disableTransitionOnChange>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <CartSheet />
            <Toaster position="top-center" offset={88} duration={2800} />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
