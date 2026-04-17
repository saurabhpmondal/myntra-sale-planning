/* ==========================================
   UTILS.JS
   Shared Helper Functions
   Safe reusable utilities only
========================================== */

/* ==========================================
   TYPE CHECKS
========================================== */

export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

export function isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

/* ==========================================
   STRING HELPERS
========================================== */

export function safeString(value = "") {
  return String(value ?? "").trim();
}

export function slugify(value = "") {
  return safeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeKey(value = "") {
  return safeString(value)
    .toLowerCase()
    .replace(/[%]/g, "percent")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function capitalize(value = "") {
  const text = safeString(value);

  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ==========================================
   NUMBER HELPERS
========================================== */

export function toNumber(value, fallback = 0) {
  if (typeof value === "number") return value;

  const cleaned = safeString(value).replace(/,/g, "");
  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? fallback : parsed;
}

export function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(toNumber(value) * factor) / factor;
}

export function percent(part, total, digits = 2) {
  if (!total) return 0;
  return round((toNumber(part) / toNumber(total)) * 100, digits);
}

export function sum(list = [], key = null) {
  if (!Array.isArray(list)) return 0;

  return list.reduce((acc, item) => {
    const val = key ? item?.[key] : item;
    return acc + toNumber(val);
  }, 0);
}

/* ==========================================
   DATE HELPERS
========================================== */

export function todayISO() {
  return formatDateISO(new Date());
}

export function formatDateISO(date) {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "";

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export function getTimestampString() {
  const d = new Date();

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return `${dd}${mm}${yyyy}${hh}${min}`;
}

/* ==========================================
   ARRAY HELPERS
========================================== */

export function unique(list = []) {
  return [...new Set(list)];
}

export function sortBy(list = [], key, direction = "asc") {
  const clone = [...list];

  clone.sort((a, b) => {
    const av = a?.[key];
    const bv = b?.[key];

    if (av < bv) return direction === "asc" ? -1 : 1;
    if (av > bv) return direction === "asc" ? 1 : -1;

    return 0;
  });

  return clone;
}

/* ==========================================
   DOM HELPERS
========================================== */

export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}

export function setText(selector, value, scope = document) {
  const el = qs(selector, scope);
  if (el) el.textContent = value;
}

export function escapeHtml(value = "") {
  const div = document.createElement("div");
  div.innerText = String(value);
  return div.innerHTML;
}

/* ==========================================
   FILE HELPERS
========================================== */

export function downloadBlob(blob, fileName = "download.txt") {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
}