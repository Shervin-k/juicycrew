// Juicy Crew — main.js (sectioned)
// 0: General  |  1: Hero  |  2: Benefits  |  3: Cases
// 4: Customer Service  |  5: Customer Voices  |  6: Contact  |  7: Header & Footer

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 0) GENERAL (helpers, scroll, feature flags)
  // =========================
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const canObserve = "IntersectionObserver" in window;
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // Smooth scroll for internal anchors
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", "#" + id);
      }
    });
  });

  // Logo file check (console hint only)
  const brandLogo = $('img[src="assets/images/logo.svg"]');
  if (brandLogo) brandLogo.addEventListener("error", () => {
    console.warn("Logo not found. Check: assets/images/logo.svg");
  });

  // =========================
  // 1) HERO (dynamic green sound-waves + blob)
  // =========================
  // 1) HERO (waves + mouse-parallax blob)
(function heroFX(){
  const cvs = document.getElementById("hero-waves");
  const blob = document.querySelector(".hero__blob");
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // --- WAVES ---
  if (cvs && !reduce){
    const ctx = cvs.getContext("2d", { alpha:true });
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio||1));
    let w=0,h=0,t=0, mx=0,my=0, tx=0,ty=0;
    const isMobile = window.innerWidth <= 900;
    const isSmallMobile = window.innerWidth <= 600;
    const cfg = { 
      lines: 6, // Reduced for smoother look
      amp: 0.15, // Moderate amplitude
      freq: 1.8, // Lower frequency for smoother, longer waves
      speed: 0.010, // Slower for smoother floating
      baseHue: 150 
    };

    const resize = () => {
      const r = cvs.getBoundingClientRect();
      w = Math.max(600, r.width);
      h = Math.max(400, r.height);
      cvs.width  = Math.floor(w*DPR);
      cvs.height = Math.floor(h*DPR);
      ctx.setTransform(DPR,0,0,DPR,0,0);
    };
    resize(); window.addEventListener("resize", resize, {passive:true});

    window.addEventListener("pointermove", (e)=>{
      const r = cvs.getBoundingClientRect();
      tx = (e.clientX - (r.left+r.width/2)) / r.width;   // -0.5..0.5
      ty = (e.clientY - (r.top +r.height/2)) / r.height;
    }, {passive:true});

    const lerp=(a,b,k)=>a+(b-a)*k;

    function draw(){
      mx = lerp(mx, tx, 0.06);
      my = lerp(my, ty, 0.06);
      ctx.clearRect(0,0,w,h);
      ctx.globalCompositeOperation="lighter";

      const ampPx = h*cfg.amp*(1+Math.abs(my)*0.8);
      for (let i=0;i<cfg.lines;i++){
        const p=i/(cfg.lines-1), phase=t*cfg.speed+p*1.4;
        const yBase=h*(0.2+0.6*p), thick=8+12*(1-p);
        ctx.lineWidth=thick;
        // Light floating green waves
        const hue = cfg.baseHue + 15*(p-0.5); // shift around green (±7.5 degrees)
        const saturation = 60;
        const lightness = 45;
        const alpha = 0.12 + 0.10*(1-p); // ranges from 0.12 to 0.22
        ctx.strokeStyle=`hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.beginPath();
        const tilt = mx*30;
        for (let x=0;x<=w;x+=4){ // Smaller increment for smoother waves
          const k=(x/w)*Math.PI*cfg.freq;
          const y=yBase
           + Math.sin(k+phase*3.5)*ampPx*(0.6+p*0.4)
           + Math.sin(k*0.7+phase*1.5)*ampPx*0.3*(1-p)
           + Math.sin(k*1.3+phase*0.8)*ampPx*0.15*(1-p)
           + my*35*(p-0.3);
          const xx=x+tilt*p;
          if(x===0)ctx.moveTo(xx,y); else ctx.lineTo(xx,y);
        }
        ctx.stroke();
      }
      ctx.globalCompositeOperation="source-over";
      t++; requestAnimationFrame(draw);
    }
    draw();

    // --- BLOB PARALLAX ---
    if (blob){
      let bx=0, by=0, btx=0, bty=0;
      window.addEventListener("pointermove",(e)=>{
        const r = cvs.getBoundingClientRect();
        btx = (e.clientX - (r.left+r.width/2)) / r.width;   // -0.5..0.5
        bty = (e.clientY - (r.top +r.height/2)) / r.height;
      },{passive:true});

      function animateBlob(){
        bx = lerp(bx, btx, 0.08);
        by = lerp(by, bty, 0.08);
        const moveX = bx * 36;   // wie stark bewegen (px)
        const moveY = by * 28;
        const scale = 1.04 + Math.min(0.04, Math.hypot(bx,by)*0.1); // leichtes Mit-Scale
        blob.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`;
        if (!reduce) requestAnimationFrame(animateBlob);
      }
      animateBlob();
    }
  }// Hero CTA — DISABLED (Button now positioned below subline via CSS)
