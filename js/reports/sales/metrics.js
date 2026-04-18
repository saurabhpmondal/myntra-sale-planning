/* ==========================================
   SALES REPORT / METRICS.JS
   FINAL LOGIC ROUND
========================================== */

import { getDataset } from "../../core/state.js";
import { applyGlobalFilters } from "../../filters/filter-engine.js";
import { normalizeMonth } from "../../normalize/dates.js";

import {
  num,
  divide,
  growthPct,
  clean,
  byGmvDesc
} from "./helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function getSalesRows() {
  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const salesAll =
    getDataset("sales");

  const pm =
    getDataset("productMaster");

  const traffic =
    getDataset("traffic");

  const returns =
    getDataset("returns");

  const sjit =
    getDataset("sjitStock");

  const sor =
    getDataset("sorStock");

  return buildRows({
    sales,
    salesAll,
    pm,
    traffic,
    returns,
    sjit,
    sor
  });
}

/* ==========================================
   BUILD
========================================== */

function buildRows(data) {
  const {
    sales,
    salesAll,
    pm,
    traffic,
    returns,
    sjit,
    sor
  } = data;

  const map = {};
  let totalUnits = 0;

  sales.forEach((r) => {
    const id =
      clean(r.style_id);

    if (!id) return;

    if (!map[id]) {
      map[id] =
        blank(id);
    }

    const row =
      map[id];

    const qty =
      num(r.qty);

    const gmv =
      num(
        r.final_amount
      );

    row.gmv += gmv;
    row.units += qty;

    totalUnits += qty;

    row.brand =
      row.brand ||
      clean(r.brand);

    if (
      r.order_line_id
    ) {
      row.soldIds.add(
        clean(
          r.order_line_id
        )
      );
    }

    const po =
      clean(
        r.po_type
      ).toUpperCase();

    if (po === "PPMP")
      row.ppmp += qty;

    if (po === "SJIT")
      row.sjitSale += qty;

    if (po === "SOR")
      row.sorSale += qty;
  });

  enrichPM(map, pm);
  enrichTraffic(
    map,
    traffic
  );
  enrichReturns(
    map,
    returns
  );
  enrichStocks(
    map,
    sjit,
    sor
  );
  enrichGrowth(
    map,
    salesAll
  );

  return finalize(
    map,
    totalUnits
  );
}

/* ==========================================
   ENRICHERS
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

    if (
      !map[id].brand
    ) {
      map[id].brand =
        clean(
          r.brand
        );
    }
  });
}

function enrichTraffic(
  map,
  rows
) {
  const ratingMap =
    {};

  rows.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    if (
      !map[id]
    )
      return;

    const val =
      num(
        r.rating
      );

    if (val > 0) {
      if (
        !ratingMap[id]
      ) {
        ratingMap[
          id
        ] = {
          sum: 0,
          count: 0
        };
      }

      ratingMap[
        id
      ].sum += val;

      ratingMap[
        id
      ].count += 1;
    }
  });

  Object.keys(
    ratingMap
  ).forEach(
    (id) => {
      map[id].rating =
        ratingMap[
          id
        ].sum /
        ratingMap[
          id
        ].count;
    }
  );
}

function enrichReturns(
  map,
  rows
) {
  const lineMap =
    {};

  Object.values(
    map
  ).forEach(
    (row) => {
      row.soldIds.forEach(
        (id) => {
          lineMap[id] =
            row.styleId;
        }
      );
    }
  );

  rows.forEach((r) => {
    const id =
      clean(
        r.order_line_id
      );

    const style =
      lineMap[id];

    if (
      style &&
      map[style]
    ) {
      map[
        style
      ].returnIds.add(
        id
      );
    }
  });
}

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
      map[id].sjitStock +=
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
      map[id].sorStock +=
        num(
          r.units
        );
    }
  });
}

/* ==========================================
   PROJECTED GROWTH
========================================== */

function enrichGrowth(
  map,
  rows
) {
  const monthEl =
    document.getElementById(
      "monthFilter"
    );

  const endEl =
    document.getElementById(
      "endDate"
    );

  if (
    !monthEl ||
    !monthEl.value
  )
    return;

  const [
    year,
    month
  ] =
    monthEl.value
      .split("-")
      .map(Number);

  let py = year;
  let pm =
    month - 1;

  if (pm === 0) {
    pm = 12;
    py--;
  }

  const totalDays =
    new Date(
      year,
      month,
      0
    ).getDate();

  let elapsed =
    totalDays;

  if (
    endEl &&
    endEl.value
  ) {
    elapsed =
      Number(
        endEl.value.split(
          "-"
        )[2]
      );
  }

  const curr =
    {};
  const prev =
    {};

  rows.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    const y =
      Number(
        r.year
      );

    const m =
      Number(
        normalizeMonth(
          r.month
        )
      );

    const val =
      num(
        r.final_amount
      );

    if (
      y === year &&
      m === month
    ) {
      curr[id] =
        (curr[id] ||
          0) + val;
    }

    if (
      y === py &&
      m === pm
    ) {
      prev[id] =
        (prev[id] ||
          0) + val;
    }
  });

  Object.keys(
    map
  ).forEach(
    (id) => {
      const cm =
        curr[id] ||
        0;

      const projected =
        elapsed > 0
          ? (cm /
              elapsed) *
            totalDays
          : cm;

      map[id].growthPct =
        growthPct(
          projected,
          prev[id]
        );
    }
  );
}

/* ==========================================
   FINALIZE
========================================== */

function finalize(
  map,
  totalUnits
) {
  return Object.values(
    map
  )
    .map((r) => {
      r.asp =
        divide(
          r.gmv,
          r.units
        );

      r.returnPct =
        divide(
          r.returnIds
            .size *
            100,
          r.soldIds
            .size
        );

      r.ppmpPct =
        divide(
          r.ppmp *
            100,
          r.units
        );

      r.sjitPct =
        divide(
          r.sjitSale *
            100,
          r.units
        );

      r.sorPct =
        divide(
          r.sorSale *
            100,
          r.units
        );

      r.sharePct =
        divide(
          r.units *
            100,
          totalUnits
        );

      return r;
    })
    .sort(
      byGmvDesc
    );
}

/* ==========================================
   TEMPLATE
========================================== */

function blank(id) {
  return {
    styleId: id,
    erp: "",
    brand: "",
    rating: 0,

    gmv: 0,
    units: 0,
    asp: 0,

    ppmp: 0,
    sjitSale: 0,
    sorSale: 0,

    ppmpPct: 0,
    sjitPct: 0,
    sorPct: 0,

    growthPct: 0,
    sharePct: 0,

    sjitStock: 0,
    sorStock: 0,

    soldIds:
      new Set(),

    returnIds:
      new Set()
  };
}