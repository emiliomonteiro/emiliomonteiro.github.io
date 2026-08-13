# Calculadora de Compra / Purchase Decision Calculator

Ferramenta web para comparar rotas de compra de **Diamantes** e **KK** (Cash) em um jogo com duas moedas. Ajuda a decidir se vale mais a pena comprar pela loja oficial, por revendedores, ou usar o mercado dentro do jogo.

Web tool to compare purchase routes for Diamonds and KK (Cash) in a game with two currencies. Helps decide whether the official shop, resellers, or the in-game market offers better value.

## Arquivos / Files

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Página principal / Main page |
| `calculator.js` | Lógica de cálculo, validação e persistência |
| `i18n.js` | Traduções (PT-BR e EN) e conversão USD ↔ BRL |
| `styles.css` | Estilos visuais / Visual styles |
| `defaults.json` | Valores padrão editáveis / Editable default values |

## Como usar / How to use

1. Abra `index.html` no navegador, ou hospede em um servidor estático.  
   Open `index.html` in a browser, or host on a static server.

2. Informe o valor que pretende gastar (**R$** por padrão).  
   Enter the amount you plan to spend (**R$** by default).

3. Configure cupom, tiers da loja oficial, taxas de revendedores e, se quiser, opções do mercado do jogo (vender diamantes ou comprar com KK).

4. Clique em **Calcular** para ver a tabela comparativa.  
   Click **Calculate** to see the comparison table.

5. A linha **verde** indica o melhor valor por Diamante; a linha **contornada** indica o melhor valor por KK.

## Moedas / Currencies

| Unidade | Regra |
|---------|-------|
| **Diamantes** | Sempre números inteiros / Always whole numbers |
| **KK** | Unidade comprável inteira; **1 KK = 1.000.000 cash** no jogo |
| **Cash** | Moeda bruta do jogo (ex: 340.000 cash por diamante no mercado) |

- **Idioma padrão:** Português (Brasil) com valores em **R$**
- **Default language:** Portuguese (Brazil) with values in **BRL**
- Ao mudar para **English**, os valores monetários são convertidos para **USD** usando a taxa `usdToBrl` em `defaults.json`.

## Loja oficial — Tiers (breakpoints)

Os tiers funcionam por valor mínimo gasto:

- **R$0+** → 0% de bônus (exemplo padrão)
- **R$100+** → 10%
- **R$150+** → 15%
- etc.

O maior breakpoint atingido pelo valor gasto é aplicado, somado ao bônus do cupom.

```
diamantes = gasto × diamantesPorReal × (1 + (bônusTier + cupom) / 100)
```

## Revendedores / Resellers

Revendedores não dão bônus. Como diamantes e KK são inteiros, o gasto exibido na comparação é **ajustado automaticamente**:

**Exemplo:** R$100 com R$0,70/diamante

- 142 diamantes = R$99,40
- 143 diamantes = R$100,10

O cálculo escolhe a opção **mais próxima** do valor pretendido.

## Mercado do jogo / In-game market

Opcional:

- **Vender Diamantes por KK** → taxa de **1%** sobre a venda
- **Comprar Diamantes com KK** → sem taxa

Preço do mercado informado em **cash por diamante** (ex: `340000`).

## Configurar valores padrão — `defaults.json`

Edite `defaults.json` para alterar os placeholders iniciais:

```json
{
  "language": "pt-BR",
  "usdToBrl": 5.5,
  "spend": 100,
  "couponBonusPct": 10,
  "diamondsPerDollar": 1,
  "tiers": [
    { "minSpend": 0, "bonusPercent": 0 },
    { "minSpend": 100, "bonusPercent": 10 }
  ],
  "resellerUsdDiamond": 0.7,
  "resellerUsdKK": 2.4,
  "sellDiamonds": false,
  "buyDiamonds": false,
  "marketCashPerDiamond": 340000
}
```

| Campo | Descrição |
|-------|-----------|
| `language` | Idioma padrão (`pt-BR` ou `en`) |
| `usdToBrl` | Taxa USD → BRL para troca de idioma |
| `spend` | Valor a gastar |
| `couponBonusPct` | Bônus do cupom (%) |
| `diamondsPerDollar` | Diamantes base por R$1 (ou $1 em EN) |
| `tiers` | Breakpoints da loja oficial |
| `resellerUsdDiamond` | R$ por diamante (revendedor) |
| `resellerUsdKK` | R$ por KK (revendedor) |
| `sellDiamonds` | Mercado: vender diamantes |
| `buyDiamonds` | Mercado: comprar diamantes |
| `marketCashPerDiamond` | Preço do mercado em cash |

Após editar, clique em **Restaurar padrões** no site para recarregar.

> **Nota:** Valores salvos no navegador (`localStorage`) têm prioridade sobre `defaults.json` até você restaurar os padrões ou limpar dados do site.

## Salvamento no navegador / Browser storage

Os últimos valores informados são salvos automaticamente em `localStorage`.

- **Chave / Key:** `pka-calculator-inputs`

## Executar localmente / Run locally

**Opção 1 — Servidor Python:**

```bash
python -m http.server 8080
```

Acesse: http://localhost:8080

**Opção 2 — Abrir `index.html` diretamente (`file://`)**

Funciona, mas `defaults.json` pode não carregar; nesse caso usa-se o fallback embutido em `calculator.js`.

Recomendado usar servidor local ou GitHub Pages para carregar `defaults.json`.

## Publicar no GitHub Pages

Este projeto é estático (HTML + CSS + JS + JSON). Para publicar:

1. Envie todos os arquivos para um repositório GitHub.
2. Ative GitHub Pages (**Settings → Pages → branch `main`, pasta `/root`**).
3. Se o site ficar em uma subpasta (ex: `/pka/`), acesse:  
   `https://seuusuario.github.io/pka/`

**Arquivos necessários no deploy:**

- `index.html`
- `calculator.js`
- `i18n.js`
- `styles.css`
- `defaults.json`

## Requisitos / Requirements

- Navegador moderno com JavaScript habilitado
- Nenhum backend, banco de dados ou build necessário
- Modern browser with JavaScript enabled
- No backend, database, or build step required
