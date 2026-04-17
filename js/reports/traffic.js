/* ==========================================
   TRAFFIC.JS
   Traffic Report Engine
   Impressions / Clicks / Conversion / Styles
========================================== */

import { getDataset } from "../core/state.js";
import { applyGlobalFilters } from "../filters/filter-engine.js";
import {
  formatNumber,
  formatPercent
} from "../core/formatters.js";
import {
  sumBy
} from "../normalize/numbers.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderTrafficReport() {
  renderTrafficOverview();
  renderTrafficTopStyles();
  renderTrafficBrandTable();
}

/* ==========================================
   OVERVIEW
========================================== */

function renderTrafficOverview() {
  const el =
    document.getElementById(
      "trafficOverview"
    );

  if (!el) return;

  const rows =
    applyGlobalFilters(
      getDataset("traffic")
    );

  const impressions =
    sumBy(
      rows,
      "impressions"
    );

  const clicks =
    sumBy(
      rows,
      "clicks"
    );

  const atc =
    sumBy(
      rows,
      "add_to_carts"
    );

  const purchases =
    sumBy(
      rows,
      "purchases"
    );

  const ctr =
    impressions
      ? (clicks /
          impressions) *
        100
      : 0;

  const cvr =
    clicks
      ? (purchases /
          clicks) *
        100
      : 0;

  el.innerHTML = `
    <div class="traffic-kpi-list">

      <div class="traffic-kpi-item">
        <div class="traffic-kpi-label">Impressions</div>
        <div class="traffic-kpi-value">${formatNumber(
          impressions
        )}</div>
      </div>

      <div class="traffic-kpi-item">
        <div class="traffic-kpi-label">Clicks</div>
        <div class="traffic-kpi-value">${formatNumber(
          clicks
        )}</div>
      </div>

      <div class="traffic-kpi-item">
        <div class="traffic-kpi-label">CTR</div>
        <div class="traffic-kpi-value">${formatPercent(
          ctr
        )}</div>
      </div>

      <div class="traffic-kpi-item">
        <div class="traffic-kpi-label">Purchases</div>
        <div class="traffic-kpi-value">${formatNumber(
          purchases
        )}</div>
      </div>

      <div class="traffic-kpi-item">
        <div class="traffic-kpi-label">CVR</div>
        <div class="traffic-kpi-value">${formatPercent(
          cvr
        )}</div>
      </div>

      <div class="traffic-kpi-item">
        <div class="traffic-kpi-label">Add To Cart</div>
        <div class="traffic-kpi-value">${formatNumber(
          atc
        )}</div>
      </div>

    </div>
  `;
}

/* ==========================================
   TOP STYLES
========================================== */

function renderTrafficTopStyles() {
  const wrap =
    document.getElementById(
      "trafficTopStyles"
    );

  if (!wrap) return;

  const rows =
    applyGlobalFilters(
      getDataset("traffic")
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
        impressions: 0,
        clicks: 0,
        purchases: 0
      };
    }

    map[
      key
    ].impressions +=
      Number(
        row.impressions ||
          0
      );

    map[
      key
    ].clicks +=
      Number(
        row.clicks || 0
      );

    map[
      key
    ].purchases +=
      Number(
        row.purchases ||
          0
      );
  });

  const data =
    Object.values(map)
      .sort(
        (a, b) =>
          b.clicks -
          a.clicks
      )
      .slice(0, 10);

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table wide zebra sticky-first">
        <thead>
          <tr>
            <th>Style ID</th>
            <th class="num">Impr.</th>
            <th class="num">Clicks</th>
            <th class="num">Purchases</th>
            <th class="num">CTR%</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              <td>${row.style_id}</td>
              <td class="num">${formatNumber(
                row.impressions
              )}</td>
              <td class="num">${formatNumber(
                row.clicks
              )}</td>
              <td class="num">${formatNumber(
                row.purchases
              )}</td>
              <td class="num">${formatPercent(
                row.impressions
                  ? (row.clicks /
                      row.impressions) *
                      100
                  : 0
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
   BRAND TABLE
========================================== */

function renderTrafficBrandTable() {
  const wrap =
    document.getElementById(
      "trafficBrandTable"
    );

  if (!wrap) return;

  const rows =
    applyGlobalFilters(
      getDataset("traffic")
    );

  const map = {};

  rows.forEach((row) => {
    const brand =
      row.brand ||
      "Unknown";

    if (!map[brand]) {
      map[brand] = {
        brand,
        impressions: 0,
        clicks: 0
      };
    }

    map[
      brand
    ].impressions +=
      Number(
        row.impressions ||
          0
      );

    map[
      brand
    ].clicks +=
      Number(
        row.clicks || 0
      );
  });

  const data =
    Object.values(map)
      .sort(
        (a, b) =>
          b.impressions -
          a.impressions
      )
      .slice(0, 10);

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table compact zebra">
        <thead>
          <tr>
            <th>Brand</th>
            <th class="num">Impr.</th>
            <th class="num">Clicks</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              <td>${row.brand}</td>
              <td class="num">${formatNumber(
                row.impressions
              )}</td>
              <td class="num">${formatNumber(
                row.clicks
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