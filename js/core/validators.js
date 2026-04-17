/* ==========================================
   VALIDATORS.JS
   Shared Validation Helpers
========================================== */

import { safeString, toNumber } from "./utils.js";

/* ==========================================
   EMPTY CHECKS
========================================== */

export function isBlank(value) {
  return (
    value === null ||
    value === undefined ||
    safeString(value) === ""
  );
}

export function hasValue(value) {
  return !isBlank(value);
}

/* ==========================================
   NUMBERS
========================================== */

export function isValidNumber(value) {
  const num = Number(
    safeString(value).replace(/,/g, "")
  );

  return !Number.isNaN(num);
}

export function isPositiveNumber(value) {
  return toNumber(value) > 0;
}

/* ==========================================
   DATE
========================================== */

export function isValidDate(value) {
  if (isBlank(value)) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

export function isDateRangeValid(start, end) {
  if (!isValidDate(start) || !isValidDate(end)) {
    return false;
  }

  return new Date(start) <= new Date(end);
}

/* ==========================================
   TEXT
========================================== */

export function minLength(value, length = 1) {
  return safeString(value).length >= length;
}

export function maxLength(value, length = 50) {
  return safeString(value).length <= length;
}

/* ==========================================
   SKU / STYLE SEARCH
========================================== */

export function isLikelyStyleId(value) {
  const text = safeString(value);

  return /^[0-9]{5,15}$/.test(text);
}

export function isLikelyErpSku(value) {
  const text = safeString(value);

  return /^[a-z0-9\-_\/]+$/i.test(text);
}

/* ==========================================
   DATA ROW
========================================== */

export function hasKey(row, key) {
  return (
    row &&
    typeof row === "object" &&
    Object.prototype.hasOwnProperty.call(row, key)
  );
}

export function hasKeys(row, keys = []) {
  return keys.every((key) => hasKey(row, key));
}

/* ==========================================
   SALES RECORD
========================================== */

export function isValidSalesRow(row) {
  return hasKeys(row, [
    "style_id",
    "final_amount",
    "qty"
  ]);
}