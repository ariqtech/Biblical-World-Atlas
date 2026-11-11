const CACHE_NAME="biblical-world-atlas-shell-v5";
const APP_SHELL=["./","./index.html","./styles.css","./design.css","./hero-landscape.svg","./app.js","./design.js","./research-pages.css","./biblical-maps.html","./biblical-maps.css","./biblical-maps.js","./antarctica.html","./theories/antarctica-ice-wall.html","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy)).catch(()=>{});}
  return response;
 }).catch(()=>caches.match(request).then(cached=>cached|| (request.mode==="navigate"?caches.match("./index.html"):Response.error()))));
});