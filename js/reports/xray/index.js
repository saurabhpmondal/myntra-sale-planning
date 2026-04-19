/* ==========================================
   File: js/reports/xray/index.js
   FULL REPLACE CODE
   SAFE RENDER + INTERNAL SEARCH BOX
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

  const data =
    keyword
      ? getXrayData(
          keyword
        )
      : null;

  root.innerHTML = `
    <div class="panel-card">

      <h3 class="panel-title">
        🔍 Style X-Ray
      </h3>

      <div style="
        display:flex;
        gap:10px;
        margin-top:12px;
        flex-wrap:wrap;
      ">
        <input
          id="xraySearch"
          type="text"
          placeholder="Search Style ID"
          value="${keyword}"
          style="
            flex:1;
            min-width:220px;
            padding:10px 12px;
            border:1px solid #ddd;
            border-radius:10px;
          "
        />

        <button
          id="xrayBtn"
          style="
            padding:10px 16px;
            border:none;
            border-radius:10px;
            cursor:pointer;
          "
        >
          Analyze
        </button>
      </div>

    </div>

    ${
      data
        ? renderData(
            data
          )
        : emptyBox(
            keyword
              ? "No style found"
              : "Search any style to begin"
          )
    }
  `;

  bindSearch();
}

/* ==========================================
   DATA VIEW
========================================== */

function renderData(
  data
) {
  return `
    <div class="xray-hero">

      <div class="xray-title">
        ${safe(
          data.styleId
        )}
      </div>

      <div class="xray-sub">
        ${safe(
          data.erp
        )} • ${safe(
    data.brand
  )}
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
        "📈 Growth",
        pct(
          data.growth
        )
      )}

      ${card(
        "↩ Return%",
        pct(
          data.returnPct
        )
      )}

      ${card(
        "🔥 DRR",
        num2(
          data.drr
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

      ${card(
        "⏳ SJIT SC",
        num1(
          data.sjitSc
        )
      )}

      ${card(
        "⏳ SOR SC",
        num1(
          data.sorSc
        )
      )}

      ${card(
        "⚡ Ship",
        fmt(
          data.shipQty
        )
      )}

    </div>

    <div class="panel-card">
      <h3 class="panel-title">
        Top Actions
      </h3>

      <div class="xray-actions">
        ${(
          data.actions ||
          []
        )
          .map(
            (x) =>
              `<div class="xray-action">${safe(
                x
              )}</div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

/* ==========================================
   SEARCH
========================================== */

function bindSearch() {
  const btn =
    document.getElementById(
      "xrayBtn"
    );

  const input =
    document.getElementById(
      "xraySearch"
    );

  if (
    btn &&
    input
  ) {
    btn.onclick =
      runSearch;

    input.onkeydown =
      (e) => {
        if (
          e.key ===
          "Enter"
        ) {
          runSearch();
        }
      };
  }
}

function runSearch() {
  const input =
    document.getElementById(
      "xraySearch"
    );

  const global =
    document.getElementById(
      "globalSearch"
    );

  const val =
    input
      ? input.value.trim()
      : "";

  if (global) {
    global.value =
      val;
  }

  renderXrayReport();
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

function emptyBox(
  text
) {
  return `
    <div class="panel-card">
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

function safe(v) {
  return String(
    v || ""
  );
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