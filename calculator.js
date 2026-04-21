// calculator.js — All Bonus Calculator Logic

/* =============================================
   UTILITIES
   ============================================= */
function fmt(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}
function pct(num) { return num.toFixed(2) + '%'; }
function val(id) { return parseFloat(document.getElementById(id).value) || 0; }

function setResults(containerId, html) {
  const el = document.getElementById(containerId);
  el.innerHTML = html;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function buildResultHTML({ icon, title, grossBonus, taxAmt, netBonus, rows, note }) {
  return `
    <div class="result-header">
      <span class="result-icon">${icon}</span>
      <h4>${title}</h4>
    </div>
    <div class="result-main">
      <div class="result-main-label">Net Bonus (After Tax)</div>
      <div class="result-main-value">${fmt(netBonus)}</div>
      <div class="result-main-sub">Gross: ${fmt(grossBonus)} — Tax Withheld: ${fmt(taxAmt)}</div>
    </div>
    <ul class="result-breakdown">
      ${rows.map(r => `
        <li class="${r.highlight ? 'highlight' : ''}">
          <span>${r.label}</span>
          <strong>${r.value}</strong>
        </li>
      `).join('')}
    </ul>
    ${note ? `<p class="result-note">⚠️ ${note}</p>` : ''}
  `;
}

/* =============================================
   1. PERFORMANCE BONUS CALCULATOR
   ============================================= */
function calculatePerformance() {
  const salary    = val('pb-salary');
  const target    = val('pb-percent') / 100;
  const rating    = parseFloat(document.getElementById('pb-rating').value);
  const companyFactor = val('pb-company') / 100;
  const taxRate   = val('pb-tax') / 100;

  if (!salary) { alert('Please enter a base salary.'); return; }

  const targetBonusAmt = salary * target;
  const grossBonus     = targetBonusAmt * rating * companyFactor;
  const taxAmt         = grossBonus * taxRate;
  const ficaAmt        = grossBonus * 0.0765; // SS + Medicare
  const netBonus       = grossBonus - taxAmt - ficaAmt;

  const ratingLabel = document.getElementById('pb-rating').options[document.getElementById('pb-rating').selectedIndex].text;

  const html = buildResultHTML({
    icon: '🎯',
    title: 'Performance Bonus Result',
    grossBonus,
    taxAmt: taxAmt + ficaAmt,
    netBonus,
    rows: [
      { label: 'Annual Base Salary',            value: fmt(salary) },
      { label: 'Target Bonus Percentage',        value: pct(target * 100) },
      { label: 'Target Bonus Amount',            value: fmt(targetBonusAmt) },
      { label: 'Performance Multiplier',         value: `${rating}× (${ratingLabel.split('–')[1]?.trim() || ''})` },
      { label: 'Company Performance Factor',     value: pct(companyFactor * 100) },
      { label: 'Gross Bonus',                    value: fmt(grossBonus), highlight: true },
      { label: 'Federal Tax Withholding',        value: `−${fmt(taxAmt)} (${pct(taxRate * 100)})` },
      { label: 'FICA (SS + Medicare)',            value: `−${fmt(ficaAmt)} (7.65%)` },
      { label: 'Estimated Net Bonus',            value: fmt(netBonus), highlight: true },
    ],
    note: 'Estimate only. Actual tax liability depends on total annual income. State taxes not included. Consult a tax professional.'
  });
  setResults('pb-results', html);
}

/* =============================================
   2. ANNUAL BONUS CALCULATOR
   ============================================= */
function calculateAnnual() {
  const salary  = val('ab-salary');
  const bonusPct = val('ab-percent') / 100;
  const months  = Math.min(val('ab-months'), 12);
  const taxRate = val('ab-tax') / 100;

  if (!salary) { alert('Please enter a base salary.'); return; }

  const fullBonus   = salary * bonusPct;
  const proratedBonus = fullBonus * (months / 12);
  const taxAmt      = proratedBonus * taxRate;
  const ficaAmt     = proratedBonus * 0.0765;
  const netBonus    = proratedBonus - taxAmt - ficaAmt;

  const html = buildResultHTML({
    icon: '📅',
    title: 'Annual Bonus Result',
    grossBonus: proratedBonus,
    taxAmt: taxAmt + ficaAmt,
    netBonus,
    rows: [
      { label: 'Annual Base Salary',           value: fmt(salary) },
      { label: 'Annual Bonus Percentage',       value: pct(bonusPct * 100) },
      { label: 'Full-Year Bonus Amount',        value: fmt(fullBonus) },
      { label: 'Months Worked',                 value: `${months} / 12` },
      { label: 'Prorated Bonus Amount',         value: fmt(proratedBonus), highlight: true },
      { label: 'Federal Tax Withholding',       value: `−${fmt(taxAmt)} (${pct(taxRate * 100)})` },
      { label: 'FICA (SS + Medicare)',           value: `−${fmt(ficaAmt)} (7.65%)` },
      { label: 'Estimated Net Bonus',           value: fmt(netBonus), highlight: true },
    ],
    note: 'Proration is based on months of service. Some employers use days or a different eligibility date.'
  });
  setResults('ab-results', html);
}

/* =============================================
   3. COMMISSION CALCULATOR
   ============================================= */
function calculateCommission() {
  const revenue = val('cm-revenue');
  const baseRate = val('cm-rate') / 100;
  const quota   = val('cm-quota');
  const accelRate = val('cm-accel') / 100;
  const taxRate = val('cm-tax') / 100;

  if (!revenue) { alert('Please enter total sales revenue.'); return; }

  const belowQuota  = Math.min(revenue, quota);
  const aboveQuota  = Math.max(0, revenue - quota);
  const baseCommission = belowQuota * baseRate;
  const accelCommission = aboveQuota * accelRate;
  const grossBonus = baseCommission + accelCommission;
  const taxAmt     = grossBonus * taxRate;
  const ficaAmt    = grossBonus * 0.0765;
  const netBonus   = grossBonus - taxAmt - ficaAmt;
  const attainment = quota > 0 ? (revenue / quota) * 100 : 100;

  const html = buildResultHTML({
    icon: '💼',
    title: 'Commission Result',
    grossBonus,
    taxAmt: taxAmt + ficaAmt,
    netBonus,
    rows: [
      { label: 'Total Sales Revenue',         value: fmt(revenue) },
      { label: 'Quota Attainment',             value: pct(attainment) },
      { label: `Sales at Base Rate (${pct(baseRate * 100)})`, value: fmt(belowQuota) },
      { label: 'Base Commission',              value: fmt(baseCommission), highlight: true },
      { label: `Over-Quota Sales (${pct(accelRate * 100)})`, value: fmt(aboveQuota) },
      { label: 'Accelerator Commission',       value: fmt(accelCommission), highlight: accelCommission > 0 },
      { label: 'Gross Commission',             value: fmt(grossBonus), highlight: true },
      { label: 'Federal Tax Withholding',      value: `−${fmt(taxAmt)} (${pct(taxRate * 100)})` },
      { label: 'FICA (SS + Medicare)',          value: `−${fmt(ficaAmt)} (7.65%)` },
      { label: 'Estimated Net Commission',     value: fmt(netBonus), highlight: true },
    ],
    note: 'Accelerator commission applies only to sales above your quota threshold.'
  });
  setResults('cm-results', html);
}

/* =============================================
   4. PROFIT SHARING CALCULATOR
   ============================================= */
function calculateProfitShare() {
  const profit  = val('ps-profit');
  const poolPct = val('ps-pool') / 100;
  const mySalary = val('ps-salary');
  const payroll = val('ps-payroll');
  const taxRate = val('ps-tax') / 100;

  if (!profit || !payroll) { alert('Please enter company profit and total payroll.'); return; }
  if (mySalary > payroll) { alert('Your salary cannot exceed total company payroll.'); return; }

  const totalPool   = profit * poolPct;
  const myShare     = payroll > 0 ? (mySalary / payroll) * totalPool : 0;
  const taxAmt      = myShare * taxRate;
  const ficaAmt     = myShare * 0.0765;
  const netBonus    = myShare - taxAmt - ficaAmt;
  const sharePercent = payroll > 0 ? (mySalary / payroll) * 100 : 0;
  const bonusAsSalaryPct = mySalary > 0 ? (myShare / mySalary) * 100 : 0;

  const html = buildResultHTML({
    icon: '🏢',
    title: 'Profit Sharing Result',
    grossBonus: myShare,
    taxAmt: taxAmt + ficaAmt,
    netBonus,
    rows: [
      { label: 'Company Net Profit',              value: fmt(profit) },
      { label: 'Profit Sharing Pool',             value: `${fmt(totalPool)} (${pct(poolPct * 100)})` },
      { label: 'Your Salary',                     value: fmt(mySalary) },
      { label: 'Total Company Payroll',           value: fmt(payroll) },
      { label: 'Your Payroll Share',              value: pct(sharePercent) },
      { label: 'Your Gross Profit Share',         value: fmt(myShare), highlight: true },
      { label: 'As % of Your Salary',             value: pct(bonusAsSalaryPct) },
      { label: 'Federal Tax Withholding',         value: `−${fmt(taxAmt)} (${pct(taxRate * 100)})` },
      { label: 'FICA (SS + Medicare)',             value: `−${fmt(ficaAmt)} (7.65%)` },
      { label: 'Estimated Net Profit Share',      value: fmt(netBonus), highlight: true },
    ],
    note: 'This uses the pro-rata salary allocation method. Some companies use equal distribution or other formulas.'
  });
  setResults('ps-results', html);
}

/* =============================================
   5. SIGNING BONUS CALCULATOR
   ============================================= */
function calculateSigning() {
  const grossBonus = val('sb-amount');
  const clawbackMonths = val('sb-clawback');
  const workedMonths   = Math.min(val('sb-worked'), clawbackMonths);
  const federalTax = val('sb-federal') / 100;
  const stateTax   = val('sb-state') / 100;

  if (!grossBonus) { alert('Please enter a signing bonus amount.'); return; }

  const ficaRate   = 0.0765;
  const totalTaxRate = federalTax + stateTax + ficaRate;
  const taxAmt    = grossBonus * totalTaxRate;
  const netBonus  = grossBonus - taxAmt;

  // Clawback
  const vestedFraction  = clawbackMonths > 0 ? workedMonths / clawbackMonths : 1;
  const unvestedFraction = 1 - vestedFraction;
  const clawbackGross   = grossBonus * unvestedFraction;
  const clawbackNet     = netBonus * unvestedFraction; // you repay gross but taxes are complex

  const html = buildResultHTML({
    icon: '✍️',
    title: 'Signing Bonus Result',
    grossBonus,
    taxAmt,
    netBonus,
    rows: [
      { label: 'Gross Signing Bonus',             value: fmt(grossBonus) },
      { label: 'Federal Tax Withholding',         value: `−${fmt(grossBonus * federalTax)} (${pct(federalTax * 100)})` },
      { label: 'State Tax Withholding',           value: `−${fmt(grossBonus * stateTax)} (${pct(stateTax * 100)})` },
      { label: 'FICA (SS + Medicare)',             value: `−${fmt(grossBonus * ficaRate)} (7.65%)` },
      { label: 'Total Taxes Withheld',            value: fmt(taxAmt), highlight: true },
      { label: 'Net Signing Bonus',               value: fmt(netBonus), highlight: true },
      { label: '──── Clawback Info ────',         value: '' },
      { label: 'Clawback Period',                 value: `${clawbackMonths} months` },
      { label: 'Months Worked',                   value: `${workedMonths} months` },
      { label: 'Vested Fraction',                 value: pct(vestedFraction * 100) },
      { label: 'Potential Clawback (Gross)',       value: fmt(clawbackGross), highlight: clawbackGross > 0 },
    ],
    note: 'Clawback repayment is typically the gross bonus amount. You may be able to recover taxes paid via Form 1341. Consult an employment attorney or tax advisor.'
  });
  setResults('sb-results', html);
}

/* =============================================
   TAB SWITCHING
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('tab-' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* =============================================
     FAQ ACCORDION
     ============================================= */
  window.toggleFaq = function(btn) {
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-question.open').forEach(q => {
      q.classList.remove('open');
      q.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  };

  /* =============================================
     SCROLL ANIMATIONS
     ============================================= */
  const fadeEls = document.querySelectorAll(
    '.step-card, .type-card, .formula-block, .tip-item, .faq-item, .about-card'
  );
  fadeEls.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));

  /* =============================================
     ACTIVE NAV LINK HIGHLIGHTING
     ============================================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.style.color = '');
        const activeLink = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.style.color = 'var(--forest)';
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));
});
