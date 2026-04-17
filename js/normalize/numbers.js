/* ==========================================
   NUMBERS.JS
   Numeric Parsing / Safe Math Helpers
========================================== */

import { safeString } from "../core/utils.js";

/* ==========================================
   PARSERS
========================================== */

export function parseNumber(value, fallback = 0) {
  if (typeof value === "number") {
    return Number.isNaN(value)
      ? fallback
      : value;
  }

  const text = safeString(value)
    .replace(/,/g, "")
    .replace(/₹/g, "")
    .replace(/%/g, "");

  const parsed = Number(text);

  return Number.isNaN(parsed)
    ? fallback
    : parsed;
}

export function parseInteger(
  value,
  fallback = 0
) {
  const parsed = parseInt(
    safeString(value).replace(/,/g, ""),
    10
  );

  return Number.isNaN(parsed)
    ? fallback
    : parsed;
}

/* ==========================================
   CHECKERS
========================================== */

export function isNumeric(value) {
  return !Number.isNaN(
    Number(
      safeString(value).replace(/,/g, "")
    )
  );
}

/* ==========================================
   SAFE MATH
========================================== */

export function safeAdd(a, b) {
  return parseNumber(a) + parseNumber(b);
}

export function safeSubtract(a, b) {
  return parseNumber(a) - parseNumber(b);
}

export function safeMultiply(a, b) {
  return parseNumber(a) * parseNumber(b);
}

export function safeDivide(
  a,
  b,
  fallback = 0
) {
  const denominator =
    parseNumber(b);

  if (!denominator) return fallback;

  return parseNumber(a) / denominator;
}

/* ==========================================
   AGGREGATIONS
========================================== */

export function sumBy(
  rows = [],
  key
) {
  return rows.reduce((acc, row) => {
    return (
      acc +
      parseNumber(row?.[key])
    );
  }, 0);
}

export function avgBy(
  rows = [],
  key
) {
  if (!rows.length) return 0;

  return (
    sumBy(rows, key) /
    rows.length
  );
}

export function maxBy(
  rows = [],
  key
) {
  if (!rows.length) return 0;

  return Math.max(
    ...rows.map((row) =>
      parseNumber(row?.[key])
    )
  );
}

export function minBy(
  rows = [],
  key
) {
  if (!rows.length) return 0;

  return Math.min(
    ...rows.map((row) =>
      parseNumber(row?.[key])
    )
  );
}