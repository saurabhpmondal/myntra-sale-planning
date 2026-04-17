/* ==========================================
   CACHE.JS
   Lightweight Browser Cache Layer
   localStorage + memory safe helpers
========================================== */

const PREFIX = "myntra_sales_planning";

/* ==========================================
   MEMORY CACHE
========================================== */

const memoryStore = new Map();

/* ==========================================
   KEYS
========================================== */

function makeKey(key) {
  return `${PREFIX}:${key}`;
}

/* ==========================================
   MEMORY METHODS
========================================== */

export function setMemory(key, value) {
  memoryStore.set(makeKey(key), value);
}

export function getMemory(key, fallback = null) {
  const fullKey = makeKey(key);

  if (!memoryStore.has(fullKey)) {
    return fallback;
  }

  return memoryStore.get(fullKey);
}

export function removeMemory(key) {
  memoryStore.delete(makeKey(key));
}

export function clearMemory() {
  memoryStore.clear();
}

/* ==========================================
   LOCAL STORAGE METHODS
========================================== */

export function setLocal(key, value) {
  try {
    const payload = JSON.stringify(value);
    localStorage.setItem(makeKey(key), payload);
  } catch (error) {
    console.warn("Local cache set failed:", error);
  }
}

export function getLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(makeKey(key));

    if (!raw) return fallback;

    return JSON.parse(raw);
  } catch (error) {
    console.warn("Local cache read failed:", error);
    return fallback;
  }
}

export function removeLocal(key) {
  try {
    localStorage.removeItem(makeKey(key));
  } catch (error) {
    console.warn("Local cache remove failed:", error);
  }
}

export function clearLocal() {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`${PREFIX}:`)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Local cache clear failed:", error);
  }
}

/* ==========================================
   TTL CACHE
========================================== */

export function setLocalWithTTL(key, value, ttlMinutes = 60) {
  const expiresAt =
    Date.now() + Number(ttlMinutes) * 60 * 1000;

  setLocal(key, {
    value,
    expiresAt
  });
}

export function getLocalWithTTL(key, fallback = null) {
  const payload = getLocal(key);

  if (!payload) return fallback;

  if (!payload.expiresAt || Date.now() > payload.expiresAt) {
    removeLocal(key);
    return fallback;
  }

  return payload.value;
}

/* ==========================================
   GENERIC HELPERS
========================================== */

export function hasLocal(key) {
  return localStorage.getItem(makeKey(key)) !== null;
}

export function hasMemory(key) {
  return memoryStore.has(makeKey(key));
}