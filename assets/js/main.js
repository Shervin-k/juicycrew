// Jahr im Footer setzen
document.addEventListener("DOMContentLoaded", function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile Navigation
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Sanftes Scrollen für interne Links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", "#" + targetId);
      }
    });
  });

  // Einfache Prüfung, ob das Logo geladen werden kann
  var logo = document.querySelector('img[src="assets/images/logo.svg"]');
  if (logo) {
    logo.addEventListener("error", function () {
      console.warn("Logo nicht gefunden, prüfe den Pfad assets/images/logo.svg");
    });
  }

  // Highlight Benefit Cards beim Scrollen
  var benefitCards = document.querySelectorAll('.benefit-card');
  if ("IntersectionObserver" in window && benefitCards.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
          entry.target.classList.add("is-active");
        } else {
          entry.target.classList.remove("is-active");
        }
      });
    }, {
      root: null,
      rootMargin: "-20% 0% -20% 0%", // Fokus: Mitte des Screens
      threshold: [0, 0.25, 0.55, 0.75, 1]
    });

    benefitCards.forEach(function (c) { io.observe(c); });
  }

  // Kleine Diagnose in der Konsole
  console.log("Juicy Crew Seite geladen");
    // Chat: reveal messages on scroll
  const msgs = document.querySelectorAll(".chat .msg");
  if ("IntersectionObserver" in window && msgs.length) {
    let firstRevealDone = false;

    const io = new IntersectionObserver((entries)=>{
      entries.forEach((e)=>{
        const el = e.target;
        if (e.isIntersecting) {
          if (!firstRevealDone) {
            msgs.forEach((m,i)=>{ m.style.transitionDelay = (i*80)+"ms"; });
            firstRevealDone = true;
          }
          el.classList.add("is-visible");
        }
        const center = e.intersectionRatio > 0.6 &&
          e.boundingClientRect.top > window.innerHeight*0.2 &&
          e.boundingClientRect.bottom < window.innerHeight*0.8;
        el.classList.toggle("is-active", center);
      });
    }, { root:null, rootMargin:"-20% 0% -20% 0%", threshold:[0,.25,.6,.9] });

    msgs.forEach(m=>io.observe(m));
  }
  // Chat: robustes Scroll-Reveal mit Stagger & Center-Highlight
const chatEl = document.querySelector(".chat");
if (chatEl) {
  const msgs = Array.from(chatEl.querySelectorAll(".msg"));
  if ("IntersectionObserver" in window && msgs.length) {
    // Startzustand sauber setzen
    msgs.forEach(m => {
      m.classList.remove("is-visible", "is-active");
      m.style.transitionDelay = "0ms";
    });

    let firstBatchDone = false;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          // Einmaliger Stagger nur für den ersten Reveal-Durchlauf
          if (!firstBatchDone) {
            msgs.forEach((m, i) => (m.style.transitionDelay = `${i * 80}ms`));
            firstBatchDone = true;
            // Delay nach dem ersten Durchlauf wieder zurücksetzen
            setTimeout(() => msgs.forEach(m => (m.style.transitionDelay = "0ms")), msgs.length * 80 + 600);
          }
          el.classList.add("is-visible");
        }
        // sanftes "aktiv", wenn grob in der Mitte
        const midBand =
          entry.intersectionRatio > 0.6 &&
          entry.boundingClientRect.top > window.innerHeight * 0.18 &&
          entry.boundingClientRect.bottom < window.innerHeight * 0.82;
        el.classList.toggle("is-active", midBand);
      });
    }, { root: null, rootMargin: "-15% 0% -15% 0%", threshold: [0, 0.25, 0.6, 0.9] });

    msgs.forEach(m => io.observe(m));
  } else {
    // Fallback: alles sichtbar machen
    msgs.forEach(m => m.classList.add("is-visible"));
  }
}
});
