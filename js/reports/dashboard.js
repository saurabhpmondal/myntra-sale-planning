/* ==========================================
   DASHBOARD.JS
   Dashboard V2
========================================== */

import { getDataset } from "../core/state.js";
import { applyGlobalFilters } from "../filters/filter-engine.js";
import {
  formatCurrency,
  formatNumber,
  formatPercent
} from "../core/formatters.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderDashboard() {
  renderKpis();
  renderChartPlaceholder();

  renderBrandTable();
  renderPoTypeTable();

  renderPriceRangeTable();
  renderErpStatusTable();

  renderStockCoverTable();
}

/* ==========================================
   KPI
========================================== */

function renderKpis() {
  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const revenue =
    sales.reduce(
      (a, r) =>
        a +
        Number(
          r.final_amount ||
            0
        ),
      0
    );

  const units =
    sales.reduce(
      (a, r) =>
        a +
        Number(
          r.qty || 0
        ),
      0
    );

  const sjit =
    getDataset(
      "sjitStock"
    ).reduce(
      (a, r) =>
        a +
        Number(
          r.sellable_inventory_count ||
            0
        ),
      0
    );

  const sor =
    getDataset(
      "sorStock"
    ).reduce(
      (a, r) =>
        a +
        Number(
          r.units || 0
        ),
      0
    );

  setText(
    "kpiRevenue",
    formatCurrency(
      revenue
    )
  );

  setText(
    "kpiUnits",
    formatNumber(
      units
    )
  );

  setText(
    "kpiReturn",
    formatPercent(0)
  );

  setText(
    "kpiSjit",
    formatNumber(
      sjit
    )
  );

  setText(
    "kpiSor",
    formatNumber(
      sor
    )
  );

  setText(
    "kpiGrowth",
    "-"
  );
}

/* ==========================================
   CHART
========================================== */

function renderChartPlaceholder() {
  const el =
    byId(
      "dashboardDailyChart"
    );

  if (!el) return;

  el.innerHTML = `
    <div class="placeholder-box large">
      Date Wise Units Chart
    </div>
  `;
}

/* ==========================================
   BRAND
========================================== */

function renderBrandTable() {
  const el =
    byId(
      "dashboardBrandSummary"
    );

  if (!el) return;

  const rows =
    applyGlobalFilters(
      getDataset("sales")
    );

  const map = {};

  rows.forEach((r) => {
    const k =
      r.brand ||
      "Unknown";

    if (!map[k]) {
      map[k] = {
        gmv: 0,
        units: 0
      };
    }

    map[k].gmv +=
      num(
        r.final_amount
      );

    map[k].units +=
      num(r.qty);
  });

  const data =
    Object.entries(map)
      .map(
        ([brand, v]) => ({
          brand,
          ...v,
          asp:
            v.units
              ? v.gmv /
                v.units
              : 0
        })
      )
      .sort(
        (a, b) =>
          b.gmv - a.gmv
      )
      .slice(0, 10);

  el.innerHTML =
    buildTable(
      ["Brand", "GMV", "Units", "ASP"],
      data.map((r) => [
        r.brand,
        formatCurrency(
          r.gmv
        ),
        formatNumber(
          r.units
        ),
        formatCurrency(
          r.asp
        )
      ])
    );
}

/* ==========================================
   PO TYPE
========================================== */

function renderPoTypeTable() {
  const el =
    byId(
      "dashboardPoSummary"
    );

  if (!el) return;

  const rows =
    applyGlobalFilters(
      getDataset("sales")
    );

  const map = {};

  rows.forEach((r) => {
    const k =
      r.po_type ||
      "Unknown";

    if (!map[k]) {
      map[k] = {
        gmv: 0,
        units: 0
      };
    }

    map[k].gmv +=
      num(
        r.final_amount
      );

    map[k].units +=
      num(r.qty);
  });

  const data =
    Object.entries(map)
      .map(
        ([type, v]) => ({
          type,
          ...v,
          asp:
            v.units
              ? v.gmv /
                v.units
              : 0
        })
      )
      .sort(
        (a, b) =>
          b.gmv - a.gmv
      );

  el.innerHTML =
    buildTable(
      [
        "PO Type",
        "GMV",
        "Units",
        "ASP"
      ],
      data.map((r) => [
        r.type,
        formatCurrency(
          r.gmv
        ),
        formatNumber(
          r.units
        ),
        formatCurrency(
          r.asp
        )
      ])
    );
}

/* ==========================================
   PRICE RANGE
========================================== */

function renderPriceRangeTable() {
  const el =
    byId(
      "dashboardPriceRange"
    );

  if (!el) return;

  const buckets = [
    "0-300",
    "301-600",
    "601-800",
    "801-1000",
    "1001-1500",
    "1501-2000",
    ">2000"
  ];

  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const map = {};

  buckets.forEach((b) => {
    map[b] = {
      units: 0,
      brands: {}
    };
  });

  sales.forEach((r) => {
    const price =
      num(
        r.final_amount
      );

    const bucket =
      getPriceBucket(
        price
      );

    if (!bucket) return;

    map[bucket].units +=
      num(r.qty);

    const brand =
      r.brand ||
      "Unknown";

    map[
      bucket
    ].brands[
      brand
    ] =
      (map[
        bucket
      ].brands[
        brand
      ] || 0) +
      num(r.qty);
  });

  const rows =
    buckets.map((b) => [
      b,
      formatNumber(
        map[b].units
      ),
      topBrand(
        map[b].brands
      )
    ]);

  el.innerHTML =
    buildTable(
      [
        "Price Range",
        "Units",
        "Top Brand"
      ],
      rows
    );
}

