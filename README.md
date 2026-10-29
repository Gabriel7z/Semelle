# Semelle Calçados

Loja da [Semelle](https://www.instagram.com/usesemelle/) — calçados femininos em Brasília. A vitrine reúne papetes, rasteiras, saltos, tênis e botas das linhas Vizzano, Beira Rio, Modare, Moleca, Activitta e Aurora.

O pedido é reservado no site. A confirmação de estoque e o PIX acontecem no Instagram. Nenhum cartão é cobrado aqui.

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

A loja publicada fica em [https://gabriel7z.github.io/Semelle/](https://gabriel7z.github.io/Semelle/). Cada push na `main` gera o site estático e o GitHub Pages publica a pasta `out`.

## Fornecedor e margem

Os anúncios vêm do catálogo público da [Aurora Calçados](https://auroracalcados.com.br/), o atacado em Novo Gama. `node scripts/importar-aurora.mjs` grava `src/data/aurora.json`. O campo `cost` é o preço de custo, em centavos.

O GitHub Actions lê esse catálogo a cada 30 minutos. Se preço ou estoque mudou, grava o arquivo novo e publica o site de novo. A visita da cliente não consulta a Aurora na hora: o GitHub Pages só consegue mostrar o último retrato publicado. Dá para forçar uma leitura em Actions, no fluxo "Importar catálogo Aurora".

A loja aplica a margem de `src/lib/margem.ts` (`MARGEM = 0.5`, ou seja, 50% em cima do custo). Um par de R$ 89,90 no fornecedor aparece na vitrine por R$ 134,85. O build grava essa vitrine em `src/data/vitrine.json`, já com o preço de venda e sem o custo.

O mesmo catálogo sai como JSON, com o custo, sem a margem. O build grava os arquivos em `public/api/fornecedor` (`npm run api`). No GitHub Pages:

```bash
curl https://gabriel7z.github.io/Semelle/api/fornecedor/produtos.json
curl https://gabriel7z.github.io/Semelle/api/fornecedor/produtos/flat-bloom-nude-aurora-3483111.json
```

A resposta traz o custo do fornecedor, sem a margem.

Frete:

- Brasília (CEP 70000-000 a 73699-999), grátis acima de R$ 249; abaixo disso, R$ 14,90
- Restante do Brasil: R$ 27,90
- Retirada em Brasília: combinada pelo Instagram

As fotos dos anúncios são as do catálogo da Aurora.

## Pedidos

A sacola e os pedidos ficam no navegador de quem compra (`localStorage`). Não há painel de admin nem gateway de pagamento. No fim do checkout, a cliente copia o resumo e envia no direct @usesemelle.
