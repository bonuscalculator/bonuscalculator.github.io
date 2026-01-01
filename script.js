// ===================================
// BRUTALIST CALCULATOR - JAVASCRIPT
// ===================================

// Mobile Menu Toggle
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("navMenu")

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close menu when link clicked
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  })
})

// Advanced Options Toggle
const advancedToggle = document.getElementById("advancedToggle")
const advancedOptions = document.getElementById("advancedOptions")
const otInputGroup = document.getElementById("otInputGroup")
const includeOT = document.getElementById("includeOT")

advancedToggle.addEventListener("change", () => {
  if (advancedToggle.checked) {
    advancedOptions.classList.add("active")
  } else {
    advancedOptions.classList.remove("active")
  }
})

includeOT.addEventListener("change", () => {
  otInputGroup.style.display = includeOT.checked ? "block" : "none"
})

// Show/Hide Breakdown Table
const showBreakdown = document.getElementById("showBreakdown")
const breakdownTable = document.getElementById("breakdownTable")

showBreakdown.addEventListener("change", () => {
  breakdownTable.style.display = showBreakdown.checked ? "block" : "none"
})

// Calculate Bonus Function
function calculateBonus() {
  const baseSalary = Number.parseFloat(document.getElementById("baseSalary").value) || 0
  const bonusPercentage = Number.parseFloat(document.getElementById("bonusPercentage").value) || 0
  const taxRate = Number.parseFloat(document.getElementById("taxRate").value) || 0
  const deductions = Number.parseFloat(document.getElementById("deductions").value) || 0
  const bonusFrequency = document.getElementById("bonusFrequency").value || "annual"
  const includeOTChecked = document.getElementById("includeOT").checked
  const otHours = Number.parseFloat(document.getElementById("otHours").value) || 0

  // Calculate base bonus
  let grossBonus = (baseSalary * bonusPercentage) / 100

  // Add overtime if enabled
  if (includeOTChecked && otHours > 0) {
    const hourlyRate = baseSalary / 2080 // Standard work year
    const overtimePay = hourlyRate * otHours * 1.5 // Time and a half
    grossBonus += overtimePay
  }

  // Calculate tax
  const taxAmount = (grossBonus * taxRate) / 100

  // Calculate net bonus
  const netBonus = grossBonus - taxAmount - deductions

  // Update results display
  updateResults(grossBonus, taxAmount, deductions, netBonus, bonusFrequency)

  // Show/hide advanced results
  const hasAdvancedOptions = advancedToggle.checked
  document.getElementById("taxResultGroup").style.display = hasAdvancedOptions ? "flex" : "none"
  document.getElementById("deductionsResultGroup").style.display =
    hasAdvancedOptions && deductions > 0 ? "flex" : "none"
  document.getElementById("divider2").style.display = hasAdvancedOptions ? "block" : "none"

  // Show comparison info
  document.getElementById("comparisonInfo").style.display = "block"

  // Animate result values
  animateValue("resultBaseBonus", grossBonus)
  animateValue("resultTaxAmount", taxAmount)
  animateValue("resultDeductions", deductions)
  animateValue("resultNetBonus", netBonus)
  animateValue("monthlyBonus", netBonus / 12)

  // Update breakdown table
  if (showBreakdown.checked) {
    updateBreakdownTable(grossBonus, taxAmount, deductions, netBonus)
  }
}

function updateResults(grossBonus, taxAmount, deductions, netBonus, frequency) {
  document.getElementById("resultBaseBonus").textContent = formatCurrency(grossBonus)
  document.getElementById("resultTaxAmount").textContent = `-${formatCurrency(taxAmount)}`
  document.getElementById("resultDeductions").textContent = `-${formatCurrency(deductions)}`
  document.getElementById("resultNetBonus").textContent = formatCurrency(netBonus)

  // Calculate monthly for comparison
  const monthlyAmount = netBonus / 12
  document.getElementById("monthlyBonus").textContent = formatCurrency(monthlyAmount)
}

function updateBreakdownTable(grossBonus, taxAmount, deductions, netBonus) {
  document.getElementById("breakdownGross").textContent = formatCurrency(grossBonus)
  document.getElementById("breakdownFederalTax").textContent = `-${formatCurrency(taxAmount)}`
  document.getElementById("breakdownDeductions").textContent = `-${formatCurrency(deductions)}`
  document.getElementById("breakdownNet").textContent = formatCurrency(netBonus)
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function animateValue(elementId, finalValue) {
  const element = document.getElementById(elementId)
  const startValue = 0
  const duration = 500
  const startTime = Date.now()

  function update() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const currentValue = startValue + (finalValue - startValue) * easeOutQuad(progress)

    element.textContent = formatCurrency(currentValue)

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  update()
}

function easeOutQuad(t) {
  return t * (2 - t)
}

// Real-time calculation on input change
document.getElementById("baseSalary").addEventListener("input", calculateBonus)
document.getElementById("bonusPercentage").addEventListener("input", calculateBonus)
document.getElementById("taxRate").addEventListener("input", calculateBonus)
document.getElementById("deductions").addEventListener("input", calculateBonus)
document.getElementById("bonusFrequency").addEventListener("change", calculateBonus)
document.getElementById("otHours").addEventListener("input", calculateBonus)

// Counter Animation for Statistics
function animateCounter() {
  const counters = document.querySelectorAll("[data-target]")
  counters.forEach((counter) => {
    const target = Number.parseFloat(counter.getAttribute("data-target"))
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const updateCounter = () => {
      current += increment
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString()
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target.toLocaleString()
      }
    }

    updateCounter()
  })
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("stat-card")) {
        animateCounter()
      }
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

document.querySelectorAll(".stat-card").forEach((card) => observer.observe(card))

// Contact Form Handler
function handleContactSubmit(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)

  // Simulate form submission
  const submitBtn = form.querySelector(".submit-btn")
  const originalText = submitBtn.textContent
  submitBtn.textContent = "MESSAGE SENT ✓"
  submitBtn.disabled = true

  setTimeout(() => {
    form.reset()
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 2000)
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Set default calculation
  calculateBonus()
})

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href !== "#" && document.querySelector(href)) {
      e.preventDefault()
      document.querySelector(href).scrollIntoView({ behavior: "smooth" })
    }
  })
})

// Performance optimization - Lazy load images if any
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.add("loaded")
        observer.unobserve(img)
      }
    })
  })
}

console.log("Bonus Calculator v1.0 loaded")
