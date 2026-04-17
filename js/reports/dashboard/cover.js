/* ==========================================
   DASHBOARD / COVER.JS
   Stock Cover Analysis
   Filter reactive (uses filtered sales)
========================================== */

import { getDataset } from "../../core/state.js";
import { applyGlobalFilters } from "../../filters/filter-engine.js";

import {
  byId,
  buildTable,
  getCoverBucket,
  num,
  fn
} from "./helpers.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderStockCoverTable() {
  const el =
    byId(
      "dashboardStockCover"
    );

  if (!el) return;

  const buckets = [
    "<30",
    "30-45",
    "45-60",
    "60-90",
    ">90"
  ];

  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  if (!sales.length) {
    el.innerHTML =
      emptyState();

    return;
  }

  const coverMap = {};

  buckets.forEach((bucket) => {
    coverMap[bucket] = {
      sjit: 0,
      sor: 0
    };
  });

  /* ======================================
     ADS MAP
  ====================================== */

  const adsMap = {};

  sales.forEach((row) => {
    const style =
      row.style_id;

    adsMap[style] =
      (adsMap[
        style
      ] || 0) +
      num(row.qty);
  });

  Object.keys(
    adsMap
  ).forEach((style) => {
    adsMap[style] =
      adsMap[style] / 30;
  });

  /* ======================================
     SJIT STOCK
  ====================================== */

  getDataset(
    "sjitStock"
  ).forEach((row) => {
    const style =
      row.style_id;

    const units =
      num(
        row.sellable_inventory_count
      );

    const ads =
      adsMap[
        style
      ] || 0;

    const cover =
      ads
        ? units / ads
        : 999;

    const bucket =
      getCoverBucket(
        cover
      );

    coverMap[
      bucket
    ].sjit +=
      units;
  });

  /* ======================================
     SOR STOCK
  ====================================== */

  getDataset(
    "sorStock"
  ).forEach((row) => {
    const style =
      row.style_id;

    const units =
      num(row.units);

    const ads =
      adsMap[
        style
      ] || 0;

    const cover =
      ads
        ? units / ads
        : 999;

    const bucket =
      getCoverBucket(
        cover
      );

    coverMap[
      bucket
    ].sor +=
      units;
  });

  /* ======================================
     RENDER
  ====================================== */

  const rows =
    buckets.map(
      (bucket) => [
        bucket,
        fn(
          coverMap[
            bucket
          ].sjit
        ),
        fn(
          coverMap[
            bucket
          ].sor
        )
      ]
    );

  el.innerHTML =
    buildTable(
      [
        "Cover",
        "SJIT Units",
        "SOR Units"
      ],
      rows
    );
}

/* ==========================================
   EMPTY
========================================== */

function emptyState() {
  return `
    <div class="placeholder-box small">
      No stock cover data
    </div>
  `;
}