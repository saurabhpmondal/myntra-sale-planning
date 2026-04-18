/* ==========================================
   File: js/app.js
   FULL REPLACE CODE
   Boot + Traffic Ready
========================================== */

import { loadInitialData } from "./data/loader.js";
import { initEvents } from "./core/events.js";
import { navigate } from "./core/router.js";

import {
  initFilters
} from "./filters/init.js";

/* ==========================================
   BOOT
========================================== */

async function boot() {
  try {
    showLoading();

    await loadInitialData();

    initFilters();

    initEvents();

    navigate(
      "dashboard"
    );

    hideLoading();
  } catch (error) {
    console.error(
      error
    );

    showError(
      "Failed to load data"
    );
  }
}

boot();

/* ==========================================
   UI HELPERS
========================================== */

function showLoading() {
  document.body.classList.add(
    "app-loading"
  );
}

function hideLoading() {
  document.body.classList.remove(
    "app-loading"
  );
}

function showError(msg) {
  const root =
    document.querySelector(
      ".app-main"
    );

  if (!root)
    return;

  root.innerHTML = `
    <section class="tab-panel active">
      <div class="panel-card">
        <div class="placeholder-box large">
          ${msg}
        </div>
      </div>
    </section>
  `;
}