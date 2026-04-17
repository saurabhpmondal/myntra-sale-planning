/* ==========================================
   SOR.JS
   SOR Planning Engine
   45 Day Cover Planning
========================================== */

import { getDataset } from "../core/state.js";
import { APP_CONFIG } from "../core/config.js";
import { formatNumber } from "../core/formatters.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderSorPlanning() {
  renderSorOverview();
  renderSorActions();
  renderSorTable();
}

/* ==========================================
   OVERVIEW
========================================== */

function renderSorOverview() {
  const el =
    document.getElementById(
      "sorOverview"
    );

  if (!el) return;

  const stock =
    getDataset(
      "sorStock"
    );

  const sales =
    getDataset(
      "sales"
    );

  const liveStock =
    stock.reduce(
      (acc, row) =>
        acc +
        Number(
          row.units || 0
        ),
      0
    );

  const avgDaily =
    calcAvgDailySales(
      sales,
      "SOR"
    );

  const cover =
    avgDaily
      ? liveStock /
        avgDaily
      : 0;

  el.innerHTML = `
    <div class="sor-metric-list">

      <div class="sor-metric-item">
        <div class="sor-metric-label">Live Stock</div>
        <div class="sor-metric-value">${formatNumber(
          liveStock
        )}</div>
      </div>

      <div class="sor-metric-item">
        <div class="sor-metric-label">Avg Daily Sales</div>
        <div class="sor-metric-value">${formatNumber(
          avgDaily
        )}</div>
      </div>

      <div class="sor-metric-item">
        <div class="sor-metric-label">Current Cover</div>
        <div class="sor-metric-value">${formatNumber(
          cover
        )}</div>
      </div>

      <div class="sor-metric-item">
        <div class="sor-metric-label">Target Cover</div>
        <div class="sor-metric-value">${APP_CONFIG.planning.coverDays} Days</div>
      </div>

    </div>
  `;
}

/* ==========================================
   ACTIONS
========================================== */

function renderSorActions() {
  const el =
    document.getElementById(
      "sorActions"
    );

  if (!el) return;

  const rows =
    buildPlanningRows();

  const stylesNeed =
    rows.filter(
      (row) =>
        row.reorder_qty >
        0
    ).length;

  const totalNeed =
    rows.reduce(
      (acc, row) =>
        acc +
        row.reorder_qty,
      0
    );

  el.innerHTML = `
    <div class="sor-tiles">

      <div class="sor-tile">
        <div class="sor-tile-label">Styles Need Action</div>
        <div class="sor-tile-value">${formatNumber(
          stylesNeed
        )}</div>
      </div>

      <div class="sor-tile">
        <div class="sor-tile-label">Suggested Qty</div>
        <div class="sor-tile-value">${formatNumber(
          totalNeed
        )}</div>
      </div>

      <div class="sor-tile">
        <div class="sor-tile-label">Planning Window</div>
        <div class="sor-tile-value">${APP_CONFIG.planning.coverDays} Days</div>
      </div>

    </div>
  `;
}

/* ==========================================
   TABLE
========================================== */

function renderSorTable() {
  const wrap =
    document.getElementById(
      "sorTable"
    );

  if (!wrap) return;

  const rows =
    buildPlanningRows()
      .sort(
        (a, b) =>
          b.reorder_qty -
          a.reorder_qty
      )
      .slice(0, 25);

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table wide zebra sticky-first">
        <thead>
          <tr>
            <th>Style ID</th>
            <th class="num">Stock</th>
            <th class="num">ADS</th>
            <th class="num">Need 45D</th>
            <th class="num">Reorder</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
            <tr>
              <td>${row.style_id}</td>
              <td class="num">${formatNumber(
                row.stock
              )}</td>
              <td class="num">${formatNumber(
                row.ads
              )}</td>
              <td class="num">${formatNumber(
                row.need_qty
              )}</td>
              <td class="num">${formatNumber(
                row.reorder_qty
              )}</td>
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
   LOGIC
========================================== */

function buildPlanningRows() {
  const stock =
    getDataset(
      "sorStock"
    );

  return stock.map(
    (row) => {
      const ads =
        getStyleAds(
          row.style_id
        );

      const live =
        Number(
          row.units || 0
        );

      const need =
        Math.ceil(
          ads *
            APP_CONFIG
              .planning
              .coverDays
        );

      const reorder =
        Math.max(
          need - live,
          0
        );

      return {
        style_id:
          row.style_id,
        stock: live,
        ads,
        need_qty:
          need,
        reorder_qty:
          reorder
      };
    }
  );
}

function getStyleAds(
  styleId
) {
  const rows =
    getDataset(
      "sales"
    ).filter(
      (row) =>
        String(
          row.style_id
        ) ===
          String(
            styleId
          ) &&
        row.po_type ===
          "SOR"
    );

  const units =
    rows.reduce(
      (acc, row) =>
        acc +
        Number(
          row.qty || 0
        ),
      0
    );

  return units / 30;
}

function calcAvgDailySales(
  rows,
  poType
) {
  const units =
    rows
      .filter(
        (row) =>
          row.po_type ===
          poType
      )
      .reduce(
        (acc, row) =>
          acc +
          Number(
            row.qty || 0
          ),
        0
      );

  return units / 30;
}