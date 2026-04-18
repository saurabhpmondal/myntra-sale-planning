/* ==========================================
   File: js/reports/traffic/metrics.js
   FULL REPLACE CODE
   CLEAN / SYNTAX SAFE
========================================== */

import { getDataset } from "../../core/state.js";
import { clean, num } from "../sales/helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function getTrafficRows() {
  const traffic =
    getDataset("traffic") || [];

  const productMaster =
    getDataset("productMaster") || [];

  const sjitStock =
    getDataset("sjitStock") || [];

  const sorStock =
    getDataset("sorStock") || [];

  const map = {};

  /* ===============================
     TRAFFIC BASE
  =============================== */

  traffic.forEach((r) => {
    const id =
      clean(r.style_id);

    if (!id) return;

    if (!map[id]) {
      map[id] =
        createRow(id);
    }

    const row =
      map[id];

    row.brand =
      row.brand ||
      clean(r.brand);

    row.impressions +=
      num(
        r.impressions
      );

    row.clicks +=
      num(
        r.clicks
      );

    row.atc +=
      num(
        r.add_to_carts
      );

    row.purchases +=
      num(
        r.purchases
      );
  });

  /* ===============================
     ERP MAP
  =============================== */

  productMaster.forEach(
    (r) => {
      const id =
        clean(
          r.style_id
        );

      if (
        map[id]
      ) {
        map[id].erp =
          clean(
            r.erp_sku
          );
      }
    }
  );

  /* ===============================
     SJIT STOCK
  =============================== */

  sjitStock.forEach(
    (r) => {
      const id =
        clean(
          r.style_id
        );

      if (
        map[id]
      ) {
        map[id]
          .sjitStock +=
          num(
            r.sellable_inventory_count
          );
      }
    }
  );

  /* ===============================
     SOR STOCK
  =============================== */

  sorStock.forEach(
    (r) => {
      const id =
        clean(
          r.style_id
        );

      if (
        map[id]
      ) {
        map[id]
          .sorStock +=
          num(
            r.units
          );
      }
    }
  );

  const rows =
    Object.values(
      map
    );

  /* ===============================
     BRAND CLICKS
  =============================== */

  const brandClicks =
    {};

  rows.forEach((r) => {
    const brand =
      r.brand ||
      "Unknown";

    brandClicks[
      brand
    ] =
      (brandClicks[
        brand
      ] || 0) +
      r.clicks;
  });

  /* ===============================
     FINAL METRICS
  =============================== */

  rows.forEach((r) => {
    r.ctr =
      percent(
        r.clicks,
        r.impressions
      );

    r.cvr =
      percent(
        r.purchases,
        r.clicks
      );

    r.ppc =
      ratio(
        r.purchases,
        r.clicks
      );

    const brand =
      r.brand ||
      "Unknown";

    r.weight =
      percent(
        r.clicks,
        brandClicks[
          brand
        ]
      );
  });

  /* ===============================
     SORT
  =============================== */

  rows.sort(
    (a, b) =>
      b.impressions -
      a.impressions
  );

  return rows;
}

/* ==========================================
   HELPERS
========================================== */

function createRow(id) {
  return {
    styleId: id,
    erp: "",
    brand: "",

    impressions: 0,
    clicks: 0,
    atc: 0,
    purchases: 0,

    ctr: 0,
    cvr: 0,
    ppc: 0,
    weight: 0,

    sjitStock: 0,
    sorStock: 0
  };
}

function percent(a, b) {
  if (!b) return 0;
  return (a / b) * 100;
}

function ratio(a, b) {
  if (!b) return 0;
  return a / b;
}