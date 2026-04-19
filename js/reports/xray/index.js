/* ==========================================
   File: js/reports/xray/index.js
   NEW FILE
   Style X-Ray Report UI
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

  root.innerHTML = `
    <div class="panel-card">

      <h3 class="panel-title">
        🔍 Style X-Ray
      </h3>

      <div class="placeholder-box large">
        Search Style ID above to begin analysis
      </div>

    </div>
  `;

  const keyword =
    getSearch();

  if (!keyword)
    return;

  const data =
    getXrayData(
      keyword
    );

  if (!data) {
    root.innerHTML = `
      <div class="panel-card">
        <h3 class="panel-title">
          🔍 Style X-Ray
        </h3>

        <div class="placeholder-box large">
          No style found
        </div>
      </div>
    `;
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
        🏆 Rank #${fmt(
          data.rank
        )}
      </div>

    </div>

    <div class="kpi-grid">

      ${card(
        "💰 GMV",
        money(
          data.gmv
        )
      )}

      ${card(
        "📦 Units",
        fmt(
          data.units
        )
      )}

      ${card(
        "🏷 ASP",
        money(
          data.asp
        )
      )}

      ${card(
        "🎯 DW",
        pct(
          data.dw
        )
      )}

      ${card(
        "🚚 SJIT",
        fmt(
          data.sjitStock
        )
      )}

      ${card(
        "🏬 SOR",
        fmt(
          data.sorStock
        )
      )}

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
    Math.round(
      v || 0
    )
  )}`;
}

function pct(v) {
  return `${Number(
    v || 0
  ).toFixed(1)}%`;
}