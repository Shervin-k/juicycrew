document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Lightweight, contained hero waves
  const cvs = document.getElementById("hero-waves");
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
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
});
