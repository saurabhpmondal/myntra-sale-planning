/* ==========================================
   HEADERS.JS
   Header Normalization Engine
   Future-proof dynamic column support
========================================== */

import { normalizeKey } from "../core/utils.js";

/* ==========================================
   PUBLIC API
========================================== */

export function normalizeHeaders(headers = []) {
  const used = new Set();

  return headers.map((header, index) => {
    let key = normalizeSingleHeader(header, index);

    /* Ensure uniqueness */
    if (used.has(key)) {
      let count = 2;

      while (used.has(`${key}_${count}`)) {
        count++;
      }

      key = `${key}_${count}`;
    }

    used.add(key);

    return key;
  });
}

/* ==========================================
   SINGLE HEADER
========================================== */

export function normalizeSingleHeader(
  header,
  index = 0
) {
  const raw = String(header ?? "").trim();

  if (!raw) {
    return `column_${index + 1}`;
  }

  let key = normalizeKey(raw);

  /* Common business replacements */
  key = key
    .replace(/^sellerid$/, "seller_id")
    .replace(/^seller_id$/, "seller_id")
    .replace(/^styleid$/, "style_id")
    .replace(/^skuid$/, "sku_id")
    .replace(/^orderlineid$/, "order_line_id")
    .replace(/^warehouseid$/, "warehouse_id")
    .replace(/^erpsku$/, "erp_sku")
    .replace(/^ponumber$/, "po_number")
    .replace(/^potype$/, "po_type");

  if (!key) {
    return `column_${index + 1}`;
  }

  return key;
}

/* ==========================================
   ROW HEADER REMAP
========================================== */

export function remapRowKeys(
  row = {},
  headers = []
) {
  const values = Object.values(row);
  const output = {};

  headers.forEach((key, index) => {
    output[key] =
      index < values.length ? values[index] : null;
  });

  return output;
}

/* ==========================================
   COLUMN REGISTRY
========================================== */

export function buildColumnRegistry(
  rows = []
) {
  if (!rows.length) return [];

  return Object.keys(rows[0]).map((key) => ({
    key,
    label: key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) =>
        c.toUpperCase()
      )
  }));
}