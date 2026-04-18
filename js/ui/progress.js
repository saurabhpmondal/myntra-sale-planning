/* ==========================================
   File: js/ui/progress.js
   NEW FILE
   Real Progress Overlay
========================================== */

let overlay = null;
let fill = null;
let titleEl = null;
let subEl = null;
let rowsEl = null;

/* ==========================================
   INIT
========================================== */

export function initProgressBar() {
  if (
    document.getElementById(
      "appProgressOverlay"
    )
  ) {
    return;
  }

  const div =
    document.createElement(
      "div"
    );

  div.id =
    "appProgressOverlay";

  div.innerHTML = `
    <div class="progress-card">

      <div
        class="progress-title"
        id="pgTitle"
      >
        Loading Data...
      </div>

      <div
        class="progress-sub"
        id="pgSub"
      >
        Preparing...
      </div>

      <div
        class="progress-rows"
        id="pgRows"
      >
        0 rows
      </div>

      <div class="progress-track">
        <div
          class="progress-fill"
          id="pgFill"
        ></div>
      </div>

    </div>
  `;

  document.body.appendChild(
    div
  );

  overlay = div;
  fill =
    document.getElementById(
      "pgFill"
    );

  titleEl =
    document.getElementById(
      "pgTitle"
    );

  subEl =
    document.getElementById(
      "pgSub"
    );

  rowsEl =
    document.getElementById(
      "pgRows"
    );
}

/* ==========================================
   SHOW
========================================== */

export function showProgress(
  title =
    "Loading Data..."
) {
  initProgressBar();

  titleEl.textContent =
    title;

  overlay.classList.add(
    "show"
  );

  setProgress(
    0,
    "Starting...",
    0
  );
}

/* ==========================================
   UPDATE
========================================== */

export function setProgress(
  pct = 0,
  label = "",
  rows = 0
) {
  if (!overlay)
    initProgressBar();

  const safe =
    Math.max(
      0,
      Math.min(
        100,
        pct
      )
    );

  fill.style.width =
    `${safe}%`;

  subEl.textContent =
    label;

  rowsEl.textContent =
    `${Number(
      rows || 0
    ).toLocaleString(
      "en-IN"
    )} rows`;
}

/* ==========================================
   HIDE
========================================== */

export function hideProgress() {
  if (!overlay)
    return;

  fill.style.width =
    "100%";

  setTimeout(
    () => {
      overlay.classList.remove(
        "show"
      );
    },
    300
  );
}