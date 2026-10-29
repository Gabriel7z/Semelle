import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { catalogoFornecedor } from "../src/lib/fornecedor"
import { pagesOrigin } from "../src/lib/site"

const catalogo = catalogoFornecedor(pagesOrigin)
const root = join(process.cwd(), "public", "api", "fornecedor")
const porAnuncio = join(root, "produtos")

mkdirSync(porAnuncio, { recursive: true })

writeFileSync(join(root, "produtos.json"), `${JSON.stringify(catalogo, null, 2)}\n`)

for (const anuncio of catalogo.anuncios) {
  writeFileSync(
    join(porAnuncio, `${anuncio.slug}.json`),
    `${JSON.stringify(anuncio, null, 2)}\n`,
  )
}
