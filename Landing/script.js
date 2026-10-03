/* Smartli Landing — isolated interactions (no dependency on main app) */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- theme: paper light by default, classic violet dark on toggle ---- */
  var themeBtn = document.getElementById("themeToggle");
  var setTheme = function (dark, save) {
    document.body.classList.toggle("dark", dark);
    if (themeBtn) themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    if (save) { try { localStorage.setItem("smartli-landing-theme", dark ? "dark" : "light"); } catch (e) {} }
  };
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("smartli-landing-theme"); } catch (e) {}
  setTheme(savedTheme === "dark", false);
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      document.body.classList.add("switching");
      setTheme(!document.body.classList.contains("dark"), true);
      setTimeout(function () { document.body.classList.remove("switching"); }, 320);
    });
  }

  /* ---- year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- nav shadow + mobile menu ---- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); });
    });
  }

  /* ---- scroll reveal (IntersectionObserver, once) ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- animated counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute("data-count") || "0");
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var dur = 1200, t0 = null;
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      // easeOut cubic — fast start, gentle settle
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---- product tabs (exit the way they entered: soft rise) ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var indicator = document.getElementById("tabIndicator");
  var moveIndicator = function (btn) {
    if (!indicator || !btn) return;
    indicator.style.width = btn.offsetWidth + "px";
    indicator.style.transform = "translateX(" + (btn.offsetLeft - 5) + "px)";
  };
  var activate = function (name) {
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-tab") === name;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      if (on) moveIndicator(t);
    });
    panels.forEach(function (p) {
      p.classList.toggle("active", p.getAttribute("data-panel") === name);
    });
  };
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { activate(t.getAttribute("data-tab")); });
  });
  window.addEventListener("resize", function () {
    var active = document.querySelector(".tab.active");
    if (active) moveIndicator(active);
  });
  var first = document.querySelector(".tab.active");
  if (first) {
    // wait a frame so fonts/layout settle before measuring
    requestAnimationFrame(function () { moveIndicator(first); });
  }

  /* ---- hero typing loop (decorative, paused for reduced motion) ---- */
  var typingEl = document.getElementById("typing");
  var lines = [
    "Great question — think of it as updating beliefs with evidence…",
    "P(A|B) = P(B|A)·P(A) / P(B). Let's plug in your example…",
    "In short: priors + new data = smarter hunch. Quiz me →"
  ];
  if (typingEl && !reduceMotion) {
    var li = 0, ci = 0, deleting = false;
    var tick = function () {
      var full = lines[li];
      if (!deleting) {
        ci++;
        typingEl.textContent = full.slice(0, ci);
        if (ci >= full.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
        setTimeout(tick, 22 + Math.random() * 30);
      } else {
        ci -= 3;
        if (ci <= 0) {
          ci = 0; deleting = false;
          li = (li + 1) % lines.length;
          setTimeout(tick, 400);
          return;
        }
        typingEl.textContent = full.slice(0, ci);
        setTimeout(tick, 14);
      }
    };
    setTimeout(tick, 900);
  } else if (typingEl) {
    typingEl.textContent = lines[1];
  }

  /* ---- mouse glow: decorative lerp, dark mode + desktop + motion-ok only ---- */
  var glow = document.getElementById("mouseGlow");
  if (glow && finePointer && !reduceMotion) {
    var gx = -600, gy = -600, tx = gx, ty = gy, shown = false;
    document.addEventListener("mousemove", function (e) {
      if (!document.body.classList.contains("dark")) { shown = false; glow.style.opacity = "0"; return; }
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; glow.style.opacity = "1"; gx = tx; gy = ty; }
    }, { passive: true });
    document.addEventListener("mouseleave", function () {
      shown = false; glow.style.opacity = "0";
    });
    (function loop() {
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      glow.style.transform = "translate3d(" + (gx - 260) + "px," + (gy - 260) + "px,0)";
      requestAnimationFrame(loop);
    })();
  }
})();
