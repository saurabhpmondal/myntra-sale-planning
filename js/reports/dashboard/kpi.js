/* ==========================================
   DASHBOARD / KPI.JS
   FILTER BASED GROWTH KPI
========================================== */

import {
  getDataset,
  getFilters
} from "../../core/state.js";

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

  /* RETURN % */
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

  /* STOCK */
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

  /* FILTER BASED GROWTH */
  const growth =
    calcGrowth(
      salesAll
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

  renderGrowth(
    growth
  );
}

/* ==========================================
   GROWTH
========================================== */

function calcGrowth(
  rows = []
) {
  const filters =
    getFilters();

  if (
    !filters.month
  ) {
    return {
      raw: 0,
      text: "-"
    };
  }

  const [
    year,
    month
  ] =
    filters.month
      .split("-")
      .map(Number);

  let py = year;
  let pm =
    month - 1;

  if (pm === 0) {
    pm = 12;
    py--;
  }

  const daysInMonth =
    new Date(
      year,
      month,
      0
    ).getDate();

  let selectedDay =
    daysInMonth;

  if (
    filters.endDate
  ) {
    selectedDay =
      Number(
        filters.endDate.split(
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
        r.month
      );

    const val =
      num(
        r.final_amount
      );

    if (
      y === year &&
      m === month
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
  ) {
    return {
      raw: 0,
      text: "-"
    };
  }

  const projected =
    (current /
      Math.max(
        selectedDay,
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

  return {
    raw:
      Number(pct),
    text:
      pct + "%"
  };
}

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