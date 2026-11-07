'use strict';
const CACHE_NAME='class-hub-v8';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon.svg','./assets/class-hub-logo.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('class-hub-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone())}return response}catch(error){const cached=await caches.match(request);if(cached)return cached;if(request.mode==='navigate'){return(await caches.match('./index.html'))||new Response('La pagina non e disponibile offline.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}throw error}})())});

