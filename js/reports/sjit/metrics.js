/* ==========================================
   File: js/reports/sjit/metrics.js
   FULL REPLACE CODE
   FIXED: Uses SAME monthFilter logic
   as working Sales report
========================================== */

import { getDataset } from "../../core/state.js";
import { clean, num } from "../sales/helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function getSjitRows() {
  const sales =
    getDataset("sales") || [];

  const returns =
    getDataset("returns") || [];

  const pm =
    getDataset("productMaster") || [];

  const traffic =
    getDataset("traffic") || [];

  const sjit =
    getDataset("sjitStock") || [];

  const rows =
    buildRows({
      sales,
      returns,
      pm,
      traffic,
      sjit
    });

  return rows.sort(
    (a, b) =>
      b.totalQty -
      a.totalQty
  );
}

/* ==========================================
   BUILD
========================================== */

function buildRows(data) {
  const map = {};
  const soldLines = {};

  const validMonths =
    getLast30DayMonths();

  /* SALES */
  data.sales.forEach((r) => {
    const ym =
      `${r.year}-${pad2(
        r.month
      )}`;

    if (
      !validMonths.has(
        ym
      )
    )
      return;

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

    const qty =
      num(r.qty);

    row.gross += qty;

    row.brand =
      row.brand ||
      clean(
        r.brand
      );

    const state =
      clean(
        r.state ||
          r.ship_state ||
          ""
      ).toUpperCase();

    if (
      isNorth(
        state
      )
    ) {
      row.northDemand +=
        qty;
    }

    if (
      isSouth(
        state
      )
    ) {
      row.southDemand +=
        qty;
    }

    const line =
      clean(
        r.order_line_id
      );

    if (line) {
      soldLines[
        line
      ] = id;
    }
  });

  /* RETURNS */
  data.returns.forEach(
    (r) => {
      const line =
        clean(
          r.order_line_id
        );

      const id =
        soldLines[
          line
        ];

      if (
        id &&
        map[id]
      ) {
        map[id]
          .returns += 1;
      }
    }
  );

  /* PM */
  data.pm.forEach(
    (r) => {
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

      map[id].status =
        clean(
          r.status
        );
    }
  );

  /* RATING */
  data.traffic.forEach(
    (r) => {
      const id =
        clean(
          r.style_id
        );

      if (!map[id])
        return;

      const rating =
        Number(
          r.rating
        );

      if (
        !isNaN(
          rating
        ) &&
        rating >
          map[id]
            .rating
      ) {
        map[id].rating =
          rating;
      }
    }
  );

  /* STOCK */
  data.sjit.forEach(
    (r) => {
      const id =
        clean(
          r.style_id
        );

      if (!map[id])
        return;

      map[id].stock +=
        num(
          r.sellable_inventory_count
        );
    }
  );

  return Object.values(
    map
  ).map((r) =>
    finalizeRow(r)
  );
}

/* ==========================================
   FINALIZE
========================================== */

function finalizeRow(r) {
  r.net =
    Math.max(
      0,
      r.gross -
        r.returns
    );

  r.returnPct =
    pct(
      r.returns,
      r.gross
    );

  r.drr =
    r.net / 30;

  r.sc =
    r.drr > 0
      ? r.stock /
        r.drr
      : 0;

  const target =
    45 * r.drr;

  let total = 0;
  let recall = 0;

  if (
    r.stock > 0 &&
    (
      r.drr === 0 ||
      upper(
        r.status
      ) !==
        "CONTINUE" ||
      r.rating <
        3.5
    )
  ) {
    recall =
      r.stock;
  } else if (
    r.sc > 60
  ) {
    recall =
      Math.max(
        0,
        Math.ceil(
          r.stock -
            target
        )
      );
  } else {
    total =
      Math.max(
        0,
        Math.ceil(
          target -
            r.stock
        )
      );
  }

  const split =
    splitQty(
      total,
      r.northDemand,
      r.southDemand
    );

  r.northQty =
    split.north;

  r.southQty =
    split.south;

  r.totalQty =
    total;

  r.recallQty =
    recall;

  return r;
}

/* ==========================================
   LAST 30 DAY MONTH LOGIC
========================================== */

function getLast30DayMonths() {
  const set =
    new Set();

  const d =
    new Date();

  for (
    let i = 0;
    i < 30;
    i++
  ) {
    const x =
      new Date(d);

    x.setDate(
      d.getDate() -
        i
    );

    const key =
      `${x.getFullYear()}-${pad2(
        x.getMonth() +
          1
      )}`;

    set.add(key);
  }

  return set;
}

/* ==========================================
   HELPERS
========================================== */

function blank(id) {
  return {
    styleId: id,
    erp: "",
    status: "",
    brand: "",
    rating: 0,

    gross: 0,
    returns: 0,
    net: 0,
    returnPct: 0,

    northDemand: 0,
    southDemand: 0,

    drr: 0,
    stock: 0,
    sc: 0,

    northQty: 0,
    southQty: 0,
    totalQty: 0,
    recallQty: 0
  };
}

function splitQty(
  qty,
  north,
  south
) {
  if (
    qty <= 0
  ) {
    return {
      north: 0,
      south: 0
    };
  }

  const t =
    north + south;

  if (t <= 0) {
    return {
      north: 0,
      south: 0
    };
  }

  const n =
    Math.round(
      qty *
        north /
        t
    );

  return {
    north: n,
    south:
      qty - n
  };
}

function pct(a, b) {
  if (!b) return 0;
  return (a / b) * 100;
}

function upper(v) {
  return String(
    v || ""
  )
    .trim()
    .toUpperCase();
}

function pad2(v) {
  return String(v)
    .padStart(
      2,
      "0"
    );
}

function isNorth(x) {
  return [
    "UP","DL","HR","UT",
    "PB","HP","JK","CH"
  ].includes(x);
}

function isSouth(x) {
  return [
    "KA","TG","AP",
    "TN","KL","PY"
  ].includes(x);
}