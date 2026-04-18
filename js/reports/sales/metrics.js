/* ==========================================
   File: js/reports/sales/metrics.js
   FULL REPLACE CODE BLOCK ONLY:
   Replace enrichTraffic() function
========================================== */

function enrichTraffic(
  map,
  rows
) {
  const bucket =
    {};

  rows.forEach(
    (r) => {
      const id =
        clean(
          r.style_id
        );

      if (
        !id ||
        !map[id]
      )
        return;

      const raw =
        r.rating;

      const val =
        Number(
          String(
            raw || ""
          )
            .replace(
              /,/g,
              ""
            )
            .trim()
        );

      if (
        isNaN(val) ||
        val <= 0
      )
        return;

      if (
        !bucket[id]
      ) {
        bucket[id] =
          [];
      }

      bucket[id].push(
        val
      );
    }
  );

  Object.keys(
    bucket
  ).forEach(
    (id) => {
      const arr =
        bucket[id];

      const avg =
        arr.reduce(
          (
            a,
            b
          ) =>
            a + b,
          0
        ) /
        arr.length;

      map[id].rating =
        avg;
    }
  );
}