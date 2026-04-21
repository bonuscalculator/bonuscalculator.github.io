// header.js — Site Header Component
(function () {
  const headerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a href="#home" class="site-logo">
          <div class="logo-icon">✦</div>
          BonusCalc
        </a>
        <nav class="site-nav" aria-label="Main navigation">
          <a href="#calculator">Calculator</a>
          <a href="#bonus-types">Bonus Types</a>
          <a href="#formulas">Formulas</a>
          <a href="#tips">Tips</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div class="nav-cta">
          <a href="#calculator" class="btn btn-primary">Calculate Now</a>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
        <a href="#calculator" onclick="closeMobileNav()">Calculator</a>
        <a href="#bonus-types" onclick="closeMobileNav()">Bonus Types</a>
        <a href="#formulas" onclick="closeMobileNav()">Formulas</a>
        <a href="#tips" onclick="closeMobileNav()">Tips</a>
        <a href="#faq" onclick="closeMobileNav()">FAQ</a>
        <a href="#calculator" class="btn btn-primary" style="margin-top:8px;justify-content:center;" onclick="closeMobileNav()">Calculate Now</a>
      </nav>
    </header>
  `;

  document.getElementById('header-root').innerHTML = headerHTML;

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  window.closeMobileNav = function () {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  };

  // Sticky shadow on scroll
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 20px rgba(45,80,22,0.14)';
    } else {
      header.style.boxShadow = '';
    }
  });
})();
