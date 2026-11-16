(function () {
  'use strict';

  var root = document.documentElement;
  var reduceQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = reduceQ.matches;
  reduceQ.addEventListener('change', function (e) { reduce = e.matches; });

  /* language */
  var i18n = Array.prototype.slice.call(document.querySelectorAll('[data-ru]'));
  i18n.forEach(function (el) { el.dataset.en = el.innerHTML; });
  var ariaI18n = Array.prototype.slice.call(document.querySelectorAll('[data-ru-aria-label]'));
  ariaI18n.forEach(function (el) { el.dataset.enAriaLabel = el.getAttribute('aria-label'); });

  var isApps = document.body.classList.contains('page-apps');
  var isPortfolio = document.body.classList.contains('page-portfolio');
  var META = isApps ? {
    en: { title: 'Apps for the Mac, Egor Repentov', desc: 'Three macOS apps for audio by Egor Repentov: RME Control for TotalMix, FLOW8 over Bluetooth LE, and Meter for tempo and key on device.' },
    ru: { title: 'Приложения для Mac, Егор Репентов', desc: 'Три macOS-приложения для звука: RME Control для TotalMix, FLOW8 по Bluetooth LE и Meter для темпа и тональности.' }
  } : isPortfolio ? {
    en: { title: 'Portfolio, Egor Repentov', desc: 'Portfolio of Egor Repentov, music producer and mix engineer: records with Garik Pogorelov, ИЮЛА, YUKA, ICEON, MALOGRANJA, ssaayyK and CokeBoy, music, recording and mixing, on Yandex Music, Spotify, Apple Music and YouTube.' },
    ru: { title: 'Портфолио, Егор Репентов', desc: 'Портфолио Егора Репентова, музыкального продюсера и микс-инженера: релизы с Гариком Погореловым, ИЮЛА, YUKA, ICEON, MALOGRANJA, ssaayyK и CokeBoy, музыка, запись и сведение, на Яндекс Музыке, в Spotify, Apple Music и на YouTube.' }
  } : {
    en: { title: 'Egor Repentov, music producer and mix engineer', desc: 'Egor Repentov is a music producer and mix engineer. Music, recording and mixing for Garik Pogorelov. Listen on Yandex Music, Spotify, Apple Music and YouTube.' },
    ru: { title: 'Егор Репентов, музыкальный продюсер и микс-инженер', desc: 'Егор Репентов, музыкальный продюсер и микс-инженер. Музыка, запись и сведение для Гарика Погорелова. Слушайте на Яндекс Музыке, в Spotify, Apple Music и на YouTube.' }
  };
  var descMeta = document.querySelector('meta[name="description"]');
  var lang = 'en';

  function setLang(next) {
    lang = next;
    root.lang = next;
    root.dataset.lang = next;
    i18n.forEach(function (el) {
      el.innerHTML = next === 'ru' ? el.getAttribute('data-ru') : el.dataset.en;
    });
    ariaI18n.forEach(function (el) {
      el.setAttribute('aria-label', next === 'ru' ? el.getAttribute('data-ru-aria-label') : el.dataset.enAriaLabel);
    });
    document.title = META[next].title;
    if (descMeta) descMeta.setAttribute('content', META[next].desc);
    Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === next));
    });
    try { localStorage.setItem('repentov-lang', next); } catch (e) {}
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (btn) {
    btn.addEventListener('click', function () { setLang(btn.dataset.setLang); });
  });

  /* language switch: arrow keys move the selection, as in a native segmented control */
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

  /* reveal */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!('IntersectionObserver' in window) || reduce) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* nav */
  var nav = document.querySelector('[data-nav]');
  var menuBtn = document.querySelector('[data-menu]');
  var drawer = document.querySelector('[data-drawer]');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    Array.prototype.forEach.call(drawer.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-scrolled', y > 6);
  }

  function requestScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }

  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll, { passive: true });
  onScroll();


  /* cover flow */
  var flow = document.querySelector('[data-flow]');
  var flowBtn = document.querySelector('[data-flow-toggle]');
  var flowPaused = false;

  function flowLabel() {
    var ru = lang === 'ru';
    if (flowPaused) return ru ? '\u0417\u0430\u043f\u0443\u0441\u0442\u0438\u0442\u044c' : 'Play';
    return ru ? '\u041f\u0430\u0443\u0437\u0430' : 'Pause';
  }

  if (flow && flowBtn) {
    flowBtn.addEventListener('click', function () {
      flowPaused = !flowPaused;
      flow.classList.toggle('is-paused', flowPaused);
      flowBtn.setAttribute('aria-pressed', String(flowPaused));
      flowBtn.textContent = flowLabel();
    });
    var originalSetLang = setLang;
    setLang = function (next) {
      originalSetLang(next);
      flowBtn.textContent = flowLabel();
    };
    flowBtn.textContent = flowLabel();
  }


  /* portfolio: artists ranked by popularity, never twice in a row or directly below */
  var releaseGrid = document.querySelector('.releases-grid');
  if (releaseGrid) {
    var releaseCards = Array.prototype.slice.call(releaseGrid.querySelectorAll('.release-card'));
    var releaseRanks = {};
    var releaseGroups = {};
    releaseCards.forEach(function (card) {
      var artist = card.getAttribute('data-artist');
      if (!artist) return;
      if (!releaseGroups[artist]) {
        releaseGroups[artist] = [];
        releaseRanks[artist] = parseInt(card.getAttribute('data-rank'), 10) || 999;
      }
      var yearEl = card.querySelector('.release-card__meta span:nth-child(2)');
      releaseGroups[artist].push({
        el: card,
        year: parseInt(yearEl && yearEl.textContent, 10) || 0
      });
    });
    Object.keys(releaseGroups).forEach(function (artist) {
      releaseGroups[artist].sort(function (a, b) { return b.year - a.year; });
    });
    var releaseArtists = Object.keys(releaseGroups).sort(function (a, b) {
      return releaseRanks[a] - releaseRanks[b];
    });
    var firstRowTitles = ['мне так хорошо', 'Честно говоря', 'Виновата сама', 'мид', 'Пепел на кроссах'];
    var releaseCols = 0;
    var releaseTimer;

    function arrangeReleases() {
      var template = window.getComputedStyle(releaseGrid).gridTemplateColumns;
      var cols = template && template !== 'none' ? template.split(' ').length : 1;
      if (!cols || cols === releaseCols) return;
      releaseCols = cols;

      var total = releaseCards.length;
      var rows = Math.ceil(total / cols);
      var queues = releaseArtists.map(function (artist) {
        return {
          artist: artist,
          cards: releaseGroups[artist].map(function (item) { return item.el; })
        };
      });
      var result = new Array(total);
      var grid = [];
      for (var r = 0; r < rows; r++) grid.push(new Array(cols).fill(null));

      var pinned = [];
      if (cols === 5) {
        firstRowTitles.forEach(function (title) {
          var card = releaseCards.filter(function (item) {
            var track = item.querySelector('.release-card__title');
            return track && track.textContent.trim() === title;
          })[0];
          if (card) pinned.push(card);
        });
      }
      if (pinned.length !== 5) pinned = [];

      if (pinned.length) {
        queues.forEach(function (queue) {
          queue.cards = queue.cards.filter(function (card) { return pinned.indexOf(card) === -1; });
        });
        pinned.forEach(function (card, col) {
          grid[0][col] = card.getAttribute('data-artist');
          result[col] = card;
        });
      }

      function fits(artist, row, col) {
        for (var c = 0; c < col; c++) {
          if (grid[row][c] === artist) return false;
        }
        return !(row > 0 && grid[row - 1][col] === artist);
      }

      function place(index) {
        if (index === total) return true;
        var row = Math.floor(index / cols);
        var col = index % cols;
        for (var q = 0; q < queues.length; q++) {
          var queue = queues[q];
          if (!queue.cards.length || !fits(queue.artist, row, col)) continue;
          var card = queue.cards.shift();
          grid[row][col] = queue.artist;
          result[index] = card;
          if (place(index + 1)) return true;
          queue.cards.unshift(card);
          grid[row][col] = null;
          result[index] = null;
        }
        return false;
      }

      if (!place(pinned.length ? cols : 0)) return;

      var current = Array.prototype.slice.call(releaseGrid.querySelectorAll('.release-card'));
      var changed = current.some(function (card, index) { return result[index] !== card; });
      if (changed) {
        var fragment = document.createDocumentFragment();
        result.forEach(function (card) { fragment.appendChild(card); });
        releaseGrid.appendChild(fragment);
      }
    }

    arrangeReleases();
    window.addEventListener('resize', function () {
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(function () {
        releaseCols = 0;
        arrangeReleases();
      }, 160);
    }, { passive: true });
  }

  var stored = null;
  try { stored = localStorage.getItem('repentov-lang'); } catch (e) {}
  if (stored === 'ru' || stored === 'en') {
    setLang(stored);
  } else {
    var device = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    if (/^ru\b/i.test(device)) setLang('ru');
  }
})();
