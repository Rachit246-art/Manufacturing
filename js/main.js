/**
 * INDUSTRIX - Master JavaScript
 * (js/main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroSlider();
  initMobileMenu();
  initScrollAnimations();
  initStatsCounters();
  initModals();
  initSearch();
  initVideoReel();
  initBackToTop();
  initNewsletter();
});


/* ==========================================================================
   Header & Sticky Navigation
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const siteHeader = document.querySelector('.site-header');
  if (!toggleBtn || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove('open');
    toggleBtn.classList.remove('active');
    if (siteHeader) siteHeader.classList.remove('menu-open');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navMenu.classList.add('open');
    toggleBtn.classList.add('active');
    if (siteHeader) siteHeader.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking any nav-link or quote button inside drawer
  navMenu.querySelectorAll('.nav-link, [data-open-quote]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   Intersection Observer for Scroll Reveals
   ========================================================================== */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.reveal-fade-up, .reveal-scale');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Animated Numbers Counter
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll('.metric-number[data-target]');
  if (!counters.length) return;

  const runCounter = (el) => {
    const rawTarget = el.getAttribute('data-target');
    const suffix = el.getAttribute('data-suffix') || '';
    const targetVal = parseFloat(rawTarget);
    const duration = 1800; // ms
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * targetVal);

      el.textContent = currentVal + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = targetVal + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   Modals Common System (Quote, Video, Search)
   ========================================================================== */
function initModals() {
  // Open Quote Modal triggers
  const quoteBtns = document.querySelectorAll('[data-open-quote]');
  const quoteModal = document.getElementById('quoteModal');

  quoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(quoteModal);
    });
  });

  // Close modals
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        closeModal(overlay);
      }
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => closeModal(modal));
    }
  });

  // Handle Quote Calculator inside Modal
  const modalForm = document.getElementById('modalQuoteForm');
  if (modalForm) {
    const productSelect = document.getElementById('modalProductSelect');
    const qtyInput = document.getElementById('modalQtyInput');
    const estimateDisplay = document.getElementById('modalEstimateDisplay');

    const updateEstimate = () => {
      const basePrices = {
        'pipes': 120,
        'sheets': 95,
        'coils': 140,
        'containers': 210,
        'custom': 180
      };
      const type = productSelect ? productSelect.value : 'pipes';
      const qty = qtyInput ? parseInt(qtyInput.value) || 10 : 10;
      const unit = basePrices[type] || 100;
      const total = unit * qty;
      if (estimateDisplay) {
        estimateDisplay.textContent = '$' + total.toLocaleString() + ' USD';
      }
    };

    if (productSelect) productSelect.addEventListener('change', updateEstimate);
    if (qtyInput) qtyInput.addEventListener('input', updateEstimate);

    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your quote request has been transmitted. An engineer will follow up within 2 hours.');
      closeModal(quoteModal);
      modalForm.reset();
      updateEstimate();
    });
  }
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   Universal Search Modal (Ctrl/Cmd + K)
   ========================================================================== */
function initSearch() {
  const searchModal = document.getElementById('searchModal');
  const searchBtn = document.querySelector('.search-trigger-btn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const siteSearchIndex = [
    { title: 'Industrial Pipes & Tubes', cat: 'Products', url: 'products.html#pipes' },
    { title: 'Heavy Sheets & Plates', cat: 'Products', url: 'products.html#sheets' },
    { title: 'Cold-Rolled Coils & Strips', cat: 'Products', url: 'products.html#coils' },
    { title: 'Industrial Storage Containers', cat: 'Products', url: 'products.html#containers' },
    { title: 'Construction & Infrastructure Solutions', cat: 'Industries', url: 'industries.html#construction' },
    { title: 'Automotive Light-Weighting Alloys', cat: 'Industries', url: 'industries.html#automotive' },
    { title: 'Oil & Gas Pipeline Metallurgy', cat: 'Industries', url: 'industries.html#oilgas' },
    { title: 'Chemical Reactor Pressure Vessels', cat: 'Industries', url: 'industries.html#chemical' },
    { title: 'Food & Beverage Sanitary Tubing', cat: 'Industries', url: 'industries.html#food' },
    { title: 'Pharmaceutical Cleanroom Fabrication', cat: 'Industries', url: 'industries.html#pharma' },
    { title: 'Company Heritage & Leadership', cat: 'About Us', url: 'about.html' },
    { title: 'Net Zero Roadmap & Carbon Dashboard', cat: 'Sustainability', url: 'sustainability.html' },
    { title: 'Open Engineering & Manufacturing Roles', cat: 'Careers', url: 'careers.html' },
    { title: 'Request for Quote (RFQ) Calculator', cat: 'Contact', url: 'contact.html' }
  ];

  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
      openModal(searchModal);
      if (searchInput) searchInput.focus();
    });
  }

  // Keyboard shortcut Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal) {
        openModal(searchModal);
        if (searchInput) searchInput.focus();
      }
    }
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        renderResults(siteSearchIndex.slice(0, 6));
        return;
      }

      const filtered = siteSearchIndex.filter(item => 
        item.title.toLowerCase().includes(query) || item.cat.toLowerCase().includes(query)
      );
      renderResults(filtered);
    });

    // Initial render of top results
    renderResults(siteSearchIndex.slice(0, 6));
  }

  function renderResults(items) {
    if (!searchResults) return;
    if (items.length === 0) {
      searchResults.innerHTML = '<div style="padding: 1rem; color: #94a3b8; text-align: center;">No matches found for your query.</div>';
      return;
    }

    searchResults.innerHTML = items.map(item => `
      <a href="${item.url}" class="search-result-item">
        <div class="search-result-info">
          <span class="search-result-title">${item.title}</span>
          <span class="search-result-category">${item.cat}</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c67d43" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    `).join('');
  }
}

