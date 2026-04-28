const CACHE_NAME = 'verdapp-v11';
const APP_SHELL = ['./','./index.html?v=20260428-carteles','./manifest.json','./icons/icon.svg'];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL).catch(() => null))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
    event.respondWith(fetch(req, { cache: 'no-store' }).then(res => { const copy = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put('./index.html?v=20260428-carteles', copy)); return res; }).catch(() => caches.match('./index.html?v=20260428-carteles').then(cached => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(req, copy)); return res; }).catch(() => cached)));
});
