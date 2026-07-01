/* Leger Family Chiropractic Care — redesign concept
   Vanilla JS: sticky header, mobile nav, scroll-reveal, demo form. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");

  /* ---- Sticky / shrinking header ---- */
  var lastKnown = 0, ticking = false;
  function onScroll() {
    lastKnown = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        header.classList.toggle("scrolled", lastKnown > 12);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  function closeNav() {
    navList.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("open")) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* ---- Scroll reveal ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    // Stagger siblings inside a grid for a nicer cascade.
    var groups = {};
    revealables.forEach(function (el) {
      var parent = el.parentElement;
      var key = parent ? (groups[parent.className] = parent) : null;
      io.observe(el);
    });
    // Apply small transition delays to grouped items.
    document.querySelectorAll(".service-grid, .value-grid, .test-grid").forEach(function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        if (child.classList.contains("reveal")) {
          child.style.transitionDelay = (i % 4) * 0.08 + "s";
        }
      });
    });
  }

  /* ---- Demo appointment form (non-wired) ---- */
  var form = document.getElementById("appt-form");
  var success = document.getElementById("form-success");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (success) {
        success.hidden = false;
        success.classList.add("show");
        success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }
      form.querySelector('button[type="submit"]').textContent = "Request received ✓";
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
