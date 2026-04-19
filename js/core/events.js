/* ==========================================
   File: js/core/events.js
   FULL REPLACE CODE
   Added Style X-Ray Refresh Support
========================================== */

import { navigate } from "./router.js";
import { setFilter } from "./state.js";

import { renderDashboard } from "../reports/dashboard/index.js";
import { renderSalesReport } from "../reports/sales/index.js";
import { renderSjitReport } from "../reports/sjit/index.js";
import { renderSorReport } from "../reports/sor/index.js";
import { renderExportCenter } from "../reports/export/index.js";
import { renderXrayReport } from "../reports/xray/index.js";

/* ==========================================
   PUBLIC
========================================== */

export function initEvents() {
  bindTabs();
  bindFilters();
  bindSearch();
}

/* ==========================================
   TABS
========================================== */

function bindTabs() {
  const tabs =
    document.querySelectorAll(
      ".tab-btn"
    );

  tabs.forEach((tab) => {
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

/* ==========================================
   FILTERS
========================================== */

function bindFilters() {
  bindMonth();

  bindSingle(
    "startDate",
    "startDate"
  );

  bindSingle(
    "endDate",
    "endDate"
  );

  bindSingle(
    "brandFilter",
    "brand"
  );

  bindSingle(
    "poTypeFilter",
    "poType"
  );
}

function bindMonth() {
  const el =
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

  if (!el) return;

  el.addEventListener(
    "change",
    () => {
      const val =
        el.value;

      setFilter(
        "month",
        val
      );

      if (
        val &&
        start &&
        end
      ) {
        const [
          year,
          mm
        ] =
          val.split("-");

        const y =
          Number(year);

        const m =
          Number(mm);

        start.value =
          `${year}-${pad(mm)}-01`;

        const now =
          new Date();

        const isCurrent =
          now.getFullYear() === y &&
          now.getMonth() + 1 === m;

        if (
          isCurrent
        ) {
          const d =
            new Date();

          d.setDate(
            d.getDate() - 1
          );

          end.value =
            `${d.getFullYear()}-${pad(
              d.getMonth() + 1
            )}-${pad(
              d.getDate()
            )}`;
        } else {
          const last =
            new Date(
              y,
              m,
              0
            );

          end.value =
            `${year}-${pad(mm)}-${pad(
              last.getDate()
            )}`;
        }

        setFilter(
          "startDate",
          start.value
        );

        setFilter(
          "endDate",
          end.value
        );
      }

      refresh();
    }
  );
}

function bindSingle(
  id,
  key
) {
  const el =
    document.getElementById(id);

  if (!el) return;

  el.addEventListener(
    "change",
    () => {
      setFilter(
        key,
        el.value
      );

      refresh();
    }
  );
}

/* ==========================================
   SEARCH
========================================== */

function bindSearch() {
  const el =
    document.getElementById(
      "globalSearch"
    );

  if (!el) return;

  el.addEventListener(
    "input",
    () => {
      setFilter(
        "search",
        el.value.trim()
      );

      refresh();
    }
  );

  el.addEventListener(
    "keydown",
    async (event) => {
      if (
        event.key ===
        "Enter"
      ) {
        await navigate(
          "xray"
        );
      }
    }
  );
}

/* ==========================================
   REFRESH
========================================== */

function refresh() {
  const active =
    document.querySelector(
      ".tab-panel.active"
    );

  if (!active)
    return;

  const id =
    active.id;

  if (id === "dashboard")
    renderDashboard();

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