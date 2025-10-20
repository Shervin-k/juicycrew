/**
 * Component Include System with Fallback
 * Dynamically loads header and footer components into pages
 */

// Component content as fallback (in case fetch fails)
const componentContent = {
  header: `<!-- Header Component -->
<header class="site-header">
  <div class="header-inner">
    <a href="index.html" class="brand">
      <img src="assets/images/logo.png" alt="Bloomwood Logo" class="brand-logo" />
    </a>
    
    <!-- Navigation Menu -->
    <nav id="site-nav" class="site-nav">
      <a href="https://calendar.app.google/FavFdbdmSK1Df5y58" target="_blank">Advertise With Us</a>
    </nav>
    
    <!-- Burger Menu Button -->
    <button id="menu-toggle" class="burger" aria-label="Open navigation menu" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</header>`,

  footer: `<!-- Footer Component -->
<style>
  @media(min-width: 900px) {
    .footer__container {
      display: flex;
      align-items: center; /* Vertikale Zentrierung */
      justify-content: space-between;
    }
    .footer__logo {
      text-align: left;
    }
    .footer__intro {
      text-align: center;
    }
    .footer__nav {
      display: none; /* Da Navigation leer ist */
    }
  }
</style>

<footer class="footer">
  <div class="footer__container">
    <!-- Links: Logo -->
    <div class="footer__logo">
      <img src="assets/images/logo.png" alt="Bloomwood Logo" style="max-width: 150px; height: auto;">
    </div>

    <!-- Mitte: Brand Spruch -->
    <p class="footer__tagline">
      Connecting conscious brands with podcasts their audiences trust
    </p>

    <!-- Rechts: Advertise-Button -->
    <a class="footer__cta" href="https://calendar.app.google/FavFdbdmSK1Df5y58" target="_blank">
      Advertise With Us
    </a>
  </div>

  <!-- Untere Zeile -->
  <div class="footer__bottom">
    <p>© <span id="year"></span> Juicy Crew</p>
    <div class="footer__links">
      <a href="mailto:matti@juicycrew.de">Contact</a>
      <a href="privacy-policy.html">Privacy</a>
    </div>
  </div>
</footer>`
};

// Simple component loader function
async function loadComponent(filePath, fallbackContent) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.warn('Fetch failed, using fallback content for:', filePath);
    return fallbackContent;
  }
}

// Load and insert component
async function includeComponent(placeholder, filePath, fallbackContent) {
  const html = await loadComponent(filePath, fallbackContent);
  if (html) {
    placeholder.insertAdjacentHTML('afterend', html);
    placeholder.remove();
    console.log('Component loaded successfully:', filePath);
    
    // Reinitialize burger functionality after header loads
    if (filePath.includes('header')) {
      setTimeout(initializeBurgerMenu, 100);
    }
  } else {
    console.error('Failed to load component:', filePath);
    placeholder.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red;">Error loading component: ${filePath}</div>`;
  }
}

// Initialize burger menu functionality
function initializeBurgerMenu() {
  console.log('🔍 Attempting to initialize burger menu...');
  
  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#site-nav");
  
  console.log('Elements found:', { toggle: !!toggle, nav: !!nav });
  
  if (toggle && nav) {
    console.log('✅ Found burger menu elements!');
    
    // Check if already initialized to prevent duplicates
    if (toggle.hasAttribute('data-initialized')) {
      console.log('⚠️ Burger menu already initialized, skipping...');
      return;
    }
    
    // Add event listener
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("active");
      toggle.setAttribute("aria-expanded", String(isOpen));
      
      console.log('🍔 Burger clicked! Menu is now:', isOpen ? 'OPEN' : 'CLOSED');
      console.log('Nav classes:', nav.className);
      console.log('Toggle classes:', toggle.className);
      
      // Body scroll lock
      if (isOpen) {
        document.body.classList.add("menu-open");
      } else {
        document.body.classList.remove("menu-open");
      }
    });

    // Close menu when clicking on a link
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        console.log('🔗 Link clicked, closing menu');
        nav.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });
    
    // Mark as initialized
    toggle.setAttribute('data-initialized', 'true');
    
    console.log('✅ Burger menu fully initialized and ready!');
  } else {
    console.error('❌ Burger menu elements NOT found!');
  }
}

// Auto-include components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, checking for components...');
  
  // Include header if placeholder exists
  const headerPlaceholder = document.querySelector('[data-include="header"]');
  if (headerPlaceholder) {
    console.log('Found header placeholder, loading...');
    includeComponent(headerPlaceholder, 'components/header.html', componentContent.header);
  } else {
    console.log('No header placeholder found');
  }

  // Include footer if placeholder exists
  const footerPlaceholder = document.querySelector('[data-include="footer"]');
  if (footerPlaceholder) {
    console.log('Found footer placeholder, loading...');
    includeComponent(footerPlaceholder, 'components/footer.html', componentContent.footer);
  } else {
    console.log('No footer placeholder found');
  }
});

// Also try to load components after a short delay in case DOMContentLoaded already fired
setTimeout(function() {
  const headerPlaceholder = document.querySelector('[data-include="header"]');
  const footerPlaceholder = document.querySelector('[data-include="footer"]');
  
  if (headerPlaceholder || footerPlaceholder) {
    console.log('Components still not loaded, trying again...');
    
    if (headerPlaceholder) {
      includeComponent(headerPlaceholder, 'components/header.html', componentContent.header);
    }
    
    if (footerPlaceholder) {
      includeComponent(footerPlaceholder, 'components/footer.html', componentContent.footer);
    }
  }
}, 100);

// Also try to initialize burger menu after a longer delay to ensure main.js has run
setTimeout(function() {
  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#site-nav");
  
  if (toggle && nav && !toggle.hasAttribute('data-initialized')) {
    console.log('Late initialization of burger menu...');
    initializeBurgerMenu();
  }
}, 500);
