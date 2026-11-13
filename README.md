# Use Semelle Calçados

Loja da [Use Semelle](https://www.instagram.com/usesemelle/) — calçados femininos em Brasília. A vitrine reúne papetes, rasteiras, saltos, tênis e botas de marcas selecionadas como Vizzano, Beira Rio, Modare e Moleca.

O pedido é reservado no site. A confirmação de estoque e o PIX acontecem no WhatsApp. Nenhum cartão é cobrado aqui.

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

A loja publicada fica em [https://usesemelleloja.com.br](https://usesemelleloja.com.br). Cada push na `main` gera o site estático e o GitHub Pages publica a pasta `out`.

## Fornecedor e margem

Os anúncios vêm do catálogo público da [Aurora Calçados](https://auroracalcados.com.br/), o atacado em Novo Gama. `node scripts/importar-aurora.mjs` grava `src/data/aurora.json`. O campo `cost` é o preço de custo, em centavos, e fica só nesse arquivo de trabalho. O site publicado não leva esse valor.

O GitHub Actions lê o catálogo a cada cerca de 30 minutos. O cron usa os minutos 7 e 37 para fugir do congestionamento de :00 e :30. Cada execução também dispara a próxima cerca de 30 minutos depois do início da leitura, porque o agendamento do GitHub sozinho deixa buracos de várias horas. Se preço ou estoque mudou, o fluxo publica o site e só então grava o arquivo no repositório. A visita da cliente não consulta a Aurora na hora: o GitHub Pages só consegue mostrar o último retrato publicado. Dá para forçar uma leitura em Actions, no fluxo "Importar catálogo Aurora".

A loja aplica a margem de `src/lib/margem.ts` (`MARGEM = 1.05`, ou seja, 105% em cima do custo) e arredonda o preço final para terminar em `,99`. Um par de R$ 89,90 no fornecedor aparece na vitrine por R$ 184,99. O build grava essa vitrine em `src/data/vitrine.json`, já com o preço de venda e sem o custo. Não existe mais JSON público em `/api/fornecedor`.

O número só entra na vitrine se a Aurora mandar a variação. `disponibilidade` diz se vende. Se `estoque` vier maior que zero, essa é a quantidade. Se o número está disponível e o estoque vem 0, a página oferece o número sem avisar "últimas unidades". Se a numeração não vier, o anúncio fica de fora.

Frete:

- Brasília (CEP 70000-000 a 73699-999), grátis acima de R$ 249; abaixo disso, R$ 14,90
- Restante do Brasil: R$ 27,90
- Retirada em Brasília: combinada pelo WhatsApp

Promoção:

- Primeira compra no site tem 20% de desconto no PIX, só nos pares fora da promoção. Itens em promoção não entram nesse desconto
- Pares com preço de vitrine a partir de R$ 300 aparecem com o valor cheio riscado e saem por R$ 249,99

As fotos dos anúncios são as do catálogo da Aurora.

## Pedidos

A sacola e os pedidos ficam no navegador de quem compra (`localStorage`). Não há painel de admin nem gateway de pagamento. No fim do checkout, o WhatsApp abre com o resumo do pedido preenchido para a Use Semelle.
