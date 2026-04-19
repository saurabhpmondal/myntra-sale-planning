/* ==========================================
   File: js/reports/daily-pulse/index.js
   FULL REPLACE CODE
   DAILY PULSE UI
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
    );

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
          <option ${
            sortBy ===
            "MTD"
              ? "selected"
              : ""
          }>
            MTD
          </option>

          <option ${
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
          <option ${
            order ===
            "HIGH"
              ? "selected"
              : ""
          }>
            HIGH
          </option>

          <option ${
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

    ${table(data)}

    ${
      limit <
      data.total
        ? `
      <div style="
        margin-top:12px;
      ">
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

  bindEvents();
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
            ${th(
              "Style ID",
              true
            )}
            ${th(
              "ERP",
              true
            )}
            ${th(
              "Brand"
            )}
            ${th(
              "Status"
            )}
            ${th(
              "MTD"
            )}
            ${th(
              "DRR"
            )}
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
                rowHtml(
                  r,
                  data.dates
                )
            )
            .join("")}
        </tbody>

      </table>
    </div>
  `;
}

function rowHtml(
  r,
  dates
) {
  let prev =
    null;

  return `
    <tr>

      ${td(
        r.styleId,
        true
      )}

      ${td(
        r.erp,
        true
      )}

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

      ${dates
        .map((d) => {
          const val =
            r.days[d];

          const cell =
            pulseCell(
              val,
              prev
            );

          prev =
            val;

          return cell;
        })
        .join("")}

    </tr>
  `;
}

/* ==========================================
   CELL COLORS
========================================== */

function pulseCell(
  val,
  prev
) {
  let bg =
    "#f8fafc";

  if (
    val === 0
  ) {
    bg =
      "#f1f5f9";
  } else if (
    prev !==
      null
  ) {
    if (
      val > prev
    )
      bg =
        "#dcfce7";

    else if (
      val < prev
    )
      bg =
        "#fee2e2";
  }

  return `
    <td style="
      padding:8px 10px;
      text-align:center;
      border-bottom:1px solid #eef2f7;
      background:${bg};
      font-weight:600;
    ">
      ${fmt(val)}
    </td>
  `;
}

/* ==========================================
   HEADERS / CELLS
========================================== */

function th(
  text,
  sticky =
    false
) {
  return `
    <th style="
      padding:10px;
      background:#f8fafc;
      border-bottom:1px solid #e5e7eb;
      position:sticky;
      top:0;
      ${
        sticky
          ? stickyCss(
              text ===
                "ERP"
                ? 110
                : 0
            )
          : ""
      }
      z-index:2;
      white-space:nowrap;
    ">
      ${text}
    </th>
  `;
}

function td(
  text,
  sticky =
    false
) {
  return `
    <td style="
      padding:8px 10px;
      border-bottom:1px solid #eef2f7;
      white-space:nowrap;
      background:#fff;
      ${
        sticky
          ? stickyCss(
              text ===
                ""
                ? 110
                : 0
            )
          : ""
      }
    ">
      ${text}
    </td>
  `;
}

function stickyCss(
  left
) {
  return `
    position:sticky;
    left:${left}px;
    z-index:1;
    background:#fff;
  `;
}

/* ==========================================
   EVENTS
========================================== */

function bindEvents() {
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