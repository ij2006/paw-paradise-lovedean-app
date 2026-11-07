// ─────────────────────────────────────────────
//  App building blocks: pop-up sheets, confirm, toast,
//  the in-app booking screen, photo viewer, pull to refresh.
// ─────────────────────────────────────────────
var PPUI = (function () {
  var layers = document.getElementById('layers');
  var app = document.getElementById('app');
  var openLayers = [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmtDate(d, long) {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: long ? 'long' : 'short', year: 'numeric' });
  }
  function reducedMotion() { return document.documentElement.getAttribute('data-motion') === 'reduced'; }

  function announce(text) {
    var a = document.getElementById('announcer');
    a.textContent = '';
    setTimeout(function () { a.textContent = text; }, 50);
  }

  var toastTimer;
  function toast(text, type) {
    var t = document.getElementById('toast');
    t.textContent = text;
    t.className = 'toast' + (type ? ' toast--' + type : '');
    t.hidden = false;
    requestAnimationFrame(function () { t.classList.add('is-on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove('is-on');
      setTimeout(function () { t.hidden = true; }, 300);
    }, 3200);
  }

  // ── Layers (sheets, booking, viewer) share focus handling ──
  function pushLayer(el, onClose) {
    var record = { el: el, onClose: onClose, lastFocus: document.activeElement };
    openLayers.push(record);
    app.setAttribute('inert', '');
    app.setAttribute('aria-hidden', 'true');
    openLayers.forEach(function (r) { if (r !== record) { r.el.setAttribute('inert', ''); } });
    document.documentElement.classList.add('has-layer');
    return record;
  }
  function popLayer(record) {
    var i = openLayers.indexOf(record);
    if (i === -1) return;
    openLayers.splice(i, 1);
    var top = openLayers[openLayers.length - 1];
    if (top) top.el.removeAttribute('inert');
    else {
      app.removeAttribute('inert');
      app.removeAttribute('aria-hidden');
      document.documentElement.classList.remove('has-layer');
    }
    if (record.lastFocus && document.contains(record.lastFocus)) {
      try { record.lastFocus.focus({ preventScroll: true }); } catch (e) {}
    }
  }
  function closeTop() {
    var top = openLayers[openLayers.length - 1];
    if (top && top.onClose) top.onClose();
    return !!top;
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openLayers.length) { e.preventDefault(); closeTop(); }
    if (e.key === 'Tab' && openLayers.length) trapFocus(e, openLayers[openLayers.length - 1].el);
  });
  function trapFocus(e, root) {
    var f = Array.prototype.filter.call(root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select, textarea, iframe, video[controls], [tabindex="0"]'),
      function (n) { return n.offsetParent !== null || n.tagName === 'IFRAME'; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ── Bottom sheet ────────────────────────────
  var sheetCount = 0;
  function sheet(opts) {
    var id = 'sheet-' + (++sheetCount);
    var wrap = document.createElement('div');
    wrap.className = 'sheet-wrap';
    wrap.innerHTML =
      '<div class="sheet-backdrop" data-close></div>' +
      '<div class="sheet' + (opts.tall ? ' sheet--tall' : '') + '" role="dialog" aria-modal="true" aria-labelledby="' + id + '-title">' +
        '<div class="sheet-grab" aria-hidden="true"><span></span></div>' +
        '<div class="sheet-head">' +
          '<h2 class="sheet-title" id="' + id + '-title">' + opts.title + '</h2>' +
          '<button type="button" class="sheet-x" data-close aria-label="Close">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="sheet-body">' + (opts.html || '') + '</div>' +
        (opts.footer ? '<div class="sheet-foot">' + opts.footer + '</div>' : '') +
      '</div>';
    layers.appendChild(wrap);
    var panel = wrap.querySelector('.sheet');
    var closed = false;
    var record;

    function close(result) {
      if (closed) return;
      closed = true;
      wrap.classList.remove('is-open');
      popLayer(record);
      setTimeout(function () { wrap.remove(); }, reducedMotion() ? 0 : 320);
      if (opts.onClose) opts.onClose(result);
    }
    record = pushLayer(wrap, function () { close(); });

    wrap.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });

    // Drag down on the handle or header to close
    var startY = null, dy = 0;
    var dragZone = wrap.querySelectorAll('.sheet-grab, .sheet-head');
    Array.prototype.forEach.call(dragZone, function (z) {
      z.addEventListener('touchstart', function (e) { startY = e.touches[0].clientY; dy = 0; panel.style.transition = 'none'; }, { passive: true });
    });
    wrap.addEventListener('touchmove', function (e) {
      if (startY === null) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      panel.style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    wrap.addEventListener('touchend', function () {
      if (startY === null) return;
      startY = null;
      panel.style.transition = '';
      panel.style.transform = '';
      if (dy > 110) close();
    });

    requestAnimationFrame(function () {
      wrap.classList.add('is-open');
      var first = panel.querySelector('[autofocus]') || panel.querySelector('.sheet-x');
      if (first) first.focus({ preventScroll: true });
    });
    if (opts.onOpen) opts.onOpen(panel, close);
    return { el: panel, close: close };
  }

  // ── Confirm (action sheet) ──────────────────
  function confirm(opts) {
    return new Promise(function (resolve) {
      var answered = false;
      var s = sheet({
        title: opts.title,
        html: (opts.message ? '<p>' + esc(opts.message) + '</p>' : '') +
          '<div class="action-btns">' +
            '<button type="button" class="btn ' + (opts.danger ? 'btn-danger' : 'btn-primary') + ' btn-block" data-yes>' + esc(opts.confirmText || 'OK') + '</button>' +
            '<button type="button" class="btn btn-secondary btn-block" data-close>Cancel</button>' +
          '</div>',
        onClose: function () { if (!answered) resolve(false); }
      });
      s.el.querySelector('[data-yes]').addEventListener('click', function () { answered = true; resolve(true); s.close(); });
    });
  }

  // ── In-app booking (Acuity) ─────────────────
  function booking(key) {
    var url = PP_CONFIG.acuity[key] || PP_CONFIG.acuity.all;
    var titles = { standard: '1-4 dogs · £12', large: '5-8 dogs · £15', all: 'Book a session' };
    var wrap = document.createElement('div');
    wrap.className = 'fullscreen booking';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'booking-title');
    wrap.innerHTML =
      '<div class="fs-bar">' +
        '<button type="button" class="fs-btn" data-close>Done</button>' +
        '<h2 class="fs-title" id="booking-title">' + titles[key] + '</h2>' +
        '<a class="fs-btn fs-btn--right" href="' + esc(url) + '" target="_blank" rel="noopener" aria-label="Open booking in your browser">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</a>' +
      '</div>' +
      '<div class="booking-frame">' +
        '<div class="booking-loading" id="booking-loading"><span class="spinner" aria-hidden="true"></span><p>Loading the booking calendar…</p></div>' +
        '<iframe title="Paw Paradise booking calendar" src="' + esc(url) + '" allow="payment" referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
      '</div>' +
      '<div class="booking-help">Booking not loading, or trouble paying? <a href="' + esc(url) + '" target="_blank" rel="noopener">Open in browser instead</a></div>';
    layers.appendChild(wrap);
    var frame = wrap.querySelector('iframe');
    var loading = wrap.querySelector('#booking-loading');
    frame.addEventListener('load', function () { loading.hidden = true; });
    // If the calendar is slow (or blocked), make the browser option obvious
    var slow = setTimeout(function () { wrap.classList.add('is-slow'); }, 8000);

    var closed = false, record;
    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(slow);
      wrap.classList.remove('is-open');
      popLayer(record);
      setTimeout(function () { wrap.remove(); }, reducedMotion() ? 0 : 320);
    }
    record = pushLayer(wrap, close);
    wrap.querySelector('[data-close]').addEventListener('click', close);
    requestAnimationFrame(function () {
      wrap.classList.add('is-open');
      wrap.querySelector('[data-close]').focus({ preventScroll: true });
    });
    announce('Booking opened');
  }

  // ── Photo & video viewer ────────────────────
  function viewer(items, start) {
    var wrap = document.createElement('div');
    wrap.className = 'fullscreen viewer';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'Photo viewer');
    wrap.innerHTML =
      '<div class="viewer-bar">' +
        '<span class="viewer-count" aria-live="polite"></span>' +
        '<button type="button" class="viewer-x" data-close aria-label="Close viewer">' +
          '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="viewer-track" tabindex="0" aria-label="Swipe left or right, or use the arrow keys">' +
        items.map(function (it, i) {
          var media = it.video
            ? '<video controls playsinline preload="none" poster="' + esc(it.poster) + '"' + (it.muted ? ' muted' : '') + '><source src="' + esc(it.video) + '" type="video/mp4" /></video>'
            : '<img src="' + esc(it.src) + '" alt="' + esc(it.alt) + '" ' + (Math.abs(i - start) > 1 ? 'loading="lazy"' : '') + ' />';
          return '<figure class="viewer-slide">' + media + (it.caption ? '<figcaption>' + esc(it.caption) + '</figcaption>' : '') + '</figure>';
        }).join('') +
      '</div>' +
      '<button type="button" class="viewer-nav viewer-prev" aria-label="Previous">‹</button>' +
      '<button type="button" class="viewer-nav viewer-next" aria-label="Next">›</button>';
    layers.appendChild(wrap);
    var track = wrap.querySelector('.viewer-track');
    var count = wrap.querySelector('.viewer-count');
    var current = start;

    function update() {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== current) {
        Array.prototype.forEach.call(track.querySelectorAll('video'), function (v) { v.pause(); });
        current = i;
      }
      count.textContent = (current + 1) + ' of ' + items.length;
    }
    function go(i) {
      i = Math.max(0, Math.min(items.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    wrap.querySelector('.viewer-prev').addEventListener('click', function () { go(current - 1); });
    wrap.querySelector('.viewer-next').addEventListener('click', function () { go(current + 1); });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    });

    var closed = false, record;
    function close() {
      if (closed) return;
      closed = true;
      Array.prototype.forEach.call(track.querySelectorAll('video'), function (v) { v.pause(); });
      wrap.classList.remove('is-open');
      popLayer(record);
      setTimeout(function () { wrap.remove(); }, reducedMotion() ? 0 : 250);
    }
    record = pushLayer(wrap, close);
    wrap.querySelector('[data-close]').addEventListener('click', close);
    requestAnimationFrame(function () {
      track.scrollLeft = start * track.clientWidth;
      update();
      wrap.classList.add('is-open');
      wrap.querySelector('[data-close]').focus({ preventScroll: true });
    });
  }

  // ── Pull to refresh ─────────────────────────
  function pullToRefresh(scroller, onRefresh) {
    var ind = document.createElement('div');
    ind.className = 'ptr';
    ind.setAttribute('aria-hidden', 'true');
    ind.innerHTML = '<span class="spinner"></span>';
    scroller.insertBefore(ind, scroller.firstChild);
    var startY = null, dy = 0, busy = false;
    scroller.addEventListener('touchstart', function (e) {
      if (busy || scroller.scrollTop > 0) { startY = null; return; }
      startY = e.touches[0].clientY; dy = 0;
    }, { passive: true });
    scroller.addEventListener('touchmove', function (e) {
      if (startY === null) return;
      dy = e.touches[0].clientY - startY;
      if (dy <= 0) { ind.style.height = '0px'; return; }
      var h = Math.min(90, dy * 0.5);
      ind.style.height = h + 'px';
      ind.classList.toggle('is-ready', h >= 60);
    }, { passive: true });
    scroller.addEventListener('touchend', function () {
      if (startY === null) return;
      startY = null;
      if (ind.classList.contains('is-ready')) {
        busy = true;
        ind.classList.add('is-busy');
        ind.style.height = '56px';
        Promise.resolve(onRefresh()).catch(function () {}).then(function () {
          busy = false;
          ind.classList.remove('is-busy', 'is-ready');
          ind.style.height = '0px';
        });
      } else {
        ind.style.height = '0px';
      }
    });
  }

  return {
    esc: esc, fmtDate: fmtDate, announce: announce, toast: toast,
    sheet: sheet, confirm: confirm, booking: booking, viewer: viewer,
    pullToRefresh: pullToRefresh, closeTop: closeTop,
    hasLayer: function () { return openLayers.length > 0; }
  };
})();
