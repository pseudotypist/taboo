// Offline support. Bump CACHE when the list of files changes.
const CACHE = 'tabu-v3-yuyue-surprise';
const ASSETS = ['./', 'index.html', 'style.css', 'app.js', 'cards.js', '../yuyue/settings.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((path) => new Request(path, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first, so a new version shows up as soon as the phone is online;
// the cached copy answers when offline or when the network takes longer than 2.5 s.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    const fresh = fetch(req).then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    });
    if (!cached) return fresh;
    return Promise.race([fresh.catch(() => cached), new Promise((done) => setTimeout(() => done(cached), 2500))]);
  })());
});
