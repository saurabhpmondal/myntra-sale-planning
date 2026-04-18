/* ==========================================
   File: js/data/bootstrap.js
   FULL REPLACE CODE
   OPTION A LAZY LOAD READY
   traffic excluded from boot load
   Added Real Progress Bar
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

import {
  showProgress,
  setProgress,
  hideProgress
} from "../ui/progress.js";

/* ==========================================
   INIT DATA BOOTSTRAP
========================================== */

export async function bootstrapAppData() {
  try {
    setLoading(true);

    showProgress(
      "Loading Data..."
    );

    info(
      "Bootstrapping initial datasets..."
    );

    /* remove traffic from initial load */
    const sources =
      getInitialSources().filter(
        (item) =>
          item.key !==
          "traffic"
      );

    const total =
      sources.length;

    const results =
      [];

    for (
      let i = 0;
      i < total;
      i++
    ) {
      const src =
        sources[i];

      setProgress(
        Math.round(
          (i / total) *
            100
        ),
        `Fetching ${src.key.toUpperCase()}`,
        0
      );

      const res =
        await fetchMany(
          [src]
        );

      const item =
        res[0] || {
          key:
            src.key,
          rows: [],
          success: false
        };

      results.push(
        item
      );

      setProgress(
        Math.round(
          ((i + 1) /
            total) *
            100
        ),
        `Fetched ${src.key.toUpperCase()}`,
        item.rows
          .length
      );
    }

    const payload =
      {};

    results.forEach(
      (item) => {
        payload[
          item.key
        ] =
          item.rows;

        if (
          !item.success
        ) {
          warn(
            `Dataset failed: ${item.key}`
          );
        }
      }
    );

    /* keep traffic empty initially */
    payload.traffic =
      [];

    setDatasets(
      payload
    );

    setLastUpdated();
    setLoaded(
      true
    );

    setProgress(
      100,
      "Completed",
      0
    );

    info(
      "Bootstrap complete"
    );

    setTimeout(
      () =>
        hideProgress(),
      350
    );
  } catch (error) {
    warn(
      "Bootstrap failed",
      error
    );

    hideProgress();
  } finally {
    setLoading(
      false
    );
  }
}