/* ==========================================
   VALUES.JS
   Universal Row Value Normalization
   Converts numbers / blanks / trims text
========================================== */

import {
  normalizeKey,
  safeString,
  toNumber
} from "../core/utils.js";

/* ==========================================
   PUBLIC API
========================================== */

export function normalizeRows(rows = []) {
  return rows.map((row) => normalizeRow(row));
}

export function normalizeRow(row = {}) {
  const output = {};

  Object.entries(row).forEach(([key, value]) => {
    const cleanKey = normalizeKey(key);
    output[cleanKey] = normalizeValue(
      cleanKey,
      value
    );
  });

  return output;
}

/* ==========================================
   SINGLE VALUE
========================================== */

export function normalizeValue(
  key,
  value
) {
  /* Null / blank */
  if (
    value === null ||
    value === undefined ||
    safeString(value) === ""
  ) {
    return null;
  }

  const text = safeString(value);

  /* Date-like keep text for now */
  if (looksLikeDateKey(key)) {
    return text;
  }

  /* Numeric-like columns */
  if (looksNumericKey(key)) {
    return toNumber(text, 0);
  }

  /* Year */
  if (key === "year") {
    return parseInt(text, 10) || null;
  }

  /* Date / Month can stay text or numeric */
  if (key === "date" || key === "month") {
    const num = Number(text);

    return Number.isNaN(num) ? text : num;
  }

  return text;
}

/* ==========================================
   DETECTORS
========================================== */

function looksNumericKey(key = "") {
  const numericWords = [
    "amount",
    "price",
    "mrp",
    "tp",
    "qty",
    "units",
    "count",
    "inventory",
    "stock",
    "clicks",
    "impressions",
    "purchases",
    "rating",
    "percent",
    "per",
    "revenue"
  ];

  return numericWords.some((word) =>
    key.includes(word)
  );
}

function looksLikeDateKey(key = "") {
  const dateWords = [
    "date",
    "created",
    "launch",
    "live",
    "start",
    "end",
    "refunded"
  ];

  return dateWords.some((word) =>
    key.includes(word)
  );
}