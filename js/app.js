/* ==========================================
   APP.JS
   Stable Recovery Build
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
   REPORTS
========================================== */

/* ROLLBACK TO STABLE FILE */
import { renderDashboard } from "./reports/dashboard.js";

import { renderSalesReport } from "./reports/sales.js";
import { renderTrafficReport } from "./reports/traffic.js";
import { renderProductsReport } from "./reports/products.js";
import { renderInventoryReport } from "./reports/inventory.js";
import { renderSjitPlanning } from "./reports/sjit.js";
import { renderSorPlanning } from "./reports/sor.js";
import { renderExportCenter } from "./reports/export.js";

/* ==========================================
   INIT
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  initApp
);

async function initApp() {
  initErrorHandler();
  initRouter();
  initEvents();
  initSearchEngine();

  subscribe(() => {
    renderAllReports();
  });

  await bootstrapAppData();

  populateMonthFilterFromData();
  populateAllFilters();

  renderAllReports();
}

/* ==========================================
   RENDER ALL
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
    console.error(fn.name, error);
  }
}