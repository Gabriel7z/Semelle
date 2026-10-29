import { catalogoFornecedor } from "@/lib/fornecedor"
import { NextResponse } from "next/server"

export function GET(request: Request) {
  const origin = new URL(request.url).origin
  return NextResponse.json(catalogoFornecedor(origin))
}
