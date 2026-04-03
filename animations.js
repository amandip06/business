/* ============================================================
   PRINCE HOME MADE CAKES AND CHOCOLATES
   animations.js — Scroll Reveal, Cursor, Particles, Counters
   ============================================================ */

(function () {
  'use strict';

  // ─── Loading Screen ───────────────────────────────────────
  window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      triggerHeroCounters();
    }, 2400);
  });

  // ─── Custom Cursor ────────────────────────────────────────
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId  = null;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left  = mouseX + 'px';
      dot.style.top   = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverEls = document.querySelectorAll('a, button, .product-card, .why-card, .gallery-item, .filter-btn, .faq-question, label');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  // ─── Scroll Progress Bar ──────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const winH  = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = winH > 0 ? (window.scrollY / winH) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ─── Scroll Reveal (IntersectionObserver) ─────────────────
  function initScrollReveal() {
    const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale', '.reveal-fade'];
    const selector      = revealClasses.join(',');
    const elements      = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Stagger children if present
          const children = entry.target.querySelectorAll('[class*="stagger-"]');
          children.forEach(child => child.classList.add('revealed'));
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
  }
  initScrollReveal();

  // Call again after dynamic content loads
  window.addEventListener('productsLoaded', initScrollReveal);

  // ─── Animated Counters ────────────────────────────────────
  function animateCounter(el, target, duration) {
    let start  = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased    = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + '+';
    };
    requestAnimationFrame(step);
  }

  function triggerHeroCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      animateCounter(el, target, 1800);
    });
  }

  // Section counters on scroll-into-view
  function initCounterObserver() {
    const counterEls = document.querySelectorAll('.counter-number[data-count]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          const target = parseInt(entry.target.getAttribute('data-count'), 10);
          animateCounter(entry.target, target, 2000);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => obs.observe(el));
  }

  setTimeout(initCounterObserver, 2600);

  // ─── Hero Floating Particles ──────────────────────────────
  const particles = ['🍰', '🍫', '🎂', '🍬', '🧁', '🎁', '✨', '⭐', '🌸', '💛'];
  function createParticle() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    const el       = document.createElement('div');
    el.className   = 'hero-particle';
    el.textContent = particles[Math.floor(Math.random() * particles.length)];
    el.style.left  = Math.random() * 100 + 'vw';
    el.style.animationDuration  = (6 + Math.random() * 10) + 's';
    el.style.animationDelay     = (Math.random() * 2) + 's';
    el.style.fontSize           = (0.8 + Math.random() * 1.2) + 'rem';
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  // Spawn particles after load
  setTimeout(() => {
    const interval = setInterval(() => {
      if (document.getElementById('heroParticles')) createParticle();
    }, 800);
    // Stop after a while to save performance
    setTimeout(() => clearInterval(interval), 30000);
  }, 2600);

  // ─── Navbar Scroll Effect ─────────────────────────────────
  const navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ─── Active Nav Link on Scroll ────────────────────────────
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    let current    = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active-section', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', highlightActiveSection, { passive: true });

  // ─── Back to Top ──────────────────────────────────────────
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (!btt) return;
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ─── Product Card Tilt Effect ─────────────────────────────
  function initTilt() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const x      = (e.clientX - rect.left) / rect.width  - 0.5;
        const y      = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-10px) scale(1.02) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
  window.addEventListener('productsLoaded', initTilt);

  // ─── Confetti on Order Add ────────────────────────────────
  const confettiColors = ['#D4A843', '#E8688A', '#6B3A1F', '#4ECDC4', '#F0C96A', '#C9813A'];
  function launchConfetti(count) {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className  = 'confetti-piece';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration  = (1.5 + Math.random() * 2) + 's';
        el.style.animationDelay     = (Math.random() * 0.3) + 's';
        el.style.background         = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        el.style.width  = (6 + Math.random() * 8)  + 'px';
        el.style.height = (6 + Math.random() * 8) + 'px';
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        container.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
      }, i * 15);
    }
  }
  window.launchConfetti = launchConfetti;

  // ─── Cart Notification ────────────────────────────────────
  function showCartNotification(name) {
    const notif = document.getElementById('cartNotification');
    if (!notif) return;
    const textEl = notif.querySelector('.cart-notif-text');
    if (textEl && name) textEl.textContent = '"' + name + '" added to order!';
    notif.classList.add('show');
    launchConfetti(30);
    setTimeout(() => notif.classList.remove('show'), 3500);
  }
  window.showCartNotification = showCartNotification;

  // ─── Smooth anchor scrolling with offset ──────────────────
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id  = anchor.getAttribute('href').slice(1);
    const el  = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const offset = 80;
    const top    = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  // ─── Gallery Lightbox Simple ──────────────────────────────
  function initGalleryLightbox() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const emoji = item.querySelector('.gallery-emoji')?.textContent || item.dataset.emoji || '🎂';
        const name  = item.querySelector('.gallery-name')?.textContent || 'Creation';
        // Simple overlay lightbox
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;
          display:flex;align-items:center;justify-content:center;
          animation:fadeIn 0.3s ease;cursor:pointer;
          backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
        `;
        overlay.innerHTML = `
          <div style="text-align:center;padding:40px;max-width:500px;">
            <div style="font-size:8rem;margin-bottom:16px;filter:drop-shadow(0 10px 30px rgba(0,0,0,0.5));">${emoji}</div>
            <div style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;color:#fff;margin-bottom:8px;">${name}</div>
            <div style="font-size:0.88rem;color:rgba(255,255,255,0.6);margin-bottom:24px;">Handcrafted with love by Arpita Pradip Singh</div>
            <a href="#contact" style="display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#D4A843,#C9813A);color:#fff;padding:12px 28px;border-radius:999px;font-weight:700;text-decoration:none;font-size:0.9rem;">
              🎂 Order Similar
            </a>
          </div>`;
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay || !overlay.querySelector('a').contains(e.target)) {
            overlay.remove();
          }
        });
        document.body.appendChild(overlay);
      });
    });
  }
  window.addEventListener('galleryLoaded', initGalleryLightbox);

  // ─── Offer Code Copy ──────────────────────────────────────
  document.addEventListener('click', (e) => {
    const codeEl = e.target.closest('.offer-code');
    if (!codeEl) return;
    const code = codeEl.dataset.code;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      const orig = codeEl.textContent;
      codeEl.textContent = '✅ Copied!';
      setTimeout(() => { codeEl.innerHTML = '📋 ' + code; }, 1800);
    }).catch(() => {
      codeEl.textContent = code;
    });
  });

  // ─── Re-init tilt & cursor after DOM changes ──────────────
  const mutObs = new MutationObserver(() => initTilt());
  mutObs.observe(document.body, { childList: true, subtree: true });

})();
