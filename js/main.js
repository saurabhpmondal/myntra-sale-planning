/* ==========================================
   MAIN.JS
   UI Phase - Core App Bootstrap
   Safe Modular Starter
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initHeaderDefaults();
  initSearchUI();
});

/* ==========================================
   TAB ENGINE
========================================== */

function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      /* Active Button */
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      /* Active Panel */
      panels.forEach((panel) => {
        panel.classList.remove("active");

        if (panel.id === target) {
          panel.classList.add("active");
        }
      });

      /* Scroll content top smoothly */
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  });
}

/* ==========================================
   HEADER DEFAULTS
========================================== */

function initHeaderDefaults() {
  setTodayDateInputs();
  populateMonthFilter();
}

/* Set Start / End Date */
function setTodayDateInputs() {
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");

  if (!startDate || !endDate) return;

  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const firstDay = `${yyyy}-${mm}-01`;
  const todayStr = `${yyyy}-${mm}-${dd}`;

  startDate.value = firstDay;
  endDate.value = todayStr;
}

/* Populate Month Dropdown */
function populateMonthFilter() {
  const monthFilter = document.getElementById("monthFilter");
  if (!monthFilter) return;

  monthFilter.innerHTML = "";

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  for (let i = 0; i < 12; i++) {
    const monthIndex = currentMonth - i;
    const date = new Date(currentYear, monthIndex, 1);

    const option = document.createElement("option");
    option.value = `${date.getFullYear()}-${date.getMonth() + 1}`;
    option.textContent =
      `${months[date.getMonth()]} ${date.getFullYear()}`;

    if (i === 0) option.selected = true;

    monthFilter.appendChild(option);
  }
}

/* ==========================================
   SEARCH UI (placeholder phase)
========================================== */

function initSearchUI() {
  const search = document.getElementById("globalSearch");

  if (!search) return;

  search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const value = search.value.trim();

      if (!value) return;

      openProductsTab();
      showTemporarySearchResult(value);
    }
  });
}

function openProductsTab() {
  const productBtn = document.querySelector(
    '.tab-btn[data-tab="products"]'
  );

  if (productBtn) {
    productBtn.click();
  }
}

function showTemporarySearchResult(keyword) {
  const panel = document.getElementById("products");

  if (!panel) return;

  const box = panel.querySelector(".placeholder-box");

  if (!box) return;

  box.innerHTML = `
    <div style="text-align:center;">
      <div style="font-weight:700; margin-bottom:8px;">
        Search Triggered
      </div>
      <div style="color:#6b7280;">
        Keyword: ${escapeHtml(keyword)}
      </div>
      <div style="margin-top:10px; color:#9ca3af; font-size:12px;">
        Real ERP SKU / Style search engine will connect in data phase
      </div>
    </div>
  `;
}

/* ==========================================
   HELPERS
========================================== */

function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}