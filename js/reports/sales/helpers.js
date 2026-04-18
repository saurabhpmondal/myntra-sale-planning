/* ==========================================
   File: js/reports/sales/helpers.js
   FULL REPLACE CODE
   FINAL JOIN KEY FIX
========================================== */

/* ==========================================
   NUMBERS
========================================== */

export function num(v) {
  const n =
    Number(
      String(v || "")
        .replace(/,/g, "")
        .trim()
    );

  return isNaN(n)
    ? 0
    : n;
}

/* ==========================================
   FINAL CLEAN
========================================== */

export function clean(v) {
  return String(
    v || ""
  )
    /* remove BOM */
    .replace(
      /\uFEFF/g,
      ""
    )

    /* remove commas */
    .replace(
      /,/g,
      ""
    )

    /* trim spaces */
    .trim()

    /* remove trailing .0 */
    .replace(
      /\.0+$/,
      ""
    )

    /* collapse double spaces */
    .replace(
      /\s+/g,
      " "
    );
}

/* ==========================================
   SAFE DIVIDE
========================================== */

export function divide(
  a,
  b
) {
  const x =
    num(a);

  const y =
    num(b);

  if (!y)
    return 0;

  return x / y;
}

/* ==========================================
   GROWTH %
========================================== */

export function growthPct(
  current,
  previous
) {
  const c =
    num(current);

  const p =
    num(previous);

  if (
    c === 0 &&
    p === 0
  ) {
    return 0;
  }

  if (
    p === 0 &&
    c > 0
  ) {
    return 100;
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

/* ==========================================
   FORMATTERS
========================================== */

export function money(v) {
  return (
    "₹" +
    Math.round(
      num(v)
    ).toLocaleString(
      "en-IN"
    )
  );
}

export function count(v) {
  return Math.round(
    num(v)
  ).toLocaleString(
    "en-IN"
  );
}

export function pct(
  v,
  d = 1
) {
  return (
    num(v).toFixed(
      d
    ) + "%"
  );
}