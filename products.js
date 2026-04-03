/* ============================================================
   PRINCE HOME MADE CAKES AND CHOCOLATES
   products.js — Load & Render Products, Gallery, FAQ, etc.
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     STATE
  ────────────────────────────────────────────────────────── */
  let allData      = null;
  let activeFilter = 'all';
  let currentSlide = 0;

  /* ──────────────────────────────────────────────────────────
     FETCH DATA FROM JSON
  ────────────────────────────────────────────────────────── */
  async function loadData() {
    try {
      const res = await fetch('data/products.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      allData = await res.json();
      renderAll();
    } catch (err) {
      console.error('[Prince Cakes] Could not load products.json:', err);
      renderFallback();
    }
  }

  /* ──────────────────────────────────────────────────────────
     UTILITY HELPERS
  ────────────────────────────────────────────────────────── */

  function discountPct(price, original) {
    if (!original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  }

  function tagLabel(tag) {
    return tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function dispatch(name) {
    window.dispatchEvent(new Event(name));
  }

  /* ──────────────────────────────────────────────────────────
     PRODUCT CARD HTML
  ────────────────────────────────────────────────────────── */
  function productCardHTML(p) {
    const discount = discountPct(p.price, p.originalPrice);
    const catName  = allData
      ? (allData.categories.find(c => c.id === p.category)?.name || p.category)
      : p.category;

    return `
      <div class="product-card reveal" data-id="${p.id}" data-category="${p.category}" role="article" aria-label="${p.name}">
        <div class="product-img">
          <span style="position:relative;z-index:1;">${p.emoji || '🎂'}</span>
          ${p.badge ? `<div class="product-badge" style="background:${p.badgeColor || '#D4A843'}">${p.badge}</div>` : ''}
          <div class="product-quick-view">
            <button class="quick-view-btn" data-id="${p.id}" aria-label="Quick view ${p.name}">
              👁 Quick View
            </button>
          </div>
        </div>
        <div class="product-body">
          <div class="product-category-tag">${catName}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.description.length > 90 ? p.description.slice(0, 90) + '…' : p.description}</div>
          <div class="product-meta">
            <div class="product-rating">
              <span class="rating-stars">★★★★★</span>
              <span>${p.rating}</span>
              <span class="product-reviews">(${p.reviews})</span>
            </div>
            <div class="product-pricing">
              <span class="product-price">₹${p.price}</span>
              ${p.originalPrice ? `<span class="product-original-price">₹${p.originalPrice}</span>` : ''}
              ${discount        ? `<span class="product-discount">${discount}% off</span>`            : ''}
            </div>
          </div>
          <div class="product-actions">
            <button class="btn-add-order" data-id="${p.id}" data-name="${p.name}" aria-label="Add ${p.name} to order">
              🎂 Add to Order
            </button>
            <button class="btn-wishlist" data-id="${p.id}" aria-label="Save ${p.name} to wishlist" title="Save for later">
              🤍
            </button>
          </div>
        </div>
      </div>`;
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: CATEGORY FILTER BUTTONS
  ────────────────────────────────────────────────────────── */
  function renderFilter() {
    const filterEl = document.getElementById('productsFilter');
    if (!filterEl || !allData) return;

    const buttons = [
      { id: 'all', name: 'All Products', icon: '✨' },
      ...allData.categories.map(c => ({ id: c.id, name: c.name, icon: c.icon }))
    ];

    filterEl.innerHTML = buttons.map(b => `
      <button class="filter-btn ${b.id === activeFilter ? 'active' : ''}" data-filter="${b.id}">
        ${b.icon} ${b.name}
      </button>`).join('');
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: MAIN PRODUCTS GRID
  ────────────────────────────────────────────────────────── */
  function renderProductsGrid(categoryId) {
    const grid = document.getElementById('productsGrid');
    if (!grid || !allData) return;

    const filtered = (categoryId === 'all')
      ? allData.products
      : allData.products.filter(p => p.category === categoryId);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
          <div style="font-size:3rem;margin-bottom:12px;">🔍</div>
          <div style="font-size:1rem;font-weight:600;">No products in this category yet.</div>
          <div style="font-size:0.88rem;margin-top:6px;">
            <a href="#contact" style="color:var(--caramel);">Contact us</a> for a custom order!
          </div>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(productCardHTML).join('');
    dispatch('productsLoaded');
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: BESTSELLERS GRID
  ────────────────────────────────────────────────────────── */
  function renderBestsellers() {
    const grid = document.getElementById('bestsellersGrid');
    if (!grid || !allData) return;

    let bestsellers = allData.products.filter(p =>
      p.badge === 'Best Seller'   ||
      p.badge === 'Fan Favourite' ||
      p.tags?.includes('bestseller')
    ).slice(0, 4);

    // Fallback: top 4 by rating
    if (bestsellers.length === 0) {
      bestsellers = [...allData.products].sort((a, b) => b.rating - a.rating).slice(0, 4);
    }

    grid.innerHTML = bestsellers.map(productCardHTML).join('');
    dispatch('productsLoaded');
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: TODAY'S SPECIAL
  ────────────────────────────────────────────────────────── */
  function renderSpecials() {
    const grid = document.getElementById('specialGrid');
    if (!grid || !allData) return;

    let specials = allData.products.filter(p =>
      p.badge === 'Best Seller'   ||
      p.badge === 'Fan Favourite' ||
      p.badge === 'Festival Hit'
    ).slice(0, 3);

    if (specials.length < 3) {
      specials = [...allData.products].sort((a, b) => b.rating - a.rating).slice(0, 3);
    }

    grid.innerHTML = specials.map(p => {
      const discount = discountPct(p.price, p.originalPrice);
      return `
        <div class="special-card reveal">
          <span class="special-emoji">${p.emoji}</span>
          <div class="special-name">${p.name}</div>
          <div class="special-desc">${p.description.length > 100 ? p.description.slice(0, 100) + '…' : p.description}</div>
          <div class="special-price">
            <span class="special-current-price">₹${p.price}</span>
            ${p.originalPrice ? `<span class="special-original">₹${p.originalPrice}</span>` : ''}
            ${discount        ? `<span class="special-off">${discount}% OFF</span>`          : ''}
          </div>
          <div class="special-timer">
            <span class="special-timer-emoji">⏰</span>
            <span>Available Today Only — Order Now!</span>
          </div>
          <a href="#contact" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:4px;">
            🎂 Order Today's Special
          </a>
        </div>`;
    }).join('');
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: OFFERS / DEALS
  ────────────────────────────────────────────────────────── */
  function renderOffers() {
    const grid = document.getElementById('offersGrid');
    if (!grid || !allData) return;

    grid.innerHTML = allData.offers.map(o => `
      <div class="offer-card shimmer reveal"
           style="background:linear-gradient(135deg,${o.color}ee 0%,${o.color}aa 100%);">
        <div class="offer-discount">${o.discount}</div>
        <span class="offer-emoji">${o.emoji}</span>
        <div class="offer-title">${o.title}</div>
        <div class="offer-desc">${o.description}</div>
        <div class="offer-code"
             data-code="${o.code}"
             title="Click to copy promo code"
             role="button"
             aria-label="Copy code ${o.code}">
          📋 ${o.code}
        </div>
        <div class="offer-validity">⏳ ${o.validTill}</div>
      </div>`).join('');
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: GALLERY GRID
  ────────────────────────────────────────────────────────── */
  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const items = [
      { emoji: '🎂', name: 'Custom Birthday Masterpiece', tag: 'Birthday Cakes'      },
      { emoji: '🍫', name: 'Belgian Dark Truffles',        tag: 'Homemade Chocolates' },
      { emoji: '🍰', name: 'Vanilla Cloud Slice',          tag: 'Classic Cakes'       },
      { emoji: '🎁', name: 'Luxury Chocolate Gift Box',    tag: 'Chocolate Boxes'     },
      { emoji: '💍', name: 'Rose Gold Anniversary Cake',   tag: 'Anniversary Cakes'   },
      { emoji: '🌈', name: 'Rainbow Funfetti Blast',       tag: 'Birthday Cakes'      },
      { emoji: '🪔', name: 'Diwali Mithai Fusion Box',     tag: 'Festival Specials'   },
      { emoji: '🎭', name: '3D Sculpted Designer Cake',    tag: 'Custom Cakes'        },
      { emoji: '🧁', name: 'Cupcake Bouquet Tower',        tag: 'Special Orders'      },
      { emoji: '✨', name: 'Gold Drip Celebration Cake',   tag: 'Premium Cakes'       },
    ];

    grid.innerHTML = items.map(item => `
      <div class="gallery-item"
           data-emoji="${item.emoji}"
           role="button"
           tabindex="0"
           aria-label="View ${item.name}">
        <span class="gallery-emoji" style="position:relative;z-index:1;">${item.emoji}</span>
        <div class="gallery-overlay">
          <div class="gallery-name">${item.name}</div>
          <div class="gallery-tag">${item.tag}</div>
        </div>
        <div class="gallery-zoom-icon" aria-hidden="true">🔍</div>
      </div>`).join('');

    dispatch('galleryLoaded');
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: TESTIMONIALS CARDS + DOTS
  ────────────────────────────────────────────────────────── */
  function renderTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const dots  = document.getElementById('testDots');
    if (!track || !allData) return;

    track.innerHTML = allData.testimonials.map(t => `
      <div class="testimonial-card reveal">
        <div class="testimonial-quote">"</div>
        <div class="testimonial-stars">★★★★★</div>
        <div class="testimonial-text">${t.text}</div>
        <div class="testimonial-author">
          <div class="testimonial-avatar" style="background:${t.avatarColor};">${t.avatar}</div>
          <div>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-meta">${t.location} · ${t.date}</div>
            <div class="testimonial-occasion">${t.occasion}</div>
          </div>
        </div>
      </div>`).join('');

    if (dots) {
      const cpv      = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      const numDots  = Math.ceil(allData.testimonials.length / cpv);
      dots.innerHTML = Array.from({ length: numDots }, (_, i) =>
        `<div class="slider-dot ${i === 0 ? 'active' : ''}"
              data-index="${i}"
              role="button"
              aria-label="Go to review page ${i + 1}"></div>`
      ).join('');
    }
  }

  /* ──────────────────────────────────────────────────────────
     TESTIMONIALS SLIDER LOGIC
  ────────────────────────────────────────────────────────── */
  function initTestimonialsSlider() {
    const track  = document.getElementById('testimonialsTrack');
    const prev   = document.getElementById('testPrev');
    const next   = document.getElementById('testNext');
    const dotsEl = document.getElementById('testDots');
    if (!track) return;

    const getSlideWidth = () => {
      const card = track.querySelector('.testimonial-card');
      if (!card) return 0;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      return card.offsetWidth + gap;
    };

    const cardsPerView = () =>
      window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

    const maxSlide = () =>
      Math.max(0, track.querySelectorAll('.testimonial-card').length - cardsPerView());

    function goTo(n) {
      const max = maxSlide();
      currentSlide = Math.max(0, Math.min(n, max));
      track.style.transform = `translateX(-${currentSlide * getSlideWidth()}px)`;

      if (dotsEl) {
        const cpv = cardsPerView();
        dotsEl.querySelectorAll('.slider-dot').forEach((d, i) => {
          d.classList.toggle('active', i === Math.floor(currentSlide / cpv));
        });
      }
    }

    if (prev) prev.addEventListener('click', () => goTo(currentSlide - 1));
    if (next) next.addEventListener('click', () => goTo(currentSlide + 1));

    if (dotsEl) {
      dotsEl.addEventListener('click', (e) => {
        const dot = e.target.closest('.slider-dot');
        if (dot) goTo(parseInt(dot.dataset.index, 10) * cardsPerView());
      });
    }

    let autoTimer = setInterval(() => {
      goTo(currentSlide >= maxSlide() ? 0 : currentSlide + 1);
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => {
        goTo(currentSlide >= maxSlide() ? 0 : currentSlide + 1);
      }, 5000);
    });

    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    }, { passive: true });

    window.addEventListener('resize', () => goTo(currentSlide), { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: WHY CHOOSE US
  ────────────────────────────────────────────────────────── */
  function renderWhyUs() {
    const grid = document.getElementById('whyGrid');
    if (!grid) return;

    const items = [
      { icon: '🌿', title: '100% Fresh Ingredients',    desc: 'We source only the freshest, finest quality ingredients locally. No preservatives, no artificial colours — ever.' },
      { icon: '👩‍🍳', title: 'Made with Personal Care',   desc: 'Every item is handcrafted by Arpita ji with deep attention to detail and a genuine passion for perfection.' },
      { icon: '✏️', title: 'Fully Custom Designs',       desc: 'Your vision, our canvas. Any theme, size, colour, message, or occasion — we bring your exact ideas to life.' },
      { icon: '💰', title: 'Honest, Affordable Pricing', desc: 'Premium quality at fair prices. We believe everyone deserves a beautiful cake without breaking the bank.' },
      { icon: '😋', title: 'Rich, Authentic Taste',      desc: 'Time-tested recipes and premium ingredients deliver flavours that keep our customers coming back for more.' },
      { icon: '⏰', title: 'On-Time, Every Time',        desc: 'We respect your special moments. Orders are always delivered or ready for pick-up exactly when promised.' },
      { icon: '🧼', title: 'Hygienic Preparation',       desc: 'Prepared in a clean, sanitised home kitchen following strict food safety guidelines. Your health is our priority.' },
      { icon: '🥚', title: 'Eggless Options Available',  desc: 'All products are available in delicious eggless variants — perfect for vegetarians and dietary preferences.' },
    ];

    grid.innerHTML = items.map((item, i) => `
      <div class="why-card reveal stagger-${(i % 4) + 1}">
        <span class="why-icon">${item.icon}</span>
        <div class="why-title">${item.title}</div>
        <div class="why-desc">${item.desc}</div>
      </div>`).join('');
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: ORDER PROCESS STEPS
  ────────────────────────────────────────────────────────── */
  function renderOrderSteps() {
    const stepsEl = document.getElementById('orderSteps');
    if (!stepsEl) return;

    const steps = [
      { num: '01', emoji: '🎂', title: 'Choose Your Item',     desc: 'Browse our menu and pick your favourite cake or chocolate. Tell us the occasion, flavour, and preferred size.' },
      { num: '02', emoji: '✏️', title: 'Customise Your Order', desc: 'Share your design ideas, personal message, dietary preferences, and any special requirements with us.' },
      { num: '03', emoji: '💬', title: 'Confirm & Pay',        desc: 'We confirm all details via WhatsApp or phone. Simple, secure payment via UPI, bank transfer, or cash.' },
      { num: '04', emoji: '🚀', title: 'Delivery or Pick-up',  desc: 'Your freshly made order arrives at your door or is ready for pick-up at the agreed date and time. Enjoy!' },
    ];

    stepsEl.innerHTML = steps.map((s, i) => `
      <div class="order-step reveal stagger-${i + 1}">
        <div class="order-step-num">${s.num}</div>
        <span class="order-step-emoji">${s.emoji}</span>
        <div class="order-step-title">${s.title}</div>
        <div class="order-step-desc">${s.desc}</div>
      </div>`).join('');
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: ANIMATED COUNTERS
  ────────────────────────────────────────────────────────── */
  function renderCounters() {
    const grid = document.getElementById('countersGrid');
    if (!grid) return;

    const items = [
      { emoji: '😊', num: 500,  suffix: '+',  label: 'Happy Customers'  },
      { emoji: '🎂', num: 1200, suffix: '+',  label: 'Cakes Delivered'  },
      { emoji: '🍫', num: 3000, suffix: '+',  label: 'Chocolates Made'  },
      { emoji: '⭐', num: 5,    suffix: '.0', label: 'Average Rating'   },
    ];

    grid.innerHTML = items.map(item => `
      <div class="counter-item reveal">
        <span class="counter-emoji">${item.emoji}</span>
        <div class="counter-number" data-count="${item.num}">${item.num}${item.suffix}</div>
        <div class="counter-label">${item.label}</div>
      </div>`).join('');
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: FAQ ACCORDION
  ────────────────────────────────────────────────────────── */
  function renderFAQ() {
    const listEl = document.getElementById('faqList');
    if (!listEl || !allData) return;

    listEl.innerHTML = allData.faqs.map((faq, i) => `
      <div class="faq-item" id="faq-item-${i}">
        <button class="faq-question"
                aria-expanded="false"
                aria-controls="faq-ans-${i}">
          <span>${faq.question}</span>
          <div class="faq-icon" aria-hidden="true">+</div>
        </button>
        <div class="faq-answer" id="faq-ans-${i}" role="region">
          <div class="faq-answer-inner">${faq.answer}</div>
        </div>
      </div>`).join('');

    initFAQAccordion();
  }

  /* ──────────────────────────────────────────────────────────
     FAQ ACCORDION INTERACTION
  ────────────────────────────────────────────────────────── */
  function initFAQAccordion() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all open items
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        // Open the clicked item if it was closed
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     PRODUCT QUICK-VIEW MODAL
  ────────────────────────────────────────────────────────── */
  function openModal(id) {
    if (!allData) return;
    const product = allData.products.find(p => p.id === id);
    if (!product) return;

    const overlay = document.getElementById('modalOverlay');
    const imgWrap = document.getElementById('modalImg');
    const badge   = document.getElementById('modalBadge');
    const title   = document.getElementById('modalTitle');
    const desc    = document.getElementById('modalDesc');
    const details = document.getElementById('modalDetails');
    const price   = document.getElementById('modalPrice');
    const orig    = document.getElementById('modalOriginal');
    const stars   = document.getElementById('modalStars');
    const reviews = document.getElementById('modalReviews');
    const tags    = document.getElementById('modalTags');
    if (!overlay || !imgWrap) return;

    // Rebuild image area
    imgWrap.innerHTML = '';

    const closeBtn = document.createElement('button');
    closeBtn.className   = 'modal-close';
    closeBtn.id          = 'modalClose';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Close product preview');
    closeBtn.addEventListener('click', closeModal);

    const emojiEl = document.createElement('span');
    emojiEl.textContent   = product.emoji || '🎂';
    emojiEl.style.cssText = 'font-size:7rem;position:relative;z-index:1;';

    imgWrap.appendChild(closeBtn);
    imgWrap.appendChild(emojiEl);

    // Populate all fields
    badge.textContent      = product.badge || '';
    badge.style.background = product.badgeColor || '#D4A843';
    title.textContent      = product.name;
    desc.textContent       = product.description;
    price.textContent      = '₹' + product.price;
    orig.textContent       = product.originalPrice ? '₹' + product.originalPrice : '';
    stars.textContent      = '★★★★★';
    reviews.textContent    = `(${product.reviews} reviews)`;

    // Detail chips
    const detailItems = [];
    if (product.weight) detailItems.push({ label: 'Weight', value: product.weight });
    if (product.serves) detailItems.push({ label: 'Serves', value: product.serves });
    if (product.pieces) detailItems.push({ label: 'Pieces', value: product.pieces });
    details.innerHTML = detailItems.map(d =>
      `<div class="modal-detail">
         <span class="modal-detail-label">${d.label}</span>
         <span class="modal-detail-value">${d.value}</span>
       </div>`
    ).join('');

    // Tag badges
    tags.innerHTML = (product.tags || []).map(t =>
      `<span class="modal-tag">✓ ${tagLabel(t)}</span>`
    ).join('');

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => title.focus(), 50);
  }

  function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Close on backdrop click or Escape key
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'modalOverlay') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ──────────────────────────────────────────────────────────
     EVENT DELEGATION — Product interactions
  ────────────────────────────────────────────────────────── */
  document.addEventListener('click', (e) => {

    // Quick View button
    const qvBtn = e.target.closest('.quick-view-btn');
    if (qvBtn) {
      e.stopPropagation();
      openModal(parseInt(qvBtn.dataset.id, 10));
      return;
    }

    // Add to Order button
    const orderBtn = e.target.closest('.btn-add-order');
    if (orderBtn) {
      e.stopPropagation();
      const name = orderBtn.dataset.name || 'Item';
      window.showCartNotification?.(name);
      orderBtn.textContent      = '✅ Added!';
      orderBtn.style.background = 'linear-gradient(135deg,#22C55E,#16A34A)';
      setTimeout(() => {
        orderBtn.textContent      = '🎂 Add to Order';
        orderBtn.style.background = '';
      }, 2500);
      return;
    }

    // Wishlist toggle
    const wishBtn = e.target.closest('.btn-wishlist');
    if (wishBtn) {
      e.stopPropagation();
      const isNowLiked    = wishBtn.classList.toggle('liked');
      wishBtn.textContent = isNowLiked ? '❤️' : '🤍';
      return;
    }

    // Whole card click → open modal
    const card = e.target.closest('.product-card');
    if (
      card &&
      !e.target.closest('.product-actions') &&
      !e.target.closest('.quick-view-btn')
    ) {
      openModal(parseInt(card.dataset.id, 10));
    }

  });

  /* ──────────────────────────────────────────────────────────
     EVENT DELEGATION — Category filter
  ────────────────────────────────────────────────────────── */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProductsGrid(activeFilter);
  });

  /* ──────────────────────────────────────────────────────────
     EVENT DELEGATION — Offer code copy
  ────────────────────────────────────────────────────────── */
  document.addEventListener('click', (e) => {
    const codeEl = e.target.closest('.offer-code');
    if (!codeEl) return;
    const code = codeEl.dataset.code;
    if (!code) return;

    const showCopied = () => {
      const saved = codeEl.innerHTML;
      codeEl.innerHTML = '✅ Copied!';
      setTimeout(() => { codeEl.innerHTML = '📋 ' + code; }, 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(showCopied).catch(showCopied);
    } else {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
      showCopied();
    }
  });

  /* ──────────────────────────────────────────────────────────
     RENDER ALL — called once JSON loads successfully
  ────────────────────────────────────────────────────────── */
  function renderAll() {
    renderFilter();
    renderProductsGrid('all');
    renderBestsellers();
    renderSpecials();
    renderOffers();
    renderGallery();
    renderTestimonials();
    renderWhyUs();
    renderOrderSteps();
    renderCounters();
    renderFAQ();

    // Small delay so DOM is fully painted before slider measures widths
    setTimeout(initTestimonialsSlider, 150);
  }

  /* ──────────────────────────────────────────────────────────
     FALLBACK — renders sections that don't need JSON
     (shown when products.json fails to load — usually because
      the site was opened by double-clicking the HTML file
      instead of through a local server)
  ────────────────────────────────────────────────────────── */
  function renderFallback() {
    renderGallery();
    renderWhyUs();
    renderOrderSteps();
    renderCounters();

    const noDataHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
        <div style="font-size:3rem;margin-bottom:12px;">⚠️</div>
        <div style="font-size:1rem;font-weight:600;color:var(--text-primary);">
          Products couldn't be loaded.
        </div>
        <div style="font-size:0.86rem;margin-top:8px;line-height:1.7;">
          Please open this project using a local server.<br>
          See <strong>README.md</strong> for quick setup instructions.
        </div>
        <a href="#contact" class="btn btn-primary" style="margin-top:24px;display:inline-flex;">
          📞 Contact Us to Order
        </a>
      </div>`;

    const productsGrid    = document.getElementById('productsGrid');
    const bestsellersGrid = document.getElementById('bestsellersGrid');
    const specialGrid     = document.getElementById('specialGrid');
    const offersGrid      = document.getElementById('offersGrid');
    const faqList         = document.getElementById('faqList');
    const testimonialsTrack = document.getElementById('testimonialsTrack');

    if (productsGrid)       productsGrid.innerHTML    = noDataHTML;
    if (bestsellersGrid)    bestsellersGrid.innerHTML = noDataHTML;
    if (specialGrid)        specialGrid.innerHTML     = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:rgba(255,243,230,0.6);"><div style="font-size:2rem;margin-bottom:8px;">🎂</div><div>Check back soon for today's specials!</div></div>`;
    if (offersGrid)         offersGrid.innerHTML      = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);font-size:0.9rem;">Offers loading soon…</div>`;
    if (testimonialsTrack)  testimonialsTrack.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted);">Reviews loading soon…</div>`;
    if (faqList)            faqList.innerHTML         = `<div style="text-align:center;padding:40px;color:var(--text-muted);">FAQ loading soon…</div>`;
  }

  /* ──────────────────────────────────────────────────────────
     INITIALISE
  ────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }

})();
