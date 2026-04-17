/* ==========================================
   CONFIG.JS
   Global App Configuration
   Central place for URLs / names / settings
========================================== */

export const APP_CONFIG = {
  appName: "MYNTRA SALES & PLANNING",
  version: "1.0.0-ui",
  environment: "production",

  currency: "INR",
  locale: "en-IN",

  defaultTab: "dashboard",

  planning: {
    coverDays: 45
  },

  search: {
    minChars: 2,
    maxSuggestions: 8,
    debounceMs: 250
  },

  ui: {
    stickyHeaderOffset: 10,
    toastDuration: 2500
  }
};

/* ==========================================
   GOOGLE SHEET CSV SOURCES
   (Locked user provided sources)
========================================== */

export const DATA_SOURCES = {
  sales: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1679615114&single=true&output=csv",

  returns: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1201655010&single=true&output=csv",

  traffic: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=533529379&single=true&output=csv",

  sjitStock: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=685171659&single=true&output=csv",

  sorStock: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=2104491192&single=true&output=csv",

  sellerStock: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=325497638&single=true&output=csv",

  productMaster: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=205952585&single=true&output=csv"
};

/* ==========================================
   KPI IDS
========================================== */

export const KPI_KEYS = [
  "revenue",
  "units",
  "return_percent",
  "sjit_stock",
  "sor_stock",
  "growth_status"
];

/* ==========================================
   TAB MAP
========================================== */

export const TAB_KEYS = [
  "dashboard",
  "sales",
  "traffic",
  "products",
  "inventory",
  "sjit",
  "sor",
  "export"
];

/* ==========================================
   EXPORT FILE PREFIXES
========================================== */

export const EXPORT_NAMES = {
  dashboard: "dashboard",
  sales: "sales_report",
  traffic: "traffic_report",
  products: "products_report",
  inventory: "inventory_report",
  sjit: "sjit_planning",
  sor: "sor_planning"
};