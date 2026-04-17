/* ==========================================
   TEXT.JS
   Text Cleaning / Standardization Helpers
========================================== */

import { safeString } from "../core/utils.js";

/* ==========================================
   BASIC CLEANING
========================================== */

export function cleanText(value) {
  const text = safeString(value);

  if (!text) return null;

  return text.replace(/\s+/g, " ").trim();
}

export function upperText(value) {
  const text = cleanText(value);

  return text ? text.toUpperCase() : null;
}

export function lowerText(value) {
  const text = cleanText(value);

  return text ? text.toLowerCase() : null;
}

/* ==========================================
   TITLE CASE
========================================== */

export function titleText(value) {
  const text = lowerText(value);

  if (!text) return null;

  return text
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
}

/* ==========================================
   BUSINESS KEYS
========================================== */

export function cleanBrand(value) {
  return titleText(value);
}

export function cleanArticleType(
  value
) {
  return titleText(value);
}

export function cleanPoType(value) {
  const text = upperText(value);

  if (!text) return null;

  const map = {
    SJIT: "SJIT",
    PPMP: "PPMP",
    SOR: "SOR"
  };

  return map[text] || text;
}

export function cleanState(value) {
  return titleText(value);
}

/* ==========================================
   SEARCH NORMALIZATION
========================================== */

export function searchText(value) {
  const text = safeString(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();

  return text;
}

/* ==========================================
   BULK CLEAN ROW
========================================== */

export function normalizeTextFields(
  row = {}
) {
  const output = { ...row };

  if ("brand" in output) {
    output.brand = cleanBrand(
      output.brand
    );
  }

  if ("article_type" in output) {
    output.article_type =
      cleanArticleType(
        output.article_type
      );
  }

  if ("po_type" in output) {
    output.po_type =
      cleanPoType(
        output.po_type
      );
  }

  if ("state" in output) {
    output.state =
      cleanState(
        output.state
      );
  }

  return output;
}