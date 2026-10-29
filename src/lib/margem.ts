/** Margem da loja sobre o preço do fornecedor. 0,5 = 50% mais caro. */
export const MARGEM = 0.5

export function precoVenda(custoCentavos: number) {
  return Math.round(custoCentavos * (1 + MARGEM))
}
