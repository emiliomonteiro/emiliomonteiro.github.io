const CASH_PER_KK = 1_000_000;
const MARKET_SELL_TAX = 0.01;
const STORAGE_KEY = "pka-calculator-inputs";

const FALLBACK_DEFAULTS = {
  language: "pt-BR",
  usdToBrl: 5.5,
  spend: 100,
  couponBonusPct: 10,
  diamondsPerDollar: 1,
  tiers: [
    { minSpend: 0, bonusPercent: 0 },
    { minSpend: 100, bonusPercent: 10 },
    { minSpend: 150, bonusPercent: 15 },
    { minSpend: 200, bonusPercent: 20 },
    { minSpend: 400, bonusPercent: 30 },
  ],
  resellerUsdDiamond: 0.7,
  resellerUsdKK: 2.4,
  sellDiamonds: false,
  buyDiamonds: false,
  marketCashPerDiamond: 340000,
};

let appDefaults = { ...FALLBACK_DEFAULTS, tiers: [...FALLBACK_DEFAULTS.tiers] };
let saveTimeout = null;
const toKK = (cash) => cash / CASH_PER_KK;
const toCash = (kk) => kk * CASH_PER_KK;
const floorDiamonds = (value) => Math.floor(value + 1e-9);
const floorKK = (value) => Math.floor(value + 1e-9);

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

/** Pick floor or ceil integer units so actual spend is closest to target (e.g. 142◆@99.40 vs 143◆@100.10). */
function adjustIntegerPurchase(targetSpend, pricePerUnit, floorUnitsFn) {
  if (!Number.isFinite(targetSpend) || !Number.isFinite(pricePerUnit) || pricePerUnit <= 0) {
    return { units: NaN, spend: NaN, targetSpend };
  }

  const exactUnits = targetSpend / pricePerUnit;
  const floorUnits = floorUnitsFn(exactUnits);

  if (Math.abs(exactUnits - floorUnits) < 1e-9) {
    return {
      units: floorUnits,
      spend: roundMoney(floorUnits * pricePerUnit),
      targetSpend,
    };
  }

  const ceilUnits = floorUnits + 1;
  const spendFloor = roundMoney(floorUnits * pricePerUnit);
  const spendCeil = roundMoney(ceilUnits * pricePerUnit);

  const diffFloor = Math.abs(targetSpend - spendFloor);
  const diffCeil = Math.abs(targetSpend - spendCeil);

  if (diffCeil < diffFloor) {
    return { units: ceilUnits, spend: spendCeil, targetSpend };
  }

  return { units: floorUnits, spend: spendFloor, targetSpend };
}

