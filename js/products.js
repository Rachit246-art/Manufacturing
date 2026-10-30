/**
 * INDUSTRIX - Products Catalog & Spec Sheet Viewer
 * (js/products.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductFilter();
  initSpecSheetModal();
});

const productDatabase = {
  'pipes-seamless': {
    name: 'Precision Seamless Steel Pipes',
    grade: 'ASTM A106 / API 5L Grade B',
    outerDia: '10.3 mm – 610 mm (1/8" to 24")',
    wallThick: '1.24 mm – 59.54 mm (SCH 10 to XXS)',
    yieldStrength: '≥ 240 MPa',
    tensileStrength: '415 – 655 MPa',
    pressureRating: 'Up to 600 bar hydrostatic',
    applications: 'Petroleum transport, high-temperature steam pipelines, structural engineering',
    finish: 'Black phosphate, clear oiled, or hot-dip galvanized'
  },
  'pipes-welded': {
    name: 'Heavy-Wall Welded Tubing',
    grade: 'ASTM A53 / EN 10217-1',
    outerDia: '21.3 mm – 1219 mm (1/2" to 48")',
    wallThick: '2.0 mm – 30 mm',
    yieldStrength: '≥ 205 MPa',
    tensileStrength: '≥ 330 MPa',
    pressureRating: 'Up to 250 bar hydrostatic',
    applications: 'Low-pressure fluid transport, piling, structural frameworks',
    finish: 'Mill varnished or 3LPE anti-corrosion coating'
  },
  'sheets-heavy': {
    name: 'High-Tensile Structural Steel Plates',
    grade: 'ASTM A36 / S355JR / Hardox 450',
    outerDia: 'Thickness: 6 mm – 150 mm',
    wallThick: 'Widths: 1500 mm – 3200 mm | Lengths up to 12000 mm',
    yieldStrength: '355 – 1200 MPa',
    tensileStrength: '490 – 1450 MPa',
    pressureRating: 'Impact tested at -40°C (Charpy V-Notch ≥ 27J)',
    applications: 'Heavy machinery chassis, bridge girders, mining equipment, yellow goods',
    finish: 'Shot-blasted and shop-primed'
  },
  'sheets-stainless': {
    name: 'Sanitary Grade Stainless Steel Sheets',
    grade: 'AISI 304 / 316L / DIN 1.4404',
    outerDia: 'Thickness: 0.5 mm – 25 mm',
    wallThick: 'Widths: 1000 mm, 1250 mm, 1500 mm',
    yieldStrength: '≥ 220 MPa',
    tensileStrength: '520 – 720 MPa',
    pressureRating: 'Hermetic vacuum & corrosion proof in saline media',
    applications: 'Pharmaceutical mixing tanks, dairy equipment, architectural facades',
    finish: '2B Cold Rolled, No.4 Brush, or Mirror Finish 8K'
  },
  'coils-cold': {
    name: 'Precision Cold-Rolled Steel Coils',
    grade: 'ASTM A1008 / EN 10130 DC01',
    outerDia: 'Thickness: 0.35 mm – 3.2 mm',
    wallThick: 'Coil Width: 600 mm – 1650 mm | Coil Weight up to 25 Tons',
    yieldStrength: '140 – 280 MPa',
    tensileStrength: '270 – 410 MPa',
    pressureRating: 'Deep drawing / high elongation ≥ 38%',
    applications: 'Automotive body stampings, appliance enclosures, precision stampings',
    finish: 'Matte dry oiled or skin-passed bright'
  },
  'coils-galv': {
    name: 'Hot-Dip Galvanized & Zinc-Alloy Strips',
    grade: 'ASTM A653 / DX51D+Z (Z140 - Z275)',
    outerDia: 'Thickness: 0.40 mm – 4.0 mm',
    wallThick: 'Strip Width: 20 mm – 1500 mm slitted',
    yieldStrength: '260 – 380 MPa',
    tensileStrength: '≥ 420 MPa',
    pressureRating: '1000 hours salt spray corrosion resistance',
    applications: 'Solar PV mounting structures, HVAC ducting, cable trays, roofing profiles',
    finish: 'Zero spangle with chemical passivation'
  },
  'containers-drum': {
    name: 'UN-Certified Tight-Head Chemical Drums',
    grade: 'Cold Rolled Steel DIN EN 10130 / UN 1A1',
    outerDia: 'Capacity: 216.5 Liters (55 US Gallons)',
    wallThick: 'Sheet Gauge: 1.0 / 1.0 / 1.0 mm or 1.2 mm',
    yieldStrength: 'Drop test certified from 1.8 meters',
    tensileStrength: 'Hydrostatic pressure 300 kPa for 30 minutes',
    pressureRating: 'UN Packaging Group I, II, III Certified',
    applications: 'Hazardous chemicals, aviation fuels, lubricant oils, specialty resins',
    finish: 'Internal epoxy-phenolic lining, baked exterior enamel'
  },
  'containers-ibc': {
    name: 'Heavy-Duty Reinforced Composite IBC Tanks',
    grade: 'HDPE Inner Tank with Galvanized Tubular Steel Cage',
    outerDia: 'Capacity: 1000 Liters (275 Gallons)',
    wallThick: 'Frame: 30x30 mm welded square tubing',
    yieldStrength: 'Stacking load up to 4-high static weight',
    tensileStrength: 'FDA compliant for food contact',
    pressureRating: 'UN 31HA1/Y Approved',
    applications: 'Bulk liquid ingredients, agrochemicals, industrial cleaning fluids',
    finish: 'Integrated grounding clamp for anti-static explosion hazard'
  }
};

function initProductFilter() {
  const tabs = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.product-grid-item');
  const searchInput = document.getElementById('productSearchInput');

  if (!tabs.length || !cards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const cardTitle = card.querySelector('.product-card-title')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('.product-card-desc')?.textContent.toLowerCase() || '';

      const matchCat = (activeCategory === 'all' || cardCat === activeCategory);
      const matchSearch = (!searchTerm || cardTitle.includes(searchTerm) || cardDesc.includes(searchTerm));

      if (matchCat && matchSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const emptyNotice = document.getElementById('noProductsNotice');
    if (emptyNotice) {
      emptyNotice.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

function initSpecSheetModal() {
  const specModal = document.getElementById('specSheetModal');
  const triggerBtns = document.querySelectorAll('[data-view-spec]');

  if (!specModal) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const specKey = btn.getAttribute('data-view-spec');
      const data = productDatabase[specKey];

      if (data) {
        document.getElementById('specModalTitle').textContent = data.name;
        document.getElementById('specModalGrade').textContent = data.grade;
        document.getElementById('specModalDimensions').textContent = data.outerDia;
        document.getElementById('specModalThickness').textContent = data.wallThick;
        document.getElementById('specModalYield').textContent = data.yieldStrength;
        document.getElementById('specModalTensile').textContent = data.tensileStrength;
        document.getElementById('specModalPressure').textContent = data.pressureRating;
        document.getElementById('specModalApps').textContent = data.applications;
        document.getElementById('specModalFinish').textContent = data.finish;

        specModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const downloadBtn = document.getElementById('btnDownloadSpec');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const title = document.getElementById('specModalTitle').textContent;
      if (window.showToast) {
        window.showToast(`Downloading certified technical data sheet: ${title} (PDF)...`);
      }
    });
  }
}
