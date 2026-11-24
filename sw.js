const CACHE='caccia-ai-premi-v17';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./data/latest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('caccia-ai-premi-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 const reqUrl=new URL(e.request.url);
 if(reqUrl.pathname.endsWith('/data/latest.json')){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(resp=>{if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return resp}).catch(()=>caches.match(e.request)));
  return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));
});
