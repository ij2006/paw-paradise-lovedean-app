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

  function view(html) { var v = screenEl.querySelector('#st-view'); var l = screenEl.querySelector('#st-loading'); if (l) l.remove(); v.innerHTML = html; return v; }
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
      '<h1 class="sr-only">Staff login</h1><p class="group-foot group-foot--top">For the Paw Paradise family only.</p>' +
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
      msgEl(v, 'st-msg', res.error ? res.error.message : 'If that email has a staff account, a reset link is on its way.', res.error ? 'error' : 'success');
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
    var v = view('<h1 class="inner-title">No staff access</h1><div class="group form-card"><p>This account isn\'t set up as staff. Staff access is switched on in Supabase.</p><button type="button" class="btn btn-secondary btn-block" id="st-out2">Sign out</button></div>');
    v.querySelector('#st-out2').addEventListener('click', signOut);
  }

  async function signOut() {
    await db.auth.signOut();
    PPUI.toast('Signed out');
    route();
  }

  function dashboard(admin) {
    var v = view(
      '<h1 class="inner-title">Hello, ' + esc(admin.name) + '</h1>' +
      '<div class="staff-actions">' +
        '<button type="button" class="btn btn-primary" id="st-write">Write a news post</button>' +
        '<button type="button" class="btn btn-secondary" id="st-out">Sign out</button>' +
      '</div>' +
      '<div class="segmented segmented--full" role="tablist" aria-label="Staff sections">' +
        '<button type="button" role="tab" id="tab-suggestions" aria-controls="panel-suggestions" data-st-tab="suggestions">Suggestions <span class="badge" id="ad-sugg-count"></span></button>' +
        '<button type="button" role="tab" id="tab-pending" aria-controls="panel-pending" data-st-tab="pending">Photos <span class="badge" id="ad-photos-count"></span></button>' +
        '<button type="button" role="tab" id="tab-live" aria-controls="panel-live" data-st-tab="live">Published <span class="badge" id="ad-live-count"></span></button>' +
      '</div>' +
      '<div role="tabpanel" id="panel-suggestions" aria-labelledby="tab-suggestions">' +
        '<p class="hint">Sent from the website\'s Suggestions page, newest first. Only you can see these. Please delete them once dealt with, and anything older than 12 months (our privacy policy says we keep them for up to 12 months).</p>' +
        '<div id="ad-sugg"></div></div>' +
      '<div role="tabpanel" id="panel-pending" aria-labelledby="tab-pending" hidden>' +
        '<p class="hint">Sent from the Gallery. Only you can see these until you approve them. Please don\'t approve photos showing children\'s faces, car number plates or anything you\'re unsure about.</p>' +
        '<div id="ad-photos" class="staff-photos"></div></div>' +
      '<div role="tabpanel" id="panel-live" aria-labelledby="tab-live" hidden>' +
        '<p class="hint">These show in the Gallery under "From our visitors". Delete one if someone asks for it to be removed.</p>' +
        '<div id="ad-photos-live" class="staff-photos"></div></div>');

    v.querySelector('#st-out').addEventListener('click', signOut);
    v.querySelector('#st-write').addEventListener('click', function () { PPF.composeSheet(function () { PPApp.refresh('news'); }); });
    v.querySelector('.segmented').addEventListener('click', function (e) {
      var b = e.target.closest('[data-st-tab]'); if (b) selectTab(b.getAttribute('data-st-tab'));
    });
    v.addEventListener('click', onAction);
    selectTab(activeTab);
    loadSuggestions();
    loadPhotos();
  }

  function selectTab(name) {
    activeTab = name;
    ['suggestions', 'pending', 'live'].forEach(function (t) {
      var tab = screenEl.querySelector('#tab-' + t), panel = screenEl.querySelector('#panel-' + t);
      if (!tab) return;
      tab.setAttribute('aria-selected', t === name ? 'true' : 'false');
      panel.hidden = t !== name;
    });
  }

  async function loadSuggestions() {
    var box = screenEl.querySelector('#ad-sugg');
    if (!box) return;
    box.innerHTML = '<div class="skeleton"></div>';
    var res = await db.from('suggestions').select('id, category, suggestion, name, email, created_at').order('created_at', { ascending: false });
    if (res.error) { box.innerHTML = '<p class="form-msg form-msg--error">Could not load suggestions: ' + esc(res.error.message) + '</p>'; return; }
    screenEl.querySelector('#ad-sugg-count').textContent = res.data.length || '';
    if (!res.data.length) { box.innerHTML = '<p class="empty">No suggestions yet.</p>'; return; }
    var yearAgo = Date.now() - 365 * 864e5;
    box.innerHTML = res.data.map(function (r) {
      var who = r.name || r.email
        ? esc(r.name || '') + (r.email ? ' <a href="mailto:' + esc(r.email) + '">' + esc(r.email) + '</a>' : '')
        : '<span class="muted">Anonymous</span>';
      var old = new Date(r.created_at).getTime() < yearAgo ? '<span class="tag-old">Over 12 months old</span>' : '';
      return '<div class="group form-card staff-item">' +
        '<div class="staff-item-head"><strong>' + esc(CATS[r.category] || r.category || 'Suggestion') + '</strong><span class="muted small">' + PPUI.fmtDate(r.created_at) + '</span></div>' + old +
        '<p class="staff-text">' + esc(r.suggestion) + '</p>' +
        '<div class="staff-item-foot"><span class="small">From: ' + who + '</span>' +
          '<button type="button" class="btn btn-danger btn-sm" data-act="delete-sugg" data-id="' + r.id + '">Delete</button></div>' +
      '</div>';
    }).join('');
  }

  function photoCard(p, url, live) {
    var who = [p.dog, p.name].filter(Boolean).map(esc).join(' with ') || '<span class="muted">No names given</span>';
    var actions = live
      ? '<button type="button" class="btn btn-danger btn-sm" data-act="delete-photo" data-id="' + p.id + '" data-path="' + esc(p.path) + '" data-live="1">Delete</button>'
      : '<button type="button" class="btn btn-primary btn-sm" data-act="approve-photo" data-id="' + p.id + '" data-path="' + esc(p.path) + '">Approve</button>' +
        '<button type="button" class="btn btn-danger btn-sm" data-act="delete-photo" data-id="' + p.id + '" data-path="' + esc(p.path) + '">Delete</button>';
    return '<div class="group staff-photo">' +
      (url ? '<img src="' + esc(url) + '" alt="Submitted photo' + (p.dog || p.name ? ': ' + esc([p.dog, p.name].filter(Boolean).join(' with ')) : '') + '" loading="lazy" />' : '<div class="photo-missing">Photo missing</div>') +
      '<p>' + who + '</p><p class="muted small">' + PPUI.fmtDate(p.created_at) + '</p>' +
      '<div class="staff-item-foot">' + actions + '</div>' +
    '</div>';
  }

  async function loadPhotos() {
    var box = screenEl.querySelector('#ad-photos'), liveBox = screenEl.querySelector('#ad-photos-live');
    if (!box) return;
    box.innerHTML = '<div class="skeleton"></div>'; liveBox.innerHTML = '';
    var res = await db.from('gallery_submissions').select('id, name, dog, path, approved, created_at').order('created_at', { ascending: false });
    if (res.error) { box.innerHTML = '<p class="form-msg form-msg--error">Could not load gallery photos: ' + esc(res.error.message) + '</p>'; return; }
    var pending = res.data.filter(function (p) { return !p.approved; });
    var live = res.data.filter(function (p) { return p.approved; });
    screenEl.querySelector('#ad-photos-count').textContent = pending.length || '';
    screenEl.querySelector('#ad-live-count').textContent = live.length || '';
    var urls = {};
    if (pending.length) {
      var signed = await db.storage.from('gallery-pending').createSignedUrls(pending.map(function (p) { return p.path; }), 3600);
      (signed.data || []).forEach(function (s) { if (s.signedUrl) urls[s.path] = s.signedUrl; });
    }
    box.innerHTML = pending.length ? pending.map(function (p) { return photoCard(p, urls[p.path], false); }).join('') : '<p class="empty">Nothing waiting. All caught up.</p>';
    liveBox.innerHTML = live.length ? live.map(function (p) { return photoCard(p, db.storage.from('gallery-public').getPublicUrl(p.path).data.publicUrl, true); }).join('') : '<p class="empty">No visitor photos published yet.</p>';
  }

  async function onAction(e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var id = b.getAttribute('data-id'), act = b.getAttribute('data-act');
    if (act === 'approve-photo' || act === 'delete-photo') {
      var path = b.getAttribute('data-path');
      if (act === 'delete-photo' && !(await PPUI.confirm({ title: 'Delete this photo for good?', confirmText: 'Delete', danger: true }))) return;
      b.disabled = true;
      var err = null;
      if (act === 'approve-photo') {
        var mv = await db.storage.from('gallery-pending').move(path, path, { destinationBucket: 'gallery-public' });
        if (mv.error) err = mv.error;
        else { var up = await db.from('gallery_submissions').update({ approved: true }).eq('id', id); err = up.error; }
      } else {
        var bucket = b.getAttribute('data-live') ? 'gallery-public' : 'gallery-pending';
        await db.storage.from(bucket).remove([path]);
        var del = await db.from('gallery_submissions').delete().eq('id', id);
        err = del.error;
      }
      if (err) { b.disabled = false; PPUI.toast('That did not work: ' + err.message, 'error'); return; }
      PPUI.toast(act === 'approve-photo' ? 'Photo approved' : 'Photo deleted', 'success');
      PPApp.refresh('gallery');
      loadPhotos();
      return;
    }
    if (act === 'delete-sugg') {
      if (!(await PPUI.confirm({ title: 'Delete this suggestion for good?', confirmText: 'Delete', danger: true }))) return;
      b.disabled = true;
      var r2 = await db.from('suggestions').delete().eq('id', id);
      if (r2.error) { b.disabled = false; PPUI.toast('That did not work: ' + r2.error.message, 'error'); return; }
      PPUI.toast('Suggestion deleted');
      loadSuggestions();
    }
  }

  // Keep the "Staff" pill and More row in step with sign-in
  async function syncIndicators() {
    var admin = await PPF.getAdmin().catch(function () { return null; });
    var pill = document.getElementById('staff-pill');
    if (pill) pill.hidden = !admin;
    var label = document.getElementById('staff-row-label');
    if (label) label.textContent = admin ? 'Staff area' : 'Staff login';
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
    isRecovering: function () { return recovering; },
    syncIndicators: syncIndicators
  };
})();
