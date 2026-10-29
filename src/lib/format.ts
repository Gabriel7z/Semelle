export function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

export function installmentLabel(cents: number, times = 3) {
  const each = Math.round(cents / times)
  return `ou ${times}x de ${formatBRL(each)} sem juros`
}

export function digits(value: string) {
  return value.replace(/\D/g, "")
}

export function maskCep(value: string) {
  const d = digits(value).slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

export function maskPhone(value: string) {
  const d = digits(value).slice(0, 11)
  if (d.length === 0) return ""
  if (d.length < 3) return `(${d}`
  if (d.length < 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso))
}