/*
(function positionHeroCTA() {
  const SELECTORS = {
    container: '.hero__copy',
    subline: '.subline',
    cta: '.hero__cta'
  };

  // Feintuning: veränderbare Werte
  const CONFIG = {
    rightOffset: '4rem',     // horizontaler Abstand vom rechten Rand der Textspalte (CSS string ok)
    mobileBreakpoint: 768,   // <= px => Button geht in Flow
    topAdjustPx: 0           // manuelle Feinanpassung in px (z. B. -6, +4)
  };

  function applyPosition() {
    const container = document.querySelector(SELECTORS.container);
    const subline = document.querySelector(SELECTORS.subline);
    const btn = document.querySelector(SELECTORS.cta);
    if (!container || !subline || !btn) return;

    const w = window.innerWidth || document.documentElement.clientWidth;
    if (w <= CONFIG.mobileBreakpoint) {
      // mobile: statisch (CSS media query sorgt dafür)
      btn.style.position = '';
      btn.style.top = '';
      btn.style.right = '';
      btn.style.transform = '';
      return;
    }

    // desktop: absolut positionieren relativ zur .hero__copy
    const cRect = container.getBoundingClientRect();
    const sRect = subline.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();

    // Mitte der Subline innerhalb container-coordinates
    const subMiddle = (sRect.top - cRect.top) + (sRect.height / 2);

    // Ziel-top so setzen, dass Button vertikal zentriert auf Subline-Mitte liegt
    const targetTop = Math.round(subMiddle - (bRect.height / 2) + CONFIG.topAdjustPx);

    // apply styles
    btn.style.position = 'absolute';
    btn.style.top = targetTop + 'px';
    btn.style.right = CONFIG.rightOffset;
    btn.style.transform = 'translateY(0)';
  }

  // Debounced resize handler
  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyPosition, 80);
  }

  // Wait for fonts/DOM ready then position
  function init() {
    applyPosition();
    window.addEventListener('resize', onResize, { passive: true });

    // If webfonts change layout, re-run when fonts finished
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(applyPosition, 30);
      }).catch(() => {});
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
*/
})();

  // =========================
  // 2) BENEFITS (simple appear effect on scroll)
  // =========================
  (function benefitsSimpleAppear(){
    const cards = $$(".benefit-card-kota");
    if (!canObserve || !cards.length) return;
    
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
        }
      });
    },{ 
      root: null, 
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1
    });
    
    cards.forEach(c => io.observe(c));
  })();

  // =========================
  // 3) CASES (KOTA-style stack: past shrinks/fades, active on top)
  // =========================
  (function casesStack(){
    const wraps = $$(".cases-kota__snap");
    if (!canObserve || !wraps.length) return;

    const applyZ = (activeIndex) => {
      wraps.forEach((w,i)=>{
        const card = $(".case-card-kota", w);
        if (!card) return;
        card.style.zIndex = String(100 + i);
        if (i === activeIndex) card.style.zIndex = String(1000 + i);
      });
    };

    wraps.forEach(w=>w.classList.remove("is-active","is-past"));
    applyZ(-1);

    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (!(entry.isIntersecting && entry.intersectionRatio>0.6)) return;
        const idx = wraps.indexOf(entry.target);
        wraps.forEach((w,i)=>{
          w.classList.toggle("is-active", i===idx);
          w.classList.toggle("is-past",   i< idx);
          if (i>idx) w.classList.remove("is-past","is-active");
        });
        applyZ(idx);
      });
    },{ root:null, threshold:[0.6]});
    wraps.forEach(w=>io.observe(w));
  })();
  

  // =========================
  // 4) CUSTOMER SERVICE (chat reveal + mid emphasis)
  // =========================
  (function chatReveal(){
    const chat = $(".chat");
    if (!chat) return;
    const msgs = $$(".msg", chat);
    const names = $$(".msg-name", chat);
    if (!msgs.length) return;

    if (!canObserve || prefersReducedMotion){
      msgs.forEach(m=>m.classList.add("is-visible"));
      names.forEach(n=>n.classList.add("is-visible"));
      return;
    }
    msgs.forEach(m=>{ m.classList.remove("is-visible","is-active"); m.style.transitionDelay="0ms"; });
    names.forEach(n=>{ n.classList.remove("is-visible"); n.style.transitionDelay="0ms"; });

    let firstBatchDone = false;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const el = entry.target;
        if (entry.isIntersecting){
          if (!firstBatchDone){
            msgs.forEach((m,i)=>m.style.transitionDelay = `${i*80}ms`);
            names.forEach((n,i)=>n.style.transitionDelay = `${i*80 + 50}ms`);
            firstBatchDone = true;
            setTimeout(()=>{
              msgs.forEach(m=>m.style.transitionDelay="0ms");
              names.forEach(n=>n.style.transitionDelay="0ms");
            }, msgs.length*80+600);
          }
          el.classList.add("is-visible");
          // Also reveal the corresponding name
          const wrapper = el.closest('.msg-wrapper');
          if (wrapper) {
            const name = wrapper.querySelector('.msg-name');
            if (name) name.classList.add('is-visible');
          }
        }
        const mid = entry.intersectionRatio>0.6 &&
                    entry.boundingClientRect.top > window.innerHeight*0.18 &&
                    entry.boundingClientRect.bottom < window.innerHeight*0.82;
        el.classList.toggle("is-active", mid);
      });
    },{ root:null, rootMargin:"-15% 0% -15% 0%", threshold:[0,0.25,0.6,0.9]});
    msgs.forEach(m=>io.observe(m));
  })();

  // =========================
  // 5) CUSTOMER VOICES (mobile-optimized reveal)
  // =========================
  (function voicesReveal(){
    const cards = $$(".voice-card");
    if (!canObserve || !cards.length) return;
    
    const isMobile = window.innerWidth <= 900;
    
    // Reset cards to initial state
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = isMobile ? "translateY(40px) scale(0.9)" : "translateY(30px) scale(0.95)";
      card.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    });
    
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          const card = entry.target;
          const index = cards.indexOf(card);
          
          // Mobile-optimized staggered animation
          const delay = isMobile ? index * 100 : index * 150;
          setTimeout(() => {
            card.classList.add('is-visible');
            card.style.opacity = "1";
            card.style.transform = "translateY(0) scale(1)";
          }, delay);
        }
      });
    },{ 
      threshold: isMobile ? [0.05, 0.1, 0.2] : [0.1, 0.2, 0.3], 
      rootMargin: isMobile ? "-20px 0px" : "-50px 0px"
    });
    
    cards.forEach(c=>io.observe(c));
  })();
  

  // =========================
  // 6) CONTACT (placeholder: could add form handling later)
  // =========================
  (function contact(){
    // aktuell nur Mailto-Button – kein JS nötig.
  })();

  // =========================
  // 7) HEADER & FOOTER (year, back-to-top)
  // Note: Burger menu is initialized in components.js after header loads
  // =========================
  (function headerFooter(){
    // year
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // show/hide "Back to top" when scrolled
    const toTop = $(".to-top");
    if (toTop){
      const onScroll = () => {
        const scrolled = window.scrollY > 600;
        toTop.style.opacity = scrolled ? "1" : "0";
        toTop.style.pointerEvents = scrolled ? "auto" : "none";
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive:true });
    }
  })();
