import type { Metadata, Viewport } from "next"
import { Fraunces, Outfit } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { CartSheet } from "@/components/cart-sheet"
import { EntryNotice } from "@/components/entry-notice"
import { CartProvider } from "@/components/cart-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"
import { store } from "@/data/catalog"
import { defaultShareImage, homeDescription, homeTitle, titleTemplate } from "@/lib/seo"
import { pagesOrigin } from "@/lib/site"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(pagesOrigin),
  title: {
    default: homeTitle,
    template: titleTemplate,
  },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: {
      default: homeTitle,
      template: titleTemplate,
    },
    description: homeDescription,
    url: "/",
    siteName: store.name,
    locale: "pt_BR",
    type: "website",
    images: [defaultShareImage],
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="overflow-x-clip antialiased">
        <ThemeProvider forcedTheme="light" attribute="class" disableTransitionOnChange>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <CartSheet />
            <EntryNotice />
            <Toaster position="top-center" offset={88} duration={2800} />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
