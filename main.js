/* ============================================================
   PRINCE HOME MADE CAKES AND CHOCOLATES
   main.js — Navigation, Form Validation, Mobile Nav, Misc
   ============================================================ */

(function () {
  'use strict';

  // ─── Mobile Navigation ────────────────────────────────────
  const hamburger        = document.getElementById('hamburger');
  const mobileNav        = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavClose   = document.getElementById('mobileNavClose');

  function openMobileNav() {
    mobileNav?.classList.add('open');
    mobileNavOverlay?.classList.add('active');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav?.classList.remove('open');
    mobileNavOverlay?.classList.remove('active');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.contains('open');
    isOpen ? closeMobileNav() : openMobileNav();
  });

  mobileNavClose?.addEventListener('click', closeMobileNav);
  mobileNavOverlay?.addEventListener('click', closeMobileNav);

  // Close mobile nav on link click
  document.querySelectorAll('[data-close-mobile]').forEach(el => {
    el.addEventListener('click', closeMobileNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // ─── Contact / Order Form Validation ──────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    const fields = {
      name:     { el: document.getElementById('name'),     errEl: document.getElementById('nameError') },
      phone:    { el: document.getElementById('phone'),    errEl: document.getElementById('phoneError') },
      email:    { el: document.getElementById('email'),    errEl: document.getElementById('emailError') },
      occasion: { el: document.getElementById('occasion'), errEl: document.getElementById('occasionError') },
      delivery: { el: document.getElementById('delivery'), errEl: document.getElementById('deliveryError') },
      message:  { el: document.getElementById('message'),  errEl: document.getElementById('messageError') },
    };

    function setError(field, msg) {
      field.el?.classList.toggle('error', !!msg);
      if (field.errEl) field.errEl.textContent = msg ? '⚠ ' + msg : '';
    }

    function clearError(field) { setError(field, ''); }

    function validatePhone(val) {
      return /^[+]?[\d\s\-()]{8,15}$/.test(val.trim());
    }

    function validateEmail(val) {
      if (!val.trim()) return true; // optional
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function validateDeliveryDate(val) {
      if (!val) return false;
      const selected = new Date(val);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return selected >= tomorrow;
    }

    // Set min date for delivery (tomorrow)
    const deliveryInput = fields.delivery.el;
    if (deliveryInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      deliveryInput.min = tomorrow.toISOString().split('T')[0];
    }

    function validateAll() {
      let valid = true;

      // Name
      const nameVal = fields.name.el?.value.trim() || '';
      if (!nameVal) {
        setError(fields.name, 'Please enter your name.');
        valid = false;
      } else if (nameVal.length < 2) {
        setError(fields.name, 'Name must be at least 2 characters.');
        valid = false;
      } else { clearError(fields.name); }

      // Phone
      const phoneVal = fields.phone.el?.value.trim() || '';
      if (!phoneVal) {
        setError(fields.phone, 'Please enter your phone number.');
        valid = false;
      } else if (!validatePhone(phoneVal)) {
        setError(fields.phone, 'Please enter a valid phone number.');
        valid = false;
      } else { clearError(fields.phone); }

      // Email (optional)
      const emailVal = fields.email.el?.value.trim() || '';
      if (!validateEmail(emailVal)) {
        setError(fields.email, 'Please enter a valid email address.');
        valid = false;
      } else { clearError(fields.email); }

      // Occasion
      const occasionVal = fields.occasion.el?.value || '';
      if (!occasionVal) {
        setError(fields.occasion, 'Please select an occasion.');
        valid = false;
      } else { clearError(fields.occasion); }

      // Delivery date
      const deliveryVal = fields.delivery.el?.value || '';
      if (!deliveryVal) {
        setError(fields.delivery, 'Please select a delivery date.');
        valid = false;
      } else if (!validateDeliveryDate(deliveryVal)) {
        setError(fields.delivery, 'Please select a date at least 1 day ahead.');
        valid = false;
      } else { clearError(fields.delivery); }

      // Message
      const messageVal = fields.message.el?.value.trim() || '';
      if (!messageVal) {
        setError(fields.message, 'Please describe your order requirements.');
        valid = false;
      } else if (messageVal.length < 10) {
        setError(fields.message, 'Please provide more details (min 10 characters).');
        valid = false;
      } else { clearError(fields.message); }

      return valid;
    }

    // Live validation on blur
    Object.values(fields).forEach(field => {
      field.el?.addEventListener('blur', validateAll);
      field.el?.addEventListener('input', () => clearError(field));
    });

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateAll()) return;

      const submitBtn  = document.getElementById('submitBtn');
      const successMsg = document.getElementById('formSuccess');

      // Simulate submission
      if (submitBtn) {
        submitBtn.textContent = '⏳ Sending…';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }

      setTimeout(() => {
        // Show success
        if (successMsg) successMsg.classList.add('visible');
        if (submitBtn) {
          submitBtn.textContent = '✅ Enquiry Sent!';
          submitBtn.style.background = 'linear-gradient(135deg,#22C55E,#16A34A)';
          submitBtn.style.opacity = '1';
        }
        form.reset();
        window.launchConfetti?.(50);

        // Reset after a while
        setTimeout(() => {
          if (successMsg) successMsg.classList.remove('visible');
          if (submitBtn) {
            submitBtn.textContent = '🎂 Send My Order Enquiry';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
          }
        }, 6000);
      }, 1400);
    });
  }

  // ─── Announcement Bar Dismiss / Auto-hide ─────────────────
  // (Optional: keep it always visible. Uncomment to auto-hide on scroll)
  // const annBar = document.getElementById('announcement-bar');
  // window.addEventListener('scroll', () => {
  //   if (annBar) annBar.style.display = window.scrollY > 200 ? 'none' : '';
  // }, { passive: true });

  // ─── WhatsApp Float Tooltip ───────────────────────────────
  // Shown automatically on first visit
  const waLabel = document.querySelector('.whatsapp-label');
  if (waLabel) {
    setTimeout(() => {
      waLabel.style.opacity = '1';
      waLabel.style.transform = 'translateX(0)';
      setTimeout(() => {
        waLabel.style.opacity = '';
        waLabel.style.transform = '';
      }, 3500);
    }, 4000);
  }

  // ─── Keyboard Accessibility: Gallery items ────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const galleryItem = e.target.closest('.gallery-item');
      if (galleryItem) {
        e.preventDefault();
        galleryItem.click();
      }
    }
  });

  // ─── Lazy-load / Intersection: add reveal classes dynamically
  // Triggered when new cards are injected by products.js
  window.addEventListener('productsLoaded', () => {
    // Re-observe new elements
    const revealEls = document.querySelectorAll('.reveal:not([data-observed])');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
      el.setAttribute('data-observed', 'true');
      observer.observe(el);
    });
  });

  // ─── Smooth section entrance on first visible ─────────────
  document.querySelectorAll('section').forEach(sec => {
    sec.classList.add('page-transition-enter');
  });

  // ─── Footer: current year ─────────────────────────────────
  const yearEls = document.querySelectorAll('.footer-year');
  yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });

  // ─── Copy to Clipboard utility (used by offer codes) ──────
  window.copyToClipboard = function (text) {
    navigator.clipboard?.writeText(text).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  };

  // ─── Handle "Order Now" modal button click → close modal ──
  document.addEventListener('click', (e) => {
    const orderBtn = e.target.closest('#modalOrderBtn');
    if (orderBtn) {
      document.getElementById('modalOverlay')?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ─── Page Visibility: pause animations when tab hidden ────
  document.addEventListener('visibilitychange', () => {
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
      heroParticles.style.animationPlayState =
        document.hidden ? 'paused' : 'running';
    }
  });

  console.log(
    '%c🎂 Prince Home Made Cakes & Chocolates',
    'color:#D4A843;font-size:16px;font-weight:bold;font-family:serif;'
  );
  console.log('%cHandcrafted with love by Arpita Pradip Singh ✨', 'color:#C9813A;font-size:12px;');

})();
