let currentLang = "pt-BR";

const I18N = {
  en: {
    pageTitle: "Purchase Decision Calculator",
    language: "Language",
    title: "Purchase Decision Calculator",
    subtitle: "Compare official shop vs reseller routes for Diamonds and KK",
    quickCompare: "Quick Compare",
    spendLabel: "Amount to spend ($)",
    spendHint: "Used for all route comparisons, including official shop tier lookup.",
    couponLabel: "Coupon bonus (%)",
    couponHint: "Added on top of the matching spend tier bonus.",
    diamondsPerUnitLabel: "Base diamonds per $1",
    diamondsPerUnitHint: "Official shop base rate before tier and coupon bonuses.",
    officialShop: "Official Shop Packages",
    tiersHint:
      "Spend breakpoints: bonus applies when amount spent reaches the threshold (e.g. $100 → 10%). 1 KK = 1,000,000 cash.",
    tierMinSpend: "Min spend ($)",
    tierBonus: "Bonus (%)",
    addTier: "+ Add tier",
    removeTier: "Remove tier",
    resellerRates: "Reseller Rates",
    resellerHint: "Resellers do not offer bonuses. Enter current fluctuating rates.",
    resellerPerDiamond: "$ per Diamond",
    resellerPerKK: "$ per KK",
    inGameMarket: "In-Game Market",
    sellDiamonds: "Sell Diamonds for KK (1% tax)",
    buyDiamonds: "Buy Diamonds with KK (no tax)",
    marketCashLabel: "Cash per Diamond",
    marketCashHint: "Example: 340,000 cash = 0.34 KK per diamond",
    calculate: "Calculate",
    resetDefaults: "Reset to defaults",
    actionsHint:
      'Defaults are loaded from <code>defaults.json</code>. Your last inputs are saved in this browser.',
    resultsTitle: "Results — Comparison",
    colRoute: "Route",
    colSpend: "Spend",
    colDiamonds: "Diamonds",
    colKKCash: "KK / Cash",
    colPerDiamond: "$/Diamond",
    colPerKK: "$/KK",
    resultsFootnote:
      "Diamonds and KK are whole numbers (1 KK = 1,000,000 cash). Lower $/Diamond or $/KK means better value.",
    noResults: "No results to display.",
    bestDiamond: "Best ◆",
    bestKK: "Best KK",
    tierBase: "base",
    routeOfficial: "Official shop → Diamonds ({tier}: {tierBonus}% + {coupon}% coupon)",
    routeResellerDiamonds: "Reseller → Diamonds",
    routeResellerKK: "Reseller → KK",
    routeSellMarket: "{source} → sell on market → net KK (1% tax)",
    routeBuyMarket: "Reseller KK → buy on market → Diamonds",
    sourceOfficial: "Official shop",
    sourceReseller: "Reseller",
    cashSuffix: "cash",
    errSpend: "Enter a valid spend amount greater than {currency}0.",
    errDiamondsPerUnit: "Enter a valid base diamonds per {currency}1 value.",
    errCoupon: "Enter a valid coupon bonus percentage.",
    errResellerDiamond: "Enter a valid reseller {currency} per Diamond rate.",
    errResellerKK: "Enter a valid reseller {currency} per KK rate.",
    errTiers: "Add at least one official shop spend breakpoint.",
    errMarket: "Enter a valid market cash per Diamond price when market options are enabled.",
    spendAdjustedFrom: "from {amount} intended",
  },
  "pt-BR": {
    pageTitle: "Calculadora de Compra",
    language: "Idioma",
    title: "Calculadora de Compra",
    subtitle: "Compare loja oficial vs revendedores para Diamantes e KK",
    quickCompare: "Comparação Rápida",
    spendLabel: "Valor a gastar (R$)",
    spendHint: "Usado em todas as rotas, incluindo o tier da loja oficial.",
    couponLabel: "Bônus do cupom (%)",
    couponHint: "Somado ao bônus do tier correspondente.",
    diamondsPerUnitLabel: "Diamantes base por R$1",
    diamondsPerUnitHint: "Taxa base da loja oficial antes dos bônus de tier e cupom.",
    officialShop: "Pacotes da Loja Oficial",
    tiersHint:
      "Breakpoints de gasto: o bônus aplica ao atingir o valor (ex: R$100 → 10%). 1 KK = 1.000.000 cash.",
    tierMinSpend: "Gasto mín. (R$)",
    tierBonus: "Bônus (%)",
    addTier: "+ Adicionar tier",
    removeTier: "Remover tier",
    resellerRates: "Taxas de Revendedores",
    resellerHint: "Revendedores não oferecem bônus. Informe as taxas atuais.",
    resellerPerDiamond: "R$ por Diamante",
    resellerPerKK: "R$ por KK",
    inGameMarket: "Mercado do Jogo",
    sellDiamonds: "Vender Diamantes por KK (taxa de 1%)",
    buyDiamonds: "Comprar Diamantes com KK (sem taxa)",
    marketCashLabel: "Cash por Diamante",
    marketCashHint: "Exemplo: 340.000 cash = 0,34 KK por diamante",
    calculate: "Calcular",
    resetDefaults: "Restaurar padrões",
    actionsHint:
      'Padrões são atualizados diariamente com os valores médios do mercado. Seus últimos valores são salvos neste navegador.',
    resultsTitle: "Resultados — Comparação",
    colRoute: "Rota",
    colSpend: "Gasto",
    colDiamonds: "Diamantes",
    colKKCash: "KK / Cash",
    colPerDiamond: "R$/Diamante",
    colPerKK: "R$/KK",
    resultsFootnote:
      "Diamantes e KK são números inteiros (1 KK = 1.000.000 cash). Menor R$/Diamante ou R$/KK = melhor valor.",
    noResults: "Nenhum resultado para exibir.",
    bestDiamond: "Melhor ◆",
    bestKK: "Melhor KK",
    tierBase: "base",
    routeOfficial: "Loja oficial → Diamantes ({tier}: {tierBonus}% + {coupon}% cupom)",
    routeResellerDiamonds: "Revendedor → Diamantes",
    routeResellerKK: "Revendedor → KK",
    routeSellMarket: "{source} → vender no mercado → KK líq. (taxa 1%)",
    routeBuyMarket: "KK revendedor → comprar no mercado → Diamantes",
    sourceOfficial: "Loja oficial",
    sourceReseller: "Revendedor",
    cashSuffix: "cash",
    errSpend: "Informe um valor válido maior que {currency}0.",
    errDiamondsPerUnit: "Informe diamantes base válidos por {currency}1.",
    errCoupon: "Informe um bônus de cupom válido.",
    errResellerDiamond: "Informe uma taxa válida de {currency} por Diamante.",
    errResellerKK: "Informe uma taxa válida de {currency} por KK.",
    errTiers: "Adicione ao menos um breakpoint de gasto.",
    errMarket: "Informe o preço de cash por Diamante quando o mercado estiver ativo.",
    spendAdjustedFrom: "de {amount} pretendido",
  },
};

function t(key, vars = {}) {
  const template = I18N[currentLang]?.[key] ?? I18N.en[key] ?? key;
  const currency = currentLang === "pt-BR" ? "R$" : "$";
  return template.replace(/\{(\w+)\}/g, (_, name) => {
    if (name === "currency") return currency;
    return vars[name] ?? `{${name}}`;
  });
}

function getCurrentLang() {
  return currentLang;
}

function setCurrentLang(lang) {
  currentLang = lang === "pt-BR" ? "pt-BR" : "en";
  document.documentElement.lang = currentLang === "pt-BR" ? "pt-BR" : "en";
}

function getLocale() {
  return currentLang === "pt-BR" ? "pt-BR" : "en-US";
}

function getCurrencySymbol() {
  return currentLang === "pt-BR" ? "R$" : "$";
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return "—";
  const symbol = getCurrencySymbol();
  const formatted = value.toLocaleString(getLocale(), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
  return currentLang === "pt-BR" ? `R$ ${formatted}` : `$${formatted}`;
}

function formatTierBreakpoint(tier) {
  if (tier.minSpend <= 0) {
    return t("tierBase");
  }
  const symbol = getCurrencySymbol();
  const amount = tier.minSpend.toLocaleString(getLocale(), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return currentLang === "pt-BR" ? `${symbol} ${amount}+` : `${symbol}${amount}+`;
}

function getExchangeRate() {
  return typeof appDefaults !== "undefined" && appDefaults.usdToBrl
    ? appDefaults.usdToBrl
    : 5.5;
}

function convertFormStateForLanguage(state, fromLang, toLang) {
  if (fromLang === toLang) return { ...state, tiers: state.tiers?.map((t) => ({ ...t })) };

  const rate = getExchangeRate();
  const toBRL = fromLang === "en" && toLang === "pt-BR";
  const toUSD = fromLang === "pt-BR" && toLang === "en";
  const mul = (v) => {
    if (!Number.isFinite(v)) return v;
    const converted = toBRL ? v * rate : toUSD ? v / rate : v;
    return Math.round(converted * 100) / 100;
  };
  const mulRate = (v) => {
    if (!Number.isFinite(v)) return v;
    const converted = toBRL ? v * rate : toUSD ? v / rate : v;
    return Math.round(converted * 10000) / 10000;
  };
  const mulDiamondsPerUnit = (v) => {
    if (!Number.isFinite(v)) return v;
    const converted = toBRL ? v / rate : toUSD ? v * rate : v;
    return Math.round(converted * 10000) / 10000;
  };

  return {
    ...state,
    language: toLang,
    spend: mul(state.spend),
    diamondsPerDollar: mulDiamondsPerUnit(state.diamondsPerDollar),
    resellerUsdDiamond: mulRate(state.resellerUsdDiamond),
    resellerUsdKK: mulRate(state.resellerUsdKK),
    tiers: (state.tiers || []).map((tier) => ({
      ...tier,
      minSpend: mul(tier.minSpend),
    })),
  };
}

function applyTranslations() {
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    el.innerHTML = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });
}

function getDefaultsForCurrentLanguage(baseDefaults) {
  const canonical = {
    ...baseDefaults,
    language: "pt-BR",
    tiers: baseDefaults.tiers.map((tier) => ({ ...tier })),
  };

  if (currentLang === "en") {
    return convertFormStateForLanguage(canonical, "pt-BR", "en");
  }

  return canonical;
}
