/* ==========================================
   File: js/reports/xray/index.js
   FULL REPLACE CODE
   V6.6 UI UPGRADE
========================================== */

import { getXrayData } from "./metrics.js";

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

function renderData(d) {
  return `
    <div style="
      background:linear-gradient(135deg,#0f172a,#1e293b);
      color:#fff;
      border-radius:18px;
      padding:18px;
      margin-top:14px;
    ">

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
          font-weight:800;
        ">
          ${safe(
            d.styleId
          )} ↗
        </div>
      </a>

      <div style="
        margin-top:8px;
        display:flex;
        gap:14px;
        flex-wrap:wrap;
        font-size:14px;
        opacity:.9;
      ">
        <div>
          ERP: <b>${safe(
            d.erp
          )}</b>
        </div>

        <div>
          Brand: <b>${safe(
            d.brand
          )}</b>
        </div>
      </div>

      <div style="
        margin-top:12px;
        display:inline-block;
        padding:7px 12px;
        border-radius:999px;
        background:rgba(255,255,255,.12);
        font-size:13px;
        font-weight:700;
      ">
        🏆 Rank #${fmt(
          d.rank
        )}
      </div>
    </div>

    ${section(
      "🏷 Product Info",
      [
        card("Status", d.status),
        card("MRP", money(d.mrp)),
        card("TP", money(d.tp)),
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

    ${trendCard(d)}

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
      "🚦 Funnel",
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

    ${donutBlock(d)}

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
  `;
}

/* ==========================================
   TREND
========================================== */

function trendCard(d) {
  const max =
    Math.max(
      ...(d.trend || [1])
    );

  return `
    <div class="panel-card">
      <h3 class="panel-title">
        📈 Real Trend
      </h3>

      <div style="
        display:flex;
        gap:7px;
        align-items:flex-end;
        height:110px;
        margin-top:10px;
      ">
        ${(d.trend || [])
          .map(
            (v) =>
              `<div style="
                flex:1;
                border-radius:10px 10px 0 0;
                background:linear-gradient(180deg,#3b82f6,#1d4ed8);
                height:${Math.max(
                  10,
                  (v / max) *
                    100
                )}%;
              "></div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

/* ==========================================
   DONUT
========================================== */

function donutBlock(d) {
  const a =
    d.ppmpPct;
  const b =
    d.sjitPct;
  const c =
    d.sorPct;

  return `
    <div class="panel-card">
      <h3 class="panel-title">
        🍩 PO Mix Visual
      </h3>

      <div style="
        margin:16px auto;
        width:160px;
        height:160px;
        border-radius:50%;
        background:
        conic-gradient(
          #7c3aed 0 ${a}%,
          #2563eb ${a}% ${a +
    b}%,
          #16a34a ${a +
    b}% 100%
        );
        position:relative;
      ">
        <div style="
          position:absolute;
          inset:28px;
          border-radius:50%;
          background:#fff;
        "></div>
      </div>

      <div style="
        display:flex;
        gap:12px;
        justify-content:center;
        flex-wrap:wrap;
        font-size:13px;
      ">
        <div>🟣 PPMP</div>
        <div>🔵 SJIT</div>
        <div>🟢 SOR</div>
      </div>
    </div>
  `;
}

/* ==========================================
   COMMON
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