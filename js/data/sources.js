/* ==========================================
   SOURCES.JS
   FULL REPLACE CODE
   Dataset Source Registry
   Optimized for Real Progress Bar
========================================== */

import { DATA_SOURCES } from "../core/config.js";

/* ==========================================
   SOURCE MAP
========================================== */

export const SOURCES = [
  {
    key: "sales",
    label: "Sales Data",
    url: DATA_SOURCES.sales,
    priority: 1,
    lazy: false
  },
  {
    key: "returns",
    label: "Returns Data",
    url: DATA_SOURCES.returns,
    priority: 2,
    lazy: false
  },
  {
    key: "productMaster",
    label: "Product Master",
    url: DATA_SOURCES.productMaster,
    priority: 3,
    lazy: false
  },
  {
    key: "sjitStock",
    label: "SJIT Stock",
    url: DATA_SOURCES.sjitStock,
    priority: 4,
    lazy: false
  },
  {
    key: "sorStock",
    label: "SOR Stock",
    url: DATA_SOURCES.sorStock,
    priority: 5,
    lazy: false
  },

  /* lazy on demand */
  {
    key: "traffic",
    label: "Traffic Data",
    url: DATA_SOURCES.traffic,
    priority: 6,
    lazy: true
  },
  {
    key: "sellerStock",
    label: "Seller Stock",
    url: DATA_SOURCES.sellerStock,
    priority: 7,
    lazy: true
  }
];

/* ==========================================
   HELPERS
========================================== */

export function getSource(
  key
) {
  return SOURCES.find(
    (item) =>
      item.key === key
  );
}

export function getInitialSources() {
  return SOURCES
    .filter(
      (item) =>
        !item.lazy
    )
    .sort(
      (a, b) =>
        a.priority -
        b.priority
    );
}

export function getLazySources() {
  return SOURCES
    .filter(
      (item) =>
        item.lazy
    )
    .sort(
      (a, b) =>
        a.priority -
        b.priority
    );
}

export function getAllSourceKeys() {
  return SOURCES.map(
    (item) =>
      item.key
  );
}