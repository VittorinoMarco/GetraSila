(function () {
  function init() {
    var burger = document.querySelector('.burger');
    var menu = document.getElementById('mobile-menu');
    if (!burger || !menu) return;

    function close() {
      burger.classList.remove('is-open');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
    function open() {
      burger.classList.add('is-open');
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    burger.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) close(); else open();
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });

    var closeBtn = menu.querySelector('.mobile-menu__close');
    if (closeBtn) closeBtn.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
    });

    // Close if window resized above mobile breakpoint
    var mq = window.matchMedia('(min-width: 881px)');
    var handler = function (e) { if (e.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);

    // Mark active link based on current page
    var path = location.pathname.split('/').pop() || 'index.html';
    menu.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (href === path) a.classList.add('is-active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
