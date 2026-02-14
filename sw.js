/**
 * ==================== SERVICE WORKER ====================
 * Offline support for Valentine App
 * Cache-first strategy with network fallback
 */

const CACHE_NAME = 'valentine-v3';
const OFFLINE_URL = '/index.html';

// Assets to cache on install
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/diary.html',
    '/timer.html',
    '/gallery.html',
    '/finale.html',
    '/style.css',
    '/performance.css',
    '/enhancements.css',
    '/intro.js',
    '/diary.js',
    '/timer.js',
    '/gallery.js',
    '/finale.js',
    '/performance.js',
    '/haptic.js',
    '/sound-effects.js',
    '/features.js',
    '/scratch-card.js',
    '/page-transitions.js',
    '/manifest.json'
];

// Install - cache core assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching core assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.log('[SW] Cache failed:', err))
    );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch - Cache first, network fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Return cached and update in background
                    fetchAndCache(event.request);
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetchAndCache(event.request);
            })
            .catch(() => {
                // Offline fallback for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }
            })
    );
});

// Fetch and update cache (stale-while-revalidate)
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);
        
        // Only cache successful responses
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        // Network failed, try cache
        const cached = await caches.match(request);
        if (cached) return cached;
        throw error;
    }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
