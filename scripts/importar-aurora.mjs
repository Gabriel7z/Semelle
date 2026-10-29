import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
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

const PULAR = /^(bolsas?|meias?)$/i

/** Subcategorias do catálogo público, no id que a Aurora manda em `categorias`. */
const SUB = {
  423192: "Aurora Glam",
  423258: "Flatforms",
  423259: "Papetes",
  423223: "Rasteiras",
  423261: "Saltos",
  423195: "Crocs",
  423197: "Meias",
  423199: "Slides",
  423198: "Tênis",
  423200: "Anabelas",
  423202: "Botas",
  423203: "Chinelos",
  423206: "Flatforms",
  423208: "Mules",
  423209: "Papetes",
  423205: "Rasteiras",
  423210: "Saltos",
  423212: "Tamancos",
  423213: "Tênis",
  428132: "Sapatilhas",
  423220: "Chinelos",
  424034: "Slides",
  423222: "Tênis",
  437495: "Papetes",
  423193: "Rasteiras",
  423194: "Saltos",
  423830: "Tamancos",
  423226: "Bolsas",
  423227: "Botas",
  423229: "Flatforms",
  423230: "Papetes",
  423228: "Rasteiras",
  423231: "Saltos",
  423232: "Sapatilhas",
  423233: "Tamancos",
  423234: "Tênis",
  423239: "Anabelas",
  423240: "Bolsas",
  423241: "Botas",
  423243: "Crocs",
  423245: "Flatforms",
  423246: "Meias",
  423249: "Papetes",
  423244: "Rasteiras",
  423250: "Saltos",
  423252: "Sapatilhas",
  423253: "Tamancos",
  423254: "Tênis",
  423293: "Anabelas",
  423295: "Botas",
  366540: "Flatforms",
  423297: "Papetes",
  423296: "Rasteiras",
  423298: "Saltos",
  425018: "Sapatilhas",
  423299: "Tamancos",
  423300: "Tênis",
}

const CDN = "https://arquivos.facilzap.app.br"

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

function absolutizar(caminho) {
  if (typeof caminho !== "string" || !caminho.trim()) return null
  if (caminho.startsWith("http://") || caminho.startsWith("https://")) return caminho
  return `${CDN}/${caminho.replace(/^\//, "")}`
}

function urlsDe(valor) {
  const achados = []
  const visitar = (item) => {
    if (!item) return
    if (typeof item === "string") {
      const url = absolutizar(item)
      if (url) achados.push(url)
      return
    }
    if (Array.isArray(item)) {
      item.forEach(visitar)
      return
    }
    if (typeof item === "object") {
      for (const chave of ["url", "src", "imagem", "caminho", "original", "large", "thumb"]) {
        const url = absolutizar(item[chave])
        if (url) achados.push(url)
      }
    }
  }
  visitar(valor)
  return [...new Set(achados)].slice(0, 6)
}

const TIPOS = [
  [/papete/i, "Papetes"],
  [/rasteir/i, "Rasteiras"],
  [/sapatilha/i, "Sapatilhas"],
  [/tamanco/i, "Tamancos"],
  [/anabela/i, "Anabelas"],
  [/\bmules?\b/i, "Mules"],
  [/chinelo/i, "Chinelos"],
  [/flatform|\bflat\b/i, "Flatforms"],
  [/slide|birken/i, "Slides"],
  [/croc/i, "Crocs"],
  [/bota/i, "Botas"],
  [/t[eê]nis/i, "Tênis"],
  [/scarpin|\bsalto\b/i, "Saltos"],
]

function tipoPeloNome(nome) {
  const texto = textoLimpo(nome)
  for (const [regra, tipo] of TIPOS) {
    if (regra.test(texto)) return tipo
  }
  return ""
}

function linhaDo(produto, marcaId, marca) {
  const grupos = produto.categorias?.[marcaId]
  const subId = Array.isArray(grupos) ? grupos[0] : null
  let nome = (subId && SUB[subId]) || ""
  if (!nome) {
    nome = tipoPeloNome(produto.nome || produto.titulo) || textoLimpo(produto.categoria_nome) || "Calçados"
  }
  if (nome === marca || /^filtro$/i.test(nome)) {
    nome = tipoPeloNome(produto.nome || produto.titulo) || nome
  }
  return { id: slugify(nome) || "calcados", name: nome }
}

