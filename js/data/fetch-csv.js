/* ==========================================
   FETCH-CSV.JS
   FULL REPLACE CODE
   FIXED LOADER ROW COUNT
   Shows live downloaded KB + final rows
========================================== */

import {
  warn,
  info
} from "../core/logger.js";

import {
  parseCSV
} from "./parser.js";

import {
  setProgress
} from "../ui/progress.js";

/* ==========================================
   FETCH SINGLE CSV
========================================== */

export async function fetchCSV(
  url = "",
  label = "Loading"
) {
  if (!url) {
    throw new Error(
      "CSV url missing"
    );
  }

  const response =
    await fetch(url, {
      method: "GET",
      cache:
        "no-store"
    });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CSV (${response.status})`
    );
  }

  const total =
    Number(
      response.headers.get(
        "content-length"
      )
    ) || 0;

  /* fallback */
  if (
    !response.body ||
    !response.body.getReader
  ) {
    const text =
      await response.text();

    const rows =
      parseCSV(text);

    setProgress(
      100,
      label,
      rows.length
    );

    return rows;
  }

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder();

  let received = 0;
  let text = "";

  while (true) {
    const {
      done,
      value
    } =
      await reader.read();

    if (done)
      break;

    received +=
      value.length;

    text +=
      decoder.decode(
        value,
        {
          stream: true
        }
      );

    const approxRows =
      Math.max(
        1,
        text.split("\n")
          .length - 1
      );

    if (total > 0) {
      const pct =
        Math.round(
          (received /
            total) *
            100
        );

      setProgress(
        pct,
        label,
        approxRows
      );
    } else {
      setProgress(
        0,
        label,
        approxRows
      );
    }
  }

  text +=
    decoder.decode();

  const rows =
    parseCSV(text);

  setProgress(
    100,
    label,
    rows.length
  );

  return rows;
}

/* ==========================================
   FETCH DATASET OBJECT
========================================== */

export async function fetchDataset(
  source
) {
  try {
    info(
      `Fetching ${source.key}`
    );

    const rows =
      await fetchCSV(
        source.url,
        `Fetching ${source.key.toUpperCase()}`
      );

    return {
      key:
        source.key,
      rows,
      success: true,
      count:
        rows.length
    };
  } catch (err) {
    warn(
      `Fetch failed: ${source.key}`,
      err
    );

    return {
      key:
        source.key,
      rows: [],
      success: false,
      count: 0,
      error: err
    };
  }
}

/* ==========================================
   FETCH MULTIPLE
========================================== */

export async function fetchMany(
  sources = []
) {
  const tasks =
    sources.map(
      (source) =>
        fetchDataset(
          source
        )
    );

  return Promise.all(
    tasks
  );
}