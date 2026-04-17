/* ==========================================
   PRODUCTS.JS
   Product Detail Report Engine
   Search driven style / ERP SKU insights
========================================== */

import { getDataset, getFilters } from "../core/state.js";
import {
  formatCurrency,
  formatNumber
} from "../core/formatters.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderProductsReport() {
  const keyword =
    getFilters().search;

  renderProductDetail(
    keyword
  );

  renderRecentMatches(
    keyword
  );
}

/* ==========================================
   MAIN DETAIL
========================================== */

function renderProductDetail(
  keyword = ""
) {
  const box =
    document.getElementById(
      "productsDetail"
    );

  if (!box) return;

  if (!keyword) {
    box.innerHTML = `
      <div class="placeholder-box large">
        Search Style ID or ERP SKU
      </div>
    `;
    return;
  }

  const product =
    findBestProduct(
      keyword
    );

  if (!product) {
    box.innerHTML = `
      <div class="placeholder-box large">
        No product found
      </div>
    `;
    return;
  }

  const sales =
    getDataset("sales");

  const rows =
    sales.filter(
      (row) =>
        String(
          row.style_id
        ) ===
          String(
            product.style_id
          ) ||
        String(
          row.erp_sku
        ) ===
          String(
            product.erp_sku
          )
    );

  const units =
    rows.reduce(
      (acc, row) =>
        acc +
        Number(
          row.qty || 0
        ),
      0
    );

  const revenue =
    rows.reduce(
      (acc, row) =>
        acc +
        Number(
          row.final_amount ||
            0
        ),
      0
    );

  box.innerHTML = `
    <div class="products-summary-list">

      <div class="products-summary-item">
        <div class="products-summary-label">ERP SKU</div>
        <div class="products-summary-value">${product.erp_sku || "-"}</div>
      </div>

      <div class="products-summary-item">
        <div class="products-summary-label">Style ID</div>
        <div class="products-summary-value">${product.style_id || "-"}</div>
      </div>

      <div class="products-summary-item">
        <div class="products-summary-label">Brand</div>
        <div class="products-summary-value">${product.brand || "-"}</div>
      </div>

      <div class="products-summary-item">
        <div class="products-summary-label">Article Type</div>
        <div class="products-summary-value">${product.article_type || "-"}</div>
      </div>

      <div class="products-summary-item">
        <div class="products-summary-label">MRP</div>
        <div class="products-summary-value">${formatCurrency(
          product.mrp || 0
        )}</div>
      </div>

      <div class="products-summary-item">
        <div class="products-summary-label">TP</div>
        <div class="products-summary-value">${formatCurrency(
          product.tp || 0
        )}</div>
      </div>

      <div class="products-summary-item">
        <div class="products-summary-label">Units Sold</div>
        <div class="products-summary-value">${formatNumber(
          units
        )}</div>
      </div>

      <div class="products-summary-item">
        <div class="products-summary-label">Revenue</div>
        <div class="products-summary-value">${formatCurrency(
          revenue
        )}</div>
      </div>

    </div>
  `;
}

/* ==========================================
   RECENT MATCHES
========================================== */

function renderRecentMatches(
  keyword = ""
) {
  const box =
    document.getElementById(
      "productsMatches"
    );

  if (!box) return;

  const rows =
    keyword
      ? searchProducts(
          keyword
        )
      : getDataset(
          "productMaster"
        ).slice(0, 10);

  box.innerHTML =
    rows.length
      ? rows
          .map(
            (row) => `
      <div class="products-result-item">
        <div class="products-result-title">${row.erp_sku || "-"}</div>
        <div class="products-result-sub">
          Style: ${row.style_id || "-"} • ${row.brand || "-"}
        </div>
      </div>
    `
          )
          .join("")
      : `<div class="placeholder-box small">No Data</div>`;
}

/* ==========================================
   SEARCH HELPERS
========================================== */

function findBestProduct(
  keyword
) {
  const rows =
    searchProducts(
      keyword
    );

  return rows[0] || null;
}

function searchProducts(
  keyword
) {
  const needle =
    String(keyword)
      .toLowerCase()
      .trim();

  return getDataset(
    "productMaster"
  ).filter((row) => {
    return [
      row.erp_sku,
      row.style_id,
      row.brand
    ]
      .join(" ")
      .toLowerCase()
      .includes(
        needle
      );
  });
}