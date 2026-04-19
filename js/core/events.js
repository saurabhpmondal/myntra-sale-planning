/* ==========================================
   File: js/core/events.js
   SAFE DAILY PULSE ENABLED
========================================== */

import { navigate } from "./router.js";
import { setFilter } from "./state.js";

import { renderDashboard } from "../reports/dashboard/index.js";
import { renderDailyPulseReport } from "../reports/daily-pulse/index.js";
import { renderSalesReport } from "../reports/sales/index.js";
import { renderSjitReport } from "../reports/sjit/index.js";
import { renderSorReport } from "../reports/sor/index.js";
import { renderExportCenter } from "../reports/export/index.js";
import { renderXrayReport } from "../reports/xray/index.js";

export function initEvents() {
  bindTabs();
  bindFilters();
  bindSearch();
}

/* TABS */
function bindTabs() {
  document
    .querySelectorAll(".tab-btn")
    .forEach((tab) => {
      tab.addEventListener(
        "click",
        async () => {
          await navigate(
            tab.dataset.tab
          );
        }
      );
    });
}

/* FILTERS */
function bindFilters() {
  bindSingle("monthFilter","month");
  bindSingle("startDate","startDate");
  bindSingle("endDate","endDate");
  bindSingle("brandFilter","brand");
  bindSingle("poTypeFilter","poType");
}

function bindSingle(id,key){
  const el=document.getElementById(id);
  if(!el) return;

  el.addEventListener("change",()=>{
    setFilter(key,el.value);
    refresh();
  });
}

/* SEARCH */
function bindSearch() {
  const el =
    document.getElementById(
      "globalSearch"
    );

  if (!el) return;

  el.addEventListener(
    "input",
    refresh
  );

  el.addEventListener(
    "keydown",
    async (e) => {
      if (e.key === "Enter") {
        await navigate("xray");
      }
    }
  );
}

/* REFRESH */
function refresh() {
  const active =
    document.querySelector(
      ".tab-panel.active"
    );

  if (!active) return;

  const id = active.id;

  if (id === "dashboard")
    renderDashboard();

  if (id === "daily-pulse")
    renderDailyPulseReport();

  if (id === "sales")
    renderSalesReport();

  if (id === "sjit")
    renderSjitReport();

  if (id === "sor")
    renderSorReport();

  if (id === "xray")
    renderXrayReport();

  if (id === "export")
    renderExportCenter();
}