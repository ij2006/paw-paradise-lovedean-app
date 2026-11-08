// ─────────────────────────────────────────────
//  Staff area: sign in, suggestions, gallery photo approval,
//  writing news posts. Same staff login and database rules as
//  the website's admin page. Only accounts with is_admin = true get in.
// ─────────────────────────────────────────────
var PPStaff = (function () {
  var esc = PPUI.esc;
  var recovering = /type=recovery/.test(window.location.hash);
  var CATS = { facilities: 'Field & facilities', booking: 'Booking & sessions', website: 'Website', dogs: 'Dogs & welfare', other: 'Other' };
  var screenEl = null;
  var activeTab = 'suggestions';

  function render(el) {
    screenEl = el;
    el.innerHTML = '<p class="empty" id="st-loading">Checking sign-in…</p><div id="st-view"></div>';
    route();
  }

  function view(html) {
    var v = screenEl.querySelector('#st-view'); var l = screenEl.querySelector('#st-loading'); if (l) l.remove();
    v.innerHTML = html;
    screenEl.dispatchEvent(new Event('scroll'));   // refresh the top bar title
    return v;
  }
  function msgEl(root, id, text, type) { var m = root.querySelector('#' + id); m.textContent = text || ''; m.className = 'form-msg form-msg--' + (type || 'info'); m.hidden = !text; }

  async function route() {
    if (!screenEl) return;
    if (!db) { signInView('Cannot reach the database. Check your internet connection and try again.'); return; }
    if (recovering) { newPasswordView(); return; }
    var s = await db.auth.getSession();
    if (!s.data || !s.data.session) { signInView(); return; }
    var admin = await PPF.getAdmin();
    if (!admin) { notAdminView(); return; }
    dashboard(admin);
  }

  function signInView(errText) {
    var v = view(
      '<h1 class="sr-only">Admin login</h1><p class="group-foot group-foot--top">For the Paw Paradise family only.</p>' +
      '<form class="group form-card form" id="st-signin" novalidate>' +
        '<div class="field"><label for="st-email">Email</label><input type="email" id="st-email" autocomplete="username" inputmode="email" /></div>' +
        '<div class="field"><label for="st-pass">Password</label><input type="password" id="st-pass" autocomplete="current-password" /></div>' +
        '<p class="form-msg" id="st-msg" role="status" hidden></p>' +
        '<button type="submit" class="btn btn-primary btn-block" id="st-signin-btn">Sign in</button>' +
        '<button type="button" class="text-link center-block" id="st-forgot">Forgotten your password?</button>' +
      '</form>');
    if (errText) msgEl(v, 'st-msg', errText, 'error');
    v.querySelector('#st-signin').addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = v.querySelector('#st-email').value.trim(), pass = v.querySelector('#st-pass').value;
      if (!email || !pass) { msgEl(v, 'st-msg', 'Please enter your email and password.', 'error'); return; }
      var btn = v.querySelector('#st-signin-btn'); btn.disabled = true; btn.textContent = 'Signing in…';
      var res = await db.auth.signInWithPassword({ email: email, password: pass });
      btn.disabled = false; btn.textContent = 'Sign in';
      if (res.error) {
        var m = res.error.message || '';
        msgEl(v, 'st-msg', m.indexOf('Invalid login') !== -1 ? 'Incorrect email or password.' : m, 'error');
        return;
      }
      route();
    });
    v.querySelector('#st-forgot').addEventListener('click', async function () {
      var email = v.querySelector('#st-email').value.trim();
      if (!email) { msgEl(v, 'st-msg', 'Type your email above first, then press this again.', 'error'); return; }
      var back = window.location.origin + window.location.pathname;
      var res = await db.auth.resetPasswordForEmail(email, { redirectTo: back });
      msgEl(v, 'st-msg', res.error ? res.error.message : 'If that email has an admin account, a reset link is on its way.', res.error ? 'error' : 'success');
    });
  }

  function newPasswordView() {
    var v = view(
      '<h1 class="inner-title">Choose a new password</h1>' +
      '<form class="group form-card form" id="st-newpass-form" novalidate>' +
        '<div class="field"><label for="st-newpass">New password (at least 8 characters)</label><input type="password" id="st-newpass" autocomplete="new-password" /></div>' +
        '<p class="form-msg" id="st-np-msg" role="status" hidden></p>' +
        '<button type="submit" class="btn btn-primary btn-block">Save password</button>' +
      '</form>');
    v.querySelector('#st-newpass-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      var pw = v.querySelector('#st-newpass').value;
      if (pw.length < 8) { msgEl(v, 'st-np-msg', 'Please use at least 8 characters.', 'error'); return; }
      var res = await db.auth.updateUser({ password: pw });
      if (res.error) { msgEl(v, 'st-np-msg', res.error.message, 'error'); return; }
      msgEl(v, 'st-np-msg', 'Password saved.', 'success');
      recovering = false;
      setTimeout(route, 800);
    });
  }

  function notAdminView() {
    var v = view('<h1 class="inner-title">No admin access</h1><div class="group form-card"><p>This account isn\'t set up as an admin. Admin access is switched on in Supabase.</p><button type="button" class="btn btn-secondary btn-block" id="st-out2">Sign out</button></div>');
    v.querySelector('#st-out2').addEventListener('click', signOut);
  }

  async function signOut() {
    await db.auth.signOut();
    PPUI.toast('Signed out');
    route();
  }

  // ── Staff home: a list ──────────────────────
  function dashboard(admin) {
    var C = PPC;
    var v = view(
      '<h1 class="sr-only">Admin</h1>' +
      C.group('', [C.row('Signed in as ' + esc(admin.name), '', { icon: C.icon('key', 'green'), sub: esc(admin.email) })]) +
      C.group('Inbox', [
        C.cell({ href: '#/staff/suggestions', icon: C.icon('mail', 'green'), title: 'Suggestions', value: '<span id="cnt-sugg"></span>' }),
        C.cell({ href: '#/staff/photos', icon: C.icon('camera', 'green'), title: 'Photos to approve', value: '<span id="cnt-pending"></span>' }),
        C.cell({ href: '#/staff/published', icon: C.icon('camera', 'green'), title: 'Published visitor photos', value: '<span id="cnt-live"></span>' })
      ]) +
      C.group('App', [
        C.row('Installed copies', '<span id="inst-total">…</span>'),
        C.row('Opened in the last 30 days', '<span id="inst-30">…</span>'),
        C.row('Opened in the last 7 days', '<span id="inst-7">…</span>')
      ]) +
            C.group('Notifications', [
        '<div class="cell cell--static" id="push-cell">' + C.icon('bell', 'green') +
          '<span class="cell-main"><span class="cell-title" id="push-label">Notify me on this phone</span><span class="cell-sub" id="push-sub">New suggestions and photos to approve</span></span>' +
          '<button type="button" class="switch" role="switch" aria-checked="false" aria-labelledby="push-label" id="push-switch"><span></span></button></div>'
      ]) +
      C.group('News', [
        C.cell({ attrs: 'id="st-write"', icon: C.icon('news', 'green'), title: 'Write a news post' }),
        C.cell({ href: '#/news', icon: C.icon('news', 'green'), title: 'View news' })
      ]) +
      '<div class="group"><button type="button" class="cell cell--danger" id="st-out"><span class="cell-main"><span class="cell-title">Sign out</span></span></button></div>');
    v.querySelector('#st-out').addEventListener('click', signOut);
    v.querySelector('#st-write').addEventListener('click', function () { PPF.composeSheet(function () { PPApp.refresh('news'); }); });
    loadCounts();
    setupPush(v);
    loadInstalls(v);
  }

  // ── How many people have the app ──
  async function loadInstalls(v) {
    var r = await db.rpc('app_install_stats');
    var set = function (id, val) { var el = v.querySelector(id); if (el) el.textContent = val; };
    if (r.error || !r.data) { ['#inst-total', '#inst-30', '#inst-7'].forEach(function (id) { set(id, '–'); }); return; }
    set('#inst-total', r.data.total + (r.data.total ? ' (' + r.data.iphone + ' iPhone, ' + r.data.android + ' Android)' : ''));
    set('#inst-30', r.data.last30); set('#inst-7', r.data.last7);
  }

  // ── Phone notifications for admins ──
  // Each admin's phone signs up here; Supabase then sends a notification to every
  // signed-up phone when a suggestion or gallery photo comes in.
  function pushSupported() { return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window; }
  function keyBytes(b64) {
    var pad = '='.repeat((4 - b64.length % 4) % 4), raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  async function saveSub(sub) {
    var j = sub.toJSON();
    var r = await db.from('push_subscriptions').upsert({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth }, { onConflict: 'endpoint' });
    return r.error;
  }
  async function setupPush(v) {
    var sw = v.querySelector('#push-switch'), sub0 = v.querySelector('#push-sub');
    if (!sw) return;
    function set(on) { sw.setAttribute('aria-checked', on ? 'true' : 'false'); }
    if (!pushSupported() || !PP_CONFIG.pushPublicKey) {
      sw.disabled = true;
      sub0.textContent = document.documentElement.classList.contains('is-installed')
        ? 'This phone can\'t get notifications (needs iOS 16.4 or later)'
        : 'Open the app from your home screen to turn this on';
      return;
    }
    var reg = await navigator.serviceWorker.ready;
    var existing = await reg.pushManager.getSubscription();
    set(!!existing && Notification.permission === 'granted');
    if (existing && Notification.permission === 'granted') saveSub(existing);   // keep it fresh
    sw.addEventListener('click', async function () {
      sw.disabled = true;
      try {
        var cur = await reg.pushManager.getSubscription();
        if (sw.getAttribute('aria-checked') === 'true') {
          if (cur) { await db.from('push_subscriptions').delete().eq('endpoint', cur.endpoint); await cur.unsubscribe(); }
          set(false); PPUI.toast('Notifications off for this phone');
          return;
        }
        var perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          PPUI.toast('Notifications are blocked. Turn them on in iPhone Settings → Notifications → Paw Paradise.', 'error');
          return;
        }
        cur = cur || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(PP_CONFIG.pushPublicKey) });
        var err = await saveSub(cur);
        if (err) { PPUI.toast('Couldn\'t turn on notifications: ' + err.message, 'error'); await cur.unsubscribe(); return; }
        set(true); PPUI.toast('Notifications on for this phone');
      } catch (e) {
        PPUI.toast('Couldn\'t turn on notifications: ' + (e && e.message ? e.message : e), 'error');
      } finally { sw.disabled = false; }
    });
  }

  async function loadCounts() {
    var s = await db.from('suggestions').select('id');
    var g = await db.from('gallery_submissions').select('approved');
    var set = function (id, n) { var el = document.getElementById(id); if (el) el.textContent = n == null ? '' : String(n); };
    if (s.data) set('cnt-sugg', s.data.length);
    if (g.data) {
      set('cnt-pending', g.data.filter(function (p) { return !p.approved; }).length);
      set('cnt-live', g.data.filter(function (p) { return p.approved; }).length);
    }
  }

  // ── Staff lists: suggestions / photos to approve / published ──
  var SUB_TITLES = { suggestions: 'Suggestions', photos: 'Photos to approve', published: 'Published photos' };
  async function renderSub(el, which, setTitle) {
    setTitle(SUB_TITLES[which] || 'Admin');
    el.innerHTML = '<h1 class="sr-only">' + (SUB_TITLES[which] || 'Admin') + '</h1><div id="st-list"><div class="pad"><div class="skeleton"></div></div></div>';
    if (!db) return;
    var admin = await PPF.getAdmin();
    if (!admin) { el.querySelector('#st-list').innerHTML = '<p class="empty">Please sign in as admin first.</p>'; return; }
    if (which === 'suggestions') return listSuggestions(el);
    return listPhotos(el, which === 'published');
  }

  function chev() { return '<svg class="cell-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

  async function listSuggestions(el) {
    var box = el.querySelector('#st-list');
    var res = await db.from('suggestions').select('id, category, suggestion, name, email, created_at').order('created_at', { ascending: false });
    if (res.error) { box.innerHTML = '<p class="empty">Could not load suggestions: ' + esc(res.error.message) + '</p>'; return; }
    var rows = res.data || [];
    if (!rows.length) { box.innerHTML = '<p class="empty">No suggestions yet.</p>'; return; }
    var yearAgo = Date.now() - 365 * 864e5;
    box.innerHTML = '<div class="group">' + rows.map(function (r, i) {
      var old = new Date(r.created_at).getTime() < yearAgo;
      return '<button type="button" class="cell cell--news" data-i="' + i + '">' +
        '<span class="cell-main"><span class="cell-title">' + esc(CATS[r.category] || r.category || 'Suggestion') + '</span>' +
        '<span class="cell-sub">' + PPUI.fmtDate(r.created_at) + ' · ' + (r.name || r.email ? esc(r.name || r.email) : 'Anonymous') + (old ? ' · over 12 months old' : '') + '</span>' +
        '<span class="cell-excerpt">' + esc(r.suggestion) + '</span></span>' + chev() + '</button>';
    }).join('') + '</div>' +
    '<p class="group-foot">Only admins can see these. Please delete them once dealt with, and anything over 12 months old (our privacy policy says we keep them for up to 12 months).</p>';
    box.querySelector('.group').addEventListener('click', function (e) {
      var b = e.target.closest('[data-i]'); if (!b) return;
      var r = rows[+b.getAttribute('data-i')];
      var s = PPUI.sheet({
        title: esc(CATS[r.category] || r.category || 'Suggestion'),
        html: '<p class="staff-text">' + esc(r.suggestion) + '</p>' +
          '<p class="small muted">' + PPUI.fmtDate(r.created_at, true) + ' · From: ' + (r.name || r.email ? esc(r.name || '') + (r.email ? ' (' + esc(r.email) + ')' : '') : 'Anonymous') + '</p>' +
          '<div class="action-btns">' +
            (r.email ? '<a class="btn btn-primary btn-block" href="mailto:' + esc(r.email) + '?subject=Your%20Paw%20Paradise%20suggestion">Reply by email</a>' : '') +
            '<button type="button" class="btn btn-danger btn-block" data-del>Delete suggestion</button>' +
          '</div>',
        onOpen: function (sheetEl, close) {
          sheetEl.querySelector('[data-del]').addEventListener('click', async function () {
            close();
            if (!(await PPUI.confirm({ title: 'Delete this suggestion for good?', confirmText: 'Delete', danger: true }))) return;
            var d = await db.from('suggestions').delete().eq('id', r.id);
            if (d.error) { PPUI.toast('That did not work: ' + d.error.message, 'error'); return; }
            PPUI.toast('Suggestion deleted'); listSuggestions(el);
          });
        }
      });
    });
  }

  async function listPhotos(el, live) {
    var box = el.querySelector('#st-list');
    var res = await db.from('gallery_submissions').select('id, name, dog, path, approved, created_at').eq('approved', live).order('created_at', { ascending: false });
    if (res.error) { box.innerHTML = '<p class="empty">Could not load photos: ' + esc(res.error.message) + '</p>'; return; }
    var rows = res.data || [];
    if (!rows.length) { box.innerHTML = '<p class="empty">' + (live ? 'No visitor photos published yet.' : 'Nothing waiting. All caught up.') + '</p>'; return; }
    var urls = {};
    if (!live) {
      var signed = await db.storage.from('gallery-pending').createSignedUrls(rows.map(function (p) { return p.path; }), 3600);
      (signed.data || []).forEach(function (s) { if (s.signedUrl) urls[s.path] = s.signedUrl; });
    } else {
      rows.forEach(function (p) { urls[p.path] = db.storage.from('gallery-public').getPublicUrl(p.path).data.publicUrl; });
    }
    box.innerHTML = '<div class="group">' + rows.map(function (p, i) {
      var who = [p.dog, p.name].filter(Boolean).join(' with ') || 'No names given';
      return '<button type="button" class="cell" data-i="' + i + '">' +
        (urls[p.path] ? '<img class="cell-thumb" src="' + esc(urls[p.path]) + '" alt="" loading="lazy" />' : '<span class="cell-thumb"></span>') +
        '<span class="cell-main"><span class="cell-title">' + esc(who) + '</span><span class="cell-sub">' + PPUI.fmtDate(p.created_at) + '</span></span>' + chev() + '</button>';
    }).join('') + '</div>' +
    '<p class="group-foot">' + (live
      ? 'These show in the Gallery under "From our visitors". Delete one if someone asks for it to be removed.'
      : 'Only admins can see these until approved. Please don\'t approve photos showing children\'s faces, car number plates or anything you\'re unsure about.') + '</p>';
    box.querySelector('.group').addEventListener('click', function (e) {
      var b = e.target.closest('[data-i]'); if (!b) return;
      var p = rows[+b.getAttribute('data-i')];
      var who = [p.dog, p.name].filter(Boolean).join(' with ') || 'No names given';
      PPUI.sheet({
        title: esc(who),
        html: (urls[p.path] ? '<img class="staff-big" src="' + esc(urls[p.path]) + '" alt="Submitted photo: ' + esc(who) + '" />' : '<p class="empty">Photo missing</p>') +
          '<p class="small muted center">' + PPUI.fmtDate(p.created_at, true) + '</p>' +
          '<div class="action-btns">' +
            (live ? '' : '<button type="button" class="btn btn-primary btn-block" data-approve>Approve and publish</button>') +
            '<button type="button" class="btn btn-danger btn-block" data-del>Delete photo</button>' +
          '</div>',
        onOpen: function (sheetEl, close) {
          var ap = sheetEl.querySelector('[data-approve]');
          if (ap) ap.addEventListener('click', async function () {
            ap.disabled = true;
            var mv = await db.storage.from('gallery-pending').move(p.path, p.path, { destinationBucket: 'gallery-public' });
            var err = mv.error;
            if (!err) { var up = await db.from('gallery_submissions').update({ approved: true }).eq('id', p.id); err = up.error; }
            if (err) { ap.disabled = false; PPUI.toast('That did not work: ' + err.message, 'error'); return; }
            close(); PPUI.toast('Photo approved', 'success'); PPApp.refresh('gallery'); listPhotos(el, live);
          });
          sheetEl.querySelector('[data-del]').addEventListener('click', async function () {
            close();
            if (!(await PPUI.confirm({ title: 'Delete this photo for good?', confirmText: 'Delete', danger: true }))) return;
            await db.storage.from(live ? 'gallery-public' : 'gallery-pending').remove([p.path]);
            var d = await db.from('gallery_submissions').delete().eq('id', p.id);
            if (d.error) { PPUI.toast('That did not work: ' + d.error.message, 'error'); return; }
            PPUI.toast('Photo deleted'); PPApp.refresh('gallery'); listPhotos(el, live);
          });
        }
      });
    });
  }

  // Keep the "Staff" pill and More row in step with sign-in
  async function syncIndicators() {
    var admin = await PPF.getAdmin().catch(function () { return null; });
    var pill = document.getElementById('staff-pill');
    if (pill) pill.hidden = !admin;
    var label = document.getElementById('staff-row-label');
    if (label) label.textContent = admin ? 'Admin area' : 'Admin login';
    return admin;
  }

  if (db) {
    db.auth.onAuthStateChange(function (event) {
      if (event === 'PASSWORD_RECOVERY') { recovering = true; if (window.PPApp) PPApp.go('staff'); }
      setTimeout(syncIndicators, 0);
    });
  }

  return {
    render: render,
    renderSub: renderSub,
    isRecovering: function () { return recovering; },
    syncIndicators: syncIndicators
  };
})();
