/* ==========================================
   File: js/reports/daily-pulse/index.js
   FULL REPLACE CODE
   FINAL DAILY PULSE UI
========================================== */

import {
  getDailyPulseRows
} from "./metrics.js";

let sortBy =
  "MTD";

let order =
  "HIGH";

let limit =
  50;

/* ==========================================
   PUBLIC
========================================== */

export function renderDailyPulseReport() {
  const root =
    document.getElementById(
      "daily-pulse"
    );

  if (!root)
    return;

  const data =
    getDailyPulseRows(
      sortBy,
      order,
      limit
    ) || {
      rows: [],
      total: 0,
      dates: []
    };

  root.innerHTML = `
    <div class="panel-card">

      <h3 class="panel-title">
        ⚡ Daily Pulse
      </h3>

      <div style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        margin-top:12px;
      ">

        <select
          id="dpSort"
          style="${selectCss()}"
        >
          <option value="MTD" ${
            sortBy ===
            "MTD"
              ? "selected"
              : ""
          }>
            MTD
          </option>

          <option value="DRR" ${
            sortBy ===
            "DRR"
              ? "selected"
              : ""
          }>
            DRR
          </option>
        </select>

        <select
          id="dpOrder"
          style="${selectCss()}"
        >
          <option value="HIGH" ${
            order ===
            "HIGH"
              ? "selected"
              : ""
          }>
            HIGH
          </option>

          <option value="LOW" ${
            order ===
            "LOW"
              ? "selected"
              : ""
          }>
            LOW
          </option>
        </select>

        <div style="
          margin-left:auto;
          font-size:13px;
          color:#64748b;
          display:flex;
          align-items:center;
        ">
          Showing
          ${Math.min(
            limit,
            data.total
          )}
          /
          ${data.total}
        </div>

      </div>

    </div>

    <div class="panel-card"
      style="
        overflow:auto;
        padding:0;
      ">

      <table style="
        width:max-content;
        min-width:100%;
        border-collapse:collapse;
        font-size:13px;
      ">

        <thead>
          <tr>
            ${th(
              "Style ID"
            )}
            ${th("ERP")}
            ${th(
              "Brand"
            )}
            ${th(
              "Status"
            )}
            ${th("MTD")}
            ${th("DRR")}
            ${th(
              "Trend"
            )}
          </tr>
        </thead>

        <tbody>
          ${data.rows
            .map(
              (r) =>
                rowHtml(
                  r
                )
            )
            .join("")}
        </tbody>

      </table>

    </div>

    ${
      limit <
      data.total
        ? `
      <div style="margin-top:12px;">
        <button
          id="dpMore"
          style="
            width:100%;
            padding:12px;
            border:none;
            border-radius:12px;
            background:#0f172a;
            color:#fff;
            font-weight:700;
            cursor:pointer;
          "
        >
          Load More
        </button>
      </div>
    `
        : ""
    }
  `;

  bind();
}

/* ==========================================
   ROW
========================================== */

function rowHtml(
  r
) {
  return `
    <tr>
      ${td(
        r.styleId
      )}
      ${td(r.erp)}
      ${td(
        r.brand
      )}
      ${td(
        r.status
      )}
      ${td(
        fmt(r.mtd)
      )}
      ${td(
        num1(r.drr)
      )}
      ${td(
        r.trend
      )}
    </tr>
  `;
}

/* ==========================================
   TABLE CELLS
========================================== */

function th(
  text
) {
  return `
    <th style="
      padding:10px;
      text-align:left;
      background:#f8fafc;
      border-bottom:1px solid #e5e7eb;
      white-space:nowrap;
    ">
      ${text}
    </th>
  `;
}

function td(
  text
) {
  return `
    <td style="
      padding:10px;
      border-bottom:1px solid #eef2f7;
      white-space:nowrap;
    ">
      ${text || ""}
    </td>
  `;
}

/* ==========================================
   EVENTS
========================================== */

function bind() {
  const s =
    document.getElementById(
      "dpSort"
    );

  const o =
    document.getElementById(
      "dpOrder"
    );

  const m =
    document.getElementById(
      "dpMore"
    );

  if (s) {
    s.onchange =
      () => {
        sortBy =
          s.value;
        renderDailyPulseReport();
      };
  }

  if (o) {
    o.onchange =
      () => {
        order =
          o.value;
        renderDailyPulseReport();
      };
  }

  if (m) {
    m.onclick =
      () => {
        limit +=
          50;
        renderDailyPulseReport();
      };
  }
}

/* ==========================================
   HELPERS
========================================== */

function fmt(v) {
  return Number(
    v || 0
  ).toLocaleString(
    "en-IN"
  );
}

function num1(v) {
  return Number(
    v || 0
  ).toFixed(1);
}

function selectCss() {
  return `
    padding:10px 12px;
    border:1px solid #dbe3ee;
    border-radius:12px;
    background:#fff;
  `;
}