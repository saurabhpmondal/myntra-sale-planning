/* ==========================================
   STATE.JS
   Global Reactive App State
   Single Source of Truth
========================================== */

import { APP_CONFIG } from "./config.js";

/* ==========================================
   INTERNAL STORE
========================================== */

const store = {
  activeTab: APP_CONFIG.defaultTab,

  filters: {
    month: "",
    startDate: "",
    endDate: "",
    brand: "All Brands",
    poType: "All PO Type",
    search: ""
  },

  datasets: {
    sales: [],
    returns: [],
    traffic: [],
    sjitStock: [],
    sorStock: [],
    sellerStock: [],
    productMaster: []
  },

  meta: {
    loaded: false,
    loading: false,
    lastUpdated: null
  },

  ui: {
    searchOpen: false
  }
};

/* ==========================================
   SUBSCRIBERS
========================================== */

const listeners = [];

/* ==========================================
   CORE METHODS
========================================== */

export function getState() {
  return structuredClone(store);
}

export function subscribe(callback) {
  if (typeof callback !== "function") return;

  listeners.push(callback);

  return () => {
    const index = listeners.indexOf(callback);

    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

function notify() {
  const snapshot = getState();

  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (error) {
      console.error("State listener error:", error);
    }
  });
}

/* ==========================================
   TAB STATE
========================================== */

export function setActiveTab(tabKey) {
  store.activeTab = tabKey;
  notify();
}

/* ==========================================
   FILTERS
========================================== */

export function setFilter(key, value) {
  if (!(key in store.filters)) return;

  store.filters[key] = value;
  notify();
}

export function setFilters(payload = {}) {
  Object.keys(payload).forEach((key) => {
    if (key in store.filters) {
      store.filters[key] = payload[key];
    }
  });

  notify();
}

export function resetFilters() {
  store.filters = {
    month: "",
    startDate: "",
    endDate: "",
    brand: "All Brands",
    poType: "All PO Type",
    search: ""
  };

  notify();
}

/* ==========================================
   DATASETS
========================================== */

export function setDataset(name, rows = []) {
  if (!(name in store.datasets)) return;

  store.datasets[name] = Array.isArray(rows) ? rows : [];
  notify();
}

export function setDatasets(payload = {}) {
  Object.keys(payload).forEach((key) => {
    if (key in store.datasets) {
      store.datasets[key] = Array.isArray(payload[key])
        ? payload[key]
        : [];
    }
  });

  notify();
}

export function getDataset(name) {
  return store.datasets[name] || [];
}

/* ==========================================
   META
========================================== */

export function setLoading(status) {
  store.meta.loading = Boolean(status);
  notify();
}

export function setLoaded(status) {
  store.meta.loaded = Boolean(status);
  notify();
}

export function setLastUpdated(dateValue = null) {
  store.meta.lastUpdated = dateValue || new Date().toISOString();
  notify();
}

/* ==========================================
   UI
========================================== */

export function setSearchOpen(status) {
  store.ui.searchOpen = Boolean(status);
  notify();
}

/* ==========================================
   HELPERS
========================================== */

export function getFilters() {
  return structuredClone(store.filters);
}

export function getActiveTab() {
  return store.activeTab;
}

export function isLoading() {
  return store.meta.loading;
}