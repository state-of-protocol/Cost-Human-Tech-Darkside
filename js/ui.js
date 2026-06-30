/**
 * ui.js
 * Lapisan paparan: bertanggungjawab memanipulasi DOM,
 * mencipta komponen kecil, dan mendaftar interaksi.
 * Tidak menyimpan state sendiri — semua data datang dari state.js / content.js.
 */

import { COUNTER_CONFIG } from "./content.js";
import { getState, setState } from "./state.js";

/* ---------------------------------------------------------
   1. Progress bar — menunjukkan kemajuan bacaan menegak
--------------------------------------------------------- */
export function initProgressBar() {
  const bar = document.querySelector("[data-progress-bar]");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
  };

  document.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* ---------------------------------------------------------
   2. Nav semasa scroll — tukar gaya header & tandakan seksyen aktif
--------------------------------------------------------- */
export function initHeaderState() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const onScroll = () => {
    const scrolled = window.scrollY > 24;
    header.classList.toggle("is-scrolled", scrolled);
    if (scrolled !== getState().hasScrolled) {
      setState({ hasScrolled: scrolled });
    }
  };

  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

export function initActiveSectionTracking() {
  const sections = document.querySelectorAll("[data-section-id]");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.sectionId;
          setState({ activePillarId: id });
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.dataset.navLink === id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------
   3. Scroll-reveal — animasi mikro halus untuk elemen masuk viewport
--------------------------------------------------------- */
export function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (getState().reducedMotion) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   4. Kaunter kos sebenar — komponen "signature" laman ini
--------------------------------------------------------- */
export function initImpactCounter() {
  const el = document.querySelector("[data-impact-counter]");
  const labelEl = document.querySelector("[data-impact-label]");
  if (!el) return;

  if (labelEl) labelEl.textContent = COUNTER_CONFIG.label;

  if (getState().reducedMotion) {
    el.textContent = "0.00";
    return;
  }

  const { counterStartTime } = getState();

  const tick = () => {
    const elapsedSeconds = (Date.now() - counterStartTime) / 1000;
    const value = elapsedSeconds * COUNTER_CONFIG.kgPerSecond;
    el.textContent = value.toFixed(3);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------
   5. Menu mudah alih
--------------------------------------------------------- */
export function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const next = !getState().menuOpen;
    setState({ menuOpen: next });
    nav.classList.toggle("is-open", next);
    toggle.setAttribute("aria-expanded", String(next));
    document.body.classList.toggle("no-scroll", next);
  });

  nav.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => {
      setState({ menuOpen: false });
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    });
  });
}

/* ---------------------------------------------------------
   6. Smooth-scroll untuk pautan dalaman (anchor)
--------------------------------------------------------- */
export function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: getState().reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });
}
