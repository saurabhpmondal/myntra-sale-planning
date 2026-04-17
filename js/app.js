/* ==========================================
   APP.JS
   Safe Recovery Bootstrap
========================================== */

import { initRouter } from "./core/router.js";
import { initEvents } from "./core/events.js";
import { initErrorHandler } from "./core/error-handler.js";
import { subscribe } from "./core/state.js";

import { bootstrapAppData } from "./data/bootstrap.js";

import {
  populateAllFilters,
  populateMonthFilterFromData
} from "./filters/options.js";

import { initSearchEngine } from "./filters/search.js";

/* ==========================================
   REPORT IMPORTS
========================================== */

import { renderDashboard } from "./reports/dashboard/index.js";
import { renderSalesReport } from "./reports/sales.js";
import { renderTrafficReport } from "./reports/traffic.js";
import { renderProductsReport } from "./reports/products.js";
import { renderInventoryReport } from "./reports/inventory.js";
import { renderSjitPlanning } from "./reports/sjit.js";
import { renderSorPlanning } from "./reports/sor.js";
import { renderExportCenter } from "./reports/export.js";

/* ==========================================
   START
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  initApp
);

async function initApp() {
  try {
    initErrorHandler();
  } catch (e) {}

  try {
    initRouter();
  } catch (e) {}

  try {
    initEvents();
  } catch (e) {}

  try {
    initSearchEngine();
  } catch (e) {}

  try {
    subscribe(() => {
      renderAllReports();
    });
  } catch (e) {}

  /* ===============================
     CRITICAL DATA LOAD
  =============================== */

  try {
    await bootstrapAppData();
  } catch (error) {
    console.error(
      "Data bootstrap failed",
      error
    );

    showBootError();
    return;
  }

  /* ===============================
     FILTERS
  =============================== */

  try {
    populateMonthFilterFromData();
  } catch (e) {}

  try {
    populateAllFilters();
  } catch (e) {}

  /* ===============================
     RENDER
  =============================== */

  renderAllReports();
}

/* ==========================================
   SAFE RENDER ALL
========================================== */

function renderAllReports() {
  safe(renderDashboard);
  safe(renderSalesReport);
  safe(renderTrafficReport);
  safe(renderProductsReport);
  safe(renderInventoryReport);
  safe(renderSjitPlanning);
  safe(renderSorPlanning);
  safe(renderExportCenter);
}

function safe(fn) {
  try {
    fn();
  } catch (error) {
    console.error(
      "Render failed:",
      fn.name,
      error
    );
  }
}

/* ==========================================
   UI ERROR
========================================== */

function showBootError() {
  const box =
    document.getElementById(
      "dashboardDailyChart"
    );

  if (!box) return;

  box.innerHTML = `
    <div class="placeholder-box large">
      Data loading failed.
      Check file paths / sheet access.
    </div>
  `;
}