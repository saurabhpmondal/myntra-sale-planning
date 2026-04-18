/* ==========================================
   APP.JS
   Final bootstrap
========================================== */

import { bootstrapAppData } from "./data/bootstrap.js";

import {
  populateAllFilters,
  populateMonthFilterFromData
} from "./filters/options.js";

import { initEvents } from "./core/events.js";
import { navigate } from "./core/router.js";

/* ==========================================
   INIT
========================================== */

async function initApp() {
  try {
    await bootstrapAppData();

    buildFilters();

    initEvents();

    navigate(
      "dashboard"
    );
  } catch (error) {
    console.error(
      "App failed",
      error
    );

    showFatal();
  }
}

/* ==========================================
   FILTERS
========================================== */

function buildFilters() {
  populateMonthFilterFromData();
  populateAllFilters();

  setDefaultMonth();
}

function setDefaultMonth() {
  const month =
    document.getElementById(
      "monthFilter"
    );

  if (
    !month ||
    !month.options
      .length
  ) {
    return;
  }

  month.selectedIndex = 0;

  month.dispatchEvent(
    new Event(
      "change"
    )
  );
}

/* ==========================================
   FATAL
========================================== */

function showFatal() {
  document.body.innerHTML = `
    <div style="
      padding:24px;
      font-family:Arial,sans-serif;
    ">
      Failed to load app
    </div>
  `;
}

/* ==========================================
   START
========================================== */

initApp();