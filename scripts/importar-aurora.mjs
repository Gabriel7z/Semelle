import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

const PHONE = "61995730688"
const ORIGIN = "https://auroracalcados.com.br"

/** Linhas femininas do atacado. Cada id é a categoria “ver tudo” da marca. */
const MARCAS = [
  { id: "246349", marca: "Aurora" },
  { id: "239479", marca: "Activitta" },
  { id: "200875", marca: "Beira Rio" },
  { id: "239482", marca: "BR Sport" },
  { id: "423190", marca: "Cameia" },
  { id: "187192", marca: "Modare" },
  { id: "200874", marca: "Moleca" },
  { id: "200872", marca: "Vizzano" },
]

const PULAR = /bolsa|meia|caixa|filtro/i

function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72)
}

function numero(valor) {
  if (typeof valor === "number" && Number.isFinite(valor)) return valor
  if (typeof valor === "string" && valor.trim()) {
    const limpo = valor.replace(/\./g, "").replace(",", ".")
    const n = Number(limpo)
    if (Number.isFinite(n)) return n
    const direto = Number(valor)
    if (Number.isFinite(direto)) return direto
  }
  return null
}

function reaisParaCentavos(valor) {
  const n = numero(valor)
  if (n == null || n <= 0) return null
  return Math.round(n * 100)
}

function precoCusto(produto) {
  const precos = produto.precos_produto || {}
  const aPartir = precos.preco_a_partir
  const candidatos = [
    precos.padrao,
    aPartir && aPartir.ativado ? aPartir.preco : null,
    precos.promocional && precos.promocional !== false ? precos.promocional : null,
    produto.preco,
    produto.preco_original,
  ]
  for (const candidato of candidatos) {
    const centavos = reaisParaCentavos(candidato)
    if (centavos) return centavos
  }
  return null
}

function urlsDe(valor) {
  const achados = []
  const visitar = (item) => {
    if (!item) return
    if (typeof item === "string" && item.startsWith("http")) {
      achados.push(item)
      return
    }
    if (Array.isArray(item)) {
      item.forEach(visitar)
      return
    }
    if (typeof item === "object") {
      for (const chave of ["url", "src", "imagem", "caminho", "original", "large", "thumb"]) {
        if (typeof item[chave] === "string" && item[chave].startsWith("http")) {
          achados.push(item[chave])
        }
      }
    }
  }
  visitar(valor)
  return [...new Set(achados)].slice(0, 6)
}

function listaVariacoes(produto) {
  const bruto = produto.variacoes
  if (!bruto) return []
  const lista = Array.isArray(bruto) ? bruto : Object.values(bruto)
  return lista.filter((item) => item && typeof item === "object")
}

function tamanhoDe(nome) {
  const texto = String(nome || "")
  const match = texto.match(/\b(3[3-9]|4[0-2])\b/)
  return match ? match[1] : null
}

function corDe(variacao) {
  const cor = String(variacao.cor || "").trim()
  if (cor) return cor
  const nome = String(variacao.nome || "").trim()
  if (nome && !tamanhoDe(nome)) return nome
  return ""
}

const AMOSTRA = {
  preto: "#1c1c1c",
  preta: "#1c1c1c",
  branco: "#f4f1ec",
  branca: "#f4f1ec",
  off: "#f3efe6",
  nude: "#d7b59a",
  bege: "#e4d2b8",
  caramelo: "#b5814a",
  marrom: "#6b4423",
  cafe: "#4a3426",
  camel: "#c4a574",
  dourado: "#c6a15b",
  dourada: "#c6a15b",
  ouro: "#c6a15b",
  prata: "#c5c8ce",
  prateado: "#c5c8ce",
  rosa: "#e7b7c6",
  rose: "#e7b7c6",
  vermelho: "#9c2f2f",
  vermelha: "#9c2f2f",
  verde: "#3f6b4a",
  azul: "#355c7d",
  lilas: "#b9a4c9",
  lilás: "#b9a4c9",
  laranja: "#d4713b",
}

function amostra(nome) {
  const chave = slugify(nome).split("-")[0]
  return AMOSTRA[chave] || "#cfc6ba"
}

function estoqueDe(variacao, produto) {
  if (String(produto.controlar_estoque) === "1") {
    const n = parseInt(variacao.estoque, 10)
    return Number.isFinite(n) && n > 0 ? n : 0
  }
  return 3
}

