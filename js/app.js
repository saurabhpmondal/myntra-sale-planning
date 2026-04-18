/* ==========================================
   APP.JS
   Current Month Default Load
   Debug Logger Kept
========================================== */

/* ==========================================
   DEBUG PANEL
========================================== */

createDebugPanel();

window.onerror = function (
  msg,
  src,
  line
) {
  logDebug(
    "ERROR: " +
      msg +
      " @ " +
      line
  );
};

window.onunhandledrejection =
  function (e) {
    logDebug(
      "PROMISE: " +
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
   INIT
========================================== */

async function initApp() {
  try {
    initErrorHandler();
    initRouter();
    initEvents();
    initSearchEngine();

    subscribe(() => {
      renderAllReports();
    });

    logDebug(
      "Loading data..."
    );

    await bootstrapAppData();

    logDebug(
      "Data loaded"
    );

    populateMonthFilterFromData();

    applyDefaultLatestMonth();

    populateAllFilters();

    renderAllReports();

    logDebug(
      "Render complete"
    );
  } catch (e) {
    logDebug(
      "BOOT FAIL: " +
        (
          e.message ||
          e
        )
    );
  }
}

/* ==========================================
   DEFAULT MONTH = LATEST
========================================== */

function applyDefaultLatestMonth() {
  const month =
    document.getElementById(
      "monthFilter"
    );

  const start =
    document.getElementById(
      "startDate"
    );

  const end =
    document.getElementById(
      "endDate"
    );

  if (
    !month ||
    !month.options
      .length
  )
    return;

  /* first option already latest due desc sort */
  month.selectedIndex = 0;

  const value =
    month.value;

  if (!value) return;

  const [
    year,
    mm
  ] =
    value.split(
      "-"
    );

  const y =
    Number(year);
  const m =
    Number(mm);

  const now =
    new Date();

  const isCurrentMonth =
    now.getFullYear() ===
      y &&
    now.getMonth() +
      1 ===
      m;

  const firstDay =
    `${year}-${pad(
      mm
    )}-01`;

  let lastDay;

  if (
    isCurrentMonth
  ) {
    /* yesterday */
    const yday =
      new Date();
    yday.setDate(
      yday.getDate() -
        1
    );

    lastDay = `${yday.getFullYear()}-${pad(
      yday.getMonth() +
        1
    )}-${pad(
      yday.getDate()
    )}`;
  } else {
    const d =
      new Date(
        y,
        m,
        0
      );

    lastDay = `${year}-${pad(
      mm
    )}-${pad(
      d.getDate()
    )}`;
  }

  start.value =
    firstDay;
  end.value =
    lastDay;

  logDebug(
    "Default month: " +
      value
  );
}

/* ==========================================
   RENDER ALL
========================================== */

function renderAllReports() {
  safe(
    renderDashboard
  );
  safe(
    renderSalesReport
  );
  safe(
    renderTrafficReport
  );
  safe(
    renderProductsReport
  );
  safe(
    renderInventoryReport
  );
  safe(
    renderSjitPlanning
  );
  safe(
    renderSorPlanning
  );
  safe(
    renderExportCenter
  );
}

function safe(fn) {
  try {
    fn();
  } catch (e) {
    logDebug(
      "Render fail"
    );
  }
}

/* ==========================================
   HELPERS
========================================== */

function pad(v) {
  return String(v)
    .padStart(
      2,
      "0"
    );
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
        "170px";
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
        "6px";
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