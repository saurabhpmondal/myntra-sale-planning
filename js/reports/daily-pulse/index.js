/* ==========================================
   File: js/reports/daily-pulse/index.js
   FULL REPLACE CODE
   DATE COLUMN UI VERSION
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

        <select id="dpSort" style="${sel()}">
          <option value="MTD" ${
            sortBy ===
            "MTD"
              ? "selected"
              : ""
          }>MTD</option>

          <option value="DRR" ${
            sortBy ===
            "DRR"
              ? "selected"
              : ""
          }>DRR</option>
        </select>

        <select id="dpOrder" style="${sel()}">
          <option value="HIGH" ${
            order ===
            "HIGH"
              ? "selected"
              : ""
          }>HIGH</option>

          <option value="LOW" ${
            order ===
            "LOW"
              ? "selected"
              : ""
          }>LOW</option>
        </select>

        <div style="
          margin-left:auto;
          font-size:12px;
          color:#64748b;
          display:flex;
          align-items:center;
        ">
          Showing
          ${Math.min(
            limit,
            data.total
          )} /
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

            ${data.dates
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
              .join("")}
          </tr>
        </thead>

        <tbody>
          ${data.rows
            .map(
              (r) =>
                row(
                  r,
                  data.dates
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

/* ========================================== */

function row(
  r,
  dates
) {
  let prev =
    null;

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
        one(r.drr)
      )}
      ${td(
        trend(
          r.trend
        )
      )}

      ${dates
        .map((d) => {
          const v =
            r.days[d] ||
            0;

          let bg =
            "#fff";

          if (
            prev !==
            null
          ) {
            if (
              v > prev
            )
              bg =
                "#dcfce7";

            else if (
              v < prev
            )
              bg =
                "#fee2e2";

            else
              bg =
                "#f8fafc";
          }

          prev = v;

          return `
            <td style="
              padding:8px 10px;
              border-bottom:1px solid #eef2f7;
              text-align:center;
              background:${bg};
              font-weight:600;
            ">
              ${fmt(v)}
            </td>
          `;
        })
        .join("")}

    </tr>
  `;
}

/* ========================================== */

function th(t) {
  return `
    <th style="
      padding:10px;
      background:#f8fafc;
      border-bottom:1px solid #e5e7eb;
      white-space:nowrap;
      text-align:left;
    ">
      ${t}
    </th>
  `;
}

function td(t) {
  return `
    <td style="
      padding:10px;
      border-bottom:1px solid #eef2f7;
      white-space:nowrap;
    ">
      ${t || ""}
    </td>
  `;
}

/* ========================================== */

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

  if (s)
    s.onchange =
      () => {
        sortBy =
          s.value;
        renderDailyPulseReport();
      };

  if (o)
    o.onchange =
      () => {
        order =
          o.value;
        renderDailyPulseReport();
      };

  if (m)
    m.onclick =
      () => {
        limit +=
          50;
        renderDailyPulseReport();
      };
}

/* ========================================== */

function trend(t) {
  if (t === "↗")
    return `<span style="color:#16a34a;">↗</span>`;

  if (t === "↘")
    return `<span style="color:#dc2626;">↘</span>`;

  return `<span style="color:#64748b;">→</span>`;
}

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

function sel() {
  return `
    padding:10px 12px;
    border:1px solid #dbe3ee;
    border-radius:12px;
    background:#fff;
  `;
}