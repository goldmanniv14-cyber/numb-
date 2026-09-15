/**
 * NUMB — shared front-end behaviour (preview site, no backend/build step).
 * Vanilla JS only, split into small named functions run from each page.
 */
(function () {
  'use strict';

  var ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10"/><path d="M6 12l6 10 6-10"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5"/><path d="M12 8h.01"/></svg>'
  };

  /* ---------------- Header / mobile menu ---------------- */
  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    var closeBtn = document.querySelector('[data-menu-close]');
    if (!toggle || !menu) return;

    function open() {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    }
    function close() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.contains('is-open');
      isOpen ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
    });
  }

  /* ---------------- Footer year ---------------- */
  function initFooterYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------- Scroll reveal ----------------
   * Fades sections in as they enter the viewport. Never allowed to leave
   * content permanently invisible: threshold 0 + a generous bottom
   * rootMargin fires early, and a timed fallback force-reveals anything
   * an observer edge case might miss (e.g. very tall sections, unusual
   * viewport/zoom combinations). */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    function revealAll() {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    }

    if (!('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    items.forEach(function (el) { io.observe(el); });

    window.setTimeout(revealAll, 2500);
  }

  /* ---------------- Product card markup ---------------- */
  function productCard(p) {
    var soldOut = p.status === 'sold-out';
    var tagClass = soldOut ? 'tag tag-soldout' : 'tag';
    return (
      '<a class="product-card' + (soldOut ? ' is-soldout' : '') + '" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
        '<div class="thumb">' +
          '<span class="' + tagClass + '">' + escapeHtml(p.tag) + '</span>' +
          '<img src="' + p.images[0] + '" alt="' + escapeHtml(p.name) + ' — תמונת מוצר (placeholder, יש להחליף)" loading="lazy" width="600" height="750">' +
        '</div>' +
        '<div class="meta">' +
          '<div class="cat">' + escapeHtml(p.category) + '</div>' +
          '<div class="name">' + escapeHtml(p.name) + '</div>' +
          '<div class="status-line">' + (soldOut ? 'אזל מהמלאי' : 'בקרוב · הדרופ הבא') + '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* ---------------- Home: next-drop teaser grid ---------------- */
  function renderHomeNextDrop() {
    var el = document.querySelector('[data-next-drop-grid]');
    if (!el || !window.NUMB_PRODUCTS) return;
    el.innerHTML = window.NUMB_PRODUCTS.nextDrop.map(productCard).join('');
  }

  /* ---------------- Catalog page ---------------- */
  function initCatalog() {
    var grid = document.querySelector('[data-catalog-grid]');
    if (!grid || !window.NUMB_PRODUCTS) return;
    var chips = document.querySelectorAll('[data-filter-chip]');
    var emptyNote = document.querySelector('[data-catalog-empty]');

    function itemsFor(filter) {
      if (filter === 'drop') return window.NUMB_PRODUCTS.nextDrop;
      if (filter === 'archive') return window.NUMB_PRODUCTS.archive;
      return window.NUMB_ALL_PRODUCTS;
    }

    function render(filter) {
      var items = itemsFor(filter);
      grid.innerHTML = items.map(productCard).join('');
      if (emptyNote) emptyNote.hidden = items.length !== 0;
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        render(chip.getAttribute('data-filter-chip'));
      });
    });

    var initial = (location.hash === '#archive') ? 'archive' : 'all';
    var initialChip = document.querySelector('[data-filter-chip="' + initial + '"]');
    if (initialChip) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      initialChip.setAttribute('aria-pressed', 'true');
    }
    render(initial);
  }

  /* ---------------- Product detail page ---------------- */
  function initProductDetail() {
    var root = document.querySelector('[data-product-root]');
    if (!root || !window.NUMB_ALL_PRODUCTS) return;

    var params = new URLSearchParams(location.search);
    var id = params.get('id');
    var product = window.NUMB_ALL_PRODUCTS.filter(function (p) { return p.id === id; })[0];

    if (!product) {
      root.innerHTML =
        '<div class="pd-info">' +
          '<p class="eyebrow">404</p>' +
          '<h1>הפריט לא נמצא</h1>' +
          '<p class="desc">ייתכן שהקישור שגוי. אפשר לחזור <a href="catalog.html" style="color:var(--red);font-weight:800;">לקטלוג</a>.</p>' +
        '</div>';
      document.title = 'הפריט לא נמצא — NUMB';
      return;
    }

    document.title = product.name + ' — NUMB';
    var soldOut = product.status === 'sold-out';
    var statusHtml = soldOut
      ? '<span class="status sold-out">אזל מהמלאי</span>'
      : '<span class="status coming-soon">בקרוב · הדרופ הבא</span>';

    var ctaHtml = soldOut
      ? '<button class="btn btn-outline is-disabled btn-block" disabled>אזל מהמלאי</button>'
      : '<a class="btn btn-signature btn-block" href="index.html#waitlist">הצטרפו לרשימת ההמתנה</a>';

    var thumbsHtml = product.images.map(function (src, i) {
      return '<button type="button" data-thumb="' + i + '" class="' + (i === 0 ? 'is-active' : '') + '" aria-label="תמונה ' + (i + 1) + ' מתוך ' + product.images.length + '"><img src="' + src + '" alt=""></button>';
    }).join('');

    root.innerHTML =
      '<div class="pd-gallery">' +
        '<div class="pd-gallery-main">' +
          '<span class="' + (soldOut ? 'tag tag-soldout' : 'tag') + '">' + escapeHtml(product.tag) + '</span>' +
          '<img data-main-image src="' + product.images[0] + '" alt="' + escapeHtml(product.name) + ' — תמונת מוצר (placeholder, יש להחליף)">' +
        '</div>' +
        (product.images.length > 1 ? '<div class="pd-thumbs">' + thumbsHtml + '</div>' : '') +
      '</div>' +
      '<div class="pd-info">' +
        '<p class="cat">' + escapeHtml(product.category) + '</p>' +
        '<h1>' + escapeHtml(product.name) + '</h1>' +
        statusHtml +
        '<p class="desc">' + escapeHtml(product.description) + '</p>' +
        (product.isSample ? '<p class="notice">שימו לב: זהו פריט לדוגמה בלבד להמחשת הארכיון, לא מוצר אמיתי.</p>' :
          '<p class="notice">מחיר, מידות וזמינות יתעדכנו כאן בהמשך — עדיין לא נקבע תאריך השקה.</p>') +
        ctaHtml +
      '</div>';

    var mainImg = root.querySelector('[data-main-image]');
    root.querySelectorAll('[data-thumb]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = Number(btn.getAttribute('data-thumb'));
        mainImg.src = product.images[idx];
        root.querySelectorAll('[data-thumb]').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
      });
    });
  }

  /* ---------------- Waitlist form (client-side only, no backend) ---------------- */
  function initWaitlistForm() {
    var form = document.querySelector('[data-waitlist-form]');
    if (!form) return;
    var msg = form.querySelector('[data-form-msg]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var valid = input && input.checkValidity();
      if (msg) {
        msg.hidden = false;
        msg.textContent = valid
          ? 'תודה! זו הדגמה בלבד — הטופס עוד לא מחובר למערכת אמיתית.'
          : 'נא להזין כתובת אימייל תקינה.';
      }
      if (valid) form.reset();
    });
  }

  /* ---------------- Bottom nav / current page marker ---------------- */
  function markCurrentNav() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    document.querySelectorAll('[data-nav-for]').forEach(function (a) {
      if (a.getAttribute('data-nav-for') === page) a.setAttribute('aria-current', 'page');
    });
  }

  function injectIcons() {
    document.querySelectorAll('[data-icon]').forEach(function (el) {
      var name = el.getAttribute('data-icon');
      if (ICONS[name]) el.innerHTML = ICONS[name];
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectIcons();
    initMenu();
    initFooterYear();
    markCurrentNav();
    renderHomeNextDrop();
    initCatalog();
    initProductDetail();
    initWaitlistForm();
    initReveal();
  });
})();
