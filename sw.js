// sw.js
const CACHE_NAME = 'delivery-office-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  // يمكنك إضافة صور أو ملفات محلية لاحقًا
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .catch(err => console.warn('فشل في كاش بعض الملفات:', err));
      })
  );
});

self.addEventListener('fetch', (event) => {
  // استخدم الإنترنت أولًا، وإذا فشل استخدم الكاش
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      .then(response => {
        return response || caches.match('./index.html');
      })
  );
});

// تحديث الـ Cache عند تغيير النسخة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      );
    })
  );
});