/* ==========================================
   APP.JS
   Main App Bootstrap
========================================== */

import { bootstrapAppData } from "./data/bootstrap.js";

import { initEvents } from "./core/events.js";

import { renderDashboard } from "./reports/dashboard/index.js";
import { renderSalesReport } from "./reports/sales/index.js";

import {
  populateAllFilters,
  populateMonthFilterFromData
} from "./filters/options.js";

/* ==========================================
   INIT
========================================== */

async function initApp() {
  try {
    await bootstrapAppData();

    populateMonthFilterFromData();
    populateAllFilters();

    setDefaultMonth();

    initEvents();
    initTabs();

    renderDashboard();
  } catch (error) {
    console.error(
      "App init failed",
      error
    );
  }
}

/* ==========================================
   TABS
========================================== */

function initTabs() {
  const buttons =
    document.querySelectorAll(
      ".tab-btn"
    );

  buttons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const tab =
            button.dataset.tab;

          switchTab(
            tab
          );
        }
      );
    }
  );
}

function switchTab(tab) {
  const panels =
    document.querySelectorAll(
      ".tab-panel"
    );

  const buttons =
    document.querySelectorAll(
      ".tab-btn"
    );

  panels.forEach(
    (panel) => {
      panel.classList.remove(
        "active"
      );
    }
  );

  buttons.forEach(
    (btn) => {
      btn.classList.remove(
        "active"
      );
    }
  );

  const target =
    document.getElementById(
      tab
    );

  const activeBtn =
    document.querySelector(
      `.tab-btn[data-tab="${tab}"]`
    );

  if (target) {
    target.classList.add(
      "active"
    );
  }

  if (activeBtn) {
    activeBtn.classList.add(
      "active"
    );
  }

  renderTab(tab);
}

/* ==========================================
   TAB RENDERERS
========================================== */

function renderTab(tab) {
  if (
    tab ===
    "dashboard"
  ) {
    renderDashboard();
    return;
  }

  if (
    tab === "sales"
  ) {
    renderSalesReport();
    return;
  }
}

/* ==========================================
   DEFAULT MONTH
========================================== */

function setDefaultMonth() {
  const month =
    document.getElementById(
      "monthFilter"
    );

  if (
    !month ||
    !month.options
      .length
  )
    return;

  month.selectedIndex = 0;

  month.dispatchEvent(
    new Event(
      "change"
    )
  );
}

/* ==========================================
   START
========================================== */

initApp();