window.onerror = function (
  msg,
  src,
  line,
  col,
  err
) {
  const box =
    document.createElement("div");

  box.style.position = "fixed";
  box.style.top = "0";
  box.style.left = "0";
  box.style.right = "0";
  box.style.zIndex = "99999";
  box.style.background = "#b91c1c";
  box.style.color = "#fff";
  box.style.padding = "10px";
  box.style.fontSize = "12px";
  box.style.maxHeight = "220px";
  box.style.overflow = "auto";

  box.innerText =
    "JS Error:\n" +
    msg +
    "\nLine: " +
    line +
    "\nFile: " +
    src;

  document.body.appendChild(
    box
  );
};


/* ==========================================
   APP.JS
   Stable Build + Dashboard Binding Layer
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

import { renderDashboard } from "./reports/dashboard-bind.js";

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
   MASTER RENDER
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
      fn.name,
      error
    );
  }
}