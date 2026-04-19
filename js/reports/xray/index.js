/* ==========================================
   File: js/reports/xray/index.js
   FULL REPLACE CODE
   v6.1 FINAL UI
========================================== */

import { getXrayData } from "./metrics.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderXrayReport() {
  const root =
    document.getElementById(
      "xray"
    );

  if (!root) return;

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
        flex-wrap:wrap;
        margin-top:12px;
      ">
        <input
          id="xraySearch"
          value="${safe(
            keyword
          )}"
          placeholder="Search Style ID"
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
  d
) {
  return `
    <div class="xray-hero">
      <div class="xray-title">
        ${safe(
          d.styleId
        )}
      </div>

      <div class="xray-sub">
        ${safe(
          d.erp
        )} • ${safe(
    d.brand
  )}
      </div>

      <div class="xray-rank">
        🏆 Rank #${fmt(
          d.rank
        )}
      </div>
    </div>

    ${section(
      "📊 Sales",
      [
        card(
          "GMV",
          money(d.gmv)
        ),
        card(
          "Units",
          fmt(d.units)
        ),
        card(
          "ASP",
          money(d.asp)
        ),
        card(
          "DW",
          pct(d.dw)
        ),
        card(
          "Growth",
          pct(
            d.growth
          )
        ),
        card(
          "Return%",
          pct(
            d.returnPct
          )
        )
      ]
    )}

    ${section(
      "📦 Stock & Planning",
      [
        card(
          "DRR",
          num1(d.drr)
        ),
        card(
          "SJIT Stock",
          fmt(
            d.sjitStock
          )
        ),
        card(
          "SOR Stock",
          fmt(
            d.sorStock
          )
        ),
        card(
          "SJIT SC",
          num1(
            d.sjitSc
          )
        ),
        card(
          "SOR SC",
          num1(
            d.sorSc
          )
        ),
        card(
          "Ship Qty",
          fmt(
            d.shipQty
          )
        ),
        card(
          "Recall",
          fmt(
            d.recallQty
          )
        )
      ]
    )}

    ${section(
      "🚦 Traffic Funnel",
      [
        card(
          "Impr.",
          fmt(
            d.impressions
          )
        ),
        card(
          "Clicks",
          fmt(
            d.clicks
          )
        ),
        card(
          "ATC",
          fmt(d.atc)
        ),
        card(
          "CTR",
          pct(d.ctr)
        ),
        card(
          "CVR",
          pct(d.cvr)
        )
      ]
    )}

    ${section(
      "🏭 PO Mix",
      [
        card(
          "PPMP",
          pct(
            d.ppmpPct
          )
        ),
        card(
          "SJIT",
          pct(
            d.sjitPct
          )
        ),
        card(
          "SOR",
          pct(
            d.sorPct
          )
        )
      ]
    )}

    ${section(
      "🏷 Product Info",
      [
        card(
          "Status",
          safe(
            d.status
          ) || "-"
        ),
        card(
          "MRP",
          money(d.mrp)
        ),
        card(
          "TP",
          money(d.tp)
        ),
        card(
          "Launch",
          safe(
            d.launchDate
          ) || "-"
        ),
        card(
          "Live",
          safe(
            d.liveDate
          ) || "-"
        )
      ]
    )}

    <div class="panel-card">
      <h3 class="panel-title">
        📈 Mini Trend
      </h3>

      <div style="
        display:flex;
        gap:6px;
        align-items:flex-end;
        height:90px;
      ">
        ${(
          d.trend ||
          []
        )
          .map(
            (v) =>
              `<div style="
                flex:1;
                background:#0f172a;
                border-radius:6px 6px 0 0;
                height:${Math.max(
                  8,
                  v
                )}%;
              "></div>`
          )
          .join("")}
      </div>
    </div>

    <div class="panel-card">
      <h3 class="panel-title">
        ⚠ Risks
      </h3>

      <div class="xray-actions">
        ${(
          d.risks ||
          []
        )
          .map(
            (x) =>
              `<div class="xray-action">${safe(
                x
              )}</div>`
          )
          .join("") ||
        `<div class="xray-action">No major risk</div>`}
      </div>
    </div>

    <div class="panel-card">
      <h3 class="panel-title">
        ✅ Actions
      </h3>

      <div class="xray-actions">
        ${(
          d.actions ||
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

  if (global)
    global.value =
      val;

  renderXrayReport();
}

/* ==========================================
   HELPERS
========================================== */

function section(
  title,
  cards
) {
  return `
    <div class="panel-card">
      <h3 class="panel-title">
        ${title}
      </h3>
      <div class="kpi-grid">
        ${cards.join("")}
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