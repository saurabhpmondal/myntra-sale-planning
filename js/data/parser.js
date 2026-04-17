/* ==========================================
   PARSER.JS
   Robust CSV Parser
   Supports quoted commas / line breaks
========================================== */

import { normalizeKey } from "../core/utils.js";

/* ==========================================
   PUBLIC API
========================================== */

export function parseCSV(csvText = "") {
  if (!csvText || !csvText.trim()) return [];

  const rows = tokenizeCSV(csvText);

  if (!rows.length) return [];

  const rawHeaders = rows[0];
  const headers = rawHeaders.map((header, index) =>
    buildHeaderKey(header, index)
  );

  const output = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (isEmptyRow(row)) continue;

    const item = {};

    headers.forEach((key, colIndex) => {
      item[key] = cleanCell(row[colIndex]);
    });

    output.push(item);
  }

  return output;
}

/* ==========================================
   TOKENIZER
========================================== */

function tokenizeCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";

  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    /* Quote handling */
    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    /* Column break */
    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    /* Row break */
    if (
      (char === "\n" || char === "\r") &&
      !inQuotes
    ) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(cell);
      rows.push(row);

      row = [];
      cell = "";

      continue;
    }

    cell += char;
  }

  /* Final cell */
  row.push(cell);

  if (row.length) {
    rows.push(row);
  }

  return rows;
}

/* ==========================================
   HEADERS
========================================== */

function buildHeaderKey(header, index) {
  const normalized = normalizeKey(header);

  if (!normalized) {
    return `column_${index + 1}`;
  }

  return normalized;
}

/* ==========================================
   CELL CLEAN
========================================== */

function cleanCell(value = "") {
  const text = String(value).trim();

  if (text === "") return null;

  return text;
}

/* ==========================================
   EMPTY ROW
========================================== */

function isEmptyRow(row = []) {
  return row.every((cell) => {
    return String(cell ?? "").trim() === "";
  });
}