/* ==========================================
   FILTER-ENGINE.JS
   Global Filtering Logic
   Used by all reports
========================================== */

import { getFilters } from "../core/state.js";
import { normalizeMonth } from "../normalize/dates.js";
import { searchText } from "../normalize/text.js";

/* ==========================================
   PUBLIC API
========================================== */

export function applyGlobalFilters(
  rows = []
) {
  const filters = getFilters();

  return rows.filter((row) =>
    passesFilters(row, filters)
  );
}

export function applyCustomFilters(
  rows = [],
  filters = {}
) {
  return rows.filter((row) =>
    passesFilters(row, filters)
  );
}

/* ==========================================
   CORE FILTER CHECK
========================================== */

function passesFilters(
  row,
  filters
) {
  if (!row) return false;

  if (!matchMonth(row, filters.month))
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
  if (!monthValue) return true;

  if (!row.year || !row.month)
    return true;

  const [year, month] =
    String(monthValue).split("-");

  const rowMonth =
    normalizeMonth(row.month);

  return (
    Number(row.year) ===
      Number(year) &&
    Number(rowMonth) ===
      Number(month)
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
  if (!startDate && !endDate)
    return true;

  const rowDate =
    row.sale_key_date ||
    row.start_date ||
    row.return_created_date ||
    row.created_on;

  if (!rowDate) return true;

  const current =
    new Date(rowDate).getTime();

  if (startDate) {
    const start =
      new Date(
        startDate
      ).getTime();

    if (current < start)
      return false;
  }

  if (endDate) {
    const end = new Date(
      endDate
    ).getTime();

    if (current > end)
      return false;
  }

  return true;
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
    brand === "All Brands"
  )
    return true;

  if (!row.brand) return false;

  return (
    String(row.brand) ===
    String(brand)
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
    poType === "All PO Type"
  )
    return true;

  if (!row.po_type)
    return false;

  return (
    String(row.po_type) ===
    String(poType)
  );
}

/* ==========================================
   SEARCH
========================================== */

function matchSearch(
  row,
  keyword
) {
  if (!keyword) return true;

  const needle =
    searchText(keyword);

  const haystack = [
    row.style_id,
    row.erp_sku,
    row.brand
  ]
    .map((item) =>
      searchText(item)
    )
    .join("|");

  return haystack.includes(
    needle
  );
}