function parseNumber(value) {
  if (value === "" || value === null || value === undefined) return NaN;
  const n = parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

function formatDiamonds(value) {
  if (!Number.isFinite(value)) return "—";
  return Math.floor(value).toLocaleString(getLocale());
}

function formatKK(value) {
  if (!Number.isFinite(value)) return "—";
  return `${Math.floor(value).toLocaleString(getLocale())} KK`;
}

function formatCash(value) {
  if (!Number.isFinite(value)) return "—";
  return `${Math.floor(value).toLocaleString(getLocale())} ${t("cashSuffix")}`;
}
function getApplicableTier(spend, tiers) {
  const sorted = [...tiers]
    .filter((t) => Number.isFinite(t.minSpend) && Number.isFinite(t.bonusPercent))
    .sort((a, b) => a.minSpend - b.minSpend);

  let applicable = { minSpend: 0, bonusPercent: 0 };
  for (const tier of sorted) {
    if (spend >= tier.minSpend) {
      applicable = tier;
    }
  }
  return applicable;
}

function calcOfficialDiamonds(spend, diamondsPerDollar, tierBonusPct, couponBonusPct) {
  const baseDiamonds = spend * diamondsPerDollar;
  const totalBonusPct = tierBonusPct + couponBonusPct;
  return floorDiamonds(baseDiamonds * (1 + totalBonusPct / 100));
}

function calcResellerDiamonds(spend, usdPerDiamond) {
  return adjustIntegerPurchase(spend, usdPerDiamond, floorDiamonds);
}

function calcResellerKK(spend, usdPerKK) {
  return adjustIntegerPurchase(spend, usdPerKK, floorKK);
}

function calcSellDiamondsForKK(diamonds, marketCashPerDiamond) {
  const intDiamonds = floorDiamonds(diamonds);
  const grossCash = intDiamonds * marketCashPerDiamond;
  const netCash = grossCash * (1 - MARKET_SELL_TAX);
  const netKK = floorKK(toKK(netCash));
  return { grossCash, netCash: toCash(netKK), netKK };
}

function calcBuyDiamondsWithKK(kk, marketCashPerDiamond) {
  if (marketCashPerDiamond <= 0) return NaN;
  const intKK = floorKK(kk);
  return floorDiamonds(toCash(intKK) / marketCashPerDiamond);
}

function makeRow(name, spend, diamonds, kk, cash, targetSpend = null) {
  const row = {
    name,
    spend,
    targetSpend: targetSpend ?? spend,
    spendAdjusted:
      targetSpend !== null && Number.isFinite(spend) && Math.abs(spend - targetSpend) > 0.009,
    diamonds: Number.isFinite(diamonds) ? floorDiamonds(diamonds) : null,
    kk: Number.isFinite(kk) ? floorKK(kk) : null,
    cash: null,
    usdPerDiamond: null,
    usdPerKK: null,
    bestDiamond: false,
    bestKK: false,
  };

  if (row.kk !== null) {
    row.cash = toCash(row.kk);
  } else if (Number.isFinite(cash)) {
    row.cash = Math.floor(cash);
  }

  if (row.diamonds !== null && row.diamonds > 0) {
    row.usdPerDiamond = spend / row.diamonds;
  }
  if (row.kk !== null && row.kk > 0) {
    row.usdPerKK = spend / row.kk;
  }

  return row;
}

function buildComparisonRows(inputs) {
  const rows = [];
  const {
    spend,
    couponBonusPct,
    diamondsPerDollar,
    tiers,
    resellerUsdDiamond,
    resellerUsdKK,
    sellDiamonds,
    buyDiamonds,
    marketCashPerDiamond,
  } = inputs;

  const tier = getApplicableTier(spend, tiers);
  const officialDiamonds = calcOfficialDiamonds(
    spend,
    diamondsPerDollar,
    tier.bonusPercent,
    couponBonusPct
  );

  rows.push(
    makeRow(
      t("routeOfficial", {
        tier: formatTierBreakpoint(tier),
        tierBonus: tier.bonusPercent,
        coupon: couponBonusPct,
      }),
      spend,
      officialDiamonds,
      null,
      null
    )
  );

  const resellerDiamondPurchase = calcResellerDiamonds(spend, resellerUsdDiamond);
  rows.push(
    makeRow(
      t("routeResellerDiamonds"),
      resellerDiamondPurchase.spend,
      resellerDiamondPurchase.units,
      null,
      null,
      spend
    )
  );

  const resellerKKPurchase = calcResellerKK(spend, resellerUsdKK);
  rows.push(
    makeRow(
      t("routeResellerKK"),
      resellerKKPurchase.spend,
      null,
      resellerKKPurchase.units,
      toCash(resellerKKPurchase.units),
      spend
    )
  );

  if (sellDiamonds && Number.isFinite(marketCashPerDiamond) && marketCashPerDiamond > 0) {
    const diamondSources = [
      { label: t("sourceOfficial"), diamonds: officialDiamonds, spend },
      {
        label: t("sourceReseller"),
        diamonds: resellerDiamondPurchase.units,
        spend: resellerDiamondPurchase.spend,
      },
    ];

    for (const source of diamondSources) {
      if (!Number.isFinite(source.diamonds) || source.diamonds <= 0) continue;
      const { netCash, netKK } = calcSellDiamondsForKK(source.diamonds, marketCashPerDiamond);
      rows.push(
        makeRow(
          t("routeSellMarket", { source: source.label }),
          source.spend,
          null,
          netKK,
          netCash
        )
      );
    }
  }

  if (buyDiamonds && Number.isFinite(marketCashPerDiamond) && marketCashPerDiamond > 0) {
    const marketDiamondsFromKK = calcBuyDiamondsWithKK(
      resellerKKPurchase.units,
      marketCashPerDiamond
    );
    rows.push(
      makeRow(
        t("routeBuyMarket"),
        resellerKKPurchase.spend,
        marketDiamondsFromKK,
        null,
        null,
        spend
      )
    );
  }

  markBestValues(rows);
  return rows;
}

function markBestValues(rows) {
  const diamondRows = rows.filter((r) => r.usdPerDiamond !== null);
  const kkRows = rows.filter((r) => r.usdPerKK !== null);

  if (diamondRows.length > 0) {
    const best = diamondRows.reduce((a, b) => (a.usdPerDiamond < b.usdPerDiamond ? a : b));
    best.bestDiamond = true;
  }

  if (kkRows.length > 0) {
    const best = kkRows.reduce((a, b) => (a.usdPerKK < b.usdPerKK ? a : b));
    best.bestKK = true;
  }
}

function renderResults(rows) {
  if (rows.length === 0) {
    return `<p>${t("noResults")}</p>`;
  }

  let html = `
    <div class="results-table-wrapper">
      <table class="results-table">
        <thead>
          <tr>
            <th>${t("colRoute")}</th>
            <th>${t("colSpend")}</th>
            <th>${t("colDiamonds")}</th>
            <th>${t("colKKCash")}</th>
            <th>${t("colPerDiamond")}</th>
            <th>${t("colPerKK")}</th>
          </tr>
        </thead>
        <tbody>
  `;

  for (const row of rows) {
    const rowClass = [
      row.bestDiamond ? "best-diamond" : "",
      row.bestKK ? "best-kk" : "",
    ]
      .filter(Boolean)
      .join(" ");

    let kkCashCell = '<span class="no-value">—</span>';
    if (row.kk !== null) {
      kkCashCell = `${formatKK(row.kk)}<br><span class="cell-muted">${formatCash(row.cash)}</span>`;
    }

    const diamondCell =
      row.diamonds !== null
        ? formatDiamonds(row.diamonds) +
          (row.bestDiamond ? `<span class="badge">${t("bestDiamond")}</span>` : "")
        : '<span class="no-value">—</span>';

    const perDiamondCell =
      row.usdPerDiamond !== null ? formatMoney(row.usdPerDiamond) : '<span class="no-value">—</span>';

    const perKKCell =
      row.usdPerKK !== null
        ? formatMoney(row.usdPerKK) + (row.bestKK ? `<span class="badge badge-kk">${t("bestKK")}</span>` : "")
        : '<span class="no-value">—</span>';

    let spendCell = formatMoney(row.spend);
    if (row.spendAdjusted) {
      spendCell += `<br><span class="cell-muted">${t("spendAdjustedFrom", { amount: formatMoney(row.targetSpend) })}</span>`;
    }

    html += `
      <tr class="${rowClass}">
        <td>${row.name}</td>
        <td>${spendCell}</td>
        <td>${diamondCell}</td>
        <td>${kkCashCell}</td>
        <td>${perDiamondCell}</td>
        <td>${perKKCell}</td>
      </tr>
    `;
  }

  html += "</tbody></table></div>";
  html += `<p class="hint" style="margin-top: 1rem;">${t("resultsFootnote")}</p>`;

  return html;
}

function readTiers() {
  const tierRows = document.querySelectorAll("#tier-rows .tier-row");
  const tiers = [];

  tierRows.forEach((row) => {
    const minSpend = parseNumber(row.querySelector(".tier-min").value);
    const bonusPercent = parseNumber(row.querySelector(".tier-bonus").value);

    if (!Number.isFinite(minSpend)) return;

    tiers.push({
      minSpend,
      bonusPercent: Number.isFinite(bonusPercent) ? bonusPercent : 0,
    });
  });

  return tiers.sort((a, b) => a.minSpend - b.minSpend);
}

function validateInputs(inputs) {
  const errors = [];

  if (!Number.isFinite(inputs.spend) || inputs.spend <= 0) {
    errors.push(t("errSpend"));
  }

  if (!Number.isFinite(inputs.diamondsPerDollar) || inputs.diamondsPerDollar < 0) {
    errors.push(t("errDiamondsPerUnit"));
  }

  if (!Number.isFinite(inputs.couponBonusPct) || inputs.couponBonusPct < 0) {
    errors.push(t("errCoupon"));
  }

  if (!Number.isFinite(inputs.resellerUsdDiamond) || inputs.resellerUsdDiamond <= 0) {
    errors.push(t("errResellerDiamond"));
  }

  if (!Number.isFinite(inputs.resellerUsdKK) || inputs.resellerUsdKK <= 0) {
    errors.push(t("errResellerKK"));
  }

  if (inputs.tiers.length === 0) {
    errors.push(t("errTiers"));
  }

  if ((inputs.sellDiamonds || inputs.buyDiamonds) &&
      (!Number.isFinite(inputs.marketCashPerDiamond) || inputs.marketCashPerDiamond <= 0)) {
    errors.push(t("errMarket"));
  }

  return errors;
}

function showErrors(errors) {
  const el = document.getElementById("form-errors");
  if (errors.length === 0) {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  el.hidden = false;
  el.innerHTML = "<ul>" + errors.map((e) => `<li>${e}</li>`).join("") + "</ul>";
}

function gatherFormState() {
  const sellDiamonds = document.getElementById("sell-diamonds").checked;
  const buyDiamonds = document.getElementById("buy-diamonds").checked;
  return {
    language: getCurrentLang(),
    spend: parseNumber(document.getElementById("spend").value),
    couponBonusPct: parseNumber(document.getElementById("coupon-bonus").value),
    diamondsPerDollar: parseNumber(document.getElementById("diamonds-per-dollar").value),
    tiers: readTiers(),
    resellerUsdDiamond: parseNumber(document.getElementById("reseller-usd-diamond").value),
    resellerUsdKK: parseNumber(document.getElementById("reseller-usd-kk").value),
    sellDiamonds,
    buyDiamonds,
    marketCashPerDiamond: parseNumber(document.getElementById("market-cash-per-diamond").value),
  };
}

function gatherInputs() {
  return gatherFormState();
}

async function loadDefaultsFromFile() {
  try {
    const response = await fetch("defaults.json");
    if (!response.ok) return;
    const data = await response.json();
    appDefaults = normalizeDefaults(data);
  } catch (_) {
    // file:// or missing defaults.json — use FALLBACK_DEFAULTS
  }
}

function normalizeDefaults(data) {
  return {
    language: data.language === "en" ? "en" : "pt-BR",
    usdToBrl: data.usdToBrl ?? FALLBACK_DEFAULTS.usdToBrl,
    spend: data.spend ?? FALLBACK_DEFAULTS.spend,
    couponBonusPct: data.couponBonusPct ?? FALLBACK_DEFAULTS.couponBonusPct,
    diamondsPerDollar: data.diamondsPerDollar ?? FALLBACK_DEFAULTS.diamondsPerDollar,
    tiers: Array.isArray(data.tiers) && data.tiers.length > 0 ? data.tiers : FALLBACK_DEFAULTS.tiers,
    resellerUsdDiamond: data.resellerUsdDiamond ?? FALLBACK_DEFAULTS.resellerUsdDiamond,
    resellerUsdKK: data.resellerUsdKK ?? FALLBACK_DEFAULTS.resellerUsdKK,
    sellDiamonds: Boolean(data.sellDiamonds),
    buyDiamonds: Boolean(data.buyDiamonds),
    marketCashPerDiamond: data.marketCashPerDiamond ?? FALLBACK_DEFAULTS.marketCashPerDiamond,
  };
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeDefaults(JSON.parse(raw));
  } catch (_) {
    return null;
  }
}

function saveFormState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gatherFormState()));
  } catch (_) {
    // storage full or unavailable
  }
}

