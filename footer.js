// footer.js — Site Footer Component
(function () {
  const year = new Date().getFullYear();

  const footerHTML = `
    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="site-logo">
              <div class="logo-icon">✦</div>
              BonusCalc
            </div>
            <p>The free, comprehensive bonus calculator for employees, HR professionals, and compensation analysts. Fast, accurate, and completely private.</p>
          </div>
          <div class="footer-col">
            <h4>Calculators</h4>
            <ul>
              <li><a href="#calculator">Performance Bonus</a></li>
              <li><a href="#calculator">Annual Bonus</a></li>
              <li><a href="#calculator">Commission Calculator</a></li>
              <li><a href="#calculator">Profit Sharing</a></li>
              <li><a href="#calculator">Signing Bonus</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#formulas">Bonus Formulas</a></li>
              <li><a href="#bonus-types">Bonus Types</a></li>
              <li><a href="#tips">Maximize Your Bonus</a></li>
              <li><a href="#comparison">Bonus Comparison</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Pages</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Use</a></li>
              <li><a href="/disclaimer">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© ${year} BonusCalculator.github.io — Free Bonus Calculator Tool. All calculations are for informational purposes only and do not constitute financial or tax advice.</p>
          <a href="#home">bonuscalculator.github.io</a>
        </div>
      </div>
    </footer>
  `;

  document.getElementById('footer-root').innerHTML = footerHTML;
})();
