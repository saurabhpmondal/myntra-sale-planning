/* ==========================================
   DASHBOARD / PRICE.JS
   Price Range Analysis
========================================== */

import { getDataset } from "../../core/state.js";
import { applyGlobalFilters } from "../../filters/filter-engine.js";

import {
  byId,
  buildTable,
  getPriceBucket,
  topBrand,
  num,
  fn
} from "./helpers.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderPriceRangeTable() {
  const el =
    byId(
      "dashboardPriceRange"
    );

  if (!el) return;

  const buckets = [
    "0-300",
    "301-600",
    "601-800",
    "801-1000",
    "1001-1500",
    "1501-2000",
    ">2000"
  ];

  const rows =
    applyGlobalFilters(
      getDataset("sales")
    );

  if (!rows.length) {
    el.innerHTML =
      emptyState();

    return;
  }

  const map = {};

  buckets.forEach((bucket) => {
    map[bucket] = {
      units: 0,
      brands: {}
    };
  });

  rows.forEach((row) => {
    const price =
      num(
        row.final_amount
      );

    const bucket =
      getPriceBucket(
        price
      );

    if (!bucket) return;

    const units =
      num(row.qty);

    const brand =
      row.brand ||
      "Unknown";

    map[
      bucket
    ].units +=
      units;

    map[
      bucket
    ].brands[
      brand
    ] =
      (map[
        bucket
      ].brands[
        brand
      ] || 0) +
      units;
  });

  const data =
    buckets.map(
      (bucket) => ({
        bucket,
        units:
          map[bucket]
            .units,
        topBrand:
          topBrand(
            map[
              bucket
            ].brands
          )
      })
    );

  el.innerHTML =
    buildTable(
      [
        "Price Range",
        "Units",
        "Top Brand"
      ],
      data.map(
        (row) => [
          row.bucket,
          fn(
            row.units
          ),
          row.topBrand
        ]
      )
    );
}

/* ==========================================
   EMPTY
========================================== */

function emptyState() {
  return `
    <div class="placeholder-box small">
      No price range data
    </div>
  `;
}