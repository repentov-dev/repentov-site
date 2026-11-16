(function () {
  'use strict';

  var root = document.documentElement;
  var reduceQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = reduceQ.matches;
  reduceQ.addEventListener('change', function (e) { reduce = e.matches; });

  var page = document.body.classList.contains('page-records') ? 'records'
    : document.body.classList.contains('page-apps') ? 'apps' : 'home';

  var META = {
    home: {
      en: { title: 'Egor Repentov — music producer and mix engineer', desc: 'Egor Repentov is a music producer and mix engineer in Minsk. Music, recording and mixing. Portfolio, studio and services.' },
      ru: { title: 'Егор Репентов — музыкальный продюсер и микс-инженер', desc: 'Егор Репентов — музыкальный продюсер и микс-инженер в Минске. Музыка, запись и сведение. Портфолио, студия и услуги.' }
    },
    records: {
      en: { title: 'Portfolio — Egor Repentov', desc: 'Portfolio of Egor Repentov, music producer and mix engineer in Minsk. Music, recording and mixing for Garik Pogorelov, saypink!, ИЮЛА, YUKA, MALOGRANJA and more.' },
      ru: { title: 'Портфолио — Егор Репентов', desc: 'Портфолио Егора Репентова, музыкального продюсера и микс-инженера из Минска. Музыка, запись и сведение для Гарика Погорелова, saypink!, ИЮЛА, YUKA, MALOGRANJA и других.' }
    },
    apps: {
      en: { title: 'Apps — Egor Repentov', desc: 'Three macOS apps for audio by Egor Repentov: RME Control for TotalMix, FLOW8 over Bluetooth LE, and Meter for tempo and key on device.' },
      ru: { title: 'Приложения — Егор Репентов', desc: 'Три macOS-приложения для звука: RME Control для TotalMix, FLOW8 по Bluetooth LE и Meter для темпа и тональности на устройстве.' }
    }
  };

  var i18n = Array.prototype.slice.call(document.querySelectorAll('[data-ru]'));
  i18n.forEach(function (el) { el.dataset.en = el.innerHTML; });
  var ariaI18n = Array.prototype.slice.call(document.querySelectorAll('[data-ru-aria-label]'));
  ariaI18n.forEach(function (el) { el.dataset.enAriaLabel = el.getAttribute('aria-label'); });
  var descMeta = document.querySelector('meta[name="description"]');
  var ogTitle = document.querySelector('meta[property="og:title"]');
  var ogDesc = document.querySelector('meta[property="og:description"]');

  function setLang(next) {
    root.lang = next;
    root.dataset.lang = next;
    i18n.forEach(function (el) {
      el.innerHTML = next === 'ru' ? el.getAttribute('data-ru') : el.dataset.en;
    });
    ariaI18n.forEach(function (el) {
      el.setAttribute('aria-label', next === 'ru' ? el.getAttribute('data-ru-aria-label') : el.dataset.enAriaLabel);
    });
    document.title = META[page][next].title;
    if (descMeta) descMeta.setAttribute('content', META[page][next].desc);
    if (ogTitle) ogTitle.setAttribute('content', META[page][next].title);
    if (ogDesc) ogDesc.setAttribute('content', META[page][next].desc);
    Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.setLang === next));
    });
    try { localStorage.setItem('repentov-lang', next); } catch (e) {}
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (btn) {
    btn.addEventListener('click', function () { setLang(btn.dataset.setLang); });
  });

  var langGroup = document.querySelector('.nav__lang');
  if (langGroup) {
    var langButtons = Array.prototype.slice.call(langGroup.querySelectorAll('[data-set-lang]'));
    langGroup.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      var current = langButtons.indexOf(document.activeElement);
      var next = e.key === 'Home' ? 0 : e.key === 'End' ? langButtons.length - 1 : (current + step + langButtons.length) % langButtons.length;
      langButtons[next].focus();
      setLang(langButtons[next].getAttribute('data-set-lang'));
    });
  }

  /* material nav + hero scroll */
  var nav = document.querySelector('[data-nav]');
  var hero = document.querySelector('.hero');
  var heroMedia = document.querySelector('.hero__media');
  var heroContent = document.querySelector('.hero__content');
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-scrolled', y > 8);
    if (hero && heroMedia && heroContent && !reduce) {
      var ratio = Math.min(y / Math.max(hero.offsetHeight, 1), 1);
      heroMedia.style.transform = 'scale(' + (1 + ratio * 0.06).toFixed(4) + ')';
      heroContent.style.opacity = String(1 - ratio * 0.55);
      heroContent.style.transform = 'translate3d(0,' + (ratio * 24).toFixed(1) + 'px,0)';
    }
  }

  function requestScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }

  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll, { passive: true });
  onScroll();

  /* mobile sheet */
  var menuBtn = document.querySelector('[data-menu]');
  var menuPanel = document.querySelector('[data-menu-panel]');
  var lastFocus = null;

  if (menuBtn && menuPanel) {
    function setMenu(open) {
      menuPanel.classList.toggle('is-open', open);
      menuBtn.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuPanel.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
      if (open) {
        lastFocus = document.activeElement;
        var first = menuPanel.querySelector('a');
        if (first) first.focus();
      } else if (lastFocus && document.contains(lastFocus)) {
        lastFocus.focus();
      }
    }
    menuBtn.addEventListener('click', function () {
      setMenu(!menuPanel.classList.contains('is-open'));
    });
    Array.prototype.forEach.call(menuPanel.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuPanel.classList.contains('is-open')) {
        setMenu(false);
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setMenu(false);
    }, { passive: true });
  }

  /* records carousel */
  var carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    var prev = document.querySelector('[data-carousel-prev]');
    var next = document.querySelector('[data-carousel-next]');
    var card = carousel.querySelector('.release-card');

    function step() {
      return card ? card.getBoundingClientRect().width + 20 : carousel.clientWidth * 0.8;
    }
    function updateButtons() {
      if (!prev || !next) return;
      var max = carousel.scrollWidth - carousel.clientWidth;
      prev.disabled = carousel.scrollLeft <= 2;
      next.disabled = carousel.scrollLeft >= max - 2;
    }
    if (prev) prev.addEventListener('click', function () {
      carousel.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' });
    });
    if (next) next.addEventListener('click', function () {
      carousel.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' });
    });
    var carouselTick = false;
    carousel.addEventListener('scroll', function () {
      if (carouselTick) return;
      carouselTick = true;
      window.requestAnimationFrame(function () { carouselTick = false; updateButtons(); });
    }, { passive: true });
    window.addEventListener('resize', updateButtons, { passive: true });
    updateButtons();
  }

  /* segmented filter + cards */
  var segmented = document.querySelector('[data-segmented]');
  if (segmented) {
    var buttons = Array.prototype.slice.call(segmented.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.grid-card[data-roles]'));
    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () {
        segmented.style.setProperty('--i', index);
        buttons.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === button));
        });
        var filter = button.dataset.filter;
        cards.forEach(function (cardEl) {
          var match = filter === 'all' || cardEl.getAttribute('data-roles').split(' ').indexOf(filter) !== -1;
          cardEl.hidden = !match;
        });
      });
    });
  }

  var stored = null;
  try { stored = localStorage.getItem('repentov-lang'); } catch (e) {}
  if (stored === 'ru') setLang('ru');
})();
