var cacheName = 'Atarefado-v1.0';

self.addEventListener('install', function(event) {
    caches.open(cacheName).then((cache) => {
        cache.addAll([
            '/',
            '/pages/index.html',
            '/manifest.webmanifest',
            '/Styles/Style.css',
            '/Scripts/Script.js',
            '/Styles/Atarefado.css',
            '/Scripts/Atarefado.js',
            '/assets/delete.png',
            '/assets/plus.png',
            '/assets/relax.png',
            '/images/android-icon-48x48.png',
            '/images/android-icon-72x72.png',
            '/images/android-icon-96x96.png',
            '/images/android-icon-144x144.png',
            '/images/android-icon-192x192.png',
            '/images/apple-icon-72x72.png',
            '/images/apple-icon-120x120.png',
            '/images/apple-icon-144x144.png',
            '/images/apple-icon-152x152.png',
            '/images/apple-icon-180x180.png',
        ]);
    });
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    let resposta = caches.open(cacheName).then((cache) => {
        return cache.match(event.request).then((recurso) => {
            if (recurso) return recurso;
            return fetch(event.request).then((recurso) => {
                cache.put(event.request, recurso.clone());
                return recurso;
            });
        });
    });
    event.respondWith(resposta);
});