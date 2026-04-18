/* ==========================================
   File: js/core/events.js
   FULL REPLACE CODE
   Added Traffic Refresh Support
========================================== */

import { navigate } from "./router.js";
import { setFilter } from "./state.js";

import { renderDashboard } from "../reports/dashboard/index.js";
import { renderSalesReport } from "../reports/sales/index.js";
import { renderTrafficReport } from "../reports/traffic/index.js";

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

  tabs.forEach(
    (tab) => {
      tab.addEventListener(
        "click",
        () => {
          navigate(
            tab.dataset.tab
          );
        }
      );
    }
  );
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

  if (!el)
    return;

  el.addEventListener(
    "change",
    (event) => {
      const val =
        event.target
          .value;

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
          val.split(
            "-"
          );

        const y =
          Number(
            year
          );

        const m =
          Number(
            mm
          );

        start.value =
          `${year}-${pad(
            mm
          )}-01`;

        const now =
          new Date();

        const isCurrent =
          now.getFullYear() ===
            y &&
          now.getMonth() +
            1 ===
            m;

        if (
          isCurrent
        ) {
          const d =
            new Date();

          d.setDate(
            d.getDate() -
              1
          );

          end.value =
            `${d.getFullYear()}-${pad(
              d.getMonth() +
                1
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
            `${year}-${pad(
              mm
            )}-${pad(
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
    document.getElementById(
      id
    );

  if (!el)
    return;

  el.addEventListener(
    "change",
    (event) => {
      setFilter(
        key,
        event.target
          .value
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

  if (!el)
    return;

  el.addEventListener(
    "input",
    (event) => {
      setFilter(
        "search",
        event.target.value.trim()
      );

      refresh();
    }
  );

  el.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key ===
        "Enter"
      ) {
        navigate(
          "sales"
        );
      }
    }
  );
}

/* ==========================================
   REFRESH ACTIVE TAB
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

  if (
    id ===
    "dashboard"
  ) {
    renderDashboard();
  }

  if (
    id ===
    "sales"
  ) {
    renderSalesReport();
  }

  if (
    id ===
    "traffic"
  ) {
    renderTrafficReport();
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