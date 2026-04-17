/* ==========================================
   DASHBOARD / HELPERS.JS
   Shared helpers for dashboard modules
========================================== */

import {
  formatCurrency,
  formatNumber
} from "../../core/formatters.js";

/* ==========================================
   DOM
========================================== */

export function byId(id) {
  return document.getElementById(
    id
  );
}

export function setText(
  id,
  value
) {
  const el = byId(id);

  if (el) {
    el.textContent =
      value;
  }
}

/* ==========================================
   NUMBERS
========================================== */

export function num(v) {
  return Number(v || 0);
}

/* ==========================================
   TABLE BUILDER
========================================== */

export function buildTable(
  headers = [],
  rows = []
) {
  return `
    <div class="table-wrap">
      <table class="data-table zebra">
        <thead>
          <tr>
            ${headers
              .map(
                (header) =>
                  `<th>${header}</th>`
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
                        `<td>${cell}</td>`
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
}

/* ==========================================
   PRICE BUCKET
========================================== */

export function getPriceBucket(
  value
) {
  const v = num(value);

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

/* ==========================================
   COVER BUCKET
========================================== */

export function getCoverBucket(
  value
) {
  const v = num(value);

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
  map = {}
) {
  let winner = "-";
  let max = 0;

  Object.entries(map)
    .forEach(
      ([key, val]) => {
        if (val > max) {
          max = val;
          winner = key;
        }
      }
    );

  return winner;
}

/* ==========================================
   SHORTCUTS
========================================== */

export const fc =
  formatCurrency;

export const fn =
  formatNumber;