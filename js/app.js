/* ==========================================
   APP.JS
   Main Application Bootstrap
   Final UI Test Build Controller
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

/* ==========================================
   APP START
========================================== */

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
   MASTER RENDERER
========================================== */

function renderAllReports() {
  renderDashboard();
  renderSalesReport();
  renderTrafficReport();
  renderProductsReport();
  renderInventoryReport();
  renderSjitPlanning();
  renderSorPlanning();
  renderExportCenter();
}