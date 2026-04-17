/* ==========================================
   EXPORT.JS
   Excel / CSV Export Center
   Report wise downloads
========================================== */

import { getDataset, getActiveTab } from "../core/state.js";
import { EXPORT_NAMES } from "../core/config.js";
import { getTimestampString } from "../core/utils.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderExportCenter() {
  bindExportButtons();
  renderExportHistory();
}

/* ==========================================
   BIND BUTTONS
========================================== */

function bindExportButtons() {
  const buttons =
    document.querySelectorAll(
      "[data-export]"
    );

  buttons.forEach((button) => {
    button.onclick =
      () => {
        const type =
          button.dataset
            .export;

        exportReport(
          type
        );
      };
  });
}

/* ==========================================
   EXPORT REPORT
========================================== */

export function exportReport(
  type = ""
) {
  const key =
    type ||
    getActiveTab();

  const fileName =
    buildFileName(
      key
    );

  const rows =
    getExportRows(
      key
    );

  downloadCSV(
    rows,
    fileName
  );

  saveHistory(
    fileName
  );
}

/* ==========================================
   DATA MAP
========================================== */

function getExportRows(
  key
) {
  switch (key) {
    case "traffic":
      return getDataset(
        "traffic"
      );

    case "products":
      return getDataset(
        "productMaster"
      );

    case "inventory":
      return [
        ...getDataset(
          "sjitStock"
        ),
        ...getDataset(
          "sorStock"
        )
      ];

    case "sjit":
      return getDataset(
        "sjitStock"
      );

    case "sor":
      return getDataset(
        "sorStock"
      );

    case "dashboard":
    case "sales":
    default:
      return getDataset(
        "sales"
      );
  }
}

/* ==========================================
   FILE NAME
========================================== */

function buildFileName(
  key
) {
  const prefix =
    EXPORT_NAMES[
      key
    ] || key;

  return `${prefix}-${getTimestampString()}.csv`;
}

/* ==========================================
   CSV DOWNLOAD
========================================== */

function downloadCSV(
  rows = [],
  fileName
) {
  if (!rows.length) {
    rows = [
      {
        message:
          "No data available"
      }
    ];
  }

  const headers =
    Object.keys(
      rows[0]
    );

  const csv = [
    headers.join(","),
    ...rows.map(
      (row) =>
        headers
          .map((key) =>
            escapeCsv(
              row[key]
            )
          )
          .join(",")
    )
  ].join("\n");

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
    fileName;
  a.click();

  URL.revokeObjectURL(
    url
  );
}

function escapeCsv(
  value
) {
  const text =
    String(
      value ?? ""
    );

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {
    return `"${text.replace(
      /"/g,
      '""'
    )}"`;
  }

  return text;
}

/* ==========================================
   HISTORY
========================================== */

function saveHistory(
  fileName
) {
  const key =
    "export_history";

  const list =
    JSON.parse(
      localStorage.getItem(
        key
      ) || "[]"
    );

  list.unshift({
    fileName,
    time:
      new Date().toLocaleString()
  });

  localStorage.setItem(
    key,
    JSON.stringify(
      list.slice(0, 10)
    )
  );

  renderExportHistory();
}

function renderExportHistory() {
  const box =
    document.getElementById(
      "exportHistory"
    );

  if (!box) return;

  const list =
    JSON.parse(
      localStorage.getItem(
        "export_history"
      ) || "[]"
    );

  box.innerHTML =
    list.length
      ? list
          .map(
            (item) => `
      <div class="export-history-item">
        <div class="export-history-title">${item.fileName}</div>
        <div class="export-history-sub">${item.time}</div>
      </div>
    `
          )
          .join("")
      : `<div class="placeholder-box small">No export history</div>`;
}