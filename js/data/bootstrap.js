/* ==========================================
   BOOTSTRAP.JS
   Initial App Data Loader
   UI Phase + Future Ready Engine
========================================== */

import {
  getInitialSources
} from "./sources.js";

import {
  fetchMany
} from "./fetch-csv.js";

import {
  setDatasets,
  setLoading,
  setLoaded,
  setLastUpdated
} from "../core/state.js";

import {
  info,
  warn
} from "../core/logger.js";

/* ==========================================
   INIT DATA BOOTSTRAP
========================================== */

export async function bootstrapAppData() {
  try {
    setLoading(true);

    info("Bootstrapping initial datasets...");

    const sources = getInitialSources();

    const results = await fetchMany(sources);

    const payload = {};

    results.forEach((item) => {
      payload[item.key] = item.rows;

      if (!item.success) {
        warn(`Dataset failed: ${item.key}`);
      }
    });

    setDatasets(payload);
    setLastUpdated();
    setLoaded(true);

    info("Bootstrap complete");
  } catch (error) {
    warn("Bootstrap failed", error);
  } finally {
    setLoading(false);
  }
}