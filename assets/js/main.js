/* =========================================================================
   Silver Star - interactions & 3D background
   ========================================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer:fine)").matches;
  var WHATSAPP = "917744948027"; // change to the venue's WhatsApp number (country code + number)

  /* ---------------------------------------------------------------------
     1. Header scroll state + back-to-top + active nav link
  --------------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 24);
    if (toTop) toTop.classList.toggle("show", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* Active section highlight */
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.getAttribute("id");
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------------------
     2. Mobile nav (toggle, close on link/Escape, reset on desktop)
  --------------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".nav-links");
  if (toggle && menu) {
    function closeMenu(focusToggle) {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      if (focusToggle) toggle.focus();
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) closeMenu(true);
    });
    // Reset menu state when crossing back to desktop width
    var desktopMQ = window.matchMedia("(min-width:981px)");
    var resetNav = function (e) { if (e.matches) closeMenu(false); };
    if (desktopMQ.addEventListener) desktopMQ.addEventListener("change", resetNav);
    else if (desktopMQ.addListener) desktopMQ.addListener(resetNav);
  }

  /* ---------------------------------------------------------------------
     3. Scroll reveal (with no-JS / no-IO fallback)
  --------------------------------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
    // Failsafe: guarantee everything is visible shortly after load
    window.addEventListener("load", function () {
      setTimeout(function () { reveals.forEach(function (el) { el.classList.add("in"); }); }, 1400);
    });
  }

  /* ---------------------------------------------------------------------
     4. Animated number counters
  --------------------------------------------------------------------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = (el.getAttribute("data-decimals") | 0);
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var start = 0, dur = 1600, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (start + (target - start) * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------------------------------------------------------------------
     5. 3D tilt on cards (fine pointers only)
  --------------------------------------------------------------------- */
  if (fine && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      var rect;
      card.addEventListener("pointerenter", function () { rect = card.getBoundingClientRect(); });
      card.addEventListener("pointermove", function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (py - 0.5) * -10;
        var ry = (px - 0.5) * 12;
        card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-6px)";
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------------------
     6. Hero parallax
  --------------------------------------------------------------------- */
  var heroImg = document.querySelector(".hero-bg img");
  if (heroImg && !reduceMotion) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) heroImg.style.transform = "scale(1.08) translateY(" + (y * 0.18) + "px)";
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     7. Gallery lightbox (with focus management + trap)
  --------------------------------------------------------------------- */
  var figures = Array.prototype.slice.call(document.querySelectorAll(".gallery figure"));
  var lb = document.querySelector(".lightbox");
  if (lb && figures.length) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lb-cap");
    var lbClose = lb.querySelector(".lb-close");
    var lbPrev = lb.querySelector(".lb-prev");
    var lbNext = lb.querySelector(".lb-next");
    var focusables = [lbClose, lbPrev, lbNext];
    var current = 0;
    var lastFocused = null;
    var items = figures.map(function (f) {
      var img = f.querySelector("img");
      return { src: img.getAttribute("data-full") || img.src, cap: (f.querySelector("figcaption") || {}).textContent || img.alt };
    });
    function show(i) {
      current = (i + items.length) % items.length;
      lbImg.src = items[current].src;
      lbImg.alt = items[current].cap;
      if (lbCap) lbCap.textContent = items[current].cap;
    }
    function open(i) {
      lastFocused = document.activeElement;
      show(i);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lbClose.focus();
    }
    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }
    figures.forEach(function (f, i) {
      f.setAttribute("tabindex", "0");
      f.setAttribute("role", "button");
      f.addEventListener("click", function () { open(i); });
      f.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); } });
    });
    lbClose.addEventListener("click", close);
    lbNext.addEventListener("click", function () { show(current + 1); });
    lbPrev.addEventListener("click", function () { show(current - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowRight") { show(current + 1); return; }
      if (e.key === "ArrowLeft") { show(current - 1); return; }
      if (e.key === "Tab") {
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (focusables.indexOf(document.activeElement) === -1) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------------------------------------------------------------------
     8. Testimonials slider (with pause control + hover/focus pause)
  --------------------------------------------------------------------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".tst"));
  var dotsWrap = document.querySelector(".tst-dots");
  if (slides.length && dotsWrap) {
    var idx = 0, timer, paused = false;
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show testimonial " + (i + 1));
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { go(i); rearm(); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);
    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("active", k === idx); });
      dots.forEach(function (d, k) {
        var on = k === idx;
        d.classList.toggle("active", on);
        d.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    function stop() { clearInterval(timer); }
    function rearm() {
      if (reduceMotion || paused) return;
      clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 6000);
    }
    var wrap = document.querySelector(".tst-wrap");
    if (!reduceMotion && wrap) {
      var pauseBtn = document.createElement("button");
      pauseBtn.type = "button";
      pauseBtn.className = "tst-pause";
      pauseBtn.setAttribute("aria-label", "Pause testimonials");
      pauseBtn.textContent = "❚❚ Pause";
      pauseBtn.addEventListener("click", function () {
        paused = !paused;
        if (paused) { stop(); pauseBtn.textContent = "▶ Play"; pauseBtn.setAttribute("aria-label", "Play testimonials"); }
        else { pauseBtn.textContent = "❚❚ Pause"; pauseBtn.setAttribute("aria-label", "Pause testimonials"); rearm(); }
      });
      wrap.appendChild(pauseBtn);
      wrap.addEventListener("mouseenter", stop);
      wrap.addEventListener("mouseleave", function () { rearm(); });
      wrap.addEventListener("focusin", stop);
      wrap.addEventListener("focusout", function () { rearm(); });
    }
    go(0); rearm();
  }

  /* ---------------------------------------------------------------------
     9. Enquiry form -> WhatsApp (validated, accessible, no backend)
  --------------------------------------------------------------------- */
  var form = document.querySelector("#enquiry-form");
  if (form) {
    var nameEl = form.querySelector("#name");
    var phoneEl = form.querySelector("#phone");
    function setError(el, errId, message) {
      var errEl = form.querySelector("#" + errId);
      if (message) {
        el.setAttribute("aria-invalid", "true");
        if (errEl) { errEl.textContent = message; errEl.hidden = false; }
      } else {
        el.removeAttribute("aria-invalid");
        if (errEl) { errEl.textContent = ""; errEl.hidden = true; }
      }
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get("name") || "").toString().trim();
      var phone = (d.get("phone") || "").toString().trim();
      var event = (d.get("event") || "").toString();
      var date = (d.get("date") || "").toString();
      var guests = (d.get("guests") || "").toString();
      var msg = (d.get("message") || "").toString().trim();

      var firstInvalid = null;
      if (!name) { setError(nameEl, "name-error", "Please enter your name."); firstInvalid = firstInvalid || nameEl; } else { setError(nameEl, "name-error", ""); }
      if (!phone) { setError(phoneEl, "phone-error", "Please enter your phone number."); firstInvalid = firstInvalid || phoneEl; } else { setError(phoneEl, "phone-error", ""); }
      if (firstInvalid) { firstInvalid.focus(); return; }

      var lines = [
        "Hello Silver Star! I'd like to enquire about booking.",
        "",
        "*Name:* " + name,
        "*Phone:* " + phone,
        "*Occasion:* " + event,
        "*Preferred date:* " + (date || "Flexible"),
        "*Approx. guests:* " + (guests || "Not sure")
      ];
      if (msg) lines.push("*Message:* " + msg);
      var text = lines.join("\n");
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text), "_blank", "noopener");

      var btn = form.querySelector("button[type=submit]");
      if (btn && !btn.dataset.busy) {
        btn.dataset.busy = "1";
        var orig = btn.innerHTML;
        btn.innerHTML = "Opening WhatsApp…";
        setTimeout(function () { btn.innerHTML = orig; delete btn.dataset.busy; }, 2500);
      }
    });
  }

  /* Current year */
  var yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     10. Three.js - drifting golden star-field (the "Silver Star" 3D look)
  --------------------------------------------------------------------- */
  function initStars() {
    if (reduceMotion || typeof THREE === "undefined") return;
    var canvas = document.getElementById("star-canvas");
    if (!canvas) return;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (err) {
      canvas.style.display = "none";
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1400);
    camera.position.z = 420;

    function makeSprite() {
      var c = document.createElement("canvas"); c.width = c.height = 64;
      var ctx = c.getContext("2d");
      var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,246,224,1)");
      g.addColorStop(0.25, "rgba(232,201,138,0.95)");
      g.addColorStop(0.55, "rgba(200,164,92,0.35)");
      g.addColorStop(1, "rgba(200,164,92,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(32, 32, 32, 0, Math.PI * 2); ctx.fill();
      var tex = new THREE.Texture(c); tex.needsUpdate = true; return tex;
    }
    var sprite = makeSprite();

    var COUNT = window.innerWidth < 720 ? 260 : 560;
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(COUNT * 3);
    var SPREAD = 1100;
    for (var i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 900 - 100;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({ size: 9, map: sprite, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 });
    var points = new THREE.Points(geo, mat);
    scene.add(points);

    var geo2 = new THREE.BufferGeometry();
    var pos2 = new Float32Array(60 * 3);
    for (var j = 0; j < 60; j++) {
      pos2[j * 3] = (Math.random() - 0.5) * SPREAD;
      pos2[j * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      pos2[j * 3 + 2] = (Math.random() - 0.5) * 700 - 50;
    }
    geo2.setAttribute("position", new THREE.BufferAttribute(pos2, 3));
    var mat2 = new THREE.PointsMaterial({ size: 16, map: sprite, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55, color: 0xeaf0ff });
    var points2 = new THREE.Points(geo2, mat2);
    scene.add(points2);

    var mouseX = 0, mouseY = 0, tX = 0, tY = 0;
    if (fine) {
      window.addEventListener("pointermove", function (e) {
        tX = (e.clientX / window.innerWidth - 0.5);
        tY = (e.clientY / window.innerHeight - 0.5);
      }, { passive: true });
    }

    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    // Single-flight RAF: never run two concurrent loops
    var running = true, rafId = null, t = 0;
    function start() { if (rafId === null) rafId = requestAnimationFrame(loop); }
    function stop() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) start(); else stop();
    });
    function loop() {
      rafId = null;
      if (!running) return;
      t += 0.0016;
      mouseX += (tX - mouseX) * 0.04;
      mouseY += (tY - mouseY) * 0.04;
      points.rotation.y = t;
      points.rotation.x = t * 0.4;
      points2.rotation.y = -t * 0.7;
      camera.position.x += (mouseX * 120 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 120 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(loop);
    }
    start();
  }

  if (document.readyState === "complete") initStars();
  else window.addEventListener("load", initStars);
})();
