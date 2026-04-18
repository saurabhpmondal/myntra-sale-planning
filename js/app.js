/* ==========================================
   APP.JS
   DEBUG RECOVERY BUILD
========================================== */

/* ==========================================
   GLOBAL DEBUG PANEL
========================================== */

createDebugPanel();

window.onerror = function (
  msg,
  src,
  line,
  col,
  err
) {
  logDebug(
    "ERROR: " +
      msg +
      " | line " +
      line
  );
};

window.onunhandledrejection =
  function (e) {
    logDebug(
      "PROMISE ERROR: " +
        (
          e.reason?.message ||
          e.reason ||
          "unknown"
        )
    );
  };

/* ==========================================
   IMPORTS
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

import { renderDashboard } from "./reports/dashboard-bind.js";
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

/* ==========================================
   MAIN
========================================== */

async function initApp() {
  logDebug(
    "STEP 1 DOM Ready"
  );

  try {
    initErrorHandler();
    logDebug(
      "STEP 2 ErrorHandler OK"
    );
  } catch (e) {
    logDebug(
      "FAIL initErrorHandler"
    );
  }

  try {
    initRouter();
    logDebug(
      "STEP 3 Router OK"
    );
  } catch (e) {
    logDebug(
      "FAIL initRouter"
    );
  }

  try {
    initEvents();
    logDebug(
      "STEP 4 Events OK"
    );
  } catch (e) {
    logDebug(
      "FAIL initEvents"
    );
  }

  try {
    initSearchEngine();
    logDebug(
      "STEP 5 Search OK"
    );
  } catch (e) {
    logDebug(
      "FAIL initSearch"
    );
  }

  try {
    subscribe(() => {
      renderAllReports();
    });

    logDebug(
      "STEP 6 Subscribe OK"
    );
  } catch (e) {
    logDebug(
      "FAIL subscribe"
    );
  }

  try {
    logDebug(
      "STEP 7 Loading Data..."
    );

    await bootstrapAppData();

    logDebug(
      "STEP 8 Data Loaded"
    );
  } catch (e) {
    logDebug(
      "FAIL bootstrapAppData: " +
        (
          e.message ||
          e
        )
    );
    return;
  }

  try {
    populateMonthFilterFromData();
    logDebug(
      "STEP 9 Month Filter OK"
    );
  } catch (e) {
    logDebug(
      "FAIL month filter"
    );
  }

  try {
    populateAllFilters();
    logDebug(
      "STEP 10 All Filters OK"
    );
  } catch (e) {
    logDebug(
      "FAIL all filters"
    );
  }

  renderAllReports();

  logDebug(
    "STEP 11 Render Complete"
  );
}

/* ==========================================
   RENDER
========================================== */

function renderAllReports() {
  safe(
    renderDashboard,
    "dashboard"
  );
  safe(
    renderSalesReport,
    "sales"
  );
  safe(
    renderTrafficReport,
    "traffic"
  );
  safe(
    renderProductsReport,
    "products"
  );
  safe(
    renderInventoryReport,
    "inventory"
  );
  safe(
    renderSjitPlanning,
    "sjit"
  );
  safe(
    renderSorPlanning,
    "sor"
  );
  safe(
    renderExportCenter,
    "export"
  );
}

function safe(
  fn,
  name
) {
  try {
    fn();
  } catch (e) {
    logDebug(
      "FAIL render " +
        name
    );
  }
}

/* ==========================================
   DEBUG UI
========================================== */

function createDebugPanel() {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      const box =
        document.createElement(
          "div"
        );

      box.id =
        "debugPanel";

      box.style.position =
        "fixed";
      box.style.bottom =
        "0";
      box.style.left =
        "0";
      box.style.right =
        "0";
      box.style.maxHeight =
        "220px";
      box.style.overflow =
        "auto";
      box.style.zIndex =
        "99999";
      box.style.background =
        "#111";
      box.style.color =
        "#0f0";
      box.style.fontSize =
        "11px";
      box.style.padding =
        "8px";
      box.style.fontFamily =
        "monospace";

      document.body.appendChild(
        box
      );
    }
  );
}

function logDebug(
  text
) {
  const box =
    document.getElementById(
      "debugPanel"
    );

  if (!box) return;

  box.innerHTML +=
    "<div>" +
    text +
    "</div>";
}