/* ==========================================
   SJIT.JS
   SJIT Planning Engine
   45 Day Cover Planning (base version)
========================================== */

import { getDataset } from "../core/state.js";
import { APP_CONFIG } from "../core/config.js";
import {
  formatNumber
} from "../core/formatters.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderSjitPlanning() {
  renderSjitOverview();
  renderSjitTable();
  renderSjitActions();
}

/* ==========================================
   OVERVIEW
========================================== */

function renderSjitOverview() {
  const el =
    document.getElementById(
      "sjitOverview"
    );

  if (!el) return;

  const sales =
    getDataset("sales");

  const stock =
    getDataset(
      "sjitStock"
    );

  const avgDaily =
    calcAvgDailySales(
      sales,
      "SJIT"
    );

  const liveStock =
    stock.reduce(
      (acc, row) =>
        acc +
        Number(
          row.sellable_inventory_count ||
            0
        ),
      0
    );

  const cover =
    avgDaily
      ? liveStock /
        avgDaily
      : 0;

  el.innerHTML = `
    <div class="sjit-metric-list">

      <div class="sjit-metric-item">
        <div class="sjit-metric-label">Live Stock</div>
        <div class="sjit-metric-value">${formatNumber(
          liveStock
        )}</div>
      </div>

      <div class="sjit-metric-item">
        <div class="sjit-metric-label">Avg Daily Sales</div>
        <div class="sjit-metric-value">${formatNumber(
          avgDaily
        )}</div>
      </div>

      <div class="sjit-metric-item">
        <div class="sjit-metric-label">Current Cover Days</div>
        <div class="sjit-metric-value">${formatNumber(
          cover
        )}</div>
      </div>

      <div class="sjit-metric-item">
        <div class="sjit-metric-label">Target Cover</div>
        <div class="sjit-metric-value">${APP_CONFIG.planning.coverDays}</div>
      </div>

    </div>
  `;
}

/* ==========================================
   ACTION BLOCKS
========================================== */

function renderSjitActions() {
  const el =
    document.getElementById(
      "sjitActions"
    );

  if (!el) return;

  const rows =
    buildPlanningRows();

  const urgent =
    rows.filter(
      (row) =>
        row.reorder_qty >
        0
    ).length;

  const totalReorder =
    rows.reduce(
      (acc, row) =>
        acc +
        row.reorder_qty,
      0
    );

  el.innerHTML = `
    <div class="sjit-tiles">

      <div class="sjit-tile">
        <div class="sjit-tile-label">Styles Need Action</div>
        <div class="sjit-tile-value">${formatNumber(
          urgent
        )}</div>
      </div>

      <div class="sjit-tile">
        <div class="sjit-tile-label">Suggested Reorder Qty</div>
        <div class="sjit-tile-value">${formatNumber(
          totalReorder
        )}</div>
      </div>

      <div class="sjit-tile">
        <div class="sjit-tile-label">Planning Window</div>
        <div class="sjit-tile-value">${APP_CONFIG.planning.coverDays} Days</div>
      </div>

    </div>
  `;
}

/* ==========================================
   TABLE
========================================== */

function renderSjitTable() {
  const wrap =
    document.getElementById(
      "sjitTable"
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
      "sjitStock"
    );

  return stock.map(
    (row) => {
      const ads =
        getStyleAds(
          row.style_id,
          "SJIT"
        );

      const live =
        Number(
          row.sellable_inventory_count ||
            0
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
  styleId,
  poType
) {
  const sales =
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
          poType
    );

  const units =
    sales.reduce(
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