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

  // Kleine Diagnose in der Konsole
  console.log("Juicy Crew Seite geladen");
});
