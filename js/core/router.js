/* ==========================================
   ROUTER.JS
   Tab Navigation Router
   Keeps UI switching isolated
========================================== */

import { TAB_KEYS } from "./config.js";
import {
  setActiveTab,
  getActiveTab
} from "./state.js";

/* ==========================================
   INIT ROUTER
========================================== */

export function initRouter() {
  bindTabButtons();
  activateInitialTab();
}

/* ==========================================
   TAB BUTTON EVENTS
========================================== */

function bindTabButtons() {
  const buttons = document.querySelectorAll(".tab-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabKey = button.dataset.tab;

      if (!tabKey) return;

      navigate(tabKey);
    });
  });
}

/* ==========================================
   INITIAL TAB
========================================== */

function activateInitialTab() {
  const current = getActiveTab();

  if (TAB_KEYS.includes(current)) {
    renderTab(current);
    return;
  }

  renderTab("dashboard");
}

/* ==========================================
   NAVIGATE
========================================== */

export function navigate(tabKey = "dashboard") {
  if (!TAB_KEYS.includes(tabKey)) return;

  setActiveTab(tabKey);
  renderTab(tabKey);

  scrollToTop();
}

/* ==========================================
   RENDER TAB
========================================== */

export function renderTab(tabKey) {
  updateButtons(tabKey);
  updatePanels(tabKey);
}

/* ==========================================
   BUTTON STATE
========================================== */

function updateButtons(activeKey) {
  const buttons = document.querySelectorAll(".tab-btn");

  buttons.forEach((button) => {
    const isActive = button.dataset.tab === activeKey;

    button.classList.toggle("active", isActive);
  });
}

/* ==========================================
   PANEL STATE
========================================== */

function updatePanels(activeKey) {
  const panels = document.querySelectorAll(".tab-panel");

  panels.forEach((panel) => {
    const isActive = panel.id === activeKey;

    panel.classList.toggle("active", isActive);
  });
}

/* ==========================================
   HELPERS
========================================== */

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}