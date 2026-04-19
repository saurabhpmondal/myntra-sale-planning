/* ==========================================
   File: js/reports/xray/index.js
   FULL REPLACE CODE
   V6.7 POLISH UI
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
    ${
      data
        ? renderData(
            data
          )
        : emptyBox(
            keyword
              ? "No style found"
              : "Search style to begin"
          )
    }
  `;
}

/* ==========================================
   MAIN VIEW
========================================== */

function renderData(d) {
  return `
    ${hero(d)}

    ${section(
      "🏷 Product Info",
      tint("slate"),
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

    ${trend(d)}

    ${section(
      "📊 Sales",
      tint("green"),
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
      tint("amber"),
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
      tint("blue"),
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

    ${donut(d)}

    ${section(
      "🏭 PO Mix",
      tint("purple"),
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
   HERO
========================================== */

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
        #1e3a8a,
        #0f172a
      );
      box-shadow:
      0 12px 30px rgba(15,23,42,.18);
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
            font-size:36px;
            font-weight:900;
            line-height:1;
          ">
            ${safe(
              d.styleId
            )} ↗
          </div>
        </a>

        <div style="
          margin-top:12px;
          display:inline-block;
          background:rgba(255,255,255,.14);
          padding:7px 12px;
          border-radius:999px;
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
          opacity:.9;
          font-size:14px;
        ">
          ERP: ${safe(
            d.erp
          )}
        </div>
      </div>
    </div>
  `;
}

/* ==========================================
   TREND
========================================== */

function trend(d) {
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
        height:110px;
        display:flex;
        gap:7px;
        align-items:flex-end;
        margin-top:10px;
      ">
        ${(d.trend || [])
          .map(
            (v) =>
              `<div style="
                flex:1;
                border-radius:12px 12px 0 0;
                background:
                linear-gradient(
                  180deg,
                  #60a5fa,
                  #2563eb
                );
                box-shadow:
                0 6px 14px rgba(37,99,235,.25);
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

function donut(d) {
  const a =
    d.ppmpPct;
  const b =
    d.sjitPct;

  return `
    <div class="panel-card">
      <h3 class="panel-title">
        🍩 PO Mix Visual
      </h3>

      <div style="
        width:160px;
        height:160px;
        margin:18px auto;
        border-radius:50%;
        background:
        conic-gradient(
          #9333ea 0 ${a}%,
          #2563eb ${a}% ${a +
    b}%,
          #84cc16 ${a +
    b}% 100%
        );
        position:relative;
        box-shadow:
        0 10px 24px rgba(0,0,0,.08);
      ">
        <div style="
          position:absolute;
          inset:26px;
          background:#fff;
          border-radius:50%;
        "></div>
      </div>
    </div>
  `;
}

/* ==========================================
   COMMON
========================================== */

function section(
  title,
  bg,
  cards
) {
  return `
    <div class="panel-card" style="${bg}">
      <h3 class="panel-title">
        ${title}
      </h3>

      <div class="kpi-grid">
        ${cards.join("")}
      </div>
    </div>
  `;
}

function tint(type) {
  if (type === "green")
    return "background:linear-gradient(180deg,#ffffff,#f0fdf4);";
  if (type === "amber")
    return "background:linear-gradient(180deg,#ffffff,#fffbeb);";
  if (type === "blue")
    return "background:linear-gradient(180deg,#ffffff,#eff6ff);";
  if (type === "purple")
    return "background:linear-gradient(180deg,#ffffff,#faf5ff);";

  return "background:linear-gradient(180deg,#ffffff,#f8fafc);";
}

function card(
  label,
  value
) {
  return `
    <div class="kpi-card" style="
      border-radius:16px;
      box-shadow:
      0 8px 18px rgba(15,23,42,.05);
    ">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
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

function getSearch() {
  const el =
    document.getElementById(
      "globalSearch"
    );

  return el
    ? el.value.trim()
    : "";
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