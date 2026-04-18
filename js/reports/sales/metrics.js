/* ==========================================
   SALES REPORT / METRICS.JS
   Style level aggregation engine
========================================== */

import {
  getDataset
} from "../../core/state.js";

import {
  applyGlobalFilters
} from "../../filters/filter-engine.js";

import {
  num,
  divide,
  growthPct,
  clean,
  byGmvDesc
} from "./helpers.js";

import {
  normalizeMonth
} from "../../normalize/dates.js";

/* ==========================================
   PUBLIC
========================================== */

export function getSalesRows() {
  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const pm =
    getDataset(
      "productMaster"
    );

  const traffic =
    getDataset(
      "traffic"
    );

  const returns =
    getDataset(
      "returns"
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
    sales,
    pm,
    traffic,
    returns,
    sjit,
    sor
  });
}

/* ==========================================
   CORE BUILD
========================================== */

function buildRows(
  data
) {
  const {
    sales,
    pm,
    traffic,
    returns,
    sjit,
    sor
  } = data;

  const map = {};

  let totalUnits = 0;

  /* current sales */
  sales.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    if (!id) return;

    if (!map[id]) {
      map[id] =
        blankRow(id);
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

    if (
      r.order_line_id
    ) {
      row.soldIds.add(
        clean(
          r.order_line_id
        )
      );
    }
  });

  /* product master */
  pm.forEach((r) => {
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

      if (
        !map[id].brand
      ) {
        map[id].brand =
          clean(
            r.brand
          );
      }
    }
  });

  /* rating */
  traffic.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    if (
      map[id]
    ) {
      map[id].rating =
        num(
          r.rating
        );
    }
  });

  /* returns */
  const styleByLine =
    {};

  Object.values(map)
    .forEach(
      (row) => {
        row.soldIds.forEach(
          (id) => {
            styleByLine[
              id
            ] =
              row.styleId;
          }
        );
      }
    );

  returns.forEach((r) => {
    const id =
      clean(
        r.order_line_id
      );

    const style =
      styleByLine[
        id
      ];

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

  /* stocks */
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

  /* growth */
  applyGrowth(
    map
  );

  /* finalize */
  const rows =
    Object.values(
      map
    ).map(
      (r) => {
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
      }
    );

  return rows.sort(
    byGmvDesc
  );
}

/* ==========================================
   GROWTH
========================================== */

function applyGrowth(
  map
) {
  const sales =
    getDataset(
      "sales"
    );

  const now =
    new Date();

  const cy =
    now.getFullYear();

  const cm =
    now.getMonth() +
    1;

  let py = cy;
  let pm =
    cm - 1;

  if (pm === 0) {
    pm = 12;
    py--;
  }

  const curr =
    {};
  const prev =
    {};

  sales.forEach((r) => {
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
      y === cy &&
      m === cm
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
      map[id].growthPct =
        growthPct(
          curr[id],
          prev[id]
        );
    }
  );
}

/* ==========================================
   HELPERS
========================================== */

function blankRow(
  id
) {
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
      new Set(),

    returnPct: 0
  };
}