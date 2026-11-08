// Paw Paradise app - service worker.
// Saves the app on the phone so it works without signal.
// App code is always fetched fresh when online, so updates appear straight away.
// Bumping VERSION after a change also clears old saved copies.
const VERSION = 'pp-app-v12';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './css/app.css',
  './js/vendor/supabase.js', './js/config.js', './js/legal.js', './js/content.js',
  './js/ui.js', './js/install-pictures.js', './js/features.js', './js/staff.js', './js/app.js',
  './images/logo.png', './images/hero.jpg', './images/icons/icon-192.png', './images/icons/icon-32.png', './apple-touch-icon.png',
  // Gallery thumbnails (small), so the gallery grid shows even without signal
  './images/gallery/thumbs/aerial-view.jpg',
  './images/gallery/thumbs/and-were-off.jpg',
  './images/gallery/thumbs/bono-testing-equipment.jpg',
  './images/gallery/thumbs/bono-tunnel.jpg',
  './images/gallery/thumbs/building-play-equipment.jpg',
  './images/gallery/thumbs/car-park-update.jpg',
  './images/gallery/thumbs/day-3-progress.jpg',
  './images/gallery/thumbs/double-gate.jpg',
  './images/gallery/thumbs/faq-video.jpg',
  './images/gallery/thumbs/fence-ramp.jpg',
  './images/gallery/thumbs/field-shelter.jpg',
  './images/gallery/thumbs/field-walk.jpg',
  './images/gallery/thumbs/grassy-mound.jpg',
  './images/gallery/thumbs/log-balance.jpg',
  './images/gallery/thumbs/mound-and-tunnel.jpg',
  './images/gallery/thumbs/paw-paradise.jpg',
  './images/gallery/thumbs/tree-stump-ring.jpg',
  './images/gallery/thumbs/weave-poles.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function staleWhileRevalidate(req) {
  return caches.open(VERSION).then(cache =>
    cache.match(req).then(hit => {
      const fresh = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      }).catch(() => hit);
      return hit || fresh;
    })
  );
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fonts: keep a copy so the app looks right offline
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }
  // Everything else from other sites (Supabase, Acuity, Google, Facebook) goes straight to the network
  if (url.origin !== self.location.origin) return;
  // Videos stream from the network (too big to store)
  if (/\.(mp4|mov|webm)$/i.test(url.pathname) || req.headers.has('range')) return;

  // Opening the app: try the network, fall back to the saved copy
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // App icons: always the latest (so a new home screen icon is picked up)
  if (/apple-touch-icon|\/icons\//.test(url.pathname)) return;

  // Photos: instant from the saved copy, refreshed in the background
  if (/\.(png|jpe?g|gif|webp|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // App code (JS, CSS, manifest): always fetch the latest when online, use the saved copy offline.
  // This means updates show up the first time the app is opened after they go live.
  event.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
