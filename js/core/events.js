/* ==========================================
   EVENTS.JS
   Global UI Event Binder
   Filters / Search / Core interactions
========================================== */

import { navigate } from "./router.js";
import { setFilter } from "./state.js";

/* ==========================================
   INIT ALL EVENTS
========================================== */

export function initEvents() {
  bindTabClicks();
  bindFilters();
  bindSearch();
}

/* ==========================================
   TAB BUTTONS
========================================== */

function bindTabClicks() {
  const buttons = document.querySelectorAll(".tab-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;

      if (!tab) return;

      navigate(tab);
    });
  });
}

/* ==========================================
   FILTERS
========================================== */

function bindFilters() {
  bindFilter("monthFilter", "month");
  bindFilter("startDate", "startDate");
  bindFilter("endDate", "endDate");
  bindFilter("brandFilter", "brand");
  bindFilter("poTypeFilter", "poType");
}

function bindFilter(elementId, stateKey) {
  const element = document.getElementById(elementId);

  if (!element) return;

  element.addEventListener("change", (event) => {
    setFilter(stateKey, event.target.value);
  });
}

/* ==========================================
   SEARCH
========================================== */

function bindSearch() {
  const input = document.getElementById("globalSearch");

  if (!input) return;

  input.addEventListener("input", (event) => {
    const value = event.target.value.trim();

    setFilter("search", value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const keyword = input.value.trim();

    if (!keyword) return;

    setFilter("search", keyword);
    navigate("products");
  });
}