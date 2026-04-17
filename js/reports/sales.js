/* ==========================================
   SALES.JS
   Sales Report Engine
   Month on Month / Brand / Product tables
========================================== */

import { getDataset } from "../core/state.js";
import { applyGlobalFilters } from "../filters/filter-engine.js";
import {
  formatCurrency,
  formatNumber,
  formatPercent
} from "../core/formatters.js";
import {
  sumBy
} from "../normalize/numbers.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderSalesReport() {
  renderSalesOverview();
  renderBrandSalesTable();
  renderTopProductsTable();
}

/* ==========================================
   OVERVIEW
========================================== */

function renderSalesOverview() {
  const el =
    document.getElementById(
      "salesOverview"
    );

  if (!el) return;

  const rows =
    applyGlobalFilters(
      getDataset("sales")
    );

  const revenue =
    sumBy(
      rows,
      "final_amount"
    );

  const units =
    sumBy(
      rows,
      "qty"
    );

  const asp =
    units
      ? revenue /
        units
      : 0;

  el.innerHTML = `
    <div class="sales-metric-list">
      <div class="sales-metric-item">
        <div class="sales-metric-label">Revenue</div>
        <div class="sales-metric-value">${formatCurrency(
          revenue
        )}</div>
      </div>

      <div class="sales-metric-item">
        <div class="sales-metric-label">Units</div>
        <div class="sales-metric-value">${formatNumber(
          units
        )}</div>
      </div>

      <div class="sales-metric-item">
        <div class="sales-metric-label">ASP</div>
        <div class="sales-metric-value">${formatCurrency(
          asp
        )}</div>
      </div>
    </div>
  `;
}

/* ==========================================
   BRAND TABLE
========================================== */

function renderBrandSalesTable() {
  const wrap =
    document.getElementById(
      "salesBrandTable"
    );

  if (!wrap) return;

  const rows =
    applyGlobalFilters(
      getDataset("sales")
    );

  const map = {};

  rows.forEach((row) => {
    const brand =
      row.brand ||
      "Unknown";

    if (!map[brand]) {
      map[brand] = {
        units: 0,
        revenue: 0
      };
    }

    map[brand].units +=
      Number(
        row.qty || 0
      );

    map[
      brand
    ].revenue +=
      Number(
        row.final_amount ||
          0
      );
  });

  const data =
    Object.entries(map)
      .map(
        ([
          brand,
          value
        ]) => ({
          brand,
          ...value
        })
      )
      .sort(
        (a, b) =>
          b.revenue -
          a.revenue
      )
      .slice(0, 10);

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table compact zebra">
        <thead>
          <tr>
            <th>Brand</th>
            <th class="num">Units</th>
            <th class="num">Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              <td>${row.brand}</td>
              <td class="num">${formatNumber(
                row.units
              )}</td>
              <td class="num">${formatCurrency(
                row.revenue
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
   TOP PRODUCTS
========================================== */

function renderTopProductsTable() {
  const wrap =
    document.getElementById(
      "salesProductTable"
    );

  if (!wrap) return;

  const rows =
    applyGlobalFilters(
      getDataset("sales")
    );

  const map = {};

  rows.forEach((row) => {
    const key =
      row.style_id ||
      "Unknown";

    if (!map[key]) {
      map[key] = {
        style_id:
          key,
        units: 0,
        revenue: 0
      };
    }

    map[key].units +=
      Number(
        row.qty || 0
      );

    map[
      key
    ].revenue +=
      Number(
        row.final_amount ||
          0
      );
  });

  const data =
    Object.values(map)
      .sort(
        (a, b) =>
          b.units -
          a.units
      )
      .slice(0, 10);

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table wide zebra sticky-first">
        <thead>
          <tr>
            <th>Style ID</th>
            <th class="num">Units</th>
            <th class="num">Revenue</th>
            <th class="num">Share%</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              <td>${row.style_id}</td>
              <td class="num">${formatNumber(
                row.units
              )}</td>
              <td class="num">${formatCurrency(
                row.revenue
              )}</td>
              <td class="num">${formatPercent(
                (
                  row.units /
                  (sumBy(
                    data,
                    "units"
                  ) ||
                    1)
                ) *
                  100
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