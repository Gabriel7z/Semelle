/** Margem da loja sobre o preço do fornecedor. 1,05 = 105% mais caro. */
export const MARGEM = 1.05

export function precoVenda(custoCentavos: number) {
  const precoBase = Math.ceil(custoCentavos * (1 + MARGEM))
  return Math.floor(precoBase / 100) * 100 + 99
}