// ===== Cases: Simple Stack für bestehende Klassen =====
(function casesSimple(){
  const cards = Array.from(document.querySelectorAll("#cases .case-card"));
  if (!cards.length || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (!(e.isIntersecting && e.intersectionRatio > 0.5)) return;
      const idx = cards.indexOf(e.target);
      cards.forEach((c,i)=>{
        c.classList.toggle("is-active", i === idx);
        c.classList.toggle("is-past",   i <  idx);
        if (i > idx) c.classList.remove("is-active","is-past");
      });
    });
  }, { root:null, rootMargin:"-10% 0% -10% 0%", threshold:[0.5] });
  cards.forEach(c => io.observe(c));
})();
  // =========================
  // 8) MOBILE RESPONSIVENESS & PERFORMANCE
  // =========================
  (function mobileOptimizations(){
    let resizeTimeout;
    
    // Handle window resize for mobile/desktop transitions
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isMobile = window.innerWidth <= 900;
        
        // Re-initialize animations if needed
        if (isMobile) {
          // Mobile-specific optimizations
          document.body.classList.add('mobile-device');
        } else {
          document.body.classList.remove('mobile-device');
        }
      }, 250);
    }, { passive: true });
    
    // Initial mobile detection
    if (window.innerWidth <= 900) {
      document.body.classList.add('mobile-device');
    }
    
    // Optimize scroll performance on mobile
    let ticking = false;
    function updateScrollElements() {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-based optimizations can go here
          ticking = false;
        });
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', updateScrollElements, { passive: true });
  })();

  console.log("Juicy Crew — scripts ready ✅");
});
// Mobile: Case Cards Tap to Reveal (one at a time)
if ('ontouchstart' in window) {
  document.addEventListener('DOMContentLoaded', () => {
    const caseTiles = document.querySelectorAll('.case-tile');
    
    caseTiles.forEach(tile => {
      tile.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Check if this tile is already revealed
        const isRevealed = tile.classList.contains('revealed');
        
        // Hide all cards first
        caseTiles.forEach(t => t.classList.remove('revealed'));
        
        // If this tile was NOT revealed, reveal it
        if (!isRevealed) {
          tile.classList.add('revealed');
        }
      });
    });
  });
}

// Smart Header: ein-/ausblenden je nach Scrollrichtung
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
      // Runter scrollen -> Header verstecken
      header.classList.add('hide');
    } else {
      // Hoch scrollen -> Header zeigen
      header.classList.remove('hide');
    }

    lastScroll = currentScroll;
  });
});
