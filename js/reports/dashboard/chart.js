/* ==========================================
   DASHBOARD / CHART.JS
   FIXED TO MASTER DATE COLUMNS
========================================== */

import { getDataset } from "../../core/state.js";
import { applyGlobalFilters } from "../../filters/filter-engine.js";

import {
  byId,
  num,
  fn
} from "./helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderChart() {
  const el =
    byId(
      "dashboardDailyChart"
    );

  if (!el) return;

  const rows =
    applyGlobalFilters(
      getDataset("sales")
    );

  const daily =
    buildDaily(
      rows
    );

  if (!daily.length) {
    el.innerHTML = `
      <div class="placeholder-box large">
        No chart data
      </div>
    `;
    return;
  }

  const max =
    Math.max(
      ...daily.map(
        (r) =>
          r.units
      ),
      1
    );

  const total =
    daily.reduce(
      (a, r) =>
        a +
        r.units,
      0
    );

  el.innerHTML = `
    <div class="chart-shell">

      <div class="chart-top">
        <div class="chart-head">
          Date Wise Units
        </div>

        <div class="chart-total">
          ${fn(
            total
          )} Units
        </div>
      </div>

      <div class="chart-bars">

        ${daily
          .map(
            (row) => `
          <div class="chart-col">

            <div
              class="chart-bar"
              style="
                height:${Math.max(
                  10,
                  (row.units /
                    max) *
                    220
                )}px
              "
              title="${row.label} : ${fn(
                row.units
              )}"
            ></div>

            <div class="chart-label">
              ${row.day}
            </div>

          </div>
        `
          )
          .join("")}

      </div>

    </div>
  `;
}

/* ==========================================
   GROUP DAILY
========================================== */

function buildDaily(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    if (
      !row.year ||
      !row.month ||
      !row.date
    )
      return;

    const key =
      makeDate(
        row.year,
        row.month,
        row.date
      );

    map[key] =
      (map[key] || 0) +
      num(row.qty);
  });

  return Object.keys(
    map
  )
    .sort()
    .map((key) => {
      const p =
        key.split(
          "-"
        );

      return {
        label: key,
        day: p[2],
        units:
          map[key]
      };
    });
}

function makeDate(
  y,
  m,
  d
) {
  return `${y}-${pad(
    m
  )}-${pad(
    d
  )}`;
}

function pad(v) {
  return String(v)
    .padStart(
      2,
      "0"
    );
}