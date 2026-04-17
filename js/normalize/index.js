/* ==========================================
   INDEX.JS
   Master Normalization Pipeline
   One import entry for all datasets
========================================== */

import { normalizeRows } from "./values.js";
import { normalizeDateFields } from "./dates.js";
import { normalizeTextFields } from "./text.js";

/* ==========================================
   PUBLIC API
========================================== */

export function normalizeDataset(
  rows = []
) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map((row) =>
    normalizeSingleRow(row)
  );
}

export function normalizeSingleRow(
  row = {}
) {
  let output = { ...row };

  /* Step 1: Value types */
  output = normalizeRows([output])[0];

  /* Step 2: Text standardization */
  output =
    normalizeTextFields(output);

  /* Step 3: Date helpers */
  output =
    normalizeDateFields(output);

  return output;
}