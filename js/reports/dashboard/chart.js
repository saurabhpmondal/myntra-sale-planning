/* ==========================================
   DASHBOARD / CHART.JS
   Date Wise Units Chart Block
   Placeholder ready for chart engine
========================================== */

import { getDataset } from "../../core/state.js";
import { applyGlobalFilters } from "../../filters/filter-engine.js";
import {
  byId,
  num,
  fn
} from "./helpers.js";

/* ==========================================
   PUBLIC API
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
    buildDailyUnits(
      sales
    );

  if (!daily.length) {
    el.innerHTML = `
      <div class="placeholder-box large">
        No chart data available
      </div>
    `;
    return;
  }

  const top =
    Math.max(
      ...daily.map(
        (row) =>
          row.units
      ),
      1
    );

  el.innerHTML = `
    <div class="chart-card">

      <div class="chart-header">
        <div class="chart-title">
          Date Wise Units
        </div>

        <div class="chart-subtitle">
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

      <div class="bar-chart">
        ${daily
          .map(
            (row) => `
          <div class="bar-col">

            <div
              class="bar-fill"
              style="
                height:${Math.max(
                  8,
                  (row.units /
                    top) *
                    180
                )}px
              "
              title="${row.date}: ${fn(
                row.units
              )}"
            ></div>

            <div class="bar-label">
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
   DAILY GROUPING
========================================== */

function buildDailyUnits(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const key =
      row.sale_key_date ||
      row.created_on ||
      "Unknown";

    map[key] =
      (map[key] || 0) +
      num(row.qty);
  });

  return Object.entries(
    map
  )
    .map(
      ([date, units]) => ({
        date,
        day:
          extractDay(
            date
          ),
        units
      })
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(
          b.date
        )
    );
}

/* ==========================================
   HELPERS
========================================== */

function extractDay(
  date = ""
) {
  const parts =
    String(date).split(
      "-"
    );

  return (
    parts[
      parts.length - 1
    ] || date
  );
}