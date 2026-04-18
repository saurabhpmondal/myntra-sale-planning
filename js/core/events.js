/* ==========================================
   EVENTS.JS
   Global UI Event Binder
   FIXED MONTH → DATE SYNC
========================================== */

import { navigate } from "./router.js";
import { setFilter } from "./state.js";

/* ==========================================
   INIT
========================================== */

export function initEvents() {
  bindTabClicks();
  bindFilters();
  bindSearch();
}

/* ==========================================
   TABS
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
            button.dataset
              .tab;

          if (!tab)
            return;

          navigate(
            tab
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

/* ==========================================
   MONTH FILTER
========================================== */

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
      )
        return;

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

      /* start always first */
      start.value =
        `${year}-${pad(
          mm
        )}-01`;

      /* end */
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

      /* sync state */
      setFilter(
        "startDate",
        start.value
      );

      setFilter(
        "endDate",
        end.value
      );
    }
  );
}

/* ==========================================
   NORMAL FILTERS
========================================== */

function bindFilter(
  elementId,
  stateKey
) {
  const el =
    document.getElementById(
      elementId
    );

  if (!el) return;

  el.addEventListener(
    "change",
    (event) => {
      setFilter(
        stateKey,
        event.target
          .value
      );
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

      const keyword =
        input.value.trim();

      if (
        !keyword
      )
        return;

      setFilter(
        "search",
        keyword
      );

      navigate(
        "products"
      );
    }
  );
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