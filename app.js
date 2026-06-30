/**
 * app.js
 * Titik masuk (entry point) aplikasi.
 * Tugas tunggal: import modul-modul yang diperlukan dan mulakannya
 * apabila DOM sedia. Tiada logik perniagaan di sini.
 */

import {
  initProgressBar,
  initHeaderState,
  initActiveSectionTracking,
  initScrollReveal,
  initImpactCounter,
  initMobileMenu,
  initSmoothAnchors,
} from "./ui.js";

function bootstrap() {
  initProgressBar();
  initHeaderState();
  initActiveSectionTracking();
  initScrollReveal();
  initImpactCounter();
  initMobileMenu();
  initSmoothAnchors();
}

document.addEventListener("DOMContentLoaded", bootstrap);
