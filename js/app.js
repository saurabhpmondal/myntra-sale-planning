/* ==========================================
   APP.JS
   FIX DEFAULT MONTH LOAD
========================================== */

/* DEBUG KEPT */
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

/* IMPORTS */
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

/* START */
document.addEventListener(
  "DOMContentLoaded",
  initApp
);

async function initApp() {
  try {
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

    forceLatestMonth();

    renderAllReports();

    logDebug(
      "APP READY"
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
   FORCE CURRENT / LATEST MONTH
========================================== */

function forceLatestMonth() {
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

  month.selectedIndex = 0;

  const val =
    month.value;

  const [
    year,
    mm
  ] =
    val.split("-");

  const today =
    new Date();

  const current =
    today.getFullYear() ===
      Number(year) &&
    today.getMonth() +
      1 ===
      Number(mm);

  start.value =
    `${year}-${mm}-01`;

  if (current) {
    const y =
      new Date();
    y.setDate(
      y.getDate() - 1
    );

    end.value =
      `${y.getFullYear()}-${pad(
        y.getMonth() +
          1
      )}-${pad(
        y.getDate()
      )}`;
  } else {
    const last =
      new Date(
        Number(year),
        Number(mm),
        0
      );

    end.value =
      `${year}-${mm}-${pad(
        last.getDate()
      )}`;
  }

  /* force change event */
  month.dispatchEvent(
    new Event(
      "change"
    )
  );

  start.dispatchEvent(
    new Event(
      "change"
    )
  );

  end.dispatchEvent(
    new Event(
      "change"
    )
  );

  logDebug(
    "DEFAULT " +
      val
  );
}

/* ==========================================
   RENDER
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
      "FAIL render"
    );
  }
}

function pad(v) {
  return String(v)
    .padStart(
      2,
      "0"
    );
}

/* DEBUG */
function createDebugPanel() {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      const d =
        document.createElement(
          "div"
        );

      d.id =
        "debugPanel";

      d.style.position =
        "fixed";
      d.style.bottom =
        "0";
      d.style.left =
        "0";
      d.style.right =
        "0";
      d.style.maxHeight =
        "160px";
      d.style.overflow =
        "auto";
      d.style.zIndex =
        "99999";
      d.style.background =
        "#111";
      d.style.color =
        "#0f0";
      d.style.fontSize =
        "11px";
      d.style.padding =
        "6px";
      d.style.fontFamily =
        "monospace";

      document.body.appendChild(
        d
      );
    }
  );
}

function logDebug(
  t
) {
  const d =
    document.getElementById(
      "debugPanel"
    );

  if (!d) return;

  d.innerHTML +=
    "<div>" +
    t +
    "</div>";
}