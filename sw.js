/* Constellation Walks: offline support. Keep this file next to walk-tracker.html. */
var CACHE='cw-v4';
var FILES=['./','./walk-tracker.html','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(FILES.map(function(u){return c.add(u).catch(function(){})}));
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url),fonts=/(^|\.)(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!==location.origin&&!fonts)return;
  if(r.mode==='navigate'){
    /* pages: network first so updates arrive, cached copy when offline */
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)});return res}).catch(function(){
      return caches.match(r).then(function(m){return m||caches.match('./walk-tracker.html')||caches.match('./index.html')||caches.match('./')})}));
    return;
  }
  /* fonts, icons, manifest: cached copy first, refreshed in the background */
  e.respondWith(caches.match(r).then(function(m){
    var net=fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}return res}).catch(function(){return m});
    return m||net;
  }));
});
