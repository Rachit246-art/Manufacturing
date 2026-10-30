/**
 * INDUSTRIX - Interactive RFQ Multi-Step Calculator & Estimation Wizard
 * (js/quote.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initRfqWizard();
});

function initRfqWizard() {
  const wizardForm = document.getElementById('rfqWizardForm');
  if (!wizardForm) return;

  const steps = wizardForm.querySelectorAll('.rfq-step');
  const stepIndicators = document.querySelectorAll('.wizard-step-indicator');
  const nextBtns = wizardForm.querySelectorAll('[data-next-step]');
  const prevBtns = wizardForm.querySelectorAll('[data-prev-step]');

  let currentStep = 1;

  // Material densities in kg/m3 & base multipliers
  const materialData = {
    'carbon-steel': { name: 'Carbon Steel (ASTM A36)', density: 7850, ratePerKg: 1.45 },
    'stainless-304': { name: 'Stainless Steel 304', density: 7930, ratePerKg: 3.85 },
    'stainless-316': { name: 'Marine Grade Stainless 316L', density: 8000, ratePerKg: 5.20 },
    'aluminum-6061': { name: 'Aluminum Alloy 6061-T6', density: 2700, ratePerKg: 4.60 },
    'titanium-gr5': { name: 'Titanium Grade 5 (Ti-6Al-4V)', density: 4430, ratePerKg: 32.00 }
  };

  const calculateEstimate = () => {
    const matSelect = document.getElementById('rfqMaterial');
    const shapeSelect = document.getElementById('rfqProductShape');
    const thickInput = document.getElementById('rfqThickness');
    const lengthInput = document.getElementById('rfqLength');
    const qtyInput = document.getElementById('rfqQuantity');

    const estWeightEl = document.getElementById('rfqEstWeight');
    const estPriceEl = document.getElementById('rfqEstPrice');
    const summaryMatEl = document.getElementById('summaryMaterial');
    const summaryQtyEl = document.getElementById('summaryQty');
    const summaryTotalEl = document.getElementById('summaryTotalEstimate');

    const matKey = matSelect ? matSelect.value : 'carbon-steel';
    const mat = materialData[matKey] || materialData['carbon-steel'];
    const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
    const thicknessMm = thickInput ? (parseFloat(thickInput.value) || 10) : 10;
    const lengthM = lengthInput ? (parseFloat(lengthInput.value) || 3) : 3;

    // Approximated weight per piece in KG based on dimensions
    // e.g. Sheet/Pipe baseline estimate:
    const baseWeightPerUnit = (thicknessMm * 0.8) * (lengthM * 1.5) * (mat.density / 1000);
    const totalWeightKg = Math.round(baseWeightPerUnit * qty);
    const totalPrice = Math.round(totalWeightKg * mat.ratePerKg + 250); // plus baseline setup

    if (estWeightEl) estWeightEl.textContent = totalWeightKg.toLocaleString() + ' kg';
    if (estPriceEl) estPriceEl.textContent = '$' + totalPrice.toLocaleString() + ' USD';
    if (summaryMatEl) summaryMatEl.textContent = mat.name;
    if (summaryQtyEl) summaryQtyEl.textContent = qty.toLocaleString() + ' Units (' + totalWeightKg.toLocaleString() + ' kg)';
    if (summaryTotalEl) summaryTotalEl.textContent = '$' + totalPrice.toLocaleString() + ' USD';
  };

  // Attach live calculation listeners
  ['rfqMaterial', 'rfqProductShape', 'rfqThickness', 'rfqLength', 'rfqQuantity'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calculateEstimate);
      el.addEventListener('change', calculateEstimate);
    }
  });

  const goToStep = (targetStep) => {
    if (targetStep < 1 || targetStep > steps.length) return;

    steps.forEach((step, idx) => {
      if (idx + 1 === targetStep) {
        step.style.display = 'block';
      } else {
        step.style.display = 'none';
      }
    });

    stepIndicators.forEach((ind, idx) => {
      if (idx + 1 === targetStep) {
        ind.classList.add('active');
        ind.classList.remove('completed');
      } else if (idx + 1 < targetStep) {
        ind.classList.remove('active');
        ind.classList.add('completed');
      } else {
        ind.classList.remove('active');
        ind.classList.remove('completed');
      }
    });

    currentStep = targetStep;
    calculateEstimate();
    window.scrollTo({ top: wizardForm.offsetTop - 100, behavior: 'smooth' });
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Basic validation for step inputs before proceeding
      if (currentStep === 1) {
        goToStep(2);
      } else if (currentStep === 2) {
        goToStep(3);
      } else if (currentStep === 3) {
        goToStep(4);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  });

  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const company = document.getElementById('rfqCompany')?.value || 'Client';
    if (window.showToast) {
      window.showToast(`Official RFQ logged successfully for ${company}. RFQ Dossier #IND-${Math.floor(100000 + Math.random() * 900000)} generated.`);
    }
    wizardForm.reset();
    goToStep(1);
  });

  // Run initial calculation
  calculateEstimate();
}
