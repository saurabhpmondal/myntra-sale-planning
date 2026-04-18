/* ==========================================
   File: js/reports/sjit/metrics.js
   FULL REPLACE CODE
   V4.1 SAFE REBUILD
========================================== */

import { getDataset } from "../../core/state.js";
import { clean, num } from "../sales/helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function getSjitRows() {
  const rows =
    buildRows({
      sales:
        getDataset(
          "sales"
        ) || [],
      returns:
        getDataset(
          "returns"
        ) || [],
      pm:
        getDataset(
          "productMaster"
        ) || [],
      traffic:
        getDataset(
          "traffic"
        ) || [],
      sjit:
        getDataset(
          "sjitStock"
        ) || []
    });

  return rows.sort(
    (a, b) =>
      b.totalQty -
      a.totalQty ||
      b.net - a.net
  );
}

/* ==========================================
   BUILD
========================================== */

function buildRows(data) {
  const map = {};
  const soldLink = {};

  data.sales.forEach((r) => {
    if (
      !isLast30Day(
        r
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

    const line =
      clean(
        r.order_line_id
      );

    if (line) {
      soldLink[
        line
      ] = id;
    }

    const zone =
      getZone(
        clean(
          r.state ||
          r.ship_state
        ).toUpperCase()
      );

    if (
      zone ===
      "North"
    ) {
      row.northDemand +=
        qty;
    }

    if (
      zone ===
      "South"
    ) {
      row.southDemand +=
        qty;
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
        soldLink[
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

  /* PRODUCT MASTER */
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

      const val =
        Number(
          r.rating
        );

      if (
        !isNaN(
          val
        ) &&
        val >
          map[id]
            .rating
      ) {
        map[id].rating =
          val;
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
    r.drr * 45;

  let total = 0;
  let recall = 0;

  const badStatus =
    upper(
      r.status
    ) !==
    "CONTINUE";

  const badRating =
    r.rating > 0 &&
    r.rating < 3.5;

  if (
    r.stock > 0 &&
    (
      r.drr === 0 ||
      badStatus ||
      badRating
    )
  ) {
    recall =
      r.stock;
  } else if (
    r.sc > 60
  ) {
    recall =
      ceil0(
        r.stock -
          target
      );
  } else {
    total =
      ceil0(
        target -
          r.stock
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

  const total =
    north + south;

  if (
    total <= 0
  ) {
    return {
      north: 0,
      south: 0
    };
  }

  const northQty =
    Math.round(
      qty *
        north /
        total
    );

  return {
    north:
      northQty,
    south:
      qty -
      northQty
  };
}

function ceil0(v) {
  if (v <= 0)
    return 0;

  return Math.max(
    1,
    Math.ceil(v)
  );
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

/* ==========================================
   DATE LOGIC
========================================== */

function isLast30Day(r) {
  const dt =
    parseDate(
      r.order_date ||
      r.date
    );

  if (dt) {
    const cut =
      new Date();

    cut.setDate(
      cut.getDate() -
        30
    );

    cut.setHours(
      0,0,0,0
    );

    return dt >= cut;
  }

  /* fallback */
  const y =
    Number(r.year);

  const m =
    Number(r.month);

  if (!y || !m)
    return false;

  const now =
    new Date();

  const d =
    new Date(
      y,
      m - 1,
      1
    );

  const cut =
    new Date();

  cut.setDate(
    cut.getDate() -
      30
  );

  return d >=
    new Date(
      cut.getFullYear(),
      cut.getMonth(),
      1
    );
}

function parseDate(v) {
  if (!v) return null;

  const d =
    new Date(v);

  if (
    !isNaN(d)
  )
    return d;

  return null;
}

/* ==========================================
   ZONE
========================================== */

function getZone(x) {
  if (
    [
      "UP","DL","HR","UT",
      "PB","HP","JK","CH"
    ].includes(x)
  )
    return "North";

  if (
    [
      "KA","TG","AP",
      "TN","KL","PY"
    ].includes(x)
  )
    return "South";

  return "";
}