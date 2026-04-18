/* ==========================================
   APP.JS
   FULL REPLACE CODE
   FIXED DEFAULT CURRENT MONTH LOAD
   Added Progress Bar Init
========================================== */

import { bootstrapAppData } from "./data/bootstrap.js";

import {
  populateAllFilters,
  populateMonthFilterFromData
} from "./filters/options.js";

import { initEvents } from "./core/events.js";
import { navigate } from "./core/router.js";

import {
  initProgressBar
} from "./ui/progress.js";

/* ==========================================
   INIT
========================================== */

async function initApp() {
  try {
    /* prepare loader UI first */
    initProgressBar();

    await bootstrapAppData();

    /* build dropdowns */
    buildFilters();

    /* bind listeners first */
    initEvents();

    /* now apply current month */
    setDefaultMonth();

    /* render dashboard */
    await navigate(
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
    !month.options.length
  ) {
    return;
  }

  /* latest month = first option */
  month.selectedIndex = 0;

  /* trigger month logic */
  month.dispatchEvent(
    new Event(
      "change",
      { bubbles: true }
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