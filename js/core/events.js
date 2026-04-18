/* ==========================================
   EVENTS.JS
   Global UI Events
========================================== */

import { navigate } from "./router.js";
import { setFilter } from "./state.js";

import { renderDashboard } from "../reports/dashboard/index.js";
import { renderSalesReport } from "../reports/sales/index.js";

/* ==========================================
   INIT
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

          if (!tab) return;

          navigate(tab);
        }
      );
    }
  );
}

/* ==========================================
   FILTERS
========================================== */

function bindFilters() {
  bindMonthFilter();

  bindFilter(
    "startDate",
    "startDate"
  );

  bindFilter(
    "endDate",
    "endDate"
  );

  bindFilter(
    "brandFilter",
    "brand"
  );

  bindFilter(
    "poTypeFilter",
    "poType"
  );
}

function bindMonthFilter() {
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

  if (!month)
    return;

  month.addEventListener(
    "change",
    (event) => {
      const value =
        event.target
          .value;

      setFilter(
        "month",
        value
      );

      if (
        !value ||
        !start ||
        !end
      ) {
        refreshActiveTab();
        return;
      }

      const [
        year,
        mm
      ] =
        value.split(
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

      const now =
        new Date();

      const isCurrent =
        now.getFullYear() ===
          y &&
        now.getMonth() +
          1 ===
          m;

      start.value =
        `${year}-${pad(
          mm
        )}-01`;

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

      refreshActiveTab();
    }
  );
}

function bindFilter(
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

      refreshActiveTab();
    }
  );
}

/* ==========================================
   SEARCH
========================================== */

function bindSearch() {
  const input =
    document.getElementById(
      "globalSearch"
    );

  if (!input)
    return;

  input.addEventListener(
    "input",
    (event) => {
      setFilter(
        "search",
        event.target.value.trim()
      );

      refreshActiveTab();
    }
  );

  input.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key !==
        "Enter"
      )
        return;

      navigate(
        "sales"
      );
    }
  );
}

/* ==========================================
   REFRESH ACTIVE TAB
========================================== */

function refreshActiveTab() {
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
    id === "sales"
  ) {
    renderSalesReport();
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