/* ==========================================
   ERP STATUS
========================================== */

function renderErpStatusTable() {
  const el =
    byId(
      "dashboardErpStatus"
    );

  if (!el) return;

  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const pm =
    getDataset(
      "productMaster"
    );

  const statusMap =
    {};

  pm.forEach((r) => {
    statusMap[
      r.style_id
    ] =
      r.status ||
      "Unknown";
  });

  const map = {};

  sales.forEach((r) => {
    const key =
      statusMap[
        r.style_id
      ] ||
      "Unknown";

    if (!map[key]) {
      map[key] = {
        gmv: 0,
        units: 0
      };
    }

    map[key].gmv +=
      num(
        r.final_amount
      );

    map[key].units +=
      num(r.qty);
  });

  const data =
    Object.entries(map)
      .map(
        ([status, v]) => ({
          status,
          ...v,
          asp:
            v.units
              ? v.gmv /
                v.units
              : 0
        })
      )
      .sort(
        (a, b) =>
          b.gmv - a.gmv
      );

  el.innerHTML =
    buildTable(
      [
        "ERP Status",
        "GMV",
        "Units",
        "ASP"
      ],
      data.map((r) => [
        r.status,
        formatCurrency(
          r.gmv
        ),
        formatNumber(
          r.units
        ),
        formatCurrency(
          r.asp
        )
      ])
    );
}

/* ==========================================
   STOCK COVER
========================================== */

function renderStockCoverTable() {
  const el =
    byId(
      "dashboardStockCover"
    );

  if (!el) return;

  const buckets = [
    "<30",
    "30-45",
    "45-60",
    "60-90",
    ">90"
  ];

  const map = {};

  buckets.forEach((b) => {
    map[b] = {
      sjit: 0,
      sor: 0
    };
  });

  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const adsMap = {};

  sales.forEach((r) => {
    const style =
      r.style_id;

    adsMap[style] =
      (adsMap[
        style
      ] || 0) +
      num(r.qty);
  });

  Object.keys(
    adsMap
  ).forEach((k) => {
    adsMap[k] =
      adsMap[k] / 30;
  });

  getDataset(
    "sjitStock"
  ).forEach((r) => {
    const ads =
      adsMap[
        r.style_id
      ] || 0;

    const cover =
      ads
        ? num(
            r.sellable_inventory_count
          ) / ads
        : 999;

    const b =
      getCoverBucket(
        cover
      );

    map[b].sjit +=
      num(
        r.sellable_inventory_count
      );
  });

  getDataset(
    "sorStock"
  ).forEach((r) => {
    const ads =
      adsMap[
        r.style_id
      ] || 0;

    const cover =
      ads
        ? num(
            r.units
          ) / ads
        : 999;

    const b =
      getCoverBucket(
        cover
      );

    map[b].sor +=
      num(r.units);
  });

  el.innerHTML =
    buildTable(
      [
        "Cover",
        "SJIT Units",
        "SOR Units"
      ],
      buckets.map((b) => [
        b,
        formatNumber(
          map[b].sjit
        ),
        formatNumber(
          map[b].sor
        )
      ])
    );
}

/* ==========================================
   HELPERS
========================================== */

function buildTable(
  headers,
  rows
) {
  return `
  <div class="table-wrap">
    <table class="data-table zebra">
      <thead>
        <tr>
          ${headers
            .map(
              (h) =>
                `<th>${h}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (r) => `
          <tr>
            ${r
              .map(
                (v) =>
                  `<td>${v}</td>`
              )
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>`;
}

function getPriceBucket(
  v
) {
  if (v <= 300)
    return "0-300";
  if (v <= 600)
    return "301-600";
  if (v <= 800)
    return "601-800";
  if (v <= 1000)
    return "801-1000";
  if (v <= 1500)
    return "1001-1500";
  if (v <= 2000)
    return "1501-2000";
  return ">2000";
}

function getCoverBucket(
  v
) {
  if (v < 30)
    return "<30";
  if (v <= 45)
    return "30-45";
  if (v <= 60)
    return "45-60";
  if (v <= 90)
    return "60-90";
  return ">90";
}

function topBrand(
  obj = {}
) {
  let top =
    "-";
  let max = 0;

  Object.entries(obj)
    .forEach(
      ([k, v]) => {
        if (
          v > max
        ) {
          max = v;
          top = k;
        }
      }
    );

  return top;
}

function setText(
  id,
  value
) {
  const el =
    byId(id);

  if (el)
    el.textContent =
      value;
}

function byId(id) {
  return document.getElementById(
    id
  );
}

function num(v) {
  return Number(v || 0);
}