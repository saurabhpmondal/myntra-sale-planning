/* ==========================================
   File: js/reports/daily-pulse/index.js
   FULL REPLACE CODE
   PHASE 1 SAFE FIX
   Restores date columns without touching metrics
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

/* ========================================== */

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
      dates: [],
      total: 0
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
        align-items:center;
      ">

        <select id="dpSort">
          <option value="MTD"
            ${
              sortBy ===
              "MTD"
                ? "selected"
                : ""
            }>
            MTD
          </option>

          <option value="DRR"
            ${
              sortBy ===
              "DRR"
                ? "selected"
                : ""
            }>
            DRR
          </option>
        </select>

        <select id="dpOrder">
          <option value="HIGH"
            ${
              order ===
              "HIGH"
                ? "selected"
                : ""
            }>
            HIGH
          </option>

          <option value="LOW"
            ${
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
          font-size:12px;
          color:#64748b;
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

    ${table(data)}

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
   TABLE
========================================== */

function table(
  data
) {
  return `
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

            ${th("Style ID")}
            ${th("ERP")}
            ${th("Brand")}
            ${th("Status")}
            ${th("MTD")}
            ${th("DRR")}
            ${th("Trend")}

            ${
              data.dates
                .map(
                  (
                    d
                  ) =>
                    th(
                      dayNo(
                        d
                      )
                    )
                )
                .join("")
            }

          </tr>
        </thead>

        <tbody>
          ${
            data.rows
              .map(
                (
                  r
                ) =>
                  row(
                    r,
                    data.dates
                  )
              )
              .join("")
          }
        </tbody>

      </table>

    </div>
  `;
}

function row(
  r,
  dates
) {
  return `
    <tr>

      ${td(
        r.styleId
      )}

      ${td(
        r.erp
      )}

      ${td(
        r.brand
      )}

      ${td(
        r.status
      )}

      ${td(
        fmt(
          r.mtd
        )
      )}

      ${td(
        one(
          r.drr
        )
      )}

      ${td(
        r.trend
      )}

      ${
        dates
          .map(
            (
              d
            ) =>
              td(
                fmt(
                  r.days?.[
                    d
                  ] || 0
                )
              )
          )
          .join("")
      }

    </tr>
  `;
}

/* ==========================================
   CELLS
========================================== */

function th(
  text
) {
  return `
    <th style="
      padding:10px;
      background:#f8fafc;
      border-bottom:1px solid #e5e7eb;
      white-space:nowrap;
      text-align:left;
      font-weight:700;
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
      padding:8px 10px;
      border-bottom:1px solid #eef2f7;
      white-space:nowrap;
    ">
      ${text}
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

function dayNo(d) {
  return String(
    d
  ).slice(-2);
}

function fmt(v) {
  return Number(
    v || 0
  ).toLocaleString(
    "en-IN"
  );
}

function one(v) {
  return Number(
    v || 0
  ).toFixed(1);
}