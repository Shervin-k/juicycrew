// Juicy Crew — main.js (Redesigned for new layout)
// 0: General | 1: Hero Fullscreen | 2: Benefits | 3: Cases | 4: Customer Service | 5: Customer Voices | 6: Contact | 7: Header & Footer

document.addEventListener("DOMContentLoaded", () => {

// =========================
// 0) GENERAL (helpers, scroll, feature flags)
// =========================

// Utility functions with better naming
const selectElement = (selector, root = document) => root.querySelector(selector);
const selectElements = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const canObserve = "IntersectionObserver" in window;
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

// PERFORMANCE OPTIMIZED: Throttled scroll handler for smooth scroll
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// Smooth scroll for internal anchors with validation
selectElements('a[href^="#"]').forEach(link => {
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

// Logo file check with proper error handling
const brandLogo = selectElement('img[src*="logo"]');
if (brandLogo) {
  brandLogo.addEventListener("error", () => {
    console.warn("Logo not found. Check: assets/images/logo.png");
  }, { once: true }); // PERFORMANCE: Run only once
}

// =========================
// 1) HERO FULLSCREEN (dynamic green sound-waves + blob)
// =========================

// REDESIGNED: Hero effects optimized for fullscreen layout
(function heroFullscreenEffects() {
  const canvas = document.getElementById("hero-waves");
  const blob = document.querySelector(".hero__blob");
  const heroSection = document.querySelector('.hero--fullscreen');
  
  if (!canvas && !blob && !heroSection) return;
  
  let isHeroVisible = true;
  let animationId = null;

  // PERFORMANCE: Use Intersection Observer to pause animations when hero not visible
  if (canObserve && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
      if (!isHeroVisible && animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      } else if (isHeroVisible && !animationId && !prefersReducedMotion) {
        startAnimations();
      }
    }, { threshold: 0.1 });
    heroObserver.observe(heroSection);
  }

  // Canvas Wave Animation - REDESIGNED for fullscreen
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d", { alpha: true });
    const devicePixelRatio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    
    let canvasWidth = 0, canvasHeight = 0, time = 0;
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    const config = { 
      lines: 5, // Reduced for cleaner look
      amplitude: 0.08, // Smaller amplitude for subtle effect
      frequency: 1.5, // Reduced frequency
      speed: 0.008, // Slower speed for calmer effect
      baseHue: 150 
    };

    // PERFORMANCE OPTIMIZED: Debounced resize with proper cleanup
    const handleResize = throttle(() => {
      const rect = canvas.getBoundingClientRect();
      canvasWidth = Math.max(400, rect.width);
      canvasHeight = Math.max(300, rect.height);
      canvas.width = Math.floor(canvasWidth * devicePixelRatio);
      canvas.height = Math.floor(canvasHeight * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }, 150);

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // PERFORMANCE OPTIMIZED: Throttled mouse move handler
    const handleMouseMove = throttle((e) => {
      const rect = canvas.getBoundingClientRect();
      targetX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      targetY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    }, 16);

    window.addEventListener("pointermove", handleMouseMove, { passive: true });

    const lerp = (a, b, factor) => a + (b - a) * factor;

    function drawWaves() {
      if (!isHeroVisible) return;

      mouseX = lerp(mouseX, targetX, 0.03);
      mouseY = lerp(mouseY, targetY, 0.03);
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.globalCompositeOperation = "lighter";

      const amplitudePixels = canvasHeight * config.amplitude * (1 + Math.abs(mouseY) * 0.3);
      
      for (let i = 0; i < config.lines; i++) {
        const lineOpacity = 0.25 + (i / config.lines) * 0.35;
        const hue = config.baseHue + i * 20 + time * 8;
        
        ctx.strokeStyle = `hsla(${hue}, 65%, 55%, ${lineOpacity})`;
        ctx.lineWidth = 1.5 + i * 0.4;
        ctx.beginPath();

        for (let x = 0; x < canvasWidth; x += 10) { // Increased step for performance
          const normalizedX = x / canvasWidth;
          const wave1 = Math.sin((normalizedX * config.frequency + time + i * 0.4) * Math.PI * 2);
          const wave2 = Math.sin((normalizedX * config.frequency * 1.4 + time * 0.6 + i * 0.6) * Math.PI * 2);
          
          const y = canvasHeight / 2 + 
                   (wave1 * amplitudePixels * (1 + mouseX * 0.2)) +
                   (wave2 * amplitudePixels * 0.25);
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      time += config.speed;
      animationId = requestAnimationFrame(drawWaves);
    }

    function startAnimations() {
      if (!animationId && !prefersReducedMotion && isHeroVisible) {
        animationId = requestAnimationFrame(drawWaves);
      }
    }

    startAnimations();
  }

  // Blob Mouse Parallax - REDESIGNED for new layout
  if (blob && !prefersReducedMotion) {
    let blobX = 0, blobY = 0, blobTargetX = 0, blobTargetY = 0;
    
    // PERFORMANCE: Throttled mouse tracking for blob
    const handleBlobMouseMove = throttle((e) => {
      if (!isHeroVisible) return;
      const rect = heroSection.getBoundingClientRect();
      blobTargetX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      blobTargetY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    }, 16);

    window.addEventListener("pointermove", handleBlobMouseMove, { passive: true });

    function animateBlob() {
      if (!isHeroVisible) {
        setTimeout(animateBlob, 100);
        return;
      }

      blobX = lerp(blobX, blobTargetX, 0.04);
      blobY = lerp(blobY, blobTargetY, 0.04);

      const moveX = blobX * 15; // Reduced movement for subtle effect
      const moveY = blobY * 12;
      const scale = 1.01 + Math.min(0.02, Math.hypot(blobX, blobY) * 0.05);

      blob.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`;
      
      if (!prefersReducedMotion) requestAnimationFrame(animateBlob);
    }

    animateBlob();
  }
})();

// =========================
// 2) BENEFITS (card highlight on scroll)
// =========================

// PERFORMANCE OPTIMIZED: Consolidated Intersection Observers
(function benefitsAnimations() {
  // KOTA-style benefits
  const kotaSection = document.querySelector('#benefits.benefits-kota');
  const kotaSnaps = kotaSection ? Array.from(kotaSection.querySelectorAll('.benefits-kota__snap')) : [];

  if (!canObserve || !kotaSnaps.length) return;

  // KOTA benefits with animation
  kotaSection.classList.add('benefits-animate');

  const kotaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio > 0.30) {
        element.classList.add('is-active');
        
        // Mark previous items as past
        const index = kotaSnaps.indexOf(element);
        kotaSnaps.forEach((snap, i) => snap.classList.toggle('is-past', i < index));
      } else {
        element.classList.remove('is-active');
      }
    });
  }, {
    threshold: [0, 0.25, 0.55, 0.75, 1],
    rootMargin: '-12% 0% -12% 0%'
  });

  kotaSnaps.forEach(snap => kotaObserver.observe(snap));
})();

// =========================
// 3) CASES (KOTA-style stack optimization)
// =========================

// PERFORMANCE OPTIMIZED: Cases with better state management
(function casesStack() {
  const simpleCases = selectElements(".case-tile");

  if (!canObserve || !simpleCases.length) return;

  const simpleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const index = simpleCases.indexOf(entry.target);
        
        simpleCases.forEach((card, i) => {
          card.classList.toggle("is-active", i === index);
          card.classList.toggle("is-past", i < index);
          if (i > index) card.classList.remove("is-active", "is-past");
        });
      }
    });
  }, { 
    root: null, 
    rootMargin: "-10% 0% -10% 0%", 
    threshold: [0.5] 
  });

  simpleCases.forEach(card => simpleObserver.observe(card));
})();

// =========================
// 4) CUSTOMER SERVICE (chat reveal optimization)
// =========================

// PERFORMANCE OPTIMIZED: Chat reveal with better timing
(function chatReveal() {
  const chat = selectElement(".chat");
  if (!chat) return;

  const messages = selectElements(".msg", chat);
  if (!messages.length) return;

  if (!canObserve || prefersReducedMotion) {
    messages.forEach(msg => msg.classList.add("is-visible"));
    return;
  }

  // Initialize
  messages.forEach(msg => {
    msg.classList.remove("is-visible", "is-active");
    msg.style.transitionDelay = "0ms";
  });

  let firstBatchRevealed = false;

  const chatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const element = entry.target;
      
      if (entry.isIntersecting) {
        if (!firstBatchRevealed) {
          // Stagger animation for first reveal
          messages.forEach((msg, i) => {
            msg.style.transitionDelay = `${i * 60}ms`;
          });
          firstBatchRevealed = true;
          
          // Reset delays after animation
          setTimeout(() => {
            messages.forEach(msg => msg.style.transitionDelay = "0ms");
          }, messages.length * 60 + 400);
        }
        
        element.classList.add("is-visible");
      }

      // Mid-screen emphasis
      const isInMidScreen = entry.intersectionRatio > 0.6 &&
        entry.boundingClientRect.top > window.innerHeight * 0.18 &&
        entry.boundingClientRect.bottom < window.innerHeight * 0.82;
      
      element.classList.toggle("is-active", isInMidScreen);
    });
  }, { 
    root: null, 
    rootMargin: "-15% 0% -15% 0%", 
    threshold: [0, 0.25, 0.6, 0.9] 
  });

  messages.forEach(msg => chatObserver.observe(msg));
})();

// =========================
// 5) CUSTOMER VOICES (optimized reveal)
// =========================

// PERFORMANCE OPTIMIZED: Voice cards with simpler animation
(function voicesReveal() {
  const voiceCards = selectElements(".voice-card");
  if (!canObserve || !voiceCards.length) return;

  // Initialize
  voiceCards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
  });

  const voicesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      
      if (entry.isIntersecting) {
        Object.assign(card.style, {
          transition: "opacity 0.4s ease, transform 0.4s ease",
          transform: "translateY(0)",
          opacity: "1"
        });
      } else {
        Object.assign(card.style, {
          transform: "translateY(20px)",
          opacity: "0"
        });
      }
    });
  }, { threshold: [0, 0.2] });

  voiceCards.forEach(card => voicesObserver.observe(card));
})();

// =========================
// 6) CONTACT (placeholder for future enhancements)
// =========================

(function contactSection() {
  // Currently using mailto links - no JS needed
  // Future: Add form validation and submission handling
})();

// =========================
// 7) HEADER & FOOTER (navigation and utilities)
// =========================

// REDESIGNED: Header and footer functionality for new layout
(function headerFooterFunctionality() {
  // Update year automatically
  const yearElement = selectElement("#year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // REDESIGNED: Mobile navigation toggle for simplified header
  const menuToggle = selectElement("#menu-toggle");
  const mobileNav = selectElement("#mobile-nav");
  
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      
      // Animate burger menu
      const spans = menuToggle.querySelectorAll("span");
      if (isOpen) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
      } else {
        spans.forEach(span => {
          span.style.transform = "";
          span.style.opacity = "";
        });
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        const spans = menuToggle.querySelectorAll("span");
        spans.forEach(span => {
          span.style.transform = "";
          span.style.opacity = "";
        });
      }
    });
  }

  // PERFORMANCE OPTIMIZED: Throttled scroll for back-to-top button
  const backToTopButton = selectElement(".to-top");
  if (backToTopButton) {
    const handleScroll = throttle(() => {
      const shouldShow = window.scrollY > 600;
      Object.assign(backToTopButton.style, {
        opacity: shouldShow ? "1" : "0.7",
        pointerEvents: "auto"
      });
    }, 100);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // REDESIGNED: Header scroll behavior for fullscreen hero
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScrollPosition = 0;

    const handleHeaderScroll = throttle(() => {
      const currentScroll = window.pageYOffset;
      
      // Show/hide header based on scroll direction
      if (currentScroll > lastScrollPosition && currentScroll > 100) {
        // Scrolling down - hide header
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up - show header
        header.style.transform = 'translateY(0)';
      }
      
      // Add backdrop blur when scrolled
      if (currentScroll > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(15px)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.9)';
        header.style.backdropFilter = 'blur(10px)';
      }
      
      lastScrollPosition = currentScroll;
    }, 16);

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    
    // Add transition for smooth header animations
    header.style.transition = 'transform 0.3s ease, background 0.2s ease, backdrop-filter 0.2s ease';
  }
})();

console.log("Juicy Crew — Redesigned scripts ready ✅");

});
