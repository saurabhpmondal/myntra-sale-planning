/* ==========================================
   File: js/reports/xray/index.js
   FULL REPLACE CODE
   V6.5 POLISHED UI
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
            border-radius:12px;
          "
        />

        <button
          id="xrayBtn"
          style="
            padding:10px 16px;
            border:none;
            border-radius:12px;
            cursor:pointer;
            background:#0f172a;
            color:#fff;
            font-weight:700;
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
    <div style="
      background:
      linear-gradient(135deg,#0f172a,#1e293b,#0b1220);
      color:#fff;
      border-radius:18px;
      padding:18px;
      margin-top:14px;
      box-shadow:0 10px 30px rgba(0,0,0,.18);
    ">
      <div style="
        font-size:34px;
        font-weight:800;
        line-height:1;
      ">
        ${safe(
          d.styleId
        )}
      </div>

      <div style="
        margin-top:8px;
        opacity:.85;
        font-size:14px;
      ">
        ${safe(
          d.erp
        )} • ${safe(
    d.brand
  )}
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
        card(
          "Status",
          safe(
            d.status
          ) || "-",
          "#1d4ed8"
        ),
        card(
          "MRP",
          money(d.mrp),
          "#7c3aed"
        ),
        card(
          "TP",
          money(d.tp),
          "#0891b2"
        ),
        card(
          "Launch",
          safe(
            d.launchDate
          ) || "-",
          "#0f766e"
        ),
        card(
          "Live",
          safe(
            d.liveDate
          ) || "-",
          "#15803d"
        )
      ]
    )}

    ${section(
      "📊 Sales",
      [
        card(
          "GMV",
          money(d.gmv),
          "#15803d"
        ),
        card(
          "Units",
          fmt(d.units),
          "#0f766e"
        ),
        card(
          "ASP",
          money(d.asp),
          "#0369a1"
        ),
        card(
          "DW",
          pct(d.dw),
          "#7c3aed"
        ),
        card(
          "Growth",
          pct(
            d.growth
          ),
          d.growth >= 0
            ? "#15803d"
            : "#b91c1c"
        ),
        card(
          "Return%",
          pct(
            d.returnPct
          ),
          "#b45309"
        )
      ]
    )}

    ${section(
      "📦 Stock & Planning",
      [
        card(
          "DRR",
          num1(d.drr),
          "#1d4ed8"
        ),
        card(
          "SJIT Stock",
          fmt(
            d.sjitStock
          ),
          "#0f766e"
        ),
        card(
          "SOR Stock",
          fmt(
            d.sorStock
          ),
          "#9333ea"
        ),
        card(
          "SJIT SC",
          num1(
            d.sjitSc
          ),
          "#0369a1"
        ),
        card(
          "SOR SC",
          num1(
            d.sorSc
          ),
          "#7c2d12"
        ),
        card(
          "Ship",
          fmt(
            d.shipQty
          ),
          "#15803d"
        ),
        card(
          "Recall",
          fmt(
            d.recallQty
          ),
          "#b91c1c"
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
          ),
          "#1d4ed8"
        ),
        card(
          "Clicks",
          fmt(
            d.clicks
          ),
          "#0891b2"
        ),
        card(
          "ATC",
          fmt(d.atc),
          "#7c3aed"
        ),
        card(
          "CTR",
          pct(d.ctr),
          "#15803d"
        ),
        card(
          "CVR",
          pct(d.cvr),
          "#0f766e"
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
          ),
          "#7c3aed"
        ),
        card(
          "SJIT",
          pct(
            d.sjitPct
          ),
          "#0369a1"
        ),
        card(
          "SOR",
          pct(
            d.sorPct
          ),
          "#15803d"
        )
      ]
    )}

    ${trendCard(d)}

    ${tagSection(
      "⚠ Risks",
      d.risks || []
    )}

    ${tagSection(
      "✅ Actions",
      d.actions || []
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
        📈 Mini Trend
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
                box-shadow:0 6px 18px rgba(59,130,246,.25);
              "></div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

/* ==========================================
   TAG BLOCK
========================================== */

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
        ${
          rows.length
            ? rows
                .map(
                  (x) =>
                    `<div style="
                      padding:10px 14px;
                      border-radius:999px;
                      background:#f8fafc;
                      border:1px solid #e5e7eb;
                      font-size:13px;
                      font-weight:600;
                    ">${safe(
                      x
                    )}</div>`
                )
                .join("")
            : `<div style="
                color:#64748b;
              ">None</div>`
        }
      </div>
    </div>
  `;
}

/* ==========================================
   SECTION
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

/* ==========================================
   CARD
========================================== */

function card(
  label,
  value,
  color
) {
  return `
    <div style="
      background:linear-gradient(135deg,#ffffff,#f8fafc);
      border:1px solid #eef2f7;
      border-top:4px solid ${color};
      border-radius:16px;
      padding:14px;
      box-shadow:0 6px 18px rgba(15,23,42,.04);
    ">
      <div style="
        font-size:12px;
        color:#64748b;
        margin-bottom:8px;
      ">
        ${label}
      </div>

      <div style="
        font-size:28px;
        font-weight:800;
        color:#0f172a;
        line-height:1.1;
      ">
        ${value}
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