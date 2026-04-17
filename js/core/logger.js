/* ==========================================
   LOGGER.JS
   Central Logging Utility
   Safe debug + production friendly
========================================== */

import { APP_CONFIG } from "./config.js";

/* ==========================================
   SETTINGS
========================================== */

const isProd = APP_CONFIG.environment === "production";
const prefix = `[${APP_CONFIG.appName}]`;

/* ==========================================
   HELPERS
========================================== */

function time() {
  return new Date().toLocaleTimeString("en-IN", {
    hour12: false
  });
}

function buildArgs(type, args) {
  return [`${prefix} ${type} ${time()}`, ...args];
}

/* ==========================================
   LOG TYPES
========================================== */

export function log(...args) {
  if (isProd) return;

  console.log(...buildArgs("LOG", args));
}

export function info(...args) {
  console.info(...buildArgs("INFO", args));
}

export function warn(...args) {
  console.warn(...buildArgs("WARN", args));
}

export function error(...args) {
  console.error(...buildArgs("ERROR", args));
}

/* ==========================================
   GROUPS
========================================== */

export function group(title = "Group") {
  if (isProd) return;

  console.group(`${prefix} ${title}`);
}

export function groupEnd() {
  if (isProd) return;

  console.groupEnd();
}

/* ==========================================
   TABLE
========================================== */

export function table(data = []) {
  if (isProd) return;

  console.table(data);
}

/* ==========================================
   TIMERS
========================================== */

export function timeStart(label = "Timer") {
  if (isProd) return;

  console.time(`${prefix} ${label}`);
}

export function timeEnd(label = "Timer") {
  if (isProd) return;

  console.timeEnd(`${prefix} ${label}`);
}