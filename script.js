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

  /* ---- Header: shrink + hide-on-scroll-down / reveal-on-any-scroll-up ---- */
  var ticking = false;
  var lastY = window.scrollY || 0;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        var y = window.scrollY || 0;
        header.classList.toggle("scrolled", y > 12);
        // Never hide while the mobile menu is open.
        if (navList && navList.classList.contains("open")) {
          header.classList.remove("nav-hidden");
        } else if (y > lastY && y > 140) {
          // scrolling down, past the header zone -> hide
          header.classList.add("nav-hidden");
        } else if (y < lastY) {
          // ANY upward movement -> reveal immediately
          header.classList.remove("nav-hidden");
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav (dropdown + scrim) ---- */
  // Build a scrim element that sits behind the dropdown and closes it on tap.
  var scrim = document.createElement("div");
  scrim.className = "nav-scrim";
  scrim.setAttribute("hidden", "");
  document.body.appendChild(scrim);

  // Elements to mark inert/aria-hidden while the drawer is open (everything but the header).
  var inertTargets = [document.getElementById("main")];
  var footerEl = document.querySelector("footer");
  if (footerEl) inertTargets.push(footerEl);

  function focusableInDrawer() {
    return Array.prototype.filter.call(
      navList.querySelectorAll('a[href], button:not([disabled])'),
      function (el) { return el.offsetParent !== null || el.getClientRects().length; }
    );
  }
  function setBackgroundInert(on) {
    inertTargets.forEach(function (el) {
      if (!el) return;
      if (on) { el.setAttribute("inert", ""); el.setAttribute("aria-hidden", "true"); }
      else { el.removeAttribute("inert"); el.removeAttribute("aria-hidden"); }
    });
  }

  function openNav() {
    navList.classList.add("open");
    scrim.removeAttribute("hidden");
    // force reflow so the transition runs
    void scrim.offsetWidth;
    scrim.classList.add("show");
    header.classList.remove("nav-hidden");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");
    setBackgroundInert(true);
    // Move focus into the drawer (first link) WITHOUT scrolling the page.
    // Plain .focus() scrolls the focused element into view -> jumps to top.
    var items = focusableInDrawer();
    if (items.length) items[0].focus({ preventScroll: true });
  }
  function closeNav(returnFocus) {
    navList.classList.remove("open");
    scrim.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
    setBackgroundInert(false);
    if (returnFocus) navToggle.focus();
    var hide = function () { scrim.setAttribute("hidden", ""); scrim.removeEventListener("transitionend", hide); };
    scrim.addEventListener("transitionend", hide);
    // fallback in case transitionend doesn't fire
    setTimeout(function () { if (!scrim.classList.contains("show")) scrim.setAttribute("hidden", ""); }, 350);
  }
  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      if (navList.classList.contains("open")) closeNav(true);
      else openNav();
    });
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav(false);
    });
    scrim.addEventListener("click", function () { closeNav(true); });
    document.addEventListener("keydown", function (e) {
      if (!navList.classList.contains("open")) return;
      if (e.key === "Escape") {
        closeNav(true);
      } else if (e.key === "Tab") {
        // Trap focus within the drawer (+ toggle button).
        var items = focusableInDrawer();
        items.unshift(navToggle);
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        var active = document.activeElement;
        if (e.shiftKey && (active === first || !navList.contains(active) && active !== navToggle)) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
    // Reset drawer + toggle state when crossing the desktop breakpoint.
    window.matchMedia("(min-width: 761px)").addEventListener("change", function (ev) {
      if (ev.matches && navList.classList.contains("open")) closeNav(false);
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
