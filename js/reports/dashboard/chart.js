/* ==========================================
   DASHBOARD / CHART.JS
   Precision Fix Chart
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

  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const daily =
    buildDailyData(
      sales
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

  el.innerHTML = `
    <div class="chart-shell">

      <div class="chart-top">
        <div class="chart-head">
          Date Wise Units
        </div>

        <div class="chart-total">
          ${fn(
            daily.reduce(
              (a, r) =>
                a +
                r.units,
              0
            )
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
              style="height:${Math.max(
                12,
                (row.units /
                  max) *
                  220
              )}px"
              title="${row.label}: ${fn(
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
   BUILD DAILY
========================================== */

function buildDailyData(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const raw =
      row.sale_key_date ||
      row.created_on ||
      row.date ||
      "";

    const key =
      normalizeDate(
        raw
      );

    if (!key) return;

    map[key] =
      (map[key] || 0) +
      num(row.qty);
  });

  return Object.keys(
    map
  )
    .sort()
    .map((key) => ({
      label: key,
      day:
        key.split(
          "-"
        )[2],
      units:
        map[key]
    }));
}

/* ==========================================
   NORMALIZE DATE
========================================== */

function normalizeDate(
  value = ""
) {
  const text =
    String(value)
      .trim()
      .replaceAll(
        "/",
        "-"
      );

  const parts =
    text.split("-");

  if (
    parts.length === 3
  ) {
    /* already yyyy-mm-dd */
    if (
      parts[0]
        .length === 4
    ) {
      return `${parts[0]}-${pad(
        parts[1]
      )}-${pad(
        parts[2]
      )}`;
    }

    /* dd-mm-yyyy */
    return `${parts[2]}-${pad(
      parts[1]
    )}-${pad(
      parts[0]
    )}`;
  }

  return "";
}

function pad(v) {
  return String(v).padStart(
    2,
    "0"
  );
}