/* ==========================================
   File: js/reports/xray/index.js
   FULL REPLACE CODE
   Added More KPIs + Better Hero
========================================== */

import {
  getXrayData
} from "./metrics.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderXrayReport() {
  const root =
    document.getElementById(
      "xray"
    );

  if (!root)
    return;

  const keyword =
    getSearch();

  if (!keyword) {
    root.innerHTML = emptyBox(
      "Search Style ID above to begin analysis"
    );
    return;
  }

  const data =
    getXrayData(
      keyword
    );

  if (!data) {
    root.innerHTML =
      emptyBox(
        "No style found"
      );
    return;
  }

  root.innerHTML = `
    <div class="xray-hero">

      <div class="xray-title">
        ${data.styleId}
      </div>

      <div class="xray-sub">
        ${data.erp}
        •
        ${data.brand}
      </div>

      <div class="xray-rank">
        🏆 BESTSELLER #${fmt(
          data.rank
        )}
      </div>

    </div>

    <div class="kpi-grid">

      ${card("💰 GMV", money(data.gmv))}
      ${card("📦 Units", fmt(data.units))}
      ${card("🏷 ASP", money(data.asp))}
      ${card("🎯 DW", pct(data.dw))}
      ${card("📈 Growth", pct(data.growth))}
      ${card("↩ Return%", pct(data.returnPct))}
      ${card("🔥 DRR", num2(data.drr))}
      ${card("🚚 SJIT", fmt(data.sjitStock))}
      ${card("🏬 SOR", fmt(data.sorStock))}
      ${card("⏳ SJIT SC", num1(data.sjitSc))}
      ${card("⏳ SOR SC", num1(data.sorSc))}
      ${card("⚡ Ship", fmt(data.shipQty))}

    </div>

    <div class="panel-card">
      <h3 class="panel-title">
        Top Actions
      </h3>

      <div class="xray-actions">
        ${data.actions
          .map(
            (x) =>
              `<div class="xray-action">${x}</div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

/* ==========================================
   HELPERS
========================================== */

function getSearch() {
  const el =
    document.getElementById(
      "globalSearch"
    );

  return el
    ? el.value.trim()
    : "";
}

function emptyBox(text) {
  return `
    <div class="panel-card">
      <h3 class="panel-title">
        🔍 Style X-Ray
      </h3>

      <div class="placeholder-box large">
        ${text}
      </div>
    </div>
  `;
}

function card(
  label,
  value
) {
  return `
    <div class="kpi-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function fmt(v) {
  return Number(
    v || 0
  ).toLocaleString(
    "en-IN"
  );
}

function money(v) {
  return `₹${fmt(
    Math.round(v || 0)
  )}`;
}

function pct(v) {
  return `${Number(
    v || 0
  ).toFixed(1)}%`;
}

function num1(v) {
  return Number(
    v || 0
  ).toFixed(1);
}

function num2(v) {
  return Number(
    v || 0
  ).toFixed(2);
}