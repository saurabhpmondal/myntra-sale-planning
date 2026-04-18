/* ==========================================
   FILTER-ENGINE.JS
   FIXED MASTER DATE LOGIC
========================================== */

import { getFilters } from "../core/state.js";
import { normalizeMonth } from "../normalize/dates.js";
import { searchText } from "../normalize/text.js";

/* ==========================================
   PUBLIC
========================================== */

export function applyGlobalFilters(
  rows = []
) {
  const filters =
    getFilters();

  return rows.filter(
    (row) =>
      passesFilters(
        row,
        filters
      )
  );
}

export function applyCustomFilters(
  rows = [],
  filters = {}
) {
  return rows.filter(
    (row) =>
      passesFilters(
        row,
        filters
      )
  );
}

/* ==========================================
   CORE
========================================== */

function passesFilters(
  row,
  filters
) {
  if (!row)
    return false;

  if (
    !matchMonth(
      row,
      filters.month
    )
  )
    return false;

  if (
    !matchDateRange(
      row,
      filters.startDate,
      filters.endDate
    )
  )
    return false;

  if (
    !matchBrand(
      row,
      filters.brand
    )
  )
    return false;

  if (
    !matchPoType(
      row,
      filters.poType
    )
  )
    return false;

  if (
    !matchSearch(
      row,
      filters.search
    )
  )
    return false;

  return true;
}

/* ==========================================
   MONTH
========================================== */

function matchMonth(
  row,
  monthValue
) {
  if (!monthValue)
    return true;

  if (
    !row.year ||
    !row.month
  )
    return true;

  const [
    y,
    m
  ] =
    String(
      monthValue
    ).split("-");

  return (
    Number(
      row.year
    ) ===
      Number(y) &&
    Number(
      normalizeMonth(
        row.month
      )
    ) ===
      Number(m)
  );
}

/* ==========================================
   DATE RANGE
========================================== */

function matchDateRange(
  row,
  startDate,
  endDate
) {
  if (
    !startDate &&
    !endDate
  )
    return true;

  /* ONLY use sales dataset year month date */
  if (
    row.year &&
    row.month &&
    row.date
  ) {
    const rowDate =
      buildDate(
        row.year,
        row.month,
        row.date
      );

    const current =
      new Date(
        rowDate
      ).getTime();

    if (
      startDate
    ) {
      const start =
        new Date(
          startDate
        ).getTime();

      if (
        current <
        start
      )
        return false;
    }

    if (
      endDate
    ) {
      const end =
        new Date(
          endDate
        ).getTime();

      if (
        current >
        end
      )
        return false;
    }

    return true;
  }

  /* non sales rows pass */
  return true;
}

function buildDate(
  y,
  m,
  d
) {
  return `${y}-${pad(
    normalizeMonth(m)
  )}-${pad(d)}`;
}

/* ==========================================
   BRAND
========================================== */

function matchBrand(
  row,
  brand
) {
  if (
    !brand ||
    brand ===
      "All Brands"
  )
    return true;

  return (
    String(
      row.brand ||
        ""
    ) ===
    String(
      brand
    )
  );
}

/* ==========================================
   PO TYPE
========================================== */

function matchPoType(
  row,
  poType
) {
  if (
    !poType ||
    poType ===
      "All PO Type"
  )
    return true;

  return (
    String(
      row.po_type ||
        ""
    ) ===
    String(
      poType
    )
  );
}

/* ==========================================
   SEARCH
========================================== */

function matchSearch(
  row,
  keyword
) {
  if (!keyword)
    return true;

  const needle =
    searchText(
      keyword
    );

  const hay =
    [
      row.style_id,
      row.erp_sku,
      row.brand
    ]
      .map((x) =>
        searchText(x)
      )
      .join("|");

  return hay.includes(
    needle
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