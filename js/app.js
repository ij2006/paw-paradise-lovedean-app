// ─────────────────────────────────────────────
//  The app: screens, tab bar, back navigation, transitions.
//  Screens live at #/home, #/book, #/info ... so links, the
//  Android back button and swipe-back all work.
// ─────────────────────────────────────────────
var PPApp = (function () {
  var screensEl = document.getElementById('screens');
  var topbar = document.getElementById('topbar');
  var titleEl = document.getElementById('topbar-title');
  var backBtn = document.getElementById('back-btn');
  var backLabel = document.getElementById('back-label');
  var tabs = document.querySelectorAll('.tab');

  // tab: which tab it belongs to by default. depth 0 = tab screen.
  var ROUTES = {
    home:        { title: 'Paw Paradise', tab: 'home', depth: 0, render: function (el) { el.innerHTML = PPC.home(); } },
    book:        { title: 'Book', tab: 'book', depth: 0, render: function (el) { el.innerHTML = PPC.book(); } },
    gallery:     { title: 'Gallery', tab: 'gallery', depth: 0, render: function (el) { PPF.gallery(el); } },
    reviews:     { title: 'Reviews', tab: 'reviews', depth: 0, render: function (el) { el.innerHTML = PPC.reviews(); } },
    more:        { title: 'More', tab: 'more', depth: 0, render: function (el) { el.innerHTML = PPC.more(); syncThemeButtons(); PPStaff.syncIndicators(); } },
    info:        { title: 'Information & FAQs', tab: 'more', depth: 1, render: function (el) { el.innerHTML = PPC.info(); } },
    about:       { title: 'Meet the team', tab: 'more', depth: 1, render: function (el) { el.innerHTML = PPC.about(); } },
    news:        { title: 'News', tab: 'more', depth: 1, render: function (el) { PPF.news(el); } },
    post:        { title: 'News', tab: 'more', depth: 2, parent: 'news', nocache: true, render: function (el, param, setTitle) { PPF.newsPost(el, param, setTitle); } },
    suggestions: { title: 'Suggestions', tab: 'more', depth: 1, render: function (el) { PPF.suggestions(el); } },
    contact:     { title: 'Contact', tab: 'more', depth: 1, render: function (el) { el.innerHTML = PPC.contact(); } },
    staff:       { title: 'Staff', tab: 'more', depth: 1, nocache: true, render: function (el) { PPStaff.render(el); } }
  };

  var cache = {};          // route key -> screen element (keeps scroll position)
  var stack = [];          // in-app history of route keys
  var current = null;      // { key, name, el }
  var currentTab = 'home';
  var firstRender = true;

  function parse(hash) {
    var h = (hash || '').replace(/^#\/?/, '');
    if (!h || /access_token|type=recovery|error_description/.test(h)) return { name: 'home', key: 'home' };
    var parts = h.split('/');
    if (parts[0] === 'news' && parts[1]) return { name: 'post', key: 'news/' + parts[1], param: decodeURIComponent(parts[1]) };
    if (ROUTES[parts[0]]) return { name: parts[0], key: parts[0] };
    return { name: 'home', key: 'home' };
  }

  function makeScreen(r) {
    var def = ROUTES[r.name];
    var el = document.createElement('div');
    el.className = 'screen';
    el.setAttribute('data-screen', r.name);
    el.hidden = true;
    screensEl.appendChild(el);
    def.render(el, r.param, function (t) { if (current && current.el === el) setTitle(t); el.dataset.title = t; });
    el.addEventListener('scroll', onScroll, { passive: true });
    applyOpening(el);
    return el;
  }

  function setTitle(t) { titleEl.textContent = t; }

  function onScroll() {
    if (!current) return;
    var y = current.el.scrollTop;
    topbar.classList.toggle('is-scrolled', y > 4);
    topbar.classList.toggle('show-title', y > 70 || ROUTES[current.name].depth > 0);
  }

  function titleOf(r, el) { return (el && el.dataset.title) || ROUTES[r.name].title; }

  function show(r, direction) {
    var def = ROUTES[r.name];
    var el = (!def.nocache && cache[r.key]) || null;
    if (!el) {
      if (def.nocache && cache[r.key]) { cache[r.key].remove(); }
      el = makeScreen(r);
      cache[r.key] = el;
    }
    var prev = current;
    current = { key: r.key, name: r.name, el: el };
    if (def.depth === 0) currentTab = def.tab;
    else if (firstRender) currentTab = def.tab;

    // Tab bar
    Array.prototype.forEach.call(tabs, function (t) {
      var on = t.getAttribute('data-tab') === currentTab;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });

    // Top bar
    setTitle(titleOf(r, el));
    topbar.classList.toggle('is-home', r.name === 'home');
    topbar.classList.toggle('on-staff', r.name === 'staff');
    var canBack = def.depth > 0;
    backBtn.hidden = !canBack;
    if (canBack) {
      var prevKey = stack[stack.length - 2];
      var prevR = prevKey ? parse('#/' + prevKey) : parse('#/' + (def.parent || def.tab));
      var bl = shortTitle(titleOf(prevR, cache[prevR.key]));
      backLabel.textContent = bl;
      backBtn.setAttribute('aria-label', bl === 'Back' ? 'Back' : 'Back to ' + bl);
    }

    // Swap screens with a transition
    var motion = document.documentElement.getAttribute('data-motion') !== 'reduced' && !firstRender && prev && prev.el !== el;
    el.hidden = false;
    if (prev && prev.el !== el) {
      var old = prev.el;
      if (motion) {
        var cls = direction === 'push' ? 'anim-push' : direction === 'pop' ? 'anim-pop' : 'anim-fade';
        screensEl.classList.add(cls);
        el.classList.add('is-entering');
        old.classList.add('is-leaving');
        setTimeout(function () {
          screensEl.classList.remove('anim-push', 'anim-pop', 'anim-fade');
          el.classList.remove('is-entering');
          old.classList.remove('is-leaving');
          old.hidden = true;
          if (direction === 'pop' && ROUTES[prev.name] && ROUTES[prev.name].depth > 0 && stack.indexOf(prev.key) === -1 && !ROUTES[prev.name].nocache) { /* keep cached */ }
        }, 340);
      } else {
        old.hidden = true;
      }
    }
    onScroll();

    if (!firstRender) {
      var h1 = el.querySelector('h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); try { h1.focus({ preventScroll: true }); } catch (e) {} }
      PPUI.announce(titleOf(r, el));
    }
    document.title = (r.name === 'home' ? '' : titleOf(r, el) + ' · ') + 'Paw Paradise Lovedean';
    firstRender = false;
  }

  function shortTitle(t) { return t.length > 14 ? 'Back' : t; }

  function onHashChange() {
    var r = parse(location.hash);
    var def = ROUTES[r.name];
    var direction;
    if (stack.length > 1 && stack[stack.length - 2] === r.key) { stack.pop(); direction = 'pop'; }
    else if (current && current.key === r.key) { return; }
    else if (def.depth === 0) { stack = [r.key]; direction = 'fade'; }
    else {
      direction = 'push';
      if (!stack.length) stack = [def.parent || def.tab];
      stack.push(r.key);
    }
    show(r, direction);
  }

  function go(name) { location.hash = '#/' + name; }

  function back() {
    if (PPUI.hasLayer()) { PPUI.closeTop(); return; }
    if (stack.length > 1) { history.back(); return; }
    var def = ROUTES[current.name];
    var parent = def.parent || def.tab;
    stack = [parent];
    location.replace('#/' + parent);
  }

  // Rebuild a screen next time it's opened (e.g. after a new post)
  function refresh(name) {
    Object.keys(cache).forEach(function (k) {
      if (k === name && (!current || current.key !== k)) { cache[k].remove(); delete cache[k]; }
    });
    if (current && current.key === name) {
      var el = current.el;
      var r = parse('#/' + name);
      var fresh = makeScreen(r);
      fresh.hidden = false;
      cache[name] = fresh;
      current.el = fresh;
      el.remove();
    }
  }

  // ── Appearance ──────────────────────────────
  var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  function getTheme() { try { return localStorage.getItem('pp-theme') || 'light'; } catch (e) { return 'light'; } }
  function applyTheme(choice) {
    try { localStorage.setItem('pp-theme', choice); } catch (e) {}
    var t = choice === 'auto' ? (mq && mq.matches ? 'dark' : 'light') : choice;
    document.documentElement.setAttribute('data-theme', t);
    syncThemeButtons();
    syncThemeColour();
  }
  function syncThemeButtons() {
    var choice = getTheme();
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-set]'), function (b) {
      b.setAttribute('aria-checked', b.getAttribute('data-theme-set') === choice ? 'true' : 'false');
    });
  }
  function syncThemeColour() {
    var bg = getComputedStyle(document.documentElement).getPropertyValue('--bar-solid').trim();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && bg) meta.setAttribute('content', bg);
  }
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { if (getTheme() === 'auto') applyTheme('auto'); });

  // Opening banner hides itself after opening day
  function applyOpening(root) {
    var day = PP_CONFIG.openingDay;
    if (!day) return;
    var end = new Date(day + 'T23:59:59');
    if (Date.now() > end.getTime()) {
      Array.prototype.forEach.call(root.querySelectorAll('[data-opening]'), function (n) { n.hidden = true; n.remove(); });
    }
  }

  // ── Taps anywhere ───────────────────────────
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-book], [data-sheet], [data-theme-set], .tab, a[href^="#/"]');
    if (!t) return;
    if (t.hasAttribute('data-book')) { e.preventDefault(); PPUI.booking(t.getAttribute('data-book')); return; }
    if (t.hasAttribute('data-sheet')) { e.preventDefault(); PPF.openSheet(t.getAttribute('data-sheet')); return; }
    if (t.hasAttribute('data-theme-set')) { applyTheme(t.getAttribute('data-theme-set')); return; }
    if (t.classList.contains('tab')) {
      var tab = t.getAttribute('data-tab');
      if (current && currentTab === tab) {
        e.preventDefault();
        if (ROUTES[current.name].depth > 0) { stack = [tab]; location.replace('#/' + tab); }
        else current.el.scrollTo({ top: 0, behavior: document.documentElement.getAttribute('data-motion') === 'reduced' ? 'auto' : 'smooth' });
      }
      return;
    }
    // A link inside a sheet closes the sheet first
    if (PPUI.hasLayer() && t.closest('#layers')) PPUI.closeTop();
  });
  backBtn.addEventListener('click', back);

  // Swipe from the left edge to go back
  (function () {
    var sx = null, sy = 0, dx = 0, el = null;
    screensEl.addEventListener('touchstart', function (e) {
      if (!current || ROUTES[current.name].depth === 0 || e.touches[0].clientX > 24) { sx = null; return; }
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; el = current.el;
    }, { passive: true });
    screensEl.addEventListener('touchmove', function (e) {
      if (sx === null) return;
      dx = e.touches[0].clientX - sx;
      if (Math.abs(e.touches[0].clientY - sy) > 40 && dx < 30) { sx = null; el.style.transform = ''; return; }
      if (dx > 0) { el.style.transition = 'none'; el.style.transform = 'translateX(' + dx + 'px)'; }
    }, { passive: true });
    screensEl.addEventListener('touchend', function () {
      if (sx === null) return;
      sx = null;
      el.style.transition = '';
      if (dx > window.innerWidth * 0.3) { el.style.transform = ''; back(); }
      else el.style.transform = '';
    });
  })();

  // Online / offline
  window.addEventListener('offline', function () { PPUI.toast('You\'re offline. Some things won\'t load until you reconnect.'); });
  window.addEventListener('online', function () { PPUI.toast('Back online', 'success'); });

  // ── Start ───────────────────────────────────
  function start() {
    var r = parse(location.hash);
    var recovery = PPStaff.isRecovering();
    if (recovery) r = { name: 'staff', key: 'staff' };
    var def = ROUTES[r.name];
    stack = def.depth === 0 ? [r.key] : [def.parent || def.tab, r.key].filter(function (k, i, a) { return a.indexOf(k) === i; });
    if (def.depth === 2) stack = [def.tab, def.parent, r.key];
    if (recovery) {
      history.replaceState(null, '', '#/' + def.tab);
      history.pushState(null, '', '#/staff');
      stack = [def.tab, 'staff'];
    } else if (!location.hash || location.hash === '#' || location.hash === '#/') {
      history.replaceState(null, '', '#/home');
    } else if (def.depth > 0) {
      // Opened straight onto an inner screen: put its parent screens underneath, so Back stays in the app
      history.replaceState(null, '', '#/' + stack[0]);
      for (var i = 1; i < stack.length; i++) history.pushState(null, '', '#/' + stack[i]);
    }
    show(r);
    window.addEventListener('hashchange', onHashChange);
    syncThemeColour();
    PPStaff.syncIndicators();

    var splash = document.getElementById('splash');
    setTimeout(function () { splash.classList.add('is-gone'); setTimeout(function () { splash.remove(); }, 400); }, 450);

    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  start();

  return { go: go, back: back, refresh: refresh, syncThemeColour: syncThemeColour };
})();
