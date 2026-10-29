# Semelle Calçados

Loja da [Semelle](https://www.instagram.com/usesemelle/) — calçados femininos em Brasília. A vitrine segue o Instagram **@usesemelle**: scarpin slingback, rasteira de strass, papetes Vizzano e Beira Rio, papete com ornamento e rasteira de flor.

O pedido é reservado no site. A confirmação de estoque e o PIX acontecem no Instagram. Nenhum cartão é cobrado aqui.

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

A loja publicada fica em [https://gabriel7z.github.io/Semelle/](https://gabriel7z.github.io/Semelle/). Cada push na `main` gera o site estático e o GitHub Pages publica a pasta `out`.

## Fornecedor e margem

O arquivo `src/data/catalog.ts` é o catálogo do fornecedor. O campo `cost` é o preço de custo, em centavos (`13990` = R$ 139,90).

A loja lê esses anúncios e aplica a margem de `src/lib/margem.ts` (`MARGEM = 0.5`, ou seja, 50% em cima do custo). A rasteira de R$ 139,90 no fornecedor aparece na vitrine por R$ 209,85.

O mesmo catálogo sai como JSON. O build grava os arquivos em `public/api/fornecedor` (`npm run api`). No GitHub Pages:

```bash
curl https://gabriel7z.github.io/Semelle/api/fornecedor/produtos.json
curl https://gabriel7z.github.io/Semelle/api/fornecedor/produtos/rasteira-brilho-h.json
```

A resposta traz o custo do fornecedor, sem a margem. Quem consome a API aplica o próprio ganho. Esta loja faz isso em `src/lib/loja.ts`.

Frete:

- Brasília (CEP 70000-000 a 73699-999), grátis acima de R$ 249; abaixo disso, R$ 14,90
- Restante do Brasil: R$ 27,90
- Retirada em Brasília: combinada pelo Instagram

As fotos estão em `public/products` e vieram das publicações públicas do perfil.

## Pedidos

A sacola e os pedidos ficam no navegador de quem compra (`localStorage`). Não há painel de admin nem gateway de pagamento. No fim do checkout, a cliente copia o resumo e envia no direct @usesemelle.
