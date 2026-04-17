/* ==========================================
   SEARCH.JS
   ERP SKU / Style ID Global Search Engine
   Suggestion based search
========================================== */

import { getDataset } from "../core/state.js";
import { APP_CONFIG } from "../core/config.js";
import { searchText } from "../normalize/text.js";
import { unique } from "../core/utils.js";

/* ==========================================
   INIT
========================================== */

export function initSearchEngine() {
  const input =
    document.getElementById(
      "globalSearch"
    );

  if (!input) return;

  input.addEventListener(
    "input",
    debounce(handleInput,
      APP_CONFIG.search
        .debounceMs)
  );

  input.addEventListener(
    "keydown",
    handleEnter
  );

  bindOutsideClose();
}

/* ==========================================
   INPUT
========================================== */

function handleInput(
  event
) {
  const keyword =
    event.target.value.trim();

  if (
    keyword.length <
    APP_CONFIG.search
      .minChars
  ) {
    hideSuggestions();
    return;
  }

  const results =
    searchProducts(
      keyword
    );

  renderSuggestions(
    results
  );
}

/* ==========================================
   ENTER
========================================== */

function handleEnter(
  event
) {
  if (
    event.key !== "Enter"
  )
    return;

  const value =
    event.target.value.trim();

  if (!value) return;

  hideSuggestions();
}

/* ==========================================
   SEARCH CORE
========================================== */

export function searchProducts(
  keyword = ""
) {
  const rows =
    getDataset(
      "productMaster"
    );

  const needle =
    searchText(
      keyword
    );

  const matches =
    rows.filter((row) => {
      const style =
        searchText(
          row.style_id
        );

      const erp =
        searchText(
          row.erp_sku
        );

      return (
        style.includes(
          needle
        ) ||
        erp.includes(
          needle
        )
      );
    });

  return uniqueRows(
    matches
  ).slice(
    0,
    APP_CONFIG.search
      .maxSuggestions
  );
}

/* ==========================================
   UI RENDER
========================================== */

function renderSuggestions(
  rows = []
) {
  let box =
    document.getElementById(
      "searchSuggestions"
    );

  if (!box) {
    box =
      document.createElement(
        "div"
      );

    box.id =
      "searchSuggestions";
    box.className =
      "search-suggestions";

    const wrap =
      document.querySelector(
        ".search-wrap"
      ) ||
      document.querySelector(
        ".search-box"
      );

    if (wrap) {
      wrap.appendChild(
        box
      );
    }
  }

  if (!rows.length) {
    box.innerHTML = `
      <div class="search-item">
        <div class="search-item-sub">
          No results found
        </div>
      </div>
    `;
    box.classList.remove(
      "hidden"
    );
    return;
  }

  box.innerHTML =
    rows
      .map(
        (row) => `
      <div class="search-item"
           data-style="${row.style_id || ""}"
           data-erp="${row.erp_sku || ""}">
        <div class="search-item-title">
          ${row.erp_sku || "-"}
        </div>
        <div class="search-item-sub">
          Style: ${row.style_id || "-"} • ${row.brand || "-"}
        </div>
      </div>
    `
      )
      .join("");

  box.classList.remove(
    "hidden"
  );

  bindSuggestionClick();
}

function bindSuggestionClick() {
  const items =
    document.querySelectorAll(
      "#searchSuggestions .search-item"
    );

  items.forEach((item) => {
    item.addEventListener(
      "click",
      () => {
        const input =
          document.getElementById(
            "globalSearch"
          );

        if (input) {
          input.value =
            item.dataset
              .erp ||
            item.dataset
              .style;
        }

        hideSuggestions();
      }
    );
  });
}

function hideSuggestions() {
  const box =
    document.getElementById(
      "searchSuggestions"
    );

  if (box) {
    box.classList.add(
      "hidden"
    );
  }
}

function bindOutsideClose() {
  document.addEventListener(
    "click",
    (event) => {
      const wrap =
        document.querySelector(
          ".search-wrap"
        ) ||
        document.querySelector(
          ".search-box"
        );

      if (
        wrap &&
        !wrap.contains(
          event.target
        )
      ) {
        hideSuggestions();
      }
    }
  );
}

/* ==========================================
   HELPERS
========================================== */

function uniqueRows(
  rows = []
) {
  const seen =
    new Set();

  return rows.filter(
    (row) => {
      const key = `${
        row.erp_sku
      }|${
        row.style_id
      }`;

      if (
        seen.has(key)
      )
        return false;

      seen.add(key);
      return true;
    }
  );
}

function debounce(
  fn,
  delay = 250
) {
  let timer;

  return function (...args) {
    clearTimeout(
      timer
    );

    timer =
      setTimeout(
        () =>
          fn.apply(
            this,
            args
          ),
        delay
      );
  };
}