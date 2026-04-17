/* ==========================================
   OPTIONS.JS
   Dynamic Filter Dropdown Builders
========================================== */

import { getDataset } from "../core/state.js";
import { unique } from "../core/utils.js";
import { normalizeMonth } from "../normalize/dates.js";

/* ==========================================
   PUBLIC API
========================================== */

export function populateAllFilters() {
  populateBrandFilter();
  populatePoTypeFilter();
}

/* ==========================================
   BRAND FILTER
========================================== */

export function populateBrandFilter() {
  const select =
    document.getElementById(
      "brandFilter"
    );

  if (!select) return;

  const sales =
    getDataset("sales");

  const brands = unique(
    sales
      .map((row) => row.brand)
      .filter(Boolean)
  ).sort();

  setOptions(
    select,
    ["All Brands", ...brands]
  );
}

/* ==========================================
   PO TYPE FILTER
========================================== */

export function populatePoTypeFilter() {
  const select =
    document.getElementById(
      "poTypeFilter"
    );

  if (!select) return;

  const sales =
    getDataset("sales");

  const poTypes = unique(
    sales
      .map(
        (row) => row.po_type
      )
      .filter(Boolean)
  ).sort();

  setOptions(
    select,
    [
      "All PO Type",
      ...poTypes
    ]
  );
}

/* ==========================================
   MONTH FILTER
========================================== */

export function populateMonthFilterFromData() {
  const select =
    document.getElementById(
      "monthFilter"
    );

  if (!select) return;

  const sales =
    getDataset("sales");

  const values = unique(
    sales
      .map((row) => {
        if (
          !row.year ||
          !row.month
        )
          return null;

        return `${row.year}-${normalizeMonth(
          row.month
        )}`;
      })
      .filter(Boolean)
  ).sort(sortMonthDesc);

  clearSelect(select);

  values.forEach((value) => {
    const [year, month] =
      value.split("-");

    const option =
      document.createElement(
        "option"
      );

    option.value = value;
    option.textContent =
      `${monthName(
        month
      )} ${year}`;

    select.appendChild(option);
  });
}

/* ==========================================
   HELPERS
========================================== */

function setOptions(
  select,
  values = []
) {
  clearSelect(select);

  values.forEach(
    (value, index) => {
      const option =
        document.createElement(
          "option"
        );

      option.value = value;
      option.textContent =
        value;

      if (index === 0) {
        option.selected = true;
      }

      select.appendChild(
        option
      );
    }
  );
}

function clearSelect(select) {
  select.innerHTML = "";
}

function sortMonthDesc(
  a,
  b
) {
  const [ay, am] =
    a.split("-").map(Number);

  const [by, bm] =
    b.split("-").map(Number);

  const av =
    ay * 100 + am;
  const bv =
    by * 100 + bm;

  return bv - av;
}

function monthName(
  month
) {
  const names = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return (
    names[
      Number(month)
    ] || month
  );
}