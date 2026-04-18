/* ==========================================
   File: js/reports/export/actions.js
   NEW FILE
   CSV Export Engine
========================================== */

import { getSalesRows } from "../sales/metrics.js";
import { getSjitRows } from "../sjit/metrics.js";
import { getSorRows } from "../sor/metrics.js";

/* ==========================================
   PUBLIC
========================================== */

export function getExportCounts() {
  return {
    sales:
      getSalesRows()
        .length,
    sjit:
      getSjitRows()
        .length,
    sor:
      getSorRows()
        .length
  };
}

export function exportSalesCsv() {
  downloadCsv(
    "sales",
    getSalesRows()
  );
}

export function exportSjitCsv() {
  downloadCsv(
    "sjit",
    getSjitRows()
  );
}

export function exportSorCsv() {
  downloadCsv(
    "sor",
    getSorRows()
  );
}

/* ==========================================
   CSV DOWNLOAD
========================================== */

function downloadCsv(
  name,
  rows = []
) {
  if (!rows.length)
    return;

  const csv =
    buildCsv(rows);

  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const a =
    document.createElement(
      "a"
    );

  a.href = url;
  a.download =
    buildFileName(
      name
    );

  document.body.appendChild(
    a
  );

  a.click();

  a.remove();

  URL.revokeObjectURL(
    url
  );
}

/* ==========================================
   BUILD CSV
========================================== */

function buildCsv(
  rows
) {
  const headers =
    Object.keys(
      rows[0]
    );

  const lines = [
    headers.join(",")
  ];

  rows.forEach(
    (row) => {
      const vals =
        headers.map(
          (key) =>
            csvSafe(
              row[key]
            )
        );

      lines.push(
        vals.join(",")
      );
    }
  );

  return lines.join(
    "\n"
  );
}

function csvSafe(v) {
  const text =
    String(
      v ?? ""
    ).replaceAll(
      '"',
      '""'
    );

  return `"${text}"`;
}

/* ==========================================
   FILE NAME
========================================== */

function buildFileName(
  tab
) {
  const d =
    new Date();

  const y =
    d.getFullYear();

  const m =
    pad(
      d.getMonth() +
        1
    );

  const day =
    pad(
      d.getDate()
    );

  const hh =
    pad(
      d.getHours()
    );

  const mm =
    pad(
      d.getMinutes()
    );

  return `${tab}-${y}${m}${day}-${hh}${mm}.csv`;
}

function pad(v) {
  return String(v)
    .padStart(
      2,
      "0"
    );
}