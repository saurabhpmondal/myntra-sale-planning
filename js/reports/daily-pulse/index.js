/* SAFE DAILY PULSE UI */

import { getDailyPulseRows } from "./metrics.js";

let sortBy = "MTD";
let order = "HIGH";
let limit = 50;

export function renderDailyPulseReport() {
  const root = document.getElementById("daily-pulse");
  if (!root) return;

  const data = getDailyPulseRows(sortBy, order, limit) || {
    rows: [],
    dates: [],
    total: 0
  };

  root.innerHTML = `
    <div class="panel-card">
      <h3 class="panel-title">⚡ Daily Pulse</h3>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
        <select id="dpSort">
          <option value="MTD" ${sortBy==="MTD"?"selected":""}>MTD</option>
          <option value="DRR" ${sortBy==="DRR"?"selected":""}>DRR</option>
        </select>

        <select id="dpOrder">
          <option value="HIGH" ${order==="HIGH"?"selected":""}>HIGH</option>
          <option value="LOW" ${order==="LOW"?"selected":""}>LOW</option>
        </select>
      </div>
    </div>

    <div class="panel-card" style="overflow:auto;">
      <table style="width:max-content;min-width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th>Style</th>
            <th>ERP</th>
            <th>Brand</th>
            <th>MTD</th>
            <th>DRR</th>
            <th>Trend</th>
            ${data.dates.map(d => `<th>${String(d).slice(-2)}</th>`).join("")}
          </tr>
        </thead>

        <tbody>
          ${data.rows.map(r => rowHtml(r, data.dates)).join("")}
        </tbody>
      </table>
    </div>
  `;

  bind();
}

function rowHtml(r, dates) {
  let prev = null;

  return `
    <tr>
      <td>${r.styleId}</td>
      <td>${r.erp}</td>
      <td>${r.brand}</td>
      <td>${fmt(r.mtd)}</td>
      <td>${num1(r.drr)}</td>
      <td>${r.trend}</td>

      ${dates.map(d => {
        const v = r.days[d] || 0;
        let bg = "#fff";

        if (prev !== null) {
          if (v > prev) bg = "#dcfce7";
          else if (v < prev) bg = "#fee2e2";
        }

        prev = v;

        return `<td style="background:${bg};text-align:center;">${fmt(v)}</td>`;
      }).join("")}
    </tr>
  `;
}

function bind() {
  const s = document.getElementById("dpSort");
  const o = document.getElementById("dpOrder");

  if (s) s.onchange = () => {
    sortBy = s.value;
    renderDailyPulseReport();
  };

  if (o) o.onchange = () => {
    order = o.value;
    renderDailyPulseReport();
  };
}

function fmt(v){ return Number(v||0).toLocaleString("en-IN"); }
function num1(v){ return Number(v||0).toFixed(1); }