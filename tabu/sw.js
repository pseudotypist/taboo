// Offline support. Bump CACHE when the list of files changes.
const CACHE = 'tabu-v4-print';
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
    const key = req.url.split('?')[0]; // one cached copy per file, whatever "?v=" says
    const cached = await cache.match(key);
    // For files, 'no-cache' makes the browser check with the server every time, so a new deploy shows
    // on the next launch instead of after the HTTP cache expires. Page loads keep their own request.
    const fresh = (req.mode === 'navigate' ? fetch(req) : fetch(req.url, { cache: 'no-cache' })).then((res) => {
      if (res.ok) cache.put(key, res.clone());
      return res;
    });
    if (!cached) return fresh;
    return Promise.race([fresh.catch(() => cached), new Promise((done) => setTimeout(() => done(cached), 2500))]);
  })());
});
