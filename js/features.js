// ─────────────────────────────────────────────
//  Features that talk to Supabase (same database as the website)
//  plus the pop-ups: gallery, photo sharing, news, privacy/terms,
//  accessibility, add-to-phone help.
// ─────────────────────────────────────────────
var db = (window.supabase && PP_CONFIG.supabaseUrl)
  ? window.supabase.createClient(PP_CONFIG.supabaseUrl, PP_CONFIG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'pp-app-auth' }
    })
  : null;

var PPF = (function () {
  var esc = PPUI.esc;
  var OFFLINE_MSG = 'You\'re offline. Connect to the internet and try again.';
  function offline() { return navigator.onLine === false; }

  // Returns the signed-in staff profile, or null
  async function getAdmin() {
    if (!db) return null;
    var s = await db.auth.getSession();
    var user = s.data && s.data.session && s.data.session.user;
    if (!user) return null;
    var res = await db.from('profiles').select('full_name, is_admin').eq('id', user.id).single();
    if (res.error || !res.data || !res.data.is_admin) return null;
    return { id: user.id, email: user.email, name: res.data.full_name || user.email.split('@')[0] };
  }

  // ── GALLERY ─────────────────────────────────
  var GALLERY = [
    { src: 'aerial-view.jpg', alt: 'Aerial view of the whole dog field surrounded by woodland', big: true },
    { video: 'weave-poles', alt: 'Video: the weave poles in the field', muted: true },
    { video: 'grassy-mound', alt: 'Video: the grassy mound', muted: true },
    { video: 'field-walk', alt: 'Video: a walk across the field', muted: true },
    { src: 'tree-stump-ring.jpg', alt: 'A ring of tree stumps for dogs to climb and explore' },
    { src: 'mound-and-tunnel.jpg', alt: 'Golden retriever standing on the grassy mound above the dog tunnel' },
    { video: 'fence-ramp', alt: 'Video: the ramp by the fence', muted: true },
    { src: 'log-balance.jpg', alt: 'Golden retriever balancing on a fallen log in the field' },
    { video: 'bono-testing-equipment', alt: 'Video: Bono testing out the new log equipment' },
    { video: 'building-play-equipment', alt: 'Video: making progress on building the play equipment' },
    { video: 'car-park-update', alt: 'Video: the parking area taking shape' },
    { video: 'and-were-off', alt: 'Video: and we\'re off' },
    { src: 'field-shelter.jpg', alt: 'The wooden field shelter inside the fenced field', big: true },
    { src: 'double-gate.jpg', alt: 'The secure double-gated entrance into the field' },
    { video: 'bono-tunnel', alt: 'Video: Bono approves of the tunnel' },
    { video: 'faq-video', alt: 'Video: Paw Paradise FAQs' },
    { src: 'paw-paradise.jpg', alt: 'Paw Paradise Lovedean' },
    { video: 'day-3-progress', alt: 'Video: day 3 progress' }
  ].map(function (g) {
    var base = 'images/gallery/', thumbs = 'images/gallery/thumbs/';
    return g.video
      ? { video: base + g.video + '.mp4', poster: base + g.video + '-poster.jpg', thumb: thumbs + g.video + '.jpg', alt: g.alt, muted: g.muted, big: g.big }
      : { src: base + g.src, thumb: thumbs + g.src, alt: g.alt, big: g.big };
  });

  function tile(it, i, group, cls) {
    return '<button type="button" class="tile' + (cls ? ' ' + cls : '') + (it.video ? ' tile--video' : '') + '" data-view="' + group + '" data-index="' + i + '" aria-label="' + esc(it.alt) + (it.video ? ' (plays video)' : '') + '">' +
      '<img src="' + esc(it.thumb) + '" alt="" loading="lazy" decoding="async" />' +
      (it.video ? '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>' : '') +
    '</button>';
  }

  // Gallery: share card at the top, then Photos / Videos / Visitors to switch between
  var visitorItems = [];
  var PHOTOS = [], VIDEOS = [];
  GALLERY.forEach(function (it, i) { (it.video ? VIDEOS : PHOTOS).push(i); });
  function gallery(el) {
    el.innerHTML = PPC.galleryHead +
      PPC.galleryShare() +
      '<div class="gallery-tabs segmented" role="tablist" aria-label="Show">' +
        '<button type="button" role="tab" aria-selected="true" data-gtab="all">All</button>' +
        '<button type="button" role="tab" aria-selected="false" data-gtab="photos">Photos</button>' +
        '<button type="button" role="tab" aria-selected="false" data-gtab="videos">Videos</button>' +
        '<button type="button" role="tab" aria-selected="false" data-gtab="visitors" id="gtab-visitors" hidden>Yours</button>' +
      '</div>' +
      '<div class="mosaic" id="mosaic"></div>';
    var mosaic = el.querySelector('#mosaic'), which = 'all';
    function draw() {
      var html;
      if (which === 'visitors') {
        html = visitorItems.map(function (it, i) { return tile(it, i, 'visitors'); }).join('');
      } else if (which === 'all') {
        // Our photos and videos, then visitors' photos under their own small title
        html = '<div class="mosaic-grid">' + GALLERY.map(function (it, n) { return tile(it, n, 'all', n % 7 === 0 ? 'tile--wide' : ''); }).join('') + '</div>' +
          (visitorItems.length ? '<h2 class="mosaic-title">Your photos</h2><div class="mosaic-grid">' +
            visitorItems.map(function (it, n) { return tile(it, GALLERY.length + n, 'all'); }).join('') + '</div>' : '');
        mosaic.innerHTML = html;
        return;
      } else {
        var list = which === 'photos' ? PHOTOS : which === 'videos' ? VIDEOS : GALLERY.map(function (_, i) { return i; });
        html = list.map(function (gi, n) { return tile(GALLERY[gi], gi, 'main', n % 7 === 0 ? 'tile--wide' : ''); }).join('');
      }
      mosaic.innerHTML = html ? '<div class="mosaic-grid">' + html + '</div>' : '<p class="empty">Nothing here yet.</p>';
    }
    draw();
    el.querySelector('.gallery-tabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-gtab]');
      if (!b) return;
      which = b.getAttribute('data-gtab');
      Array.prototype.forEach.call(el.querySelectorAll('[data-gtab]'), function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      draw();
    });
    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-view]');
      if (!t) return;
      var v = t.getAttribute('data-view');
      var items = v === 'main' ? GALLERY : v === 'all' ? GALLERY.concat(visitorItems) : visitorItems;
      PPUI.viewer(items, +t.getAttribute('data-index'));
    });
    el._drawGallery = function () { if (which === 'visitors' || which === 'all') draw(); };
    loadVisitorPhotos(el);
    PPUI.pullToRefresh(el, function () { return loadVisitorPhotos(el); });
  }

  async function loadVisitorPhotos(el) {
    if (!db) return;
    var res = await db.from('gallery_submissions').select('name, dog, path, created_at').eq('approved', true).order('created_at', { ascending: false });
    if (res.error || !res.data) return;
    visitorItems = res.data.map(function (p) {
      var url = db.storage.from('gallery-public').getPublicUrl(p.path).data.publicUrl;
      var who = [p.dog, p.name].filter(Boolean).join(' with ');
      return { src: url, thumb: url, alt: who ? 'Visitor photo: ' + who : 'Visitor photo from the field' };
    });
    var vt = el.querySelector('#gtab-visitors');
    if (vt) vt.hidden = !visitorItems.length;
    if (el._drawGallery) el._drawGallery();
  }

  // ── SHARE PHOTOS (same rules as the website) ──
  var MAX_FILES = 3, MAX_SIDE = 1600, QUALITY = 0.82;
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { resolve({ img: img, url: url }); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('unreadable')); };
      img.src = url;
    });
  }
  async function shrink(file) {
    var loaded = await loadImage(file);
    var img = loaded.img, w = img.naturalWidth, h = img.naturalHeight;
    var scale = Math.min(1, MAX_SIDE / Math.max(w, h));
    var canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(loaded.url);
    // Redrawing leaves out the camera's hidden data, including GPS location
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (b) { b ? resolve(b) : reject(new Error('convert')); }, 'image/jpeg', QUALITY);
    });
  }

  function sharePhotosSheet() {
    var chosen = [];
    PPUI.sheet({
      title: 'Send your photos',
      tall: true,
      html:
        '<p>Send us up to 3 photos from your visit. We check every photo before it goes on the website.</p>' +
        '<form class="form" id="gs-form" novalidate>' +
          '<div class="field"><span class="label" id="gs-files-label">Your photos (up to 3)</span>' +
            '<label class="photo-pick" for="gs-files"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/></svg> Choose photos</label>' +
            '<input type="file" id="gs-files" accept="image/*" multiple class="visually-hidden-input" aria-labelledby="gs-files-label" />' +
            '<p class="field-hint" id="gs-count" aria-live="polite"></p>' +
            '<div class="gs-preview" id="gs-preview"></div></div>' +
          '<div class="field"><label for="gs-name">Your name <span class="opt">(optional)</span></label><input type="text" id="gs-name" maxlength="40" autocomplete="given-name" /></div>' +
          '<div class="field"><label for="gs-dog">Dog\'s name <span class="opt">(optional)</span></label><input type="text" id="gs-dog" maxlength="60" /></div>' +
          '<p class="field-hint">If you add names, they show under your photo.</p>' +
          '<div class="hp-field" aria-hidden="true"><label for="gs-website">Leave this empty</label><input type="text" id="gs-website" tabindex="-1" autocomplete="off" /></div>' +
          '<label class="check" for="gs-consent"><input type="checkbox" id="gs-consent" /><span>These are my photos and I\'m happy for Paw Paradise to show them on the website and social media. Anyone else in them is happy for them to be shared.</span></label>' +
          '<p class="form-msg" id="gs-msg" role="status" hidden></p>' +
          '<button type="submit" class="btn btn-primary btn-block" id="gs-submit">Send photos</button>' +
          '<p class="small center"><button type="button" class="text-link" data-sheet="privacy">Privacy Policy</button></p>' +
        '</form>',
      onOpen: function (el) {
        var $ = function (id) { return el.querySelector('#' + id); };
        function showMsg(text, type) { var m = $('gs-msg'); m.textContent = text; m.className = 'form-msg form-msg--' + type; m.hidden = false; }
        function render() {
          var box = $('gs-preview'); box.innerHTML = '';
          chosen.forEach(function (f, i) {
            var wrap = document.createElement('div'); wrap.className = 'gs-thumb';
            var img = document.createElement('img'); var url = URL.createObjectURL(f);
            img.src = url; img.alt = ''; img.onload = function () { URL.revokeObjectURL(url); };
            var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'gs-remove';
            rm.setAttribute('aria-label', 'Remove photo ' + (i + 1)); rm.textContent = '×';
            rm.addEventListener('click', function () { chosen.splice(i, 1); render(); });
            wrap.appendChild(img); wrap.appendChild(rm); box.appendChild(wrap);
          });
          $('gs-count').textContent = chosen.length ? chosen.length + ' of ' + MAX_FILES + ' chosen' + (chosen.length < MAX_FILES ? '. Tap again to add more.' : '.') : '';
        }
        $('gs-files').addEventListener('change', function () {
          var input = $('gs-files');
          var picked = Array.prototype.slice.call(input.files || []);
          input.value = '';
          $('gs-msg').hidden = true;
          var room = MAX_FILES - chosen.length;
          if (picked.length > room) {
            if (room <= 0) showMsg('You\'ve already chosen ' + MAX_FILES + ' photos, the most you can send at once. Remove one to add another.', 'error');
            else showMsg('You can send up to ' + MAX_FILES + ' photos at a time, so only ' + room + ' more ' + (room === 1 ? 'was' : 'were') + ' added.', 'error');
            picked = picked.slice(0, Math.max(room, 0));
          }
          chosen = chosen.concat(picked);
          render();
        });
        $('gs-form').addEventListener('submit', async function (e) {
          e.preventDefault();
          var btn = $('gs-submit');
          var files = chosen.slice();
          var name = $('gs-name').value.trim().slice(0, 40);
          var dog = $('gs-dog').value.trim().slice(0, 60);
          if (!files.length) { showMsg('Please choose at least one photo.', 'error'); return; }
          if (!$('gs-consent').checked) { showMsg('Please tick the box to confirm we can show your photos.', 'error'); $('gs-consent').focus(); return; }
          if ($('gs-website').value) { showMsg('Thank you! We\'ll take a look and add your photos to the gallery soon.', 'success'); return; }
          if (offline()) { showMsg(OFFLINE_MSG, 'error'); return; }
          if (!db) { showMsg('Connection error. Please close the app and try again.', 'error'); return; }
          btn.disabled = true;
          var sent = 0, failed = 0, unreadable = 0;
          for (var i = 0; i < files.length; i++) {
            btn.textContent = 'Sending photo ' + (i + 1) + ' of ' + files.length + '…';
            var blob;
            try { blob = await shrink(files[i]); } catch (err) { unreadable++; continue; }
            var path = uuid() + '.jpg';
            var up = await db.storage.from('gallery-pending').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
            if (up.error) { console.error(up.error); failed++; continue; }
            var row = await db.from('gallery_submissions').insert({ name: name || null, dog: dog || null, path: path, consent: true });
            if (row.error) { console.error(row.error); failed++; continue; }
            sent++;
          }
          btn.disabled = false; btn.textContent = 'Send photos';
          if (sent && !failed && !unreadable) {
            showMsg('Thank you! We\'ll take a look and add your ' + (sent === 1 ? 'photo' : 'photos') + ' to the gallery soon.', 'success');
            $('gs-name').value = ''; $('gs-dog').value = ''; $('gs-consent').checked = false;
            chosen = []; render();
          } else if (sent) {
            showMsg(sent + ' sent, but ' + (failed + unreadable) + ' didn\'t go through. ' + (unreadable ? 'Try a JPEG or PNG photo, or ' : 'Please try again, or ') + 'email it to us.', 'error');
          } else if (unreadable && !failed) {
            showMsg('We couldn\'t read that photo. Please try a JPEG or PNG, or email it to us.', 'error');
          } else {
            showMsg('Something went wrong. Please try again, or email your photos to ' + PP_CONFIG.email + '.', 'error');
          }
        });
      }
    });
  }

  // ── NEWS (blog posts) ───────────────────────
  var posts = [];
  function formatBody(t) {
    return '<p>' + esc(t).replace(/\r?\n\r?\n/g, '</p><p>').replace(/\r?\n/g, '<br>') + '</p>';
  }
  function news(el) {
    el.innerHTML = PPC.newsHead +
      '<div class="group" id="news-write-group" hidden>' + PPC.cell({ attrs: 'id="news-write"', icon: PPC.icon('news', 'amber'), title: 'Write a post' }) + '</div>' +
      '<div id="news-list"></div>';
    el.querySelector('#news-write').addEventListener('click', function () { composeSheet(function () { loadNews(el); }); });
    loadNews(el);
    PPUI.pullToRefresh(el, function () { return loadNews(el); });
  }
  async function loadNews(el) {
    var list = el.querySelector('#news-list');
    if (!posts.length) list.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div>';
    getAdmin().then(function (a) { el.querySelector('#news-write-group').hidden = !a; });
    if (!db) { list.innerHTML = '<p class="empty">Unable to load news. Please close the app and try again.</p>'; return; }
    // No signal: skip the request (it would retry for several seconds) and show saved news straight away
    var res = offline() ? { error: true } : await db.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false });
    var note = '';
    if (res.error || !res.data) {
      var saved = null;
      try { saved = JSON.parse(localStorage.getItem('pp-news-saved') || 'null'); } catch (e) {}
      if (!saved || !saved.length) {
        list.innerHTML = '<p class="empty">' + (offline() ? 'You\'re offline. News will load when you\'re back online.' : 'Couldn\'t load news. Pull down to try again.') + '</p>';
        return;
      }
      posts = saved;
      note = '<p class="form-msg form-msg--info">' + (offline() ? 'You\'re offline, so this is the news from your last visit.' : 'Showing saved news. Pull down to refresh.') + '</p>';
    } else {
      posts = res.data;
      try { localStorage.setItem('pp-news-saved', JSON.stringify(posts.slice(0, 20))); } catch (e) {}
    }
    if (!posts.length) { list.innerHTML = '<p class="empty">No news yet. Check back soon.</p>'; return; }
    list.innerHTML = note + '<div class="group">' + posts.map(function (p) {
      return '<a class="cell cell--news" href="#/news/' + p.id + '">' +
        '<span class="cell-main"><span class="cell-title">' + esc(p.title) + '</span>' +
          '<span class="cell-sub">' + PPUI.fmtDate(p.created_at, true) + ' · ' + esc(p.author_name || 'Paw Paradise') + '</span>' +
          (p.excerpt ? '<span class="cell-excerpt">' + esc(p.excerpt) + '</span>' : '') +
        '</span>' +
        '<svg class="cell-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</a>';
    }).join('') + '</div>';
  }
  async function newsPost(el, id, setTitle) {
    var p = posts.filter(function (x) { return String(x.id) === String(id); })[0];
    if (!p && db) {
      el.innerHTML = '<div class="pad"><div class="skeleton"></div></div>';
      var res = await db.from('blog_posts').select('*').eq('id', id).eq('published', true).maybeSingle();
      p = res.data;
    }
    if (!p) { el.innerHTML = '<h1 class="sr-only">News</h1><p class="empty">This post isn\'t available.</p>'; return; }
    setTitle(p.title);
    el.innerHTML = '<article class="post">' +
      '<div class="news-meta"><span class="avatar" aria-hidden="true">' + esc((p.author_name || 'P').charAt(0).toUpperCase()) + '</span>' +
        '<span><strong>' + esc(p.author_name || 'Paw Paradise') + '</strong><span>' + PPUI.fmtDate(p.created_at, true) + '</span></span></div>' +
      '<h1 class="post-title">' + esc(p.title) + '</h1>' +
      (p.excerpt ? '<p class="lead">' + esc(p.excerpt) + '</p>' : '') +
      '<div class="post-body">' + formatBody(p.body || '') + '</div>' +
      '<button type="button" class="btn btn-danger btn-block" id="post-delete" hidden>Delete this post</button>' +
    '</article>';
    getAdmin().then(function (a) {
      var b = el.querySelector('#post-delete');
      if (!a || !b) return;
      b.hidden = false;
      b.addEventListener('click', async function () {
        var ok = await PPUI.confirm({ title: 'Delete this post?', message: 'This cannot be undone.', confirmText: 'Delete', danger: true });
        if (!ok) return;
        var r = await db.from('blog_posts').delete().eq('id', p.id);
        if (r.error) { PPUI.toast('That did not work: ' + r.error.message, 'error'); return; }
        posts = posts.filter(function (x) { return x.id !== p.id; });
        PPUI.toast('Post deleted');
        PPApp.refresh('news');
        history.back();
      });
    });
  }

  async function composeSheet(onDone) {
    var admin = await getAdmin();
    if (!admin) { PPUI.toast('Please sign in as admin first.', 'error'); return; }
    PPUI.sheet({
      title: 'Write a post',
      tall: true,
      html:
        '<form class="form" id="post-form" novalidate>' +
          '<div class="field"><label for="post-author">Your name</label><input type="text" id="post-author" autocomplete="off" placeholder="Leave blank to post as Paw Paradise" /></div>' +
          '<div class="field"><label for="post-title">Title</label><input type="text" id="post-title" autocomplete="off" placeholder="Post title" /></div>' +
          '<div class="field"><label for="post-excerpt">Short teaser <span class="opt">(optional, shown on the news list)</span></label><textarea id="post-excerpt" rows="2" placeholder="A sentence or two to draw people in…"></textarea></div>' +
          '<div class="field"><label for="post-body">Post</label><textarea id="post-body" rows="9" placeholder="Write your post here. Leave a blank line between paragraphs."></textarea><span class="field-hint">Blank lines become paragraph breaks. No other formatting needed.</span></div>' +
          '<p class="form-msg" id="post-msg" role="status" hidden></p>' +
          '<button type="submit" class="btn btn-primary btn-block" id="post-publish">Publish post</button>' +
        '</form>',
      onOpen: function (el, close) {
        var $ = function (id) { return el.querySelector('#' + id); };
        function msg(t, type) { var m = $('post-msg'); m.textContent = t; m.className = 'form-msg form-msg--' + type; m.hidden = !t; }
        $('post-form').addEventListener('submit', async function (e) {
          e.preventDefault();
          var title = $('post-title').value.trim(), body = $('post-body').value.trim();
          if (!title) { msg('Please add a title.', 'error'); return; }
          if (!body) { msg('Please write something in the post body.', 'error'); return; }
          if (offline()) { msg(OFFLINE_MSG, 'error'); return; }
          var btn = $('post-publish'); btn.disabled = true; btn.textContent = 'Publishing…';
          var res = await db.from('blog_posts').insert({
            author_id: admin.id, author_name: $('post-author').value.trim() || 'Paw Paradise',
            title: title, excerpt: $('post-excerpt').value.trim() || null, body: body, published: true
          });
          btn.disabled = false; btn.textContent = 'Publish post';
          if (res.error) { msg('Could not publish: ' + res.error.message, 'error'); return; }
          close();
          PPUI.toast('Post published', 'success');
          if (onDone) onDone();
        });
      }
    });
  }

  // ── HOME extras: photo strip + latest news ──
  function homeExtras(el) {
    var strip = el.querySelector('#home-strip');
    if (strip) {
      var picks = [0, 4, 5, 12, 13, 7];
      strip.innerHTML = picks.map(function (i) {
        var it = GALLERY[i];
        return '<button type="button" class="strip-item" data-strip="' + i + '" aria-label="' + esc(it.alt) + '"><img src="' + esc(it.thumb) + '" alt="" loading="lazy" decoding="async" /></button>';
      }).join('');
      strip.addEventListener('click', function (e) {
        var b = e.target.closest('[data-strip]');
        if (b) PPUI.viewer(GALLERY, +b.getAttribute('data-strip'));
      });
    }
    var box = el.querySelector('#home-news');
    if (!box || !db || offline()) return;
    db.from('blog_posts').select('id, title, created_at').eq('published', true).order('created_at', { ascending: false }).limit(1).then(function (res) {
      var p = res.data && res.data[0];
      if (!p) return;
      box.innerHTML = '<h2 class="group-title">Latest news</h2><div class="group">' +
        '<a class="cell" href="#/news/' + p.id + '"><span class="cell-icon cell-icon--green" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="4" y="5" width="16" height="14" rx="2.5"/><path d="M8 9.5h8M8 12.5h8M8 15.5h5"/></svg></span>' +
        '<span class="cell-main"><span class="cell-title">' + esc(p.title) + '</span><span class="cell-sub">' + PPUI.fmtDate(p.created_at, true) + '</span></span>' +
        '<svg class="cell-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
        '<a class="cell" href="#/news"><span class="cell-main"><span class="cell-title">All news</span></span><svg class="cell-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a></div>';
    }, function () {});
  }

  // ── POP-UPS ─────────────────────────────────
  function legalSheet(which) {
    var doc = PP_LEGAL[which] || PP_LEGAL.privacy;
    PPUI.sheet({ title: doc.title, tall: true, html: '<div class="legal">' + doc.html + '</div>' });
  }

  var A11Y = { size: 'pp-fontsize', contrast: 'pp-contrast', dyslexia: 'pp-dyslexia', motion: 'pp-motion' };
  function getPref(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
  function setPref(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function a11ySheet() {
    var h = document.documentElement;
    function toggle(key, label) {
      return '<div class="setting"><span id="a11y-' + key + '">' + label + '</span>' +
        '<button type="button" class="switch" role="switch" aria-labelledby="a11y-' + key + '" data-pref="' + key + '"><span></span></button></div>';
    }
    PPUI.sheet({
      title: 'Accessibility',
      html:
        '<div class="setting"><span id="a11y-size">Text size</span>' +
          '<div class="segmented" role="radiogroup" aria-labelledby="a11y-size">' +
            '<button type="button" role="radio" data-size="sm" aria-label="Small text"><span style="font-size:12px">A</span></button>' +
            '<button type="button" role="radio" data-size="md" aria-label="Default text"><span style="font-size:15px">A</span></button>' +
            '<button type="button" role="radio" data-size="lg" aria-label="Large text"><span style="font-size:19px">A</span></button>' +
            '<button type="button" role="radio" data-size="xl" aria-label="Extra large text"><span style="font-size:23px">A</span></button>' +
          '</div></div>' +
        toggle('contrast', 'High contrast') +
        toggle('dyslexia', 'Dyslexia-friendly font') +
        toggle('motion', 'Reduce motion'),
      onOpen: function (el) {
        function sync() {
          Array.prototype.forEach.call(el.querySelectorAll('[data-size]'), function (b) {
            b.setAttribute('aria-checked', b.getAttribute('data-size') === h.getAttribute('data-fontsize') ? 'true' : 'false');
          });
          Array.prototype.forEach.call(el.querySelectorAll('[data-pref]'), function (b) {
            var k = b.getAttribute('data-pref');
            var on = k === 'motion' ? h.getAttribute('data-motion') === 'reduced' : h.getAttribute('data-' + k) === 'on';
            b.setAttribute('aria-checked', on ? 'true' : 'false');
          });
        }
        el.addEventListener('click', function (e) {
          var s = e.target.closest('[data-size]');
          if (s) { h.setAttribute('data-fontsize', s.getAttribute('data-size')); setPref(A11Y.size, s.getAttribute('data-size')); sync(); return; }
          var p = e.target.closest('[data-pref]');
          if (!p) return;
          var k = p.getAttribute('data-pref');
          if (k === 'motion') { var m = h.getAttribute('data-motion') === 'reduced' ? 'on' : 'reduced'; h.setAttribute('data-motion', m); setPref(A11Y.motion, m); }
          else { var v = h.getAttribute('data-' + k) === 'on' ? 'off' : 'on'; h.setAttribute('data-' + k, v); setPref(A11Y[k], v); }
          sync();
          PPApp.syncThemeColour();
        });
        sync();
      }
    });
  }

  // Android/Chrome offers a real install prompt; iPhone needs Share > Add to Home Screen
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener('appinstalled', function () { deferredPrompt = null; document.documentElement.classList.add('is-installed'); });

  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function isInstalled() { return document.documentElement.classList.contains('is-installed'); }

  // "Add app to phone": pick iPhone or Android.
  // Android installs in one tap (Chrome's own prompt). iPhone needs Safari's Share > Add to Home Screen.
  // Used both in the pop-up (More tab) and on the "Get the app" page people see in a browser.
  function renderInstall(body, opts) {
    opts = opts || {};
    var ios = isIOS(), android = /android/i.test(navigator.userAgent);
    var hero = opts.hero === false ? '' : '<div class="install-hero"><img src="images/icons/pp-icon-180.png" alt="" width="64" height="64" /><p><strong>Paw Paradise</strong><br>Opens full screen from your home screen, like any other app.</p></div>';
    function show(html, focus) {
      body.innerHTML = hero + html;
      if (focus !== false) { var f = body.querySelector('button, a'); if (f) f.focus({ preventScroll: true }); }
    }
    function done() {
      show('<div class="install-done"><p class="install-done-tick" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></p><p><strong>Added to your phone</strong></p><p>Open <strong>Paw Paradise</strong> from your home screen.</p></div>');
      if (opts.onInstalled) opts.onInstalled();
    }

    function pick(focus) {
      if (isInstalled()) { show('<p class="center">You\'re already using the app.</p>', focus); return; }
      show('<p class="install-q">Which phone do you have?</p>' +
        '<div class="platform-pick">' +
          '<button type="button" class="platform-btn' + (ios ? ' is-likely' : '') + '" data-platform="ios"><span class="platform-emoji" aria-hidden="true">🍎</span>iPhone<small>Add to Home Screen</small></button>' +
          '<button type="button" class="platform-btn' + (android ? ' is-likely' : '') + '" data-platform="android"><span class="platform-emoji" aria-hidden="true">🤖</span>Android<small>Install in one tap</small></button>' +
        '</div>', focus);
    }

    function iphone() {
      var notSafari = /CriOS|FxiOS|EdgiOS|GSA|FBAN|FBAV|Instagram/i.test(navigator.userAgent);
      if (ios && notSafari) {
        show('<ol class="install-steps">' +
          '<li><span class="step-n">1</span><span>Copy this link and open it in <strong>Safari</strong>. iPhones only let Safari add apps to the home screen.</span></li>' +
          '<li><span class="step-n">2</span><span>In Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</span></li></ol>' +
          '<button type="button" class="btn btn-primary btn-block" id="copy-link">Copy link</button>' +
          '<button type="button" class="text-link back-link" data-back>Back</button>');
        return;
      }
      // Safari 26+ hides Share behind the ••• button; older Safari has Share in the toolbar
      var m = navigator.userAgent.match(/Version\/(\d+)/);
      var newSafari = !ios || !m || +m[1] >= 26;
      function step(n, text, pic) {
        return '<li class="pic-step"><span class="step-n">' + n + '</span><div><p>' + text + '</p>' + pic + '</div></li>';
      }
      var steps = newSafari
        ? step(1, 'Tap the <strong>menu button</strong> at the left of the address bar, at the bottom of the screen.', PPPics.moreButton()) +
          step(2, 'Tap <strong>Share</strong> at the top of the menu.', PPPics.menuShare()) +
          step(3, 'Scroll down and tap <strong>Add to Home Screen</strong>. If you can\'t see it, tap <strong>View More</strong> first.', PPPics.shareSheet(true)) +
          step(4, 'Leave <strong>Open as Web App</strong> on, then tap <strong>Add</strong>.', PPPics.addDialog(true))
        : step(1, 'Tap the <strong>Share</strong> button at the bottom of the screen.', PPPics.oldToolbar()) +
          step(2, 'Scroll down and tap <strong>Add to Home Screen</strong>.', PPPics.shareSheet(false)) +
          step(3, 'Tap <strong>Add</strong>.', PPPics.addDialog(false));
      show('<p class="install-note">Make sure you\'re in <strong>Safari</strong>, then:</p>' +
        '<ol class="install-steps">' + steps + '</ol>' +
        '<p class="install-note">Paw Paradise then appears on your home screen, like any other app.</p>' +
        '<button type="button" class="text-link back-link" data-back>Back</button>');
    }

    async function androidInstall() {
      if (deferredPrompt) {
        // Chrome's own install prompt: one tap to confirm
        deferredPrompt.prompt();
        var choice = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (choice && choice.outcome === 'accepted') done();
        return;
      }
      // Prompt not available (e.g. not Chrome, or already offered): show the steps with pictures
      function step(n, text, pic) {
        return '<li class="pic-step"><span class="step-n">' + n + '</span><div><p>' + text + '</p>' + pic + '</div></li>';
      }
      show('<p class="install-note">Make sure you\'re in <strong>Chrome</strong>, then:</p>' +
        '<ol class="install-steps">' +
          step(1, 'Tap the <strong>⋮</strong> menu at the top right of the screen.', PPPics.chromeMenuButton()) +
          step(2, 'Tap <strong>Add to Home screen</strong> (on some phones it says <strong>Install app</strong>).', PPPics.chromeMenu()) +
          step(3, 'Tap <strong>Install</strong>.', PPPics.chromeInstall()) +
        '</ol>' +
        '<p class="install-note">Paw Paradise then appears on your home screen, like any other app.</p>' +
        '<button type="button" class="text-link back-link" data-back>Back</button>');
    }

    body.addEventListener('click', function (e) {
      var p = e.target.closest('[data-platform]');
      if (p) { if (p.getAttribute('data-platform') === 'ios') iphone(); else androidInstall(); return; }
      if (e.target.closest('[data-back]')) { pick(); return; }
      if (e.target.closest('#copy-link')) {
        var url = location.origin + location.pathname;
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { PPUI.toast('Link copied. Paste it into Safari.'); }, function () { PPUI.toast(url); });
      }
    });
    window.addEventListener('appinstalled', function () { if (document.contains(body)) done(); });
    pick(opts.focus);
  }

  function installSheet() {
    PPUI.sheet({
      title: 'Add app to your phone',
      html: '<div id="install-body"></div>',
      onOpen: function (el) { renderInstall(el.querySelector('#install-body')); }
    });
  }

  function openSheet(name) {
    if (name === 'privacy' || name === 'terms') return legalSheet(name);
    if (name === 'a11y') return a11ySheet();
    if (name === 'install') return installSheet();
    if (name === 'share-photos') return sharePhotosSheet();
  }

  return {
    getAdmin: getAdmin, gallery: gallery, homeExtras: homeExtras, installSheet: installSheet, renderInstall: renderInstall, isInstalled: isInstalled, isIOS: isIOS,
    news: news, newsPost: newsPost, composeSheet: composeSheet, openSheet: openSheet
  };
})();
