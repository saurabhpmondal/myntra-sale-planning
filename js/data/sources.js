/* ==========================================
   SOURCES.JS
   Dataset Source Registry
   TRAFFIC ENABLED FOR SALES RATINGS
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
    priority: "high",
    lazy: false
  },
  {
    key: "productMaster",
    label: "Product Master",
    url: DATA_SOURCES.productMaster,
    priority: "high",
    lazy: false
  },
  {
    key: "sjitStock",
    label: "SJIT Stock",
    url: DATA_SOURCES.sjitStock,
    priority: "high",
    lazy: false
  },
  {
    key: "sorStock",
    label: "SOR Stock",
    url: DATA_SOURCES.sorStock,
    priority: "high",
    lazy: false
  },
  {
    key: "returns",
    label: "Returns Data",
    url: DATA_SOURCES.returns,
    priority: "high",
    lazy: false
  },

  /* NOW PRELOAD */
  {
    key: "traffic",
    label: "Traffic Data",
    url: DATA_SOURCES.traffic,
    priority: "high",
    lazy: false
  },

  {
    key: "sellerStock",
    label: "Seller Stock",
    url: DATA_SOURCES.sellerStock,
    priority: "low",
    lazy: true
  }
];

/* ==========================================
   HELPERS
========================================== */

export function getSource(key) {
  return SOURCES.find(
    (item) =>
      item.key === key
  );
}

export function getInitialSources() {
  return SOURCES.filter(
    (item) =>
      !item.lazy
  );
}

export function getLazySources() {
  return SOURCES.filter(
    (item) =>
      item.lazy
  );
}

export function getAllSourceKeys() {
  return SOURCES.map(
    (item) =>
      item.key
  );
}