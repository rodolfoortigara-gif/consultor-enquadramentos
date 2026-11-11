// Service worker: cache offline. Versão c0f8322603 (11/11/2026 11:38)
const CACHE='enq-c0f8322603';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// rede primeiro (pega versão nova quando online), cache quando offline
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  // página (navegação): pula o cache HTTP do navegador -> sempre a versão publicada mais nova
  const req=e.request.mode==='navigate'?new Request(e.request.url,{cache:'no-cache'}):e.request;
  e.respondWith(fetch(req).then(r=>{const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));});
