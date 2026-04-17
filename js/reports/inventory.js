/* ==========================================
   INVENTORY.JS
   Inventory Report Engine
   Combined view: SJIT / SOR / Seller Stock
========================================== */

import { getDataset } from "../core/state.js";
import {
  formatNumber
} from "../core/formatters.js";
import {
  sumBy
} from "../normalize/numbers.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderInventoryReport() {
  renderInventoryOverview();
  renderInventoryTables();
  renderInventoryHealth();
}

/* ==========================================
   OVERVIEW
========================================== */

function renderInventoryOverview() {
  const el =
    document.getElementById(
      "inventoryOverview"
    );

  if (!el) return;

  const sjit =
    sumBy(
      getDataset(
        "sjitStock"
      ),
      "sellable_inventory_count"
    );

  const sor =
    sumBy(
      getDataset(
        "sorStock"
      ),
      "units"
    );

  const seller =
    sumBy(
      getDataset(
        "sellerStock"
      ),
      "units"
    );

  const total =
    sjit +
    sor +
    seller;

  el.innerHTML = `
    <div class="inventory-metric-list">

      <div class="inventory-metric-item">
        <div class="inventory-metric-label">SJIT Stock</div>
        <div class="inventory-metric-value">${formatNumber(
          sjit
        )}</div>
      </div>

      <div class="inventory-metric-item">
        <div class="inventory-metric-label">SOR Stock</div>
        <div class="inventory-metric-value">${formatNumber(
          sor
        )}</div>
      </div>

      <div class="inventory-metric-item">
        <div class="inventory-metric-label">Seller Stock</div>
        <div class="inventory-metric-value">${formatNumber(
          seller
        )}</div>
      </div>

      <div class="inventory-metric-item">
        <div class="inventory-metric-label">Total Stock</div>
        <div class="inventory-metric-value">${formatNumber(
          total
        )}</div>
      </div>

    </div>
  `;
}

/* ==========================================
   HEALTH
========================================== */

function renderInventoryHealth() {
  const el =
    document.getElementById(
      "inventoryHealth"
    );

  if (!el) return;

  const sjit =
    sumBy(
      getDataset(
        "sjitStock"
      ),
      "sellable_inventory_count"
    );

  const sor =
    sumBy(
      getDataset(
        "sorStock"
      ),
      "units"
    );

  const status =
    sjit + sor > 0
      ? "Healthy"
      : "Low";

  el.innerHTML = `
    <div class="inventory-tiles">

      <div class="inventory-tile">
        <div class="inventory-tile-label">Inventory Health</div>
        <div class="inventory-tile-value">${status}</div>
      </div>

      <div class="inventory-tile">
        <div class="inventory-tile-label">SJIT Share</div>
        <div class="inventory-tile-value">${formatNumber(
          sjit
        )}</div>
      </div>

      <div class="inventory-tile">
        <div class="inventory-tile-label">SOR Share</div>
        <div class="inventory-tile-value">${formatNumber(
          sor
        )}</div>
      </div>

    </div>
  `;
}

/* ==========================================
   TABLES
========================================== */

function renderInventoryTables() {
  const wrap =
    document.getElementById(
      "inventoryTable"
    );

  if (!wrap) return;

  const sjit =
    getDataset(
      "sjitStock"
    )
      .slice(0, 15)
      .map((row) => ({
        style_id:
          row.style_id,
        source:
          "SJIT",
        units:
          row.sellable_inventory_count
      }));

  const sor =
    getDataset(
      "sorStock"
    )
      .slice(0, 15)
      .map((row) => ({
        style_id:
          row.style_id,
        source:
          "SOR",
        units:
          row.units
      }));

  const rows = [
    ...sjit,
    ...sor
  ].slice(0, 20);

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table zebra sticky-first">
        <thead>
          <tr>
            <th>Style ID</th>
            <th>Source</th>
            <th class="num">Units</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
            <tr>
              <td>${row.style_id || "-"}</td>
              <td>${row.source}</td>
              <td class="num">${formatNumber(
                row.units || 0
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