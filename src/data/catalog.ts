export const store = {
  name: "Semelle",
  legalName: "Semelle Calçados",
  tagline: "O par perfeito",
  city: "Brasília",
  state: "DF",
  instagram: "https://www.instagram.com/usesemelle/",
  handle: "@usesemelle",
  dm: "https://ig.me/m/usesemelle",
  freeShippingCents: 24900,
  dfShippingCents: 1490,
  brShippingCents: 2790,
} as const

export const shoeSizes = ["33", "34", "35", "36", "37", "38", "39"] as const

export type CategoryId = "scarpins" | "rasteiras" | "papetes"

export type Colorway = {
  id: string
  name: string
  swatch: string
  images: string[]
}

export type Product = {
  slug: string
  name: string
  brand: string
  category: CategoryId
  cost: number
  reference?: string
  badge?: string
  featured?: boolean
  caption: string
  description: string
  details: string[]
  colors: Colorway[]
  sizes: string[]
  stock: Record<string, number>
  instagram?: string
}

export const categories: {
  id: CategoryId
  name: string
  blurb: string
  image: string
}[] = [
  {
    id: "scarpins",
    name: "Scarpins",
    blurb: "O salto que fecha o look sem pedir licença ao conforto.",
    image: "/products/scarpin-offwhite.jpg",
  },
  {
    id: "rasteiras",
    name: "Rasteiras",
    blurb: "Brilho no pé e sola rasteira para o dia inteiro.",
    image: "/products/rasteira-nude-1.jpg",
  },
  {
    id: "papetes",
    name: "Papetes",
    blurb: "Conforto de verdade, com o brilho na medida.",
    image: "/products/papete-vizzano.jpg",
  },
]

const sizes = [...shoeSizes]

function stock(
  colorIds: string[],
  overrides: Record<string, number> = {},
): Record<string, number> {
  const map: Record<string, number> = {}
  for (const colorId of colorIds) {
    for (const size of sizes) {
      const key = `${colorId}-${size}`
      map[key] = overrides[key] ?? 3
    }
  }
  return map
}

