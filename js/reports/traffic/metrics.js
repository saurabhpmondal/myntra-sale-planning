/* ==========================================
   File: js/reports/traffic/metrics.js
   TRAFFIC REPORT
   Core metrics builder
========================================== */

import { getDataset } from "../../core/state.js";

import {
  clean,
  num
} from "../sales/helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function getTrafficRows() {
  const traffic =
    getDataset(
      "traffic"
    );

  const pm =
    getDataset(
      "productMaster"
    );

  const sjit =
    getDataset(
      "sjitStock"
    );

  const sor =
    getDataset(
      "sorStock"
    );

  return buildRows({
    traffic,
    pm,
    sjit,
    sor
  });
}

/* ==========================================
   BUILD
========================================== */

function buildRows(data) {
  const map = {};

  data.traffic.forEach(
    (r) => {
      const id =
        clean(
          r.style_id
        );

      if (!id)
        return;

      if (!map[id]) {
        map[id] =
          blank(id);
      }

      const row =
        map[id];

      row.brand =
        row.brand ||
        clean(
          r.brand
        );

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
    }
  );

  enrichPM(
    map,
    data.pm
  );

  enrichStocks(
    map,
    data.sjit,
    data.sor
  );

  return finalize(
    map
  );
}

/* ==========================================
   PRODUCT MASTER
========================================== */

function enrichPM(
  map,
  rows
) {
  rows.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    if (!map[id])
      return;

    map[id].erp =
      clean(
        r.erp_sku
      );
  });
}

/* ==========================================
   STOCKS
========================================== */

function enrichStocks(
  map,
  sjit,
  sor
) {
  sjit.forEach((r) => {
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
  });

  sor.forEach((r) => {
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
  });
}

/* ==========================================
   FINALIZE
========================================== */

function finalize(
  map
) {
  const rows =
    Object.values(
      map
    );

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

  return rows
    .map((r) => {
      r.ctr =
        safePct(
          r.clicks,
          r.impressions
        );

      r.cvr =
        safePct(
          r.purchases,
          r.clicks
        );

      r.ppc =
        safeNum(
          r.purchases,
          r.clicks
        );

      const brand =
        r.brand ||
        "Unknown";

      r.weight =
        safePct(
          r.clicks,
          brandClicks[
            brand
          ]
        );

      return r;
    })
    .sort(
      (
        a,
        b
      ) =>
        b.impressions -
        a.impressions
    );
}

/* ==========================================
   HELPERS
========================================== */

function safePct(
  a,
  b
) {
  if (!b)
    return 0;

  return (
    (a / b) *
    100
  );
}

function safeNum(
  a,
  b
) {
  if (!b)
    return 0;

  return a / b;
}

/* ==========================================
   TEMPLATE
========================================== */

function blank(id) {
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