const CACHE_NAME = 'pomify-v1'
const OFFLINE_URL = '/'
self.addEventListener('install', event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll([OFFLINE_URL,'/','/index.html','/manifest.json'])))
  self.skipWaiting()
})
self.addEventListener('activate', event=>{ event.waitUntil(self.clients.claim()) })
self.addEventListener('fetch', event=>{
  if(event.request.method !== 'GET') return
  event.respondWith(caches.match(event.request).then(resp=>resp || fetch(event.request).then(rsp=>{ if(rsp && rsp.type==='basic'){ const copy = rsp.clone(); caches.open(CACHE_NAME).then(c=>c.put(event.request,copy)); } return rsp; }).catch(()=>caches.match('/'))))
})
