/* ==========================================
   SALES REPORT / HELPERS.JS
   Final utilities
========================================== */

/* ==========================================
   NUMBERS
========================================== */

export function num(v) {
  return Number(v || 0);
}

export function clean(v) {
  return String(
    v || ""
  ).trim();
}

export function divide(
  a,
  b
) {
  const x =
    Number(a || 0);

  const y =
    Number(b || 0);

  if (!y)
    return 0;

  return x / y;
}

/* ==========================================
   FORMATTERS
========================================== */

export function money(v) {
  const n =
    Number(v || 0);

  return (
    "₹" +
    n.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0
      }
    )
  );
}

export function count(v) {
  return Number(
    v || 0
  ).toLocaleString(
    "en-IN"
  );
}

export function pct(
  v,
  d = 1
) {
  return (
    Number(v || 0).toFixed(
      d
    ) + "%"
  );
}

/* ==========================================
   GROWTH
========================================== */

export function growthPct(
  current,
  previous
) {
  const c =
    Number(current || 0);

  const p =
    Number(previous || 0);

  if (
    c === 0 &&
    p === 0
  )
    return 0;

  if (
    p === 0 &&
    c > 0
  ) {
    return (
      ((c - 1) / 1) *
      100
    );
  }

  if (
    p > 0 &&
    c === 0
  ) {
    return -100;
  }

  return (
    ((c - p) / p) *
    100
  );
}

/* ==========================================
   SORT
========================================== */

export function byGmvDesc(
  a,
  b
) {
  return (
    num(b.gmv) -
    num(a.gmv)
  );
}