function scheduleSaveFormState() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveFormState, 400);
}

function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (!el || value === undefined || value === null || Number.isNaN(value)) return;
  el.value = value;
}

function renderTierRows(tiers) {
  const container = document.getElementById("tier-rows");
  container.innerHTML = "";
  for (const tier of tiers) {
    container.appendChild(createTierRow(tier.minSpend, tier.bonusPercent));
  }
  if (tiers.length === 0) {
    container.appendChild(createTierRow(0, 0));
  }
}

function applyFormState(state) {
  setInputValue("spend", state.spend);
  setInputValue("coupon-bonus", state.couponBonusPct);
  setInputValue("diamonds-per-dollar", state.diamondsPerDollar);
  setInputValue("reseller-usd-diamond", state.resellerUsdDiamond);
  setInputValue("reseller-usd-kk", state.resellerUsdKK);
  setInputValue("market-cash-per-diamond", state.marketCashPerDiamond);

  document.getElementById("sell-diamonds").checked = Boolean(state.sellDiamonds);
  document.getElementById("buy-diamonds").checked = Boolean(state.buyDiamonds);

  renderTierRows(state.tiers || []);
  updateMarketPriceField();
}

function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEY);
  applyFormState(getDefaultsForCurrentLanguage(appDefaults));
  document.getElementById("results-section").hidden = true;
  showErrors([]);
}

