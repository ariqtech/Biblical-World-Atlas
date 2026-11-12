const CACHE_NAME="biblical-world-atlas-shell-v19";
const APP_SHELL=["./","./index.html","./styles.css","./design.css","./hero-landscape.svg","./app.js","./design.js","./research-pages.css","./biblical-maps.html","./biblical-maps.css","./biblical-maps.js","./bible-library.html","./bible-library.js","./reading-library.css","./ancient-texts.html","./book-reader.js?v=2","./book-reader.css","./natural-world.html","./natural-world.css","./natural-world.js","./historical-world-maps.html","./historical-world-maps.css","./historical-world-maps.js","./historical-map-catalog.json","./research-source-directory.html","./research-source-directory.css","./research-source-directory.js","./research-source-directory.json","./strongs.html","./strongs.css","./strongs.js","./commentaries.html","./commentaries.css","./commentaries.js","./commentary-links.json","./matthew-henry.js","./gospels.html","./gospels.css","./gospels.js","./bible-book-index.html","./bible-book-index.css","./bible-book-index.js","./prophetic-references.html","./prophetic-references.css","./prophetic-references.js","./antarctica.html","./theories/antarctica-ice-wall.html","./manifest.webmanifest","./icon.svg"];
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