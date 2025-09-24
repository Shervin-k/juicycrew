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
    const cfg = { lines:8, amp:0.14, freq:2.2, speed:0.015, baseHue:150 };

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

      const ampPx = h*cfg.amp*(1+Math.abs(my)*0.7);
      for (let i=0;i<cfg.lines;i++){
        const p=i/(cfg.lines-1), phase=t*cfg.speed+p*1.2;
        const yBase=h*(0.25+0.5*p), thick=6+10*(1-p);
        ctx.lineWidth=thick;
        ctx.strokeStyle=`hsla(${cfg.baseHue+15*(p-0.5)},60%,45%,${0.12+0.1*(1-p)})`;
        ctx.beginPath();
        const tilt = mx*24;
        for (let x=0;x<=w;x+=8){
          const k=(x/w)*Math.PI*cfg.freq;
          const y=yBase
           + Math.sin(k+phase*3)*ampPx*(0.5+p)
           + Math.sin(k*0.5+phase*1.2)*ampPx*0.25*(1-p)
           + my*28*(p-0.3);
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
  }
})();

  // =========================
  // 2) BENEFITS (card highlight on scroll)
  // =========================
  (function benefitsIO(){
    const cards = $$(".benefit-card");
    if (!canObserve || !cards.length) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        e.target.classList.toggle("is-active", e.isIntersecting && e.intersectionRatio>0.55);
      });
    },{ root:null, rootMargin:"-20% 0% -20% 0%", threshold:[0,0.25,0.55,0.75,1]});
    cards.forEach(c=>io.observe(c));
  })();
  // Benefits: KOTA-Animation aktivieren
(function () {
  const section = document.querySelector('#benefits.benefits-kota');
  if (!section || !('IntersectionObserver' in window)) return;

  // Animation einschalten: schaltet die .benefits-animate CSS-Regeln frei
  section.classList.add('benefits-animate');

  const snaps = Array.from(section.querySelectorAll('.benefits-kota__snap'));
  if (!snaps.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
        el.classList.add('is-active');

        // alle vorigen als "past" markieren (kleiner/blasser)
        const idx = snaps.indexOf(el);
        snaps.forEach((s, i) => s.classList.toggle('is-past', i < idx));
      } else {
        el.classList.remove('is-active');
      }
    });
  }, {
    threshold: [0, 0.25, 0.55, 0.75, 1],
    rootMargin: '-12% 0% -12% 0%' // Fokuszone in der Mitte
  });

  snaps.forEach((s) => io.observe(s));
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
    if (!msgs.length) return;

    if (!canObserve || prefersReducedMotion){
      msgs.forEach(m=>m.classList.add("is-visible"));
      return;
    }
    msgs.forEach(m=>{ m.classList.remove("is-visible","is-active"); m.style.transitionDelay="0ms"; });

    let firstBatchDone = false;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const el = entry.target;
        if (entry.isIntersecting){
          if (!firstBatchDone){
            msgs.forEach((m,i)=>m.style.transitionDelay = `${i*80}ms`);
            firstBatchDone = true;
            setTimeout(()=>msgs.forEach(m=>m.style.transitionDelay="0ms"), msgs.length*80+600);
          }
          el.classList.add("is-visible");
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
  // 5) CUSTOMER VOICES (subtle reveal)
  // =========================
  (function voicesReveal(){
    const cards = $$(".voice-card");
    if (!canObserve || !cards.length) return;
    cards.forEach(c=>c.style.opacity="0");
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if (e.isIntersecting){
          e.target.style.transition = "opacity .4s ease, transform .4s ease";
          e.target.style.transform  = "translateY(0)";
          e.target.style.opacity    = "1";
        } else {
          e.target.style.transform  = "translateY(8px)";
          e.target.style.opacity    = "0";
        }
      });
    },{ threshold:[0,0.2]});
    cards.forEach(c=>io.observe(c));
  })();

  // =========================
  // 6) CONTACT (placeholder: could add form handling later)
  // =========================
  (function contact(){
    // aktuell nur Mailto-Button – kein JS nötig.
  })();

  // =========================
  // 7) HEADER & FOOTER (year, mobile nav, to-top)
  // =========================
  (function headerFooter(){
    // year
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // mobile nav
    const toggle = $("#menu-toggle");
    const nav = $("#site-nav");
    if (toggle && nav){
      toggle.addEventListener("click", ()=>{
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

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
  console.log("Juicy Crew — scripts ready ✅");
});
