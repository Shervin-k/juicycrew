// Juicy Crew – main.js (einfach & sauber)
document.addEventListener("DOMContentLoaded", () => {
  // 1) Jahr im Footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2) Mobile-Navi (funktioniert nur, wenn es #menu-toggle gibt – sonst wird's einfach übersprungen)
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 3) Sanftes Scrollen für interne Links (#…)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
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

  // 4) Logo-Pfad prüfen (nur Hinweis in der Konsole)
  const logo = document.querySelector('img[src="assets/images/logo.svg"]');
  if (logo) {
    logo.addEventListener("error", () => {
      console.warn("Logo nicht gefunden. Pfad prüfen: assets/images/logo.svg");
    });
  }

  // === Helfer: IntersectionObserver sicher nutzen ===
  const canObserve = "IntersectionObserver" in window;
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // 5) Benefits: Karte im Fokus leicht hervorheben
  const benefitCards = document.querySelectorAll(".benefit-card");
  if (canObserve && benefitCards.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            entry.target.classList.add("is-active");
          } else {
            entry.target.classList.remove("is-active");
          }
        });
      },
      { root: null, rootMargin: "-20% 0% -20% 0%", threshold: [0, 0.25, 0.55, 0.75, 1] }
    );
    benefitCards.forEach((c) => io.observe(c));
  }

// 6) Cases: aktive Karte oben; vorige bleibt klein & blass dahinter
{
  const wraps = Array.from(document.querySelectorAll(".cases-kota__snap"));
  const canObserve = "IntersectionObserver" in window;
  if (canObserve && wraps.length) {

    // Helper: zIndex so setzen, dass spätere Karten über früheren liegen
    const applyZ = (activeIndex) => {
      wraps.forEach((w, i) => {
        const card = w.querySelector(".case-card-kota");
        if (!card) return;
        // Basis: Reihenfolge = Stack
        card.style.zIndex = String(100 + i);
        // aktive Karte noch höher
        if (i === activeIndex) card.style.zIndex = String(1000 + i);
      });
    };

    // Initialzustand
    wraps.forEach(w => w.classList.remove("is-active","is-past"));
    applyZ(-1);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!(entry.isIntersecting && entry.intersectionRatio > 0.6)) return;

        const idx = wraps.indexOf(entry.target);
        // Markiere: alles davor = past, aktuelle = active, danach = neutral
        wraps.forEach((w, i) => {
          w.classList.toggle("is-active", i === idx);
          w.classList.toggle("is-past",   i <  idx);
          if (i > idx) { w.classList.remove("is-past","is-active"); }
        });
        applyZ(idx);
      });
    }, { root:null, threshold:[0.6] });

    wraps.forEach(w => io.observe(w));
  }
}

  // 7) Chat: Nachrichten beim Scrollen einblenden (mit kleinem Stufen-Delay)
  const chat = document.querySelector(".chat");
  if (chat) {
    const msgs = Array.from(chat.querySelectorAll(".msg"));
    if (!canObserve || prefersReducedMotion) {
      // Fallback oder wenn Animationen aus: alles sofort sichtbar
      msgs.forEach((m) => m.classList.add("is-visible"));
    } else if (msgs.length) {
      // Startzustand
      msgs.forEach((m) => {
        m.classList.remove("is-visible", "is-active");
        m.style.transitionDelay = "0ms";
      });

      let firstBatchDone = false;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;

            if (entry.isIntersecting) {
              // Einmaliger Staffel-Delay nur beim ersten Betreten
              if (!firstBatchDone) {
                msgs.forEach((m, i) => (m.style.transitionDelay = `${i * 80}ms`));
                firstBatchDone = true;
                setTimeout(() => msgs.forEach((m) => (m.style.transitionDelay = "0ms")), msgs.length * 80 + 600);
              }
              el.classList.add("is-visible");
            }

            // leichtes "aktiv", wenn ungefähr mittig
            const mid =
              entry.intersectionRatio > 0.6 &&
              entry.boundingClientRect.top > window.innerHeight * 0.18 &&
              entry.boundingClientRect.bottom < window.innerHeight * 0.82;
            el.classList.toggle("is-active", mid);
          });
        },
        { root: null, rootMargin: "-15% 0% -15% 0%", threshold: [0, 0.25, 0.6, 0.9] }
      );

      msgs.forEach((m) => io.observe(m));
    }
  }

  console.log("Juicy Crew Seite geladen ✅");
});
