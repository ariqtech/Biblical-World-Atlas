"use strict";
/*
 * Biblical World Atlas compact offline cache
 * Only the homepage essentials download during installation.
 * Research pages and lightweight indexes are cached when visited.
 * External maps, manuscripts, commentary books and Strong's data are never cached here.
 */
const VERSION="v13";
const CORE_CACHE="biblical-world-atlas-shell-"+VERSION;
const PAGE_CACHE="biblical-world-atlas-visited-"+VERSION;
const CORE_ASSETS=[
 "./","./index.html","./styles.css","./design.css","./hero-landscape.svg",
 "./app.js","./design.js","./manifest.webmanifest","./icon.svg"
];
const MAX_VISITED=70;
const MAX_RESPONSE_BYTES=524288;
const TEXT_ASSET=/\.(?:html|css|js|json|svg|webmanifest)$/i;

function cacheKey(request){
 const u=new URL(request.url);
 // Pages are static: marketing, search and filter query params cannot alter the file bytes.
 // Normalize query strings to avoid duplicate offline copies of the same page.
 u.search="";
 u.hash="";
 return u.href;
}
function suitable(request){
 const u=new URL(request.url);
 return request.method==="GET" && u.origin===self.location.origin &&
   (u.pathname.endsWith("/")||TEXT_ASSET.test(u.pathname));
}
async function readCached(key){
 const core=await caches.open(CORE_CACHE);
 const found=await core.match(key);
 if(found)return found;
 return (await caches.open(PAGE_CACHE)).match(key);
}
async function storeIfSmall(key,response){
 if(!response.ok||response.type==="opaque"||response.type==="opaqueredirect")return;
 const size=Number(response.headers.get("content-length")||0);
 if(Number.isFinite(size)&&size>MAX_RESPONSE_BYTES)return;
 const cache=await caches.open(PAGE_CACHE);
 try{
  await cache.put(key,response.clone());
  const keys=await cache.keys();
  // The oldest visited entries are removed first to bound local storage.
  if(keys.length>MAX_VISITED)await Promise.all(keys.slice(0,keys.length-MAX_VISITED).map(k=>cache.delete(k)));
 }catch(_error){
  // Storage can be blocked or quota-limited; keep normal online reading functional.
 }
}
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CORE_CACHE).then(c=>c.addAll(CORE_ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith("biblical-world-atlas-")&&k!==CORE_CACHE&&k!==PAGE_CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(!suitable(request))return;
 const key=cacheKey(request);
 if(request.mode==="navigate"){
  // Fresh pages first; cached versions still work after losing connectivity.
  event.respondWith((async()=>{
   try{
    const response=await fetch(request);
    if(response.ok)await storeIfSmall(key,response);
    return response;
   }catch(_error){
    const saved=await readCached(key);
    if(saved)return saved;
    return new Response(
     '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
     '<title>Offline | Biblical World Atlas</title><body style="font:18px Georgia,serif;background:#fff9ec;color:#152e42;padding:30px;line-height:1.6">'+
     '<h1>Biblical World Atlas</h1><p>This research page has not been saved in your offline browser cache yet. Reconnect to the internet to open it.</p>'+
     '<p><a href="./" style="color:#164a6b">Return to the cached homepage</a></p></body></html>',
     {status:503,headers:{"Content-Type":"text/html; charset=utf-8"}}
    );
   }
  })());
 }else{
  // Static HTML dependencies and small indexes load from cache when available.
  event.respondWith((async()=>{
   const saved=await readCached(key);
   if(saved)return saved;
   try{
    const response=await fetch(request);
    if(response.ok)await storeIfSmall(key,response);
    return response;
   }catch(_error){return Response.error();}
  })());
 }
});