function quantidade(produto, variacao) {
  const id = String(variacao.id)
  const estoque = parseInt(produto.estoque?.[id], 10)
  const disponivel = String(produto.disponibilidade?.[id] || "") === "1"
  if (Number.isFinite(estoque) && estoque > 0) return estoque
  if (disponivel) return 3
  return 0
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

function corPeloNome(nome, marca) {
  const base = String(nome || "")
    .replace(new RegExp(`\\s*-\\s*${marca}\\s*$`, "i"), "")
    .toLowerCase()
  const cores = [
    "off white",
    "branco off",
    "verde",
    "lilás",
    "lilas",
    "vermelha",
    "vermelho",
    "preta",
    "preto",
    "branca",
    "branco",
    "nude",
    "bege",
    "caramelo",
    "marrom",
    "dourada",
    "dourado",
    "prata",
    "rosa",
    "azul",
    "laranja",
    "café",
    "cafe",
    "camel",
    "chocolate",
    "ostra",
  ]
  for (const cor of cores) {
    if (base.includes(cor)) {
      return cor.replace(/(^|\s)\p{L}/gu, (letra) => letra.toUpperCase())
    }
  }
  return "Única"
}

const ENTIDADES = {
  ccedil: "ç",
  Ccedil: "Ç",
  atilde: "ã",
  Atilde: "Ã",
  otilde: "õ",
  Otilde: "Õ",
  aacute: "á",
  Aacute: "Á",
  eacute: "é",
  Eacute: "É",
  iacute: "í",
  Iacute: "Í",
  oacute: "ó",
  Oacute: "Ó",
  uacute: "ú",
  Uacute: "Ú",
  agrave: "à",
  Agrave: "À",
  egrave: "è",
  Egrave: "È",
  acirc: "â",
  Acirc: "Â",
  ecirc: "ê",
  Ecirc: "Ê",
  ocirc: "ô",
  Ocirc: "Ô",
  amp: "&",
  quot: '"',
  apos: "'",
  nbsp: " ",
  bull: "•",
  lt: "<",
  gt: ">",
}

function decodificar(texto) {
  return texto
    .replace(/&#(\d+);/g, (_, codigo) => String.fromCodePoint(Number(codigo)))
    .replace(/&#x([0-9a-f]+);/gi, (_, codigo) => String.fromCodePoint(parseInt(codigo, 16)))
    .replace(/&([a-z]+);/gi, (tudo, nome) => ENTIDADES[nome] ?? tudo)
}

function descricaoPublica(produto, reserva) {
  return semPrecoDeAtacado(textoLimpo(produto.descricao || produto.descricao_curta)) || reserva
}

function semPrecoDeAtacado(texto) {
  return texto
    .replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g, "")
    .replace(/(?:r\$\s*)?\d{1,3}(?:\.\d{3})*,\d{2}\s*(?:[-–—]\s*)*(?:atacado|varejo)(?:\s+\w+)?/gi, " ")
    .replace(/(?:atacado|varejo)(?:\s+(?:c?variado))?\s*(?:r\$\s*)?\d{1,3}(?:\.\d{3})*,\d{2}/gi, " ")
    .replace(/atacado|varejo|cvariado|\bvariado\b:?/gi, " ")
    .replace(/(?:r\$\s*)?\d{1,3}(?:\.\d{3})*,\d{2}/g, " ")
    .replace(/\d{1,3},\d\s+\d{1,2}\b/g, " ")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, "")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/(?:\s*[-–—]\s*){2,}/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s\-–—.,]+|[\s\-–—.,]+$/g, "")
}

