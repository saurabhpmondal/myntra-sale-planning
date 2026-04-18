/* ==========================================
   DASHBOARD / KPI.JS
   REAL RETURN %
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
  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const returns =
    getDataset(
      "returns"
    );

  /* SALES KPI */
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

  /* UNIQUE SOLD ORDER LINES */
  const soldSet =
    new Set();

  sales.forEach((row) => {
    if (
      row.order_line_id
    ) {
      soldSet.add(
        String(
          row.order_line_id
        )
      );
    }
  });

  /* FILTER RETURNS
     only lines existing in current filtered sales
  */
  const returnSet =
    new Set();

  returns.forEach((row) => {
    const id =
      String(
        row.order_line_id ||
          ""
      ).trim();

    if (
      !id
    )
      return;

    if (
      soldSet.has(
        id
      )
    ) {
      returnSet.add(
        id
      );
    }
  });

  const returnPct =
    soldSet.size > 0
      ? (
          (returnSet.size /
            soldSet.size) *
          100
        ).toFixed(1) +
        "%"
      : "0%";

  /* STOCK KPI */
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

  /* RENDER */
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
    "-"
  );
}