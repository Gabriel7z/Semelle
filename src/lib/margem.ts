/** Margem da loja sobre o preço do fornecedor. 1,05 = 105% mais caro. */
export const MARGEM = 1.05

/** A partir deste preço de vitrine, o par entra na promoção fixa. */
export const PROMOCAO_A_PARTIR = 30000

/** Preço promocional para pares de R$ 300 ou mais. */
export const PROMOCAO_PRECO = 24999

export function precoVenda(custoCentavos: number) {
  const precoBase = Math.ceil(custoCentavos * (1 + MARGEM))
  return Math.floor(precoBase / 100) * 100 + 99
}

export function precoVitrine(custoCentavos: number) {
  const cheio = precoVenda(custoCentavos)
  if (cheio < PROMOCAO_A_PARTIR) return { price: cheio }
  return { price: PROMOCAO_PRECO, compareAt: cheio }
}