function textoLimpo(valor) {
  return decodificar(String(valor || ""))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizar(produto, marca, marcaId) {
  const nome = semPrecoDeAtacado(textoLimpo(produto.nome || produto.titulo))
  const custo = precoCusto(produto)
  const imagensProduto = urlsDe(produto.imagens)
  if (!nome || !custo || imagensProduto.length === 0) return null
  if (/^\s*(bolsa|carteira|mochila|necessaire|meia|caixa)\b/i.test(nome)) return null

  const linha = linhaDo(produto, marcaId, marca)
  if (PULAR.test(linha.name)) return null
  if (linha.name === marca || /^(filtro|calçados|calcados)$/i.test(linha.name)) return null

  const categoria = linha.id
  const categoriaNome = linha.name
  const variacoes = listaVariacoes(produto)
  const grupos = new Map()

  for (const variacao of variacoes) {
    const cor = corDe(variacao) || corPeloNome(nome, marca)
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
    if (tamanho) grupos.get(id).sizes.set(tamanho, quantidade(produto, variacao))
  }

  let colors = [...grupos.values()]
  if (colors.length === 0) {
    colors = [
      {
        id: slugify(corPeloNome(nome, marca)) || "unica",
        name: corPeloNome(nome, marca),
        swatch: amostra(corPeloNome(nome, marca)),
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
  const descricao = descricaoPublica(
    produto,
    `${nome}. ${marca}, numeração ${tamanhos[0]} ao ${tamanhos[tamanhos.length - 1]}.`,
  )

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
    colors: colors
      .map(({ sizes: _sizes, ...color }) => color)
      .sort((a, b) => a.id.localeCompare(b.id, "pt")),
    sizes: tamanhos,
    stock: Object.fromEntries(Object.entries(stock).sort(([a], [b]) => a.localeCompare(b, "en"))),
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

if (process.env.AURORA_SAMPLE) {
  const { readFileSync } = await import("node:fs")
  const amostra = JSON.parse(readFileSync(process.env.AURORA_SAMPLE, "utf8"))
  for (const item of amostra) {
    const marca = MARCAS.find((entry) => entry.marca === item.marca) || MARCAS[0]
    console.log(JSON.stringify(normalizar(item.produto, marca.marca, marca.id), null, 2))
  }
  process.exit(0)
}

const porId = new Map()

for (const marca of MARCAS) {
  const brutos = await marcaCompleta(marca)
  for (const bruto of brutos) {
    const id = String(bruto.id)
    if (porId.has(id)) continue
    const produto = normalizar(bruto, marca.marca, marca.id)
    if (produto) porId.set(id, produto)
  }
}

const products = [...porId.values()].sort((a, b) =>
  a.supplierId.localeCompare(b.supplierId, "en", { numeric: true }),
)
const contagem = new Map()
for (const product of products) {
  contagem.set(product.category, (contagem.get(product.category) || 0) + 1)
}
const ordem = [...contagem.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)
const destaques = ["rasteiras", "papetes", "saltos", "tenis", "sapatilhas", "botas", "flatforms"]
let marcados = 0
for (const categoria of destaques) {
  const produto = products.find((item) => item.category === categoria)
  if (!produto) continue
  produto.featured = true
  marcados += 1
}
for (const product of products) {
  if (marcados >= 6) break
  if (product.featured) continue
  product.featured = true
  marcados += 1
}

const categories = ordem.map((id) => {
  const exemplo = products.find((product) => product.category === id)
  return {
    id,
    name: exemplo.categoryName,
    blurb: `${contagem.get(id)} pares de ${exemplo.categoryName.toLowerCase()} na coleção.`,
    image: exemplo.colors[0].images[0],
  }
})

if (products.length < 400) {
  console.error(`Catálogo curto demais (${products.length}). A vitrine atual foi mantida.`)
  process.exit(1)
}

const destino = join(process.cwd(), "src/data/aurora.json")
let anterior = 0
try {
  anterior = JSON.parse(readFileSync(destino, "utf8")).products.length
} catch {
  anterior = 0
}
if (anterior && products.length < anterior * 0.7) {
  console.error(
    `A Aurora devolveu ${products.length} anúncios e a vitrine tem ${anterior}. A vitrine atual foi mantida.`,
  )
  process.exit(1)
}

mkdirSync(dirname(destino), { recursive: true })
writeFileSync(destino, `${JSON.stringify({ products, categories })}\n`)

console.log(`Anúncios prontos: ${products.length}`)
console.log(
  "Categorias:",
  ordem.map((id) => `${id} (${contagem.get(id)})`).join(", "),
)
