/* ==========================================
   ERROR-HANDLER.JS
   Global Error Capture + Friendly UI Handling
========================================== */

import { error } from "./logger.js";

/* ==========================================
   INIT
========================================== */

export function initErrorHandler() {
  bindWindowErrors();
  bindUnhandledPromises();
}

/* ==========================================
   WINDOW JS ERRORS
========================================== */

function bindWindowErrors() {
  window.addEventListener("error", (event) => {
    error("Runtime Error:", {
      message: event.message,
      file: event.filename,
      line: event.lineno,
      column: event.colno
    });

    showToast(
      "Something went wrong. Please refresh the app."
    );
  });
}

/* ==========================================
   PROMISE ERRORS
========================================== */

function bindUnhandledPromises() {
  window.addEventListener(
    "unhandledrejection",
    (event) => {
      error("Unhandled Promise:", event.reason);

      showToast(
        "Unable to complete request. Please try again."
      );
    }
  );
}

/* ==========================================
   FRIENDLY TOAST
========================================== */

export function showToast(
  message = "Something went wrong."
) {
  let toast = document.getElementById("globalToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";

    toast.style.position = "fixed";
    toast.style.right = "16px";
    toast.style.bottom = "16px";
    toast.style.zIndex = "9999";
    toast.style.maxWidth = "320px";
    toast.style.padding = "12px 14px";
    toast.style.borderRadius = "12px";
    toast.style.background = "#111827";
    toast.style.color = "#ffffff";
    toast.style.fontSize = "13px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow =
      "0 10px 28px rgba(0,0,0,0.18)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    toast.style.transition =
      "all 0.25s ease";

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  clearTimeout(toast._timer);

  toast._timer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
  }, 2500);
}

/* ==========================================
   SAFE EXECUTOR
========================================== */

export function safeRun(fn, fallback = null) {
  try {
    return fn();
  } catch (err) {
    error("SafeRun Error:", err);
    return fallback;
  }
}