/* ==========================================================================
   Video Reel Modal (Watch Our Process)
   ========================================================================== */
function initVideoReel() {
  const watchBtns = document.querySelectorAll('[data-open-process]');
  const videoModal = document.getElementById('videoModal');
  if (!watchBtns.length || !videoModal) return;

  const reelSteps = [
    {
      num: '01',
      title: 'Raw Material Selection',
      desc: 'Certified high-grade iron ore, recycled scrap alloys, and aerospace titanium inspected via spectrometry.',
      img: 'assets/images/sheets_plates.jpg'
    },
    {
      num: '02',
      title: 'Advanced CNC Laser Cutting',
      desc: 'Sub-millimeter 30kW fiber laser cutters shaping hardened plates with zero thermal warp.',
      img: 'assets/images/laser_cutting.jpg'
    },
    {
      num: '03',
      title: 'Automated Cold Rolling',
      desc: 'Precision multi-stand rolling mills creating flawless uniform coils with micron-level tolerances.',
      img: 'assets/images/coils_strips.jpg'
    },
    {
      num: '04',
      title: 'Ultrasonic & CMM Inspection',
      desc: '100% non-destructive testing, coordinate measurement machines, and hydrostatic pressure certification.',
      img: 'assets/images/pipes_tubes.jpg'
    }
  ];

  watchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(videoModal);
    });
  });

  const reelImg = document.getElementById('reelImage');
  const reelTitle = document.getElementById('reelTitle');
  const reelDesc = document.getElementById('reelDesc');
  const stepBtns = document.querySelectorAll('.reel-step-btn');

  stepBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      stepBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = reelSteps[idx];
      if (reelImg) reelImg.src = data.img;
      if (reelTitle) reelTitle.textContent = data.num + '. ' + data.title;
      if (reelDesc) reelDesc.textContent = data.desc;
    });
  });
}

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   Newsletter Subscription
   ========================================================================== */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast('Thank you for subscribing to Industrix Technical Digest!');
      input.value = '';
    }
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c67d43" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   Hero Cinematic Background Slider
   ========================================================================== */
function initHeroSlider() {
  const heroSection = document.getElementById('hero');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const content = document.getElementById('heroSliderContent');

  if (!slides.length) return;

  let currentIndex = 0;
  let slideInterval = null;
  const slideDuration = 6000; // 6 seconds per slide

  const showSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      const progressBar = dot.querySelector('.dot-progress');
      if (i === currentIndex) {
        dot.classList.add('active');
        if (progressBar) {
          progressBar.style.transition = 'none';
          progressBar.style.width = '0%';
          void progressBar.offsetWidth; // force reflow
          progressBar.style.transition = `width ${slideDuration}ms linear`;
          progressBar.style.width = '100%';
        }
      } else {
        dot.classList.remove('active');
        if (progressBar) {
          progressBar.style.transition = 'none';
          progressBar.style.width = '0%';
        }
      }
    });


  };

  const nextSlide = () => {
    showSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    showSlide(currentIndex - 1);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const stopAutoPlay = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-slide'));
      showSlide(target);
      startAutoPlay();
    });
  });

  // Pause on hover
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && window.scrollY < 400) {
      nextSlide();
      startAutoPlay();
    } else if (e.key === 'ArrowLeft' && window.scrollY < 400) {
      prevSlide();
      startAutoPlay();
    }
  });

  // Initial display
  showSlide(0);
  startAutoPlay();
}

// Global exposure
window.showToast = showToast;

