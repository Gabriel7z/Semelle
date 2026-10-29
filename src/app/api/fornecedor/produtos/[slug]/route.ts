import { catalogoFornecedor } from "@/lib/fornecedor"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params
  const origin = new URL(request.url).origin
  const anuncio = catalogoFornecedor(origin).anuncios.find(
    (item) => item.slug === slug,
  )
  if (!anuncio) {
    return NextResponse.json({ erro: "Anúncio não encontrado." }, { status: 404 })
  }
  return NextResponse.json(anuncio)
}
