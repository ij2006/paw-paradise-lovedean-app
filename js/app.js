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
    home:    { title: 'Paw Paradise', tab: 'home', depth: 0, render: function (el) { el.innerHTML = PPC.home(); updateToday(el); PPF.homeExtras(el); } },
    book:    { title: 'Book', tab: 'book', depth: 0, fixed: true, render: renderBook, onShow: loadBooking },
    gallery: { title: 'Gallery', tab: 'gallery', depth: 0, render: function (el) { PPF.gallery(el); } },
    more:    { title: 'More', tab: 'more', depth: 0, render: function (el) { el.innerHTML = PPC.more(); syncThemeButtons(); syncGlass(); PPStaff.syncIndicators(); } },
    info:    { title: 'FAQs', tab: 'more', depth: 1, render: renderInfo },
    faq:     { title: 'FAQs', tab: 'more', depth: 2, parent: 'info', render: function (el, slug, setTitle) { el.innerHTML = PPC.faqSubject(slug); setTitle(PPC.faqTitle(slug)); } },
    news:    { title: 'News', tab: 'more', depth: 1, render: function (el) { PPF.news(el); } },
    post:    { title: 'News', tab: 'more', depth: 2, parent: 'news', nocache: true, render: function (el, param, setTitle) { PPF.newsPost(el, param, setTitle); } },
    offers:  { title: 'Block bookings & gifts', tab: 'home', depth: 1, render: function (el) { el.innerHTML = PPC.offers(); } },
    contact: { title: 'Contact', tab: 'more', depth: 1, render: function (el) { el.innerHTML = PPC.contact(); } },
    staff:   { title: 'Admin', tab: 'more', depth: 1, nocache: true, render: function (el) { PPStaff.render(el); } },
    staffsub:{ title: 'Admin', tab: 'more', depth: 2, parent: 'staff', nocache: true, render: function (el, which, setTitle) { PPStaff.renderSub(el, which, setTitle); } }
  };

  // ── Book tab: the Acuity booking page, filling the screen ──
  function renderBook(el) {
    el.innerHTML =
      '<h1 class="sr-only">Book a session</h1>' +
      '<div class="booking-loading" id="booking-loading"><span class="spinner" aria-hidden="true"></span><p>Loading booking…</p>' +
        '<p id="booking-slow" hidden>Taking a while? <a href="' + PP_CONFIG.acuity.all + '" target="_blank" rel="noopener">Open booking in your browser</a></p></div>' +
      '<div class="booking-offline" id="booking-offline" hidden><p><strong>You\'re offline</strong></p><p>Connect to the internet to book a session.</p><button type="button" class="btn btn-primary" id="booking-retry">Try again</button></div>';
    el.querySelector('#booking-retry').addEventListener('click', function () { loadBooking(el, true); });
  }
  function loadBooking(el, retry) {
    var offline = navigator.onLine === false;
    el.querySelector('#booking-offline').hidden = !offline;
    el.querySelector('#booking-loading').hidden = offline || !!el.querySelector('iframe');
    if (offline || (el.querySelector('iframe') && !retry)) return;
    var old = el.querySelector('iframe'); if (old) old.remove();
    var f = document.createElement('iframe');
    f.title = 'Paw Paradise booking calendar';
    f.src = PP_CONFIG.acuity.all;
    f.setAttribute('allow', 'payment');
    var slow = setTimeout(function () { var h = el.querySelector('#booking-slow'); if (h) h.hidden = false; }, 10000);
    f.addEventListener('load', function () { clearTimeout(slow); el.querySelector('#booking-loading').hidden = true; });
    el.appendChild(f);
  }

  // ── FAQs: search across every subject ──
  function renderInfo(el) {
    el.innerHTML = PPC.info();
    var input = el.querySelector('#faq-search'), results = el.querySelector('#faq-results'), subjects = el.querySelector('#faq-subjects');
    input.addEventListener('input', function () {
      var html = PPC.faqSearch(input.value);
      results.hidden = !html; subjects.hidden = !!html;
      results.innerHTML = html || '';
    });
  }

  // ── Home: today's opening hours ──
  var BANK_HOLIDAYS = ['2026-12-25', '2026-12-28', '2027-01-01', '2027-03-26', '2027-03-29', '2027-05-03', '2027-05-31', '2027-08-30', '2027-12-27', '2027-12-28',
                       '2028-01-03', '2028-04-14', '2028-04-17', '2028-05-01', '2028-05-29', '2028-08-28', '2028-12-25', '2028-12-26'];
  function hoursFor(d) {
    var m = d.getMonth() + 1, day = d.getDay();
    var iso = d.getFullYear() + '-' + String(m).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    var summer = m >= 4 && m <= 10;
    var lateStart = !summer || day === 0 || BANK_HOLIDAYS.indexOf(iso) !== -1;
    return lateStart ? '8:00am – 9:00pm' : '7:00am – 9:00pm';
  }
  function updateToday(el) {
    var t = el.querySelector('#today-hours');
    if (t) t.textContent = hoursFor(new Date());
  }
  var cache = {};          // route key -> screen element (keeps scroll position)
  var stack = [];          // in-app history of route keys
  var current = null;      // { key, name, el }
  var currentTab = 'home';
  var firstRender = true;
  var pending = null;      // slide animation in progress

  function finishTransition() {
    if (!pending) return;
    clearTimeout(pending.timer);
    (pending.anims || []).forEach(function (a) { try { a.cancel(); } catch (e) {} });
    document.documentElement.classList.remove('is-animating');
    screensEl.classList.remove('anim-push', 'anim-pop', 'anim-fade');
    Array.prototype.forEach.call(screensEl.children, function (s) {
      s.classList.remove('is-entering', 'is-leaving');
      s.style.zIndex = ''; s.style.willChange = ''; s.style.boxShadow = '';
      if (!current || s !== current.el) s.hidden = true;
    });
    pending = null;
  }

  function parse(hash) {
    var h = (hash || '').replace(/^#\/?/, '');
    if (!h || h === 'install' || /access_token|type=recovery|error_description/.test(h)) return { name: 'home', key: 'home' };
    var parts = h.split('/');
    if (parts[0] === 'news' && parts[1]) return { name: 'post', key: 'news/' + parts[1], param: decodeURIComponent(parts[1]) };
    if (parts[0] === 'staff' && parts[1]) return { name: 'staffsub', key: 'staff/' + parts[1], param: parts[1] };
    if (parts[0] === 'faq' && parts[1]) return { name: 'faq', key: 'faq/' + parts[1], param: decodeURIComponent(parts[1]) };
    if (ROUTES[parts[0]]) return { name: parts[0], key: parts[0] };
    return { name: 'home', key: 'home' };
  }

  function makeScreen(r) {
    var def = ROUTES[r.name];
    var el = document.createElement('div');
    el.className = 'screen' + (def.fixed ? ' screen--fixed' : '') + (def.depth > 0 ? ' screen--inner' : '');
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
    topbar.classList.toggle('has-scrolled', y > 4);
    topbar.classList.add('show-title', 'is-scrolled');
  }

  function titleOf(r, el) { return (el && el.dataset.title) || ROUTES[r.name].title; }

  // Page slides on (set to false for screens to appear instantly)
  var SLIDES = true;

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
    Array.prototype.forEach.call(tabs, function (t, i) {
      var on = t.getAttribute('data-tab') === currentTab;
      t.classList.toggle('is-active', on);
      if (on) { t.setAttribute('aria-current', 'page'); placeLens(i); } else t.removeAttribute('aria-current');
    });

    // Top bar
    setTitle(titleOf(r, el));
    topbar.classList.toggle('is-home', r.name === 'home');
    topbar.classList.toggle('on-staff', r.name === 'staff' || r.name === 'staffsub');
    topbar.classList.toggle('is-fixed', !!def.fixed);
    document.getElementById('book-external').hidden = r.name !== 'book';
    var canBack = def.depth > 0;
    backBtn.hidden = !canBack;
    if (canBack) {
      var prevKey = stack[stack.length - 2];
      var prevR = prevKey ? parse('#/' + prevKey) : parse('#/' + (def.parent || def.tab));
      var bl = titleOf(r, el).length > 12 ? '' : shortTitle(titleOf(prevR, cache[prevR.key]));
      backLabel.textContent = bl;
      backBtn.setAttribute('aria-label', bl ? 'Back to ' + bl : 'Back');
    }

    // Swap screens with a transition.
    // Finish any slide still in progress first, so a quick second tap can never
    // leave the wrong screen showing.
    finishTransition();
    var motion = SLIDES && direction !== 'none' && direction !== 'fade' && document.documentElement.getAttribute('data-motion') !== 'reduced' && !firstRender && prev && prev.el !== el;
    el.hidden = false;
    Array.prototype.forEach.call(screensEl.children, function (s) {
      if (s !== el && (!motion || s !== (prev && prev.el))) s.hidden = true;
    });
    if (motion) {
      // Slide like an iPhone app: the new screen slides over from the right while the
      // old one drifts left (reversed for Back). Runs on the phone's graphics chip, and
      // the screens are only tidied up once the slide has really finished, so a busy
      // moment can never cut it short and make the page jump.
      var old = prev.el;
      old.hidden = false;
      var push = direction === 'push';
      var topEl = push ? el : old, underEl = push ? old : el;
      topEl.style.zIndex = '2'; underEl.style.zIndex = '1';
      el.style.willChange = old.style.willChange = 'transform';
      topEl.style.boxShadow = '-8px 0 28px rgba(0,0,0,.10)';
      var opts = { duration: 340, easing: 'cubic-bezier(.32,.72,0,1)' };
      var off = 'translate3d(100%,0,0)', on = 'translate3d(0,0,0)', back = 'translate3d(-30%,0,0)';
      var a1 = topEl.animate(push ? [{ transform: off }, { transform: on }] : [{ transform: on }, { transform: off }], opts);
      var a2 = underEl.animate(push ? [{ transform: on }, { transform: back }] : [{ transform: back }, { transform: on }], opts);
      document.documentElement.classList.add('is-animating');
      var mine = { old: old, anims: [a1, a2], timer: setTimeout(finishTransition, 900) };
      pending = mine;
      a1.onfinish = function () { if (pending === mine) finishTransition(); };
    }
    if (def.onShow) def.onShow(el);
    onScroll();

    if (!firstRender) {
      var h1 = el.querySelector('h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); try { h1.focus({ preventScroll: true }); } catch (e) {} }
      PPUI.announce(titleOf(r, el));
    }
    document.title = (r.name === 'home' ? '' : titleOf(r, el) + ' · ') + 'Paw Paradise Lovedean';
    firstRender = false;
  }

  function shortTitle(t) { return t.length > 9 ? '' : t; }

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
    if (Date.now() - navIntent > 1200 && direction !== 'fade') direction = 'none';
    show(r, direction);
  }

  function go(name) { navigate('#/' + name); }

  // Change screen now and record it in the history (so Back and swiping work)
  function navigate(hash) {
    navIntent = Date.now();
    if (location.hash === hash) return;
    history.pushState(null, '', hash);
    onHashChange();
  }

  function back() {
    navIntent = Date.now();
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
  function syncGlass() {
    var on = document.documentElement.getAttribute('data-glass') !== 'off';
    Array.prototype.forEach.call(document.querySelectorAll('[data-glass-toggle]'), function (b) { b.setAttribute('aria-checked', on ? 'true' : 'false'); });
  }
  function toggleGlass() {
    var on = document.documentElement.getAttribute('data-glass') !== 'off';
    document.documentElement.setAttribute('data-glass', on ? 'off' : 'on');
    try { localStorage.setItem('pp-glass', on ? 'off' : 'on'); } catch (e) {}
    syncGlass();
  }
  // Status bar colour (Android) matches the green band behind the iPhone status bar
  function syncThemeColour() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0F1813' : '#24533A');
  }
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { if (getTheme() === 'auto') applyTheme('auto'); });

  // Before opening day: show the opening date. After: show today's hours.
  function applyOpening(root) {
    var day = PP_CONFIG.openingDay;
    var opened = !day || Date.now() > new Date(day + 'T00:00:00').getTime();
    var stillOpeningDay = day && Date.now() <= new Date(day + 'T23:59:59').getTime();
    Array.prototype.forEach.call(root.querySelectorAll('[data-opening]'), function (n) { if (opened && !stillOpeningDay) n.remove(); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-after-opening]'), function (n) { if (!opened) n.remove(); });
    // On opening day itself show "Today" hours, not the countdown
    if (opened && stillOpeningDay) Array.prototype.forEach.call(root.querySelectorAll('.home-status [data-opening]'), function (n) { n.remove(); });
  }

  // ── Taps anywhere ───────────────────────────
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-book], [data-sheet], [data-theme-set], [data-glass-toggle], .tab, a[href^="#/"]');
    if (!t) return;
    if (t.hasAttribute('data-book')) { e.preventDefault(); go('book'); return; }
    if (t.hasAttribute('data-sheet')) { e.preventDefault(); PPF.openSheet(t.getAttribute('data-sheet')); return; }
    if (t.hasAttribute('data-theme-set')) { applyTheme(t.getAttribute('data-theme-set')); return; }
    if (t.hasAttribute('data-glass-toggle')) { toggleGlass(); return; }
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
    // Open the screen straight away, in this same tap, rather than waiting for the
    // browser to report the address change a moment later
    if (t.matches('a[href^="#/"]') && !e.defaultPrevented && !t.target) {
      e.preventDefault();
      navigate(t.getAttribute('href'));
    }
  });
  backBtn.addEventListener('click', back);

  // Tap the version number 5 times: shows how the app has measured the screen
  // (handy for checking it fits a particular phone).
  var footTaps = 0, footTimer;
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.app-foot') || e.target.closest('a')) return;
    footTaps++; clearTimeout(footTimer); footTimer = setTimeout(function () { footTaps = 0; }, 1500);
    if (footTaps < 5) return;
    footTaps = 0;
    var f = window.PPFit || {}, i = f.insets || {};
    PPUI.sheet({ title: 'Screen check', html: '<div class="group">' +
      PPC.row('Screen', f.screen || '?') + PPC.row('App area', f.viewport || '?') +
      PPC.row('Notch (iOS)', (i.top || 0) + 'pt') + PPC.row('Home bar (iOS)', (i.bottom || 0) + 'pt') +
      PPC.row('Notch used', getComputedStyle(document.documentElement).getPropertyValue('--safe-top-fb').trim() || '0px', { sub: 'Only if iOS reports none' }) + PPC.row('Stretched', f.stretched ? 'Yes' : 'No') + PPC.row('Opened', ((performance.now() / 1000) | 0) + 's ago') +
      PPC.row('Version', PP_CONFIG.version) + '</div>' });
  });

  // ── Tab bar you can slide along ─────────────
  // Press and drag across the bar: a glass highlight follows your finger
  // and opens the tab you let go on (like the iPhone's own tab bars).
  var tabbar = document.getElementById('tabbar'), lens = document.getElementById('tab-lens');
  var suppressClick = 0;
  function tabWidth() { return tabs[0].getBoundingClientRect().width; }
  function placeLens(i, px) {
    if (!lens || !tabs.length) return;
    var x = typeof px === 'number' ? px : tabs[i].offsetLeft;
    lens.style.width = tabWidth() + 'px';
    lens.style.transform = 'translateX(' + x + 'px)';
  }
  function tabIndexAt(clientX) {
    var r = tabbar.getBoundingClientRect(), w = tabWidth(), pad = tabs[0].offsetLeft;
    return Math.max(0, Math.min(tabs.length - 1, Math.floor((clientX - r.left - pad) / w)));
  }
  (function () {
    var startX = null, dragging = false, hoverIndex = -1;
    tabbar.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      startX = e.clientX; dragging = false; hoverIndex = -1;
      // Like the iPhone's own tab bars: switch the moment a finger touches a tab
      if (e.pointerType === 'touch') {
        var t = e.target.closest('.tab');
        if (t) {
          var name = t.getAttribute('data-tab');
          suppressClick = Date.now();
          if (current && currentTab === name) {
            if (ROUTES[current.name].depth > 0) { stack = [name]; location.replace('#/' + name); }
            else current.el.scrollTo({ top: 0, behavior: document.documentElement.getAttribute('data-motion') === 'reduced' ? 'auto' : 'smooth' });
          } else {
            location.hash = '#/' + name;
          }
        }
      }
    });
    tabbar.addEventListener('pointermove', function (e) {
      if (startX === null) return;
      if (!dragging && Math.abs(e.clientX - startX) > 8) {
        dragging = true;
        tabbar.classList.add('is-dragging');
        try { tabbar.setPointerCapture(e.pointerId); } catch (err) {}
      }
      if (!dragging) return;
      var r = tabbar.getBoundingClientRect(), w = tabWidth(), pad = tabs[0].offsetLeft;
      var x = Math.max(pad, Math.min(r.width - pad - w, e.clientX - r.left - w / 2));
      placeLens(0, x);
      var i = tabIndexAt(e.clientX);
      if (i !== hoverIndex) {
        hoverIndex = i;
        Array.prototype.forEach.call(tabs, function (t, k) { t.classList.toggle('is-hover', k === i); });
        if (navigator.vibrate) { try { navigator.vibrate(4); } catch (err) {} }
      }
    });
    function end(e) {
      if (startX === null) return;
      startX = null;
      if (!dragging) return;
      dragging = false;
      tabbar.classList.remove('is-dragging');
      Array.prototype.forEach.call(tabs, function (t) { t.classList.remove('is-hover'); });
      suppressClick = Date.now();
      var i = tabIndexAt(e.clientX);
      var name = tabs[i].getAttribute('data-tab');
      if (current && currentTab === name) {
        Array.prototype.forEach.call(tabs, function (t, k) { if (t.classList.contains('is-active')) placeLens(k); });
      } else {
        location.hash = '#/' + name;
      }
    }
    tabbar.addEventListener('pointerup', end);
    tabbar.addEventListener('pointercancel', function () {
      startX = null; dragging = false; tabbar.classList.remove('is-dragging');
      Array.prototype.forEach.call(tabs, function (t, k) { t.classList.remove('is-hover'); if (t.classList.contains('is-active')) placeLens(k); });
    });
    // A slide shouldn't also count as a tap
    tabbar.addEventListener('click', function (e) { if (Date.now() - suppressClick < 1500) { e.preventDefault(); e.stopPropagation(); } }, true);
    window.addEventListener('resize', function () { Array.prototype.forEach.call(tabs, function (t, k) { if (t.classList.contains('is-active')) placeLens(k); }); });
  })();

  // Swiping back: iPhone home screen apps already have their own swipe-back
  // (it steps back through the app's history), so the app doesn't add a second one;
  // two at once made a swipe go back two screens. When the phone does the swipe,
  // the screen is shown without a second slide on top of the phone's own.
  var navIntent = 0;
  function markIntent() { navIntent = Date.now(); }
  document.addEventListener('click', markIntent, true);
  document.addEventListener('keydown', markIntent, true);
  document.getElementById('tabbar').addEventListener('pointerdown', markIntent, true);

  // Online / offline
  window.addEventListener('offline', function () { PPUI.toast('You\'re offline. Some things won\'t load until you reconnect.'); });
  window.addEventListener('online', function () { PPUI.toast('Back online', 'success'); });

  // ── "Get the app" page ──────────────────────
  // In a normal browser people only see how to add the app to their phone.
  // The full app runs once it's opened from the home screen.
  // Add ?app to the address to see the full app in a browser (for testing).
  function showLanding() {
    var C = PP_CONFIG;
    var landing = document.getElementById('landing');
    document.getElementById('app').hidden = true;
    document.documentElement.classList.add('on-landing');
    document.title = 'Get the Paw Paradise app';
    landing.hidden = false;
    landing.innerHTML =
      '<div class="landing-inner">' +
        '<img class="landing-logo" src="images/logo.png" alt="Paw Paradise Lovedean logo" width="120" height="120" />' +
        '<h1 class="landing-title">Get the Paw Paradise app</h1>' +
        '<div class="landing-card" id="landing-install"></div>' +
        '<p class="landing-foot">Prefer the website? <a href="' + C.website + '">pawparadiselovedean.co.uk</a></p>' +
      '</div>';
    PPF.renderInstall(landing.querySelector('#landing-install'), { hero: false, focus: false });
  }

  // ── Start ───────────────────────────────────
  function start() {
    var installed = document.documentElement.classList.contains('is-installed');
    var forceApp = /[?&]app\b/.test(location.search);
    if (!installed && !forceApp && !PPStaff.isRecovering()) {
      showLanding();
      finishStartup();
      return;
    }
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

    if (/[?&]install\b/.test(location.search) || location.hash === '#/install') {
      setTimeout(function () { PPF.installSheet(); }, 700);
    }
    window.addEventListener('online', function () { if (current && current.name === 'book') loadBooking(current.el); });
    prerenderTabs();
    finishStartup();
  }

  // Build the main tabs in the background so the first tap on each is instant
  function prerenderTabs() {
    // Main tabs first, then the screens they open, so every tap shows its screen straight away
    var queue = ['home', 'gallery', 'more', 'book', 'offers', 'info', 'contact', 'news', 'faq/planning', 'faq/arrival', 'faq/rules', 'faq/health', 'faq/bookings'];
    function next() {
      var name = queue.shift();
      if (!name) return;
      var r = parse('#/' + name);
      if (!cache[r.key] && !ROUTES[r.name].nocache) cache[r.key] = makeScreen(r);
      (window.requestIdleCallback || function (fn) { setTimeout(fn, 120); })(next);
    }
    setTimeout(next, 600);
  }

  function finishStartup() {
    var splash = document.getElementById('splash');
    setTimeout(function () { splash.classList.add('is-gone'); setTimeout(function () { splash.remove(); }, 400); }, 450);
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      // When a new version takes over, reload once so it shows straight away
      // (only in the first few seconds after opening, never while someone is using the app;
      //  otherwise the update simply appears the next time the app is opened)
      var hadController = !!navigator.serviceWorker.controller, reloaded = false, startedAt = Date.now();
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (!hadController || reloaded || Date.now() - startedAt > 4000 || PPUI.hasLayer()) return;
        reloaded = true;
        location.reload();
      });
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(function (reg) {
        // Check for a new version whenever the app comes back to the front
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { startedAt = Date.now(); reg.update().catch(function () {}); } });
      }).catch(function () {});
    }
  }

  start();

  return { go: go, back: back, refresh: refresh, syncThemeColour: syncThemeColour };
})();
