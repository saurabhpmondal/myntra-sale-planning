/* ==========================================
   DASHBOARD / KPI.JS
   RETURN % + GROWTH KPI
========================================== */

import { getDataset } from "../../core/state.js";
import { applyGlobalFilters } from "../../filters/filter-engine.js";

import {
  setText,
  num,
  fc,
  fn
} from "./helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderKpis() {
  const salesAll =
    getDataset(
      "sales"
    );

  const sales =
    applyGlobalFilters(
      salesAll
    );

  const returns =
    getDataset(
      "returns"
    );

  /* CURRENT FILTERED SALES */
  const revenue =
    sales.reduce(
      (a, r) =>
        a +
        num(
          r.final_amount
        ),
      0
    );

  const units =
    sales.reduce(
      (a, r) =>
        a +
        num(r.qty),
      0
    );

  /* ======================================
     RETURN %
  ====================================== */

  const soldIds =
    new Set();

  sales.forEach((r) => {
    if (
      r.order_line_id
    ) {
      soldIds.add(
        String(
          r.order_line_id
        )
      );
    }
  });

  const returned =
    new Set();

  returns.forEach((r) => {
    const id =
      String(
        r.order_line_id ||
          ""
      ).trim();

    if (
      soldIds.has(id)
    ) {
      returned.add(
        id
      );
    }
  });

  const returnPct =
    soldIds.size > 0
      ? (
          (returned.size /
            soldIds.size) *
          100
        ).toFixed(1) +
        "%"
      : "0%";

  /* ======================================
     STOCK
  ====================================== */

  const sjit =
    getDataset(
      "sjitStock"
    ).reduce(
      (a, r) =>
        a +
        num(
          r.sellable_inventory_count
        ),
      0
    );

  const sor =
    getDataset(
      "sorStock"
    ).reduce(
      (a, r) =>
        a +
        num(
          r.units
        ),
      0
    );

  /* ======================================
     GROWTH KPI
     Last Month vs Projected Current
  ====================================== */

  const growth =
    calcGrowth(
      salesAll
    );

  /* ======================================
     RENDER
  ====================================== */

  setText(
    "kpiRevenue",
    fc(revenue)
  );

  setText(
    "kpiUnits",
    fn(units)
  );

  setText(
    "kpiReturn",
    returnPct
  );

  setText(
    "kpiSjit",
    fn(sjit)
  );

  setText(
    "kpiSor",
    fn(sor)
  );

  setText(
    "kpiGrowth",
    growth
  );
}

/* ==========================================
   GROWTH
========================================== */

function calcGrowth(
  rows = []
) {
  if (!rows.length)
    return "-";

  const now =
    new Date();

  const cy =
    now.getFullYear();

  const cm =
    now.getMonth() +
    1;

  const today =
    now.getDate();

  const daysInMonth =
    new Date(
      cy,
      cm,
      0
    ).getDate();

  let py = cy;
  let pm = cm - 1;

  if (pm === 0) {
    pm = 12;
    py--;
  }

  let current =
    0;
  let previous =
    0;

  rows.forEach((r) => {
    const y =
      Number(
        r.year
      );

    const m =
      Number(
        r.month
      );

    const val =
      num(
        r.final_amount
      );

    if (
      y === cy &&
      m === cm
    ) {
      current +=
        val;
    }

    if (
      y === py &&
      m === pm
    ) {
      previous +=
        val;
    }
  });

  if (
    previous === 0
  )
    return "-";

  const projected =
    (current /
      Math.max(
        today,
        1
      )) *
    daysInMonth;

  const pct =
    (
      ((projected -
        previous) /
        previous) *
      100
    ).toFixed(1);

  return pct + "%";
}