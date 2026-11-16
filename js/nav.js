(function () {
  'use strict';
  var btn = document.querySelector('[data-menu]');
  var panel = document.querySelector('[data-menu-panel]');
  if (!btn || !panel) return;
  var lastFocus = null;

  function setMenu(open) {
    panel.classList.toggle('is-open', open);
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    if (open) {
      lastFocus = document.activeElement;
      var first = panel.querySelector('a');
      if (first) first.focus();
    } else if (lastFocus && document.contains(lastFocus)) {
      lastFocus.focus();
    }
  }

  btn.addEventListener('click', function () { setMenu(!panel.classList.contains('is-open')); });
  Array.prototype.forEach.call(panel.querySelectorAll('a'), function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) setMenu(false);
  }, { passive: true });
})();
