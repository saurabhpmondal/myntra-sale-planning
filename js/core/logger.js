/* ==========================================
   LOGGER.JS
   FULL REPLACE CODE
   Central Logging Utility
   Safe debug + production friendly
   Added dataset timing support
========================================== */

import { APP_CONFIG } from "./config.js";

/* ==========================================
   SETTINGS
========================================== */

const isProd =
  APP_CONFIG.environment ===
  "production";

const prefix =
  `[${APP_CONFIG.appName}]`;

const timers =
  new Map();

/* ==========================================
   HELPERS
========================================== */

function time() {
  return new Date()
    .toLocaleTimeString(
      "en-IN",
      {
        hour12: false
      }
    );
}

function buildArgs(
  type,
  args
) {
  return [
    `${prefix} ${type} ${time()}`,
    ...args
  ];
}

/* ==========================================
   LOG TYPES
========================================== */

export function log(
  ...args
) {
  if (isProd)
    return;

  console.log(
    ...buildArgs(
      "LOG",
      args
    )
  );
}

export function info(
  ...args
) {
  console.info(
    ...buildArgs(
      "INFO",
      args
    )
  );
}

export function warn(
  ...args
) {
  console.warn(
    ...buildArgs(
      "WARN",
      args
    )
  );
}

export function error(
  ...args
) {
  console.error(
    ...buildArgs(
      "ERROR",
      args
    )
  );
}

/* ==========================================
   GROUPS
========================================== */

export function group(
  title = "Group"
) {
  if (isProd)
    return;

  console.group(
    `${prefix} ${title}`
  );
}

export function groupEnd() {
  if (isProd)
    return;

  console.groupEnd();
}

/* ==========================================
   TABLE
========================================== */

export function table(
  data = []
) {
  if (isProd)
    return;

  console.table(data);
}

/* ==========================================
   TIMERS
========================================== */

export function timeStart(
  label = "Timer"
) {
  if (isProd)
    return;

  timers.set(
    label,
    performance.now()
  );

  console.time(
    `${prefix} ${label}`
  );
}

export function timeEnd(
  label = "Timer"
) {
  if (isProd)
    return;

  console.timeEnd(
    `${prefix} ${label}`
  );

  if (
    timers.has(
      label
    )
  ) {
    const start =
      timers.get(
        label
      );

    const ms =
      Math.round(
        performance.now() -
          start
      );

    timers.delete(
      label
    );

    console.info(
      ...buildArgs(
        "INFO",
        [
          `${label} completed in ${ms} ms`
        ]
      )
    );
  }
}