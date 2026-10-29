# Semelle Calçados

Loja da [Semelle](https://www.instagram.com/usesemelle/) — calçados femininos em Brasília. A vitrine segue o Instagram **@usesemelle**: scarpin slingback, rasteira de strass, papetes Vizzano e Beira Rio, papete com ornamento e rasteira de flor.

O pedido é reservado no site. A confirmação de estoque e o PIX acontecem no Instagram. Nenhum cartão é cobrado aqui.

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## O que ajustar

Preços, estoque por número e textos das peças ficam em `src/data/catalog.ts`.

O Instagram da loja não publicou tabela de preços. Os valores de vitrine foram colocados perto do varejo atual das peças reconhecíveis (a rasteira Vizzano 6371.1105, por exemplo, aparece no mercado em torno de R$ 110 a R$ 140; na loja está R$ 139,90). Troque os números em centavos (`13990` = R$ 139,90) antes de divulgar.

Frete:

- Brasília (CEP 70000-000 a 73699-999), grátis acima de R$ 249; abaixo disso, R$ 14,90
- Restante do Brasil: R$ 27,90
- Retirada em Brasília: combinada pelo Instagram

As fotos estão em `public/products` e vieram das publicações públicas do perfil.

## Pedidos

A sacola e os pedidos ficam no navegador de quem compra (`localStorage`). Não há painel de admin nem gateway de pagamento. No fim do checkout, a cliente copia o resumo e envia no direct @usesemelle.
