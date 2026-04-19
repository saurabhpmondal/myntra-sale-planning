/* ==========================================
   File: js/reports/xray/index.js
   FULL REPLACE CODE
   V6.7.1 FIXED UI
========================================== */

import { getXrayData } from "./metrics.js";

export function renderXrayReport() {
  const root =
    document.getElementById(
      "xray"
    );

  if (!root) return;

  const keyword =
    getLocalSearch();

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
            border-radius:12px;
          "
        />

        <button
          id="xrayBtn"
          style="
            padding:10px 16px;
            border:none;
            border-radius:12px;
            background:#0f172a;
            color:#fff;
            font-weight:700;
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
            "Search style to begin"
          )
    }
  `;

  bindSearch();
}

/* ========================================== */

function renderData(d) {
  return `
    ${hero(d)}

    ${section(
      "🏷 Product Info",
      [
        card(
          "Status",
          d.status
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
          d.launchDate
        ),
        card(
          "Live",
          d.liveDate
        )
      ]
    )}

    ${trend(d)}

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
          "Return",
          fmt(
            d.returnUnits
          )
        ),
        card(
          "Net",
          fmt(
            d.netUnits
          )
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
        )
      ]
    )}

    ${section(
      "📦 Stock",
      [
        card(
          "DRR",
          num1(d.drr)
        ),
        card(
          "SJIT",
          fmt(
            d.sjitStock
          )
        ),
        card(
          "SOR",
          fmt(
            d.sorStock
          )
        ),
        card(
          "Ship",
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
      "🍩 PO Mix",
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

    ${poVisual(d)}

    ${tagSection(
      "⚠ Risks",
      d.risks
    )}

    ${tagSection(
      "✅ Actions",
      d.actions
    )}
  `;
}

/* ========================================== */

function hero(d) {
  return `
    <div style="
      margin-top:14px;
      padding:18px;
      border-radius:20px;
      color:#fff;
      background:
      linear-gradient(
        135deg,
        #0f172a,
        #1e3a8a
      );
      display:grid;
      grid-template-columns:1fr auto;
      gap:14px;
      align-items:center;
    ">

      <div>
        <a
          href="${d.myntraUrl}"
          target="_blank"
          style="
            color:#fff;
            text-decoration:none;
          "
        >
          <div style="
            font-size:34px;
            font-weight:900;
          ">
            ${d.styleId} ↗
          </div>
        </a>

        <div style="
          margin-top:10px;
          display:inline-block;
          padding:7px 12px;
          border-radius:999px;
          background:
          rgba(255,255,255,.14);
          font-size:13px;
          font-weight:700;
        ">
          🏆 Rank #${fmt(
            d.rank
          )}
        </div>
      </div>

      <div style="
        text-align:right;
      ">
        <div style="
          font-size:24px;
          font-weight:800;
        ">
          ${safe(
            d.brand
          )}
        </div>

        <div style="
          margin-top:6px;
          font-size:14px;
          opacity:.9;
        ">
          ERP:
          ${safe(
            d.erp
          )}
        </div>
      </div>
    </div>
  `;
}

/* ========================================== */

function trend(d) {
  const vals =
    d.trend || [];

  const max =
    Math.max(
      ...vals.map(
        (x) =>
          x.value
      ),
      1
    );

  return `
    <div class="panel-card">
      <h3 class="panel-title">
        📈 Trend
      </h3>

      <div style="
        height:110px;
        display:flex;
        gap:6px;
        align-items:flex-end;
        margin-top:10px;
      ">
        ${vals
          .map(
            (x) =>
              `<div title="${x.date}"
                style="
                flex:1;
                height:${Math.max(
                  10,
                  (x.value /
                    max) *
                    100
                )}%;
                border-radius:10px 10px 0 0;
                background:
                linear-gradient(
                  180deg,
                  #60a5fa,
                  #2563eb
                );
              "></div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function poVisual(d) {
  return `
    <div class="panel-card">
      <h3 class="panel-title">
        🍩 PO Mix Visual
      </h3>

      <div style="
        margin-top:14px;
        display:grid;
        gap:10px;
      ">
        ${bar(
          "PPMP",
          d.ppmpPct,
          "#9333ea"
        )}
        ${bar(
          "SJIT",
          d.sjitPct,
          "#2563eb"
        )}
        ${bar(
          "SOR",
          d.sorPct,
          "#16a34a"
        )}
      </div>
    </div>
  `;
}

function bar(
  label,
  val,
  color
) {
  return `
    <div>
      <div style="
        display:flex;
        justify-content:space-between;
        font-size:13px;
        margin-bottom:5px;
      ">
        <span>${label}</span>
        <b>${pct(
          val
        )}</b>
      </div>

      <div style="
        height:10px;
        background:#eef2f7;
        border-radius:999px;
      ">
        <div style="
          height:100%;
          width:${val}%;
          background:${color};
          border-radius:999px;
        "></div>
      </div>
    </div>
  `;
}

/* ========================================== */

function tagSection(
  title,
  rows
) {
  return `
    <div class="panel-card">
      <h3 class="panel-title">
        ${title}
      </h3>

      <div style="
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        margin-top:10px;
      ">
        ${rows
          .map(
            (x) =>
              `<div style="
                padding:8px 12px;
                border-radius:999px;
                background:#f8fafc;
                border:1px solid #e5e7eb;
                font-size:13px;
                font-weight:600;
              ">${x}</div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

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

/* ========================================== */

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
        )
          runSearch();
      };
  }
}

function runSearch() {
  const input =
    document.getElementById(
      "xraySearch"
    );

  window.__xraySearch =
    input
      ? input.value.trim()
      : "";

  renderXrayReport();
}

function getLocalSearch() {
  return (
    window.__xraySearch ||
    ""
  );
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

/* ========================================== */

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