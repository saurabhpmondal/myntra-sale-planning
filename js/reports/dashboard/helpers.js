/* ==========================================
   DASHBOARD / HELPERS.JS
   Defensive Shared Helpers
========================================== */

import {
  formatCurrency,
  formatNumber
} from "../../core/formatters.js";

/* ==========================================
   DOM
========================================== */

export function byId(id) {
  try {
    return document.getElementById(
      id
    );
  } catch (e) {
    return null;
  }
}

export function setText(
  id,
  value
) {
  const el =
    byId(id);

  if (!el) return;

  el.textContent =
    safeText(value);
}

/* ==========================================
   NUMERIC
========================================== */

export function num(v) {
  const n =
    Number(
      String(
        v ?? 0
      ).replace(
        /,/g,
        ""
      )
    );

  return Number.isFinite(
    n
  )
    ? n
    : 0;
}

/* ==========================================
   FORMAT SAFE
========================================== */

export function fc(v) {
  try {
    return formatCurrency(
      num(v)
    );
  } catch (e) {
    return `₹${num(v).toLocaleString()}`;
  }
}

export function fn(v) {
  try {
    return formatNumber(
      num(v)
    );
  } catch (e) {
    return num(v).toLocaleString();
  }
}

/* ==========================================
   TABLE
========================================== */

export function buildTable(
  headers = [],
  rows = []
) {
  try {
    return `
      <div class="table-wrap">
        <table class="data-table zebra">
          <thead>
            <tr>
              ${headers
                .map(
                  (h) =>
                    `<th>${safeText(
                      h
                    )}</th>`
                )
                .join("")}
            </tr>
          </thead>

          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr>
                    ${row
                      .map(
                        (cell) =>
                          `<td>${safeText(
                            cell
                          )}</td>`
                      )
                      .join("")}
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (e) {
    return `
      <div class="placeholder-box small">
        Table render failed
      </div>
    `;
  }
}

/* ==========================================
   BUCKETS
========================================== */

export function getPriceBucket(
  value
) {
  const v =
    num(value);

  if (v <= 300)
    return "0-300";
  if (v <= 600)
    return "301-600";
  if (v <= 800)
    return "601-800";
  if (v <= 1000)
    return "801-1000";
  if (v <= 1500)
    return "1001-1500";
  if (v <= 2000)
    return "1501-2000";

  return ">2000";
}

export function getCoverBucket(
  value
) {
  const v =
    num(value);

  if (v < 30)
    return "<30";
  if (v <= 45)
    return "30-45";
  if (v <= 60)
    return "45-60";
  if (v <= 90)
    return "60-90";

  return ">90";
}

/* ==========================================
   TOP BRAND
========================================== */

export function topBrand(
  obj = {}
) {
  let top = "-";
  let max = 0;

  Object.entries(
    obj
  ).forEach(
    ([k, v]) => {
      const val =
        num(v);

      if (
        val > max
      ) {
        max = val;
        top = k;
      }
    }
  );

  return top;
}

/* ==========================================
   SAFE TEXT
========================================== */

function safeText(v) {
  return String(
    v ?? ""
  )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    );
}