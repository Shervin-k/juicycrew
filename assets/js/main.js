// Bloomwood site scripts
document.addEventListener("DOMContentLoaded", () => {
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const canObserve = "IntersectionObserver" in window;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // Year in footer
  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const toggle = $("#menu-toggle");
  const nav = $("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Smooth internal anchor scroll
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

  // Hero waves canvas (lightweight, contained)
  (function heroWaves() {
    const cvs = document.getElementById("hero-waves");
    if (!cvs || reduce) return;

    const ctx = cvs.getContext("2d", { alpha: true });
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0, h = 0, t = 0;

    function resize() {
      const r = cvs.getBoundingClientRect();
      w = Math.max(600, r.width);
      h = Math.max(360, r.height);
      cvs.width = Math.floor(w * DPR);
      cvs.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const lines = 6, amp = h * 0.12, freq = 2.2;

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
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // Chat reveal
  (function chatReveal() {
    const chat = $(".chat");
    if (!chat || !canObserve || reduce) {
      $$(".msg").forEach(m => m.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    }, { threshold: 0.2 });
    $$(".msg").forEach(m => io.observe(m));
  })();
});
