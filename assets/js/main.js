// main.js — Bloomwood
document.addEventListener("DOMContentLoaded", () => {
  // Mini-helpers
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // -----------------------------
  // Footer: aktuelles Jahr setzen
  // -----------------------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --------------------------------
  // Mobile-Navigation: einheitlicher Toggle (.open)
  // --------------------------------
  const menuBtn = $("#menu-toggle");
  const siteNav = $("#site-nav");
  if (menuBtn && siteNav) {
    menuBtn.addEventListener("click", () => {
      const open = siteNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  // --------------------------------
  // Optional: sanftes Scrollen für In-Page-Links
  // --------------------------------
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", "#" + id);
    });
  });

  // --------------------------------
  // Hero-Waves: nur im Viewport animieren
  // respektiert prefers-reduced-motion
  // --------------------------------
  (function heroWaves() {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const canvas = document.getElementById("hero-waves");
    const hero   = canvas?.closest(".hero");

    if (!canvas || !hero || reduce) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0, h = 0, t = 0;
    let rafId = null;
    let running = false;
    let inView = false;

    function resize() {
      const r = canvas.getBoundingClientRect();
      w = Math.max(600, r.width);
      h = Math.max(360, r.height);
      canvas.width  = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function drawFrame() {
      ctx.clearRect(0, 0, w, h);
      const lines = 6;
      const amp = h * 0.12;
      const freq = 2.2;

      for (let i = 0; i < lines; i++) {
        const p = i / (lines - 1);
        const yBase = h * (0.25 + 0.55 * p);
        ctx.lineWidth = 4 + 8 * (1 - p);
        ctx.strokeStyle = `hsla(${150 + 12 * (p - 0.5)},60%,45%,${0.12 + 0.1 * (1 - p)})`;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const k = (x / w) * Math.PI * freq;
          const y = yBase
            + Math.sin(k + t * 0.015) * amp * (0.5 + p)
            + Math.sin(k * 0.5 + t * 0.02) * amp * 0.25 * (1 - p);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      t++;
    }

    function loop() {
      if (!running) return;
      drawFrame();
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Initial sizing
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Pause bei Tab-Wechsel
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (inView) start();
    });

    // Start/Stop basierend auf Sichtbarkeit der Hero-Section
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.target !== hero) continue;
          inView = e.isIntersecting && e.intersectionRatio > 0.1;
          if (inView && !document.hidden) start();
          else stop();
        }
      }, { threshold: [0, 0.1, 0.25] });
      io.observe(hero);
    } else {
      // Fallback: einfach starten
      start();
    }
  })();

  // --------------------------------
  // Kleine Reveal-Effekte für Chat-Nachrichten
  // (ohne Layout-Manipulation)
  // --------------------------------
  (function chatReveal() {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const msgs = $$(".msg");
    if (!msgs.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      msgs.forEach(m => m.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    }, { threshold: 0.2 });

    msgs.forEach(m => io.observe(m));
  })();
});
