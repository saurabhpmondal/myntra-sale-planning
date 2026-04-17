/* ==========================================
   FORMATTERS.JS
   Display Formatting Helpers
========================================== */

import { APP_CONFIG } from "./config.js";
import { toNumber, round } from "./utils.js";

/* ==========================================
   CURRENCY
========================================== */

const currencyFormatter = new Intl.NumberFormat(
  APP_CONFIG.locale,
  {
    style: "currency",
    currency: APP_CONFIG.currency,
    maximumFractionDigits: 0
  }
);

export function formatCurrency(value = 0) {
  return currencyFormatter.format(toNumber(value));
}

/* ==========================================
   NUMBERS
========================================== */

const numberFormatter = new Intl.NumberFormat(
  APP_CONFIG.locale,
  {
    maximumFractionDigits: 0
  }
);

export function formatNumber(value = 0) {
  return numberFormatter.format(toNumber(value));
}

export function formatDecimal(value = 0, digits = 2) {
  return round(value, digits).toLocaleString(
    APP_CONFIG.locale,
    {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }
  );
}

/* ==========================================
   PERCENT
========================================== */

export function formatPercent(value = 0, digits = 2) {
  return `${formatDecimal(value, digits)}%`;
}

/* ==========================================
   GROWTH STATUS
========================================== */

export function formatGrowthStatus(value = 0) {
  const num = toNumber(value);

  if (num > 3) {
    return `Growing +${formatDecimal(num, 1)}%`;
  }

  if (num < -3) {
    return `Decline ${formatDecimal(num, 1)}%`;
  }

  return `Stable ${formatDecimal(num, 1)}%`;
}

export function growthClass(value = 0) {
  const num = toNumber(value);

  if (num > 3) return "up";
  if (num < -3) return "down";

  return "flat";
}

/* ==========================================
   DATES
========================================== */

export function formatDate(value) {
  if (!value) return "";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return String(value);

  return d.toLocaleDateString(APP_CONFIG.locale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function formatMonthYear(year, month) {
  const d = new Date(Number(year), Number(month) - 1, 1);

  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleDateString(APP_CONFIG.locale, {
    month: "short",
    year: "numeric"
  });
}

/* ==========================================
   TEXT
========================================== */

export function titleCase(value = "") {
  return String(value)
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}