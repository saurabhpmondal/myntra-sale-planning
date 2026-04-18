/* ==========================================
   File: js/reports/sales/metrics.js
   CLEAN SAFE VERSION
   No Syntax Errors
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

  return buildRows({
    sales,
    salesAll:
      getDataset("sales"),
    pm:
      getDataset(
        "productMaster"
      ),
    traffic:
      getDataset(
        "traffic"
      ),
    returns:
      getDataset(
        "returns"
      ),
    sjit:
      getDataset(
        "sjitStock"
      ),
    sor:
      getDataset(
        "sorStock"
      )
  });
}

/* ==========================================
   BUILD
========================================== */

function buildRows(data) {
  const map = {};
  let totalUnits = 0;

  data.sales.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    if (!id) return;

    if (!map[id]) {
      map[id] =
        blank(id);
    }

    const row =
      map[id];

    const qty =
      num(r.qty);

    row.units += qty;
    row.gmv += num(r.final_amount);

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

  enrichPM(
    map,
    data.pm
  );

  enrichTraffic(
    map,
    data.traffic
  );

  enrichReturns(
    map,
    data.returns
  );

  enrichStocks(
    map,
    data.sjit,
    data.sor
  );

  enrichGrowth(
    map,
    data.salesAll
  );

  return finalize(
    map,
    totalUnits
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
   RATING = MAX NON ZERO
========================================== */

function enrichTraffic(
  map,
  rows
) {
  rows.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    if (
      !id ||
      !map[id]
    )
      return;

    const val =
      Number(
        r.rating
      );

    if (
      isNaN(val) ||
      val <= 0
    )
      return;

    if (
      val >
      map[id].rating
    ) {
      map[id].rating =
        val;
    }
  });
}

/* ==========================================
   RETURNS
========================================== */

function enrichReturns(
  map,
  rows
) {
  const link =
    {};

  Object.values(
    map
  ).forEach(
    (row) => {
      row.soldIds.forEach(
        (id) => {
          link[id] =
            row.styleId;
        }
      );
    }
  );

  rows.forEach((r) => {
    const oid =
      clean(
        r.order_line_id
      );

    const sid =
      link[oid];

    if (
      sid &&
      map[sid]
    ) {
      map[
        sid
      ].returnIds.add(
        oid
      );
    }
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
   GROWTH
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

  const parts =
    monthEl.value
      .split("-")
      .map(Number);

  const year =
    parts[0];

  const month =
    parts[1];

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

  const curr = {};
  const prev = {};

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
      const current =
        curr[id] || 0;

      const projected =
        elapsed > 0
          ? (current /
              elapsed) *
            totalDays
          : current;

      map[id]
        .growthPct =
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