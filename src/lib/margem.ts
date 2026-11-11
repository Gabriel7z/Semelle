/** Margem da loja sobre o preço do fornecedor. 0,55 = 55% mais caro. */
export const MARGEM = 0.55

export function precoVenda(custoCentavos: number) {
  const precoBase = Math.ceil(custoCentavos * (1 + MARGEM))
  return Math.floor(precoBase / 100) * 100 + 99
}
