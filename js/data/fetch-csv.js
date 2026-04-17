/* ==========================================
   FETCH-CSV.JS
   CSV Downloader + Parser Entry
========================================== */

import { warn, info } from "../core/logger.js";
import { parseCSV } from "./parser.js";

/* ==========================================
   FETCH SINGLE CSV
========================================== */

export async function fetchCSV(url = "") {
  if (!url) {
    throw new Error("CSV url missing");
  }

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CSV (${response.status})`
    );
  }

  const text = await response.text();

  return parseCSV(text);
}

/* ==========================================
   FETCH DATASET OBJECT
========================================== */

export async function fetchDataset(source) {
  try {
    info(`Fetching ${source.key}`);

    const rows = await fetchCSV(source.url);

    return {
      key: source.key,
      rows,
      success: true,
      count: rows.length
    };
  } catch (err) {
    warn(`Fetch failed: ${source.key}`, err);

    return {
      key: source.key,
      rows: [],
      success: false,
      count: 0,
      error: err
    };
  }
}

/* ==========================================
   FETCH MULTIPLE IN PARALLEL
========================================== */

export async function fetchMany(sources = []) {
  const tasks = sources.map((source) =>
    fetchDataset(source)
  );

  return Promise.all(tasks);
}