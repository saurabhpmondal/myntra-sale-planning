/* ==========================================
   File: js/reports/dashboard/kpi.js
   FULL REPLACE CODE
   Projected Growth KPI + Stable Current Month Logic
========================================== */

import {
  getDataset
} from "../../core/state.js";

import {
  applyGlobalFilters
} from "../../filters/filter-engine.js";

import {
  normalizeMonth
} from "../../normalize/dates.js";

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
    getDataset("sales");

  const sales =
    applyGlobalFilters(
      salesAll
    );

  const returns =
    getDataset(
      "returns"
    );

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

  const sold =
    new Set();

  sales.forEach((r) => {
    if (
      r.order_line_id
    ) {
      sold.add(
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
      sold.has(id)
    ) {
      returned.add(
        id
      );
    }
  });

  const returnPct =
    sold.size > 0
      ? (
          (returned.size /
            sold.size) *
          100
        ).toFixed(1) +
        "%"
      : "0%";

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

  const growth =
    calcProjectedGrowth(
      salesAll
    );

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

  renderGrowth(
    growth
  );
}

/* ==========================================
   PROJECTED KPI GROWTH
========================================== */

function calcProjectedGrowth(
  rows = []
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
  ) {
    return {
      raw: 0,
      text: "0.0%"
    };
  }

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
      current += val;
    }

    if (
      y === py &&
      m === pm
    ) {
      previous += val;
    }
  });

  const projected =
    elapsed > 0
      ? (current /
          elapsed) *
        totalDays
      : current;

  let pct = 0;

  if (
    previous === 0 &&
    projected > 0
  ) {
    pct =
      ((projected -
        1) /
        1) *
      100;
  } else if (
    previous > 0
  ) {
    pct =
      ((projected -
        previous) /
        previous) *
      100;
  }

  return {
    raw:
      Number(
        pct.toFixed(1)
      ),
    text:
      pct.toFixed(1) +
      "%"
  };
}

/* ==========================================
   RENDER GROWTH
========================================== */

function renderGrowth(
  growth
) {
  const el =
    document.getElementById(
      "kpiGrowth"
    );

  if (!el) return;

  if (
    growth.raw > 0
  ) {
    el.innerHTML =
      "▲ " +
      growth.text;
    el.style.color =
      "#16a34a";
  } else if (
    growth.raw < 0
  ) {
    el.innerHTML =
      "▼ " +
      growth.text;
    el.style.color =
      "#dc2626";
  } else {
    el.innerHTML =
      growth.text;
    el.style.color =
      "#64748b";
  }
}