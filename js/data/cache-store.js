/* ==========================================
   CACHE-STORE.JS
   Dataset Cache Layer
   Uses browser localStorage + memory cache
========================================== */

import {
  setMemory,
  getMemory,
  setLocalWithTTL,
  getLocalWithTTL
} from "../core/cache.js";

/* ==========================================
   SETTINGS
========================================== */

const TTL_MINUTES = 30;

/* ==========================================
   SAVE DATASET
========================================== */

export function saveDataset(key, rows = []) {
  if (!key) return;

  setMemory(key, rows);

  setLocalWithTTL(
    `dataset:${key}`,
    rows,
    TTL_MINUTES
  );
}

/* ==========================================
   LOAD DATASET
========================================== */

export function loadDataset(key) {
  if (!key) return null;

  const memory = getMemory(key);

  if (memory) return memory;

  const local = getLocalWithTTL(
    `dataset:${key}`,
    null
  );

  if (local) {
    setMemory(key, local);
    return local;
  }

  return null;
}

/* ==========================================
   LOAD MULTIPLE
========================================== */

export function loadMany(keys = []) {
  const output = {};

  keys.forEach((key) => {
    output[key] = loadDataset(key) || [];
  });

  return output;
}