function textoLimpo(valor) {
  return String(valor || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizar(produto, marca) {
  const nome = textoLimpo(produto.nome || produto.titulo)
  const custo = precoCusto(produto)
  const imagensProduto = urlsDe(produto.imagens)
  if (!nome || !custo || imagensProduto.length === 0) return null

  const categoriaNome = textoLimpo(produto.categoria_nome || produto.subcategoria || "Calçados")
  if (PULAR.test(categoriaNome) || PULAR.test(nome)) return null

  const categoria = slugify(categoriaNome) || "calcados"
  const variacoes = listaVariacoes(produto)
  const grupos = new Map()

  for (const variacao of variacoes) {
    const cor = corDe(variacao) || "Única"
    const id = slugify(cor) || "unica"
    if (!grupos.has(id)) {
      grupos.set(id, {
        id,
        name: cor,
        swatch: amostra(cor),
        images: urlsDe(variacao.imagem).length ? urlsDe(variacao.imagem) : imagensProduto,
        sizes: new Map(),
      })
    }
    const tamanho = tamanhoDe(variacao.nome) || tamanhoDe(variacao.nome_tratado)
    if (tamanho) grupos.get(id).sizes.set(tamanho, estoqueDe(variacao, produto))
  }

  let colors = [...grupos.values()]
  if (colors.length === 0) {
    colors = [
      {
        id: "unica",
        name: "Única",
        swatch: "#cfc6ba",
        images: imagensProduto,
        sizes: new Map(),
      },
    ]
  }

  const sizes = new Set()
  const stock = {}
  for (const color of colors) {
    if (color.sizes.size === 0) {
      for (const tamanho of ["33", "34", "35", "36", "37", "38", "39"]) {
        color.sizes.set(tamanho, 3)
      }
    }
    for (const [tamanho, qtd] of color.sizes) {
      sizes.add(tamanho)
      stock[`${color.id}-${tamanho}`] = qtd
    }
    if (color.images.length === 0) color.images = imagensProduto
  }

  const tamanhos = [...sizes].sort()
  const id = String(produto.id)
  const referencia = textoLimpo(produto.sku || produto.referencia || produto.cod_barras) || null
  const descricao =
    textoLimpo(produto.descricao || produto.descricao_curta) ||
    `${nome}. ${marca}, numeração ${tamanhos[0]} ao ${tamanhos[tamanhos.length - 1]}.`

  return {
    slug: `${slugify(nome) || "par"}-${id}`,
    name: nome,
    brand: marca,
    category: categoria,
    categoryName: categoriaNome,
    cost: custo,
    reference: referencia,
    featured: false,
    caption: nome,
    description: descricao,
    details: [
      `Marca ${marca}`,
      categoriaNome,
      `Numeração ${tamanhos.join(", ")}`,
    ],
    colors: colors.map(({ sizes: _sizes, ...color }) => color),
    sizes: tamanhos,
    stock,
    supplierId: id,
  }
}

async function pagina(marca, page) {
  const url = `${ORIGIN}/c/auroraatacado/carregar_produtos/${page}/${marca.id}/${PHONE}?mobile=0`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "SemelleCatalogo/1.0",
      Origin: ORIGIN,
      Referer: `${ORIGIN}/c/auroraatacado/categoria/${marca.id}/${PHONE}`,
    },
    body: JSON.stringify({ pagina_especifica: "categoria" }),
  })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`${marca.marca} página ${page}: HTTP ${response.status} ${text.slice(0, 180)}`)
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`${marca.marca} página ${page}: resposta não é JSON ${text.slice(0, 180)}`)
  }
}

function produtosDaResposta(data) {
  if (!data || data.acao) return []
  const lista = data.produtos !== undefined ? data.produtos : data
  if (Array.isArray(lista)) return lista
  if (lista && typeof lista === "object") return Object.values(lista)
  return []
}

async function marcaCompleta(marca) {
  const brutos = []
  const vistos = new Set()
  for (let page = 1; page <= 80; page += 1) {
    const data = await pagina(marca, page)
    if (data?.acao === "sem_mais_produtos") break
    const lote = produtosDaResposta(data)
    const novos = lote.filter((item) => item && !vistos.has(String(item.id)))
    if (novos.length === 0) break
    novos.forEach((item) => vistos.add(String(item.id)))
    brutos.push(...novos)
    process.stdout.write(`${marca.marca} p${page}: +${novos.length} (total ${brutos.length})\n`)
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  return brutos
}

const porId = new Map()
const amostras = []

for (const marca of MARCAS) {
  const brutos = await marcaCompleta(marca)
  if (brutos[0] && amostras.length < 2) {
    amostras.push({ marca: marca.marca, chaves: Object.keys(brutos[0]), produto: brutos[0] })
  }
  for (const bruto of brutos) {
    const id = String(bruto.id)
    if (porId.has(id)) continue
    const produto = normalizar(bruto, marca.marca)
    if (produto) porId.set(id, produto)
  }
}

const products = [...porId.values()]
const contagem = new Map()
for (const product of products) {
  contagem.set(product.category, (contagem.get(product.category) || 0) + 1)
}
const ordem = [...contagem.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)
for (const product of products) {
  product.featured = ordem.slice(0, 6).includes(product.category) && product.brand === "Vizzano"
}
if (!products.some((product) => product.featured)) {
  products.slice(0, 6).forEach((product) => {
    product.featured = true
  })
}

const destino = join(process.cwd(), "src/data/aurora.json")
mkdirSync(dirname(destino), { recursive: true })
writeFileSync(destino, `${JSON.stringify(products)}\n`)
writeFileSync(
  join(process.cwd(), "src/data/aurora-sample.json"),
  `${JSON.stringify(amostras, null, 2)}\n`,
)

console.log(`Anúncios prontos: ${products.length}`)
console.log(
  "Categorias:",
  ordem.map((id) => `${id} (${contagem.get(id)})`).join(", "),
)
