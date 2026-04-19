import { getDailyPulseRows } from "./metrics.js";

export function renderDailyPulseReport() {
  const root = document.getElementById("daily-pulse");
  if (!root) return;

  const data = getDailyPulseRows("MTD","HIGH",50) || {
    rows: [],
    dates: [],
    total: 0
  };

  root.innerHTML = `
    <div class="panel-card">
      <h3 class="panel-title">⚡ Daily Pulse</h3>
      <div style="overflow:auto;margin-top:12px;">
        <table style="width:max-content;min-width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr>
              <th>Style ID</th>
              <th>ERP</th>
              <th>MTD</th>
              <th>DRR</th>
              <th>Trend</th>
              ${data.dates.map(d => `<th>${String(d).slice(-2)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data.rows.map(r => `
              <tr>
                <td>${r.styleId}</td>
                <td>${r.erp}</td>
                <td>${r.mtd}</td>
                <td>${Number(r.drr||0).toFixed(1)}</td>
                <td>${r.trend}</td>
                ${data.dates.map(d => `<td>${r.days[d] || 0}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}