function handleLanguageChange(event) {
  const newLang = event.target.value;
  const oldLang = getCurrentLang();
  if (newLang === oldLang) return;

  const converted = convertFormStateForLanguage(gatherFormState(), oldLang, newLang);
  setCurrentLang(newLang);
  applyFormState(converted);
  applyTranslations();

  const resultsSection = document.getElementById("results-section");
  if (!resultsSection.hidden) {
    handleCalculate(new Event("submit"));
  }

  saveFormState();
}
function handleCalculate(event) {
  if (event?.preventDefault) event.preventDefault();

  const inputs = gatherInputs();
  const errors = validateInputs(inputs);
  showErrors(errors);

  if (errors.length > 0) {
    document.getElementById("results-section").hidden = true;
    return;
  }

  const rows = buildComparisonRows(inputs);
  document.getElementById("results-container").innerHTML = renderResults(rows);
  const resultsSection = document.getElementById("results-section");
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  saveFormState();
}
function updateMarketPriceField() {
  const sellChecked = document.getElementById("sell-diamonds").checked;
  const buyChecked = document.getElementById("buy-diamonds").checked;
  const show = sellChecked || buyChecked;
  const field = document.getElementById("market-price-field");
  const input = document.getElementById("market-cash-per-diamond");

  field.hidden = !show;
  input.disabled = !show;
}

