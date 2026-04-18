/* ==========================================
   DASHBOARD / CHART.JS
   FIXED DATE WISE UNITS CHART
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
              title="${row.date} : ${fn(
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
   DAILY GROUP
========================================== */

function buildDaily(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const raw =
      row.order_date ||
      row.sale_key_date ||
      row.created_on ||
      row.date ||
      "";

    const date =
      normalize(
        raw
      );

    if (!date) return;

    map[date] =
      (map[date] || 0) +
      num(row.qty);
  });

  return Object.keys(
    map
  )
    .sort()
    .map((date) => ({
      date,
      day:
        date.split(
          "-"
        )[2],
      units:
        map[date]
    }));
}

/* ==========================================
   NORMALIZE
========================================== */

function normalize(
  val
) {
  const t =
    String(
      val || ""
    )
      .trim()
      .replaceAll(
        "/",
        "-"
      );

  const p =
    t.split("-");

  if (
    p.length !== 3
  )
    return "";

  /* yyyy-mm-dd */
  if (
    p[0].length === 4
  ) {
    return `${p[0]}-${pad(
      p[1]
    )}-${pad(
      p[2]
    )}`;
  }

  /* dd-mm-yyyy */
  return `${p[2]}-${pad(
    p[1]
  )}-${pad(
    p[0]
  )}`;
}

function pad(v) {
  return String(v)
    .padStart(
      2,
      "0"
    );
}