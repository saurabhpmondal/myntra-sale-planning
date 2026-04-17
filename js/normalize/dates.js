/* ==========================================
   DATES.JS
   Date Normalization Helpers
   Sales-first date engine
========================================== */

import { safeString } from "../core/utils.js";

/* ==========================================
   PUBLIC API
========================================== */

export function normalizeDateFields(
  row = {}
) {
  const output = { ...row };

  /* Sales date helper */
  if (
    row.year !== undefined &&
    row.month !== undefined &&
    row.date !== undefined
  ) {
    output.sale_key_date =
      buildSaleKeyDate(
        row.year,
        row.month,
        row.date
      );
  }

  return output;
}

/* ==========================================
   BUILD YYYY-MM-DD
========================================== */

export function buildSaleKeyDate(
  year,
  month,
  day
) {
  const y = Number(year);

  const m = normalizeMonth(month);
  const d = Number(day);

  if (!y || !m || !d) return null;

  return [
    y,
    String(m).padStart(2, "0"),
    String(d).padStart(2, "0")
  ].join("-");
}

/* ==========================================
   MONTH NORMALIZER
========================================== */

export function normalizeMonth(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const text = safeString(value)
    .toLowerCase();

  const monthMap = {
    january: 1,
    jan: 1,
    february: 2,
    feb: 2,
    march: 3,
    mar: 3,
    april: 4,
    apr: 4,
    may: 5,
    june: 6,
    jun: 6,
    july: 7,
    jul: 7,
    august: 8,
    aug: 8,
    september: 9,
    sep: 9,
    october: 10,
    oct: 10,
    november: 11,
    nov: 11,
    december: 12,
    dec: 12
  };

  if (monthMap[text]) {
    return monthMap[text];
  }

  const num = Number(text);

  if (
    num >= 1 &&
    num <= 12
  ) {
    return num;
  }

  return null;
}

/* ==========================================
   FILTER HELPERS
========================================== */

export function isDateBetween(
  value,
  start,
  end
) {
  if (!value) return false;

  const current =
    new Date(value).getTime();

  const startTime = start
    ? new Date(start).getTime()
    : null;

  const endTime = end
    ? new Date(end).getTime()
    : null;

  if (
    startTime &&
    current < startTime
  ) {
    return false;
  }

  if (
    endTime &&
    current > endTime
  ) {
    return false;
  }

  return true;
}

/* ==========================================
   SORT
========================================== */

export function sortByDate(
  rows = [],
  key = "sale_key_date"
) {
  return [...rows].sort((a, b) => {
    const av =
      a?.[key] || "";
    const bv =
      b?.[key] || "";

    return av.localeCompare(bv);
  });
}