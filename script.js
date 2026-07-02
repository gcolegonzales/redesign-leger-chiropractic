/* Leger Chiropractic — redesign concept
   Vanilla JS: shrink-on-scroll header, mobile nav, scroll-reveal,
   graceful photo fallbacks, demo appointment form. No dependencies. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");

  /* ---- Graceful photo fallbacks ----
     Photos live in assets/photos/ and are dropped in later. Until then the
     files 404; mark their frames "empty" so the designed placeholder shows. */
  document.querySelectorAll("[data-photo] img").forEach(function (img) {
    function markEmpty() {
      var wrap = img.closest("[data-photo]");
      if (wrap) {
        wrap.classList.add(
          wrap.classList.contains("portrait-frame") ? "portrait-empty" : "media-empty"
        );
      }
      img.style.display = "none";
    }
    if (img.complete && img.naturalWidth === 0) markEmpty();
    img.addEventListener("error", markEmpty);
  });
  // portrait frame is one level up from [data-photo]; normalize it
  document.querySelectorAll(".hero-portrait img").forEach(function (img) {
    img.addEventListener("error", function () {
      var frame = img.closest(".portrait-frame");
      if (frame) frame.classList.add("portrait-empty");
    });
    if (img.complete && img.naturalWidth === 0) {
      var frame = img.closest(".portrait-frame");
      if (frame) frame.classList.add("portrait-empty");
    }
  });

  /* ---- Shrink-on-scroll header ---- */
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        header.classList.toggle("scrolled", window.scrollY > 12);
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

  /* ---- Scroll reveal (with staggered cascade) ---- */
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
    revealables.forEach(function (el) { io.observe(el); });

    document.querySelectorAll(".care-rows, .phase-track, .timeline, .hero-copy").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        if (child.classList && child.classList.contains("reveal")) {
          child.style.transitionDelay = (i % 5) * 0.07 + "s";
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
