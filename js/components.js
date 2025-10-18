/**
 * Component Include System with Fallback
 * Dynamically loads header and footer components into pages
 */

// Component content as fallback (in case fetch fails)
const componentContent = {
  header: `<!-- Header Component -->
<header class="site-header">
  <div class="header-inner">
   <a href="#" class="brand">
  <img src="assets/images/logo.png" alt="Bloomwood Logo" class="brand-logo" />
</a>
    
    <!-- Das ist dein Menü -->
    <nav id="site-nav" class="site-nav">
      <a href="https://calendar.app.google/FavFdbdmSK1Df5y58" target="_blank">Advertise With Us</a>
    </nav>
    
    <!-- Und das ist der Burger-Button -->
    <button id="menu-toggle" class="burger" aria-label="Navigation öffnen" aria-expanded="false">
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
  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#site-nav");
  
  if (toggle && nav) {
    console.log('Initializing burger menu functionality...');
    
    // Remove any existing event listeners by cloning the element
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // Add event listener to the new element
    newToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      newToggle.classList.toggle("active");
      newToggle.setAttribute("aria-expanded", String(isOpen));
      console.log('Burger menu toggled:', isOpen);
    });
    
    // Mark as initialized to prevent duplicate setup
    newToggle.setAttribute('data-initialized', 'true');
    
    console.log('Burger menu functionality initialized successfully');
  } else {
    console.warn('Burger menu elements not found:', { toggle: !!toggle, nav: !!nav });
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