export const products: Product[] = [
  {
    slug: "scarpin-slingback-off-white",
    name: "Scarpin Slingback",
    brand: "Vizzano",
    category: "scarpins",
    cost: 18990,
    featured: true,
    caption: "Um scarpin é indispensável para quem ama elegância e conforto.",
    description:
      "Bico fino, tira no calcanhar e salto que alonga sem pesar. O off white da Vizzano entra no trabalho, no almoço e no convite de última hora — o par que a Semelle trata como básico de verdade.",
    details: [
      "Cor off white, com palmilha em tom caramelo e fivela dourada",
      "Modelo slingback, bico fino",
      "Marca Vizzano",
      "Numeração 33 ao 39",
    ],
    colors: [
      {
        id: "off-white",
        name: "Off white",
        swatch: "#E6E0D6",
        images: ["/products/scarpin-offwhite.jpg"],
      },
    ],
    sizes,
    stock: stock(["off-white"], { "off-white-33": 1, "off-white-39": 2 }),
    instagram: "https://www.instagram.com/p/DSnRpoyEZ6X/",
  },
  {
    slug: "rasteira-brilho-h",
    name: "Rasteira Brilho H",
    brand: "Vizzano",
    category: "rasteiras",
    cost: 13990,
    reference: "6371.1105",
    badge: "Mais pedida",
    featured: true,
    caption: "Para fechar o ano com estilo: muito brilho nos pés.",
    description:
      "A tira em H cravejada de strass é o par que a Semelle mais mostra no feed. Sola baixa, calce fácil e quatro cores para escolher a favorita — nude, dourado, preto e off white.",
    details: [
      "Referência Vizzano 6371.1105",
      "Cabedal sintético com aplicação de strass",
      "Solado baixo e palmilha macia",
      "Calce fácil, bico aberto",
      "Cores: nude, dourado, preto e off white",
    ],
    colors: [
      {
        id: "nude",
        name: "Nude",
        swatch: "#C6A57A",
        images: [
          "/products/rasteira-nude-1.jpg",
          "/products/rasteira-nude-2.jpg",
          "/products/rasteira-nude-3.jpg",
        ],
      },
      {
        id: "dourado",
        name: "Dourado",
        swatch: "#C6A15A",
        images: [
          "/products/rasteira-dourada-1.jpg",
          "/products/rasteira-dourada-2.jpg",
        ],
      },
      {
        id: "preto",
        name: "Preto",
        swatch: "#1C1C1C",
        images: [
          "/products/rasteira-preta-1.jpg",
          "/products/rasteira-preta-2.jpg",
        ],
      },
      {
        id: "off-white",
        name: "Off white",
        swatch: "#E7E1D4",
        images: [
          "/products/rasteira-off-1.jpg",
          "/products/rasteira-off-2.jpg",
        ],
      },
    ],
    sizes,
    stock: stock(["nude", "dourado", "preto", "off-white"], {
      "nude-39": 0,
      "dourado-34": 1,
      "preto-33": 2,
      "off-white-40": 0,
    }),
    instagram: "https://www.instagram.com/p/DR5EzeHEU1g/",
  },
  {
    slug: "papete-glitter",
    name: "Papete Glitter",
    brand: "Beira Rio",
    category: "papetes",
    cost: 9990,
    featured: true,
    caption: "Minimalista e confortável.",
    description:
      "Duas tiras de glitter sobre a base preta. A papete da Beira Rio é o par direto: pouco volume, brilho contido e sola que aguenta rua, shopping e fim de tarde.",
    details: [
      "Marca Beira Rio",
      "Duas tiras com glitter",
      "Base e palmilha pretas",
      "Modelo minimalista, calce fácil",
    ],
    colors: [
      {
        id: "preto",
        name: "Preto",
        swatch: "#1A1A1A",
        images: ["/products/papete-beira-rio.jpg"],
      },
    ],
    sizes,
    stock: stock(["preto"], { "preto-38": 0, "preto-33": 1 }),
    instagram: "https://www.instagram.com/p/DJ88s-JOI1b/",
  },
  {
    slug: "papete-strass",
    name: "Papete Strass",
    brand: "Vizzano",
    category: "papetes",
    cost: 15990,
    badge: "Vizzano",
    featured: true,
    caption: "Minimalistas, versáteis e com o brilho certo — exatamente como seu dia pede.",
    description:
      "Plataforma baixa, duas tiras de strass e a assinatura Vizzano na palmilha. Preta ou off white, ela atravessa o jeans e o vestido sem trocar de par.",
    details: [
      "Marca Vizzano",
      "Duas tiras com strass",
      "Solado plataforma, palmilha macia",
      "Disponível em preto e off white",
    ],
    colors: [
      {
        id: "preto",
        name: "Preto",
        swatch: "#161616",
        images: ["/products/papete-vizzano.jpg"],
      },
      {
        id: "off-white",
        name: "Off white",
        swatch: "#E4DDD2",
        images: ["/products/papete-vizzano.jpg"],
      },
    ],
    sizes,
    stock: stock(["preto", "off-white"], {
      "preto-39": 1,
      "off-white-34": 2,
    }),
    instagram: "https://www.instagram.com/p/DJb_kapu-mH/",
  },
  {
    slug: "papete-ornamento",
    name: "Papete Ornamento",
    brand: "Semelle",
    category: "papetes",
    cost: 12990,
    caption: "Sofisticada e confortável: do jeito que você merece.",
    description:
      "A tira larga fecha num ornamento dourado. Off white ou marrom, a papete tem cara de salto sem a altura — o par que a Semelle indica para quem quer presença e descanso no mesmo pé.",
    details: [
      "Ornamento metálico dourado",
      "Cores off white e marrom",
      "Sola macia, modelo de dedo",
      "Seleção Semelle",
    ],
    colors: [
      {
        id: "off-white",
        name: "Off white",
        swatch: "#F3EFE8",
        images: ["/products/papete-ornamento.jpg"],
      },
      {
        id: "marrom",
        name: "Marrom",
        swatch: "#6E4332",
        images: ["/products/papete-ornamento.jpg"],
      },
    ],
    sizes,
    stock: stock(["off-white", "marrom"], { "marrom-33": 0, "off-white-39": 2 }),
    instagram: "https://www.instagram.com/p/DI32DYOugxR/",
  },
  {
    slug: "rasteira-flor",
    name: "Rasteira Flor",
    brand: "Semelle",
    category: "rasteiras",
    cost: 14990,
    featured: true,
    caption: "Flor em destaque, brilho na medida certa e aquele toque especial que transforma qualquer produção.",
    description:
      "Amarração dourada no tornozelo, flor de ráfia e um centro de brilho. É a rasteira de ocasião da Semelle: festa, almoço longo, convite que pede um detalhe e não um salto.",
    details: [
      "Tiras douradas de amarrar no tornozelo",
      "Flor em ráfia com centro de strass",
      "Sola rasteira",
      "Seleção Semelle",
    ],
    colors: [
      {
        id: "dourado",
        name: "Dourado",
        swatch: "#C4A15A",
        images: ["/products/rasteira-flor.jpg"],
      },
    ],
    sizes,
    stock: stock(["dourado"], { "dourado-33": 1, "dourado-39": 0 }),
    instagram: "https://www.instagram.com/p/DI2HIkqu2RO/",
  },
]

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function unitsLeft(product: Product, colorId: string, size: string) {
  return product.stock[`${colorId}-${size}`] ?? 0
}

export function relatedProducts(slug: string) {
  const current = getProduct(slug)
  if (!current) return products.slice(0, 3)
  const same = products.filter(
    (product) => product.category === current.category && product.slug !== slug,
  )
  const rest = products.filter(
    (product) => product.category !== current.category && product.slug !== slug,
  )
  return [...same, ...rest].slice(0, 3)
}

export function categoryName(id: CategoryId) {
  return categories.find((category) => category.id === id)?.name ?? id
}

export const brands = [...new Set(products.map((product) => product.brand))]
