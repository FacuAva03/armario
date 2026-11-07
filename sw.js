// Service worker: deja abrir la app sin conexión. Los archivos propios van "red primero"
// (así cada publicación llega al toque) y las librerías de Firebase, "caché primero".
const CACHE = 'armario-v6';
const ARCHIVOS = [
  './', './index.html', './styles.css', './config.js', './manifest.webmanifest',
  './js/app.js', './js/store.js', './js/datos.js', './js/calce.js', './js/silueta.js', './js/sanear.js', './js/guia.js',
  './icons/icon-192.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(claves => Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function redPrimero(req) {
  return fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => {
    if (res.ok) {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(req, copia));
    }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')));
}

function cachePrimero(req) {
  return caches.match(req).then(r => r || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(req, copia));
    }
    return res;
  }));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    // Los datos personales (seed.local.json) nunca se guardan en la caché del service worker.
    if (url.pathname.endsWith('seed.local.json')) return;
    e.respondWith(redPrimero(req));
  } else if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    e.respondWith(cachePrimero(req));
  }
});