function createTierRow(minSpend = "", bonus = "") {
  const row = document.createElement("div");
  row.className = "dynamic-row tier-row";
  row.innerHTML = `
    <input type="number" class="tier-min" min="0" step="0.01" value="${minSpend}" placeholder="0">
    <input type="number" class="tier-bonus" min="0" step="0.01" value="${bonus}" placeholder="0">
    <button type="button" class="btn-remove" aria-label="${t("removeTier")}">&times;</button>
  `;
  row.querySelector(".btn-remove").addEventListener("click", () => row.remove());
  return row;
}

function initDynamicRows() {
  document.querySelectorAll("#tier-rows .btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest(".tier-row").remove());
  });

  document.getElementById("add-tier").addEventListener("click", () => {
    document.getElementById("tier-rows").appendChild(createTierRow());
  });
}

function initMarketCheckboxes() {
  document.getElementById("sell-diamonds").addEventListener("change", updateMarketPriceField);
  document.getElementById("buy-diamonds").addEventListener("change", updateMarketPriceField);
  updateMarketPriceField();
}

function initPersistence() {
  document.getElementById("calculator-form").addEventListener("input", scheduleSaveFormState);
  document.getElementById("calculator-form").addEventListener("change", scheduleSaveFormState);
  document.getElementById("reset-defaults-btn").addEventListener("click", resetToDefaults);
}

function initLanguage() {
  const select = document.getElementById("language-select");
  select.value = getCurrentLang();
  select.addEventListener("change", handleLanguageChange);
}

async function initApp() {
  await loadDefaultsFromFile();
  const saved = loadSavedState();
  const savedLang = saved?.language ?? "pt-BR";
  setCurrentLang(savedLang);

  let initialState;
  if (saved) {
    initialState = {
      ...getDefaultsForCurrentLanguage(appDefaults),
      ...saved,
      tiers: saved.tiers?.length ? saved.tiers : getDefaultsForCurrentLanguage(appDefaults).tiers,
      language: savedLang,
    };
  } else {
    initialState = getDefaultsForCurrentLanguage(appDefaults);
  }

  document.getElementById("language-select").value = savedLang;
  applyFormState(initialState);
  applyTranslations();
  initDynamicRows();
  initMarketCheckboxes();
  initPersistence();
  initLanguage();
  document.getElementById("calculator-form").addEventListener("submit", handleCalculate);
}

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});
