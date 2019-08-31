const staticAssets = [
  "./",
  "./app.js"
]

let dynamicData = []

self.addEventListener("install", async e =>{
  const cache = await caches.open("dettesNotes-static");
  cache.addAll(staticAssets);
})

self.addEventListener("fetch", e =>{
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cachFirst(req))    
  }else{
    e.respondWith(networkFirst(req));
  }

  e.respondWith(cachFirst(req));
})

async function cachFirst(req) {
  const cachResponse = await caches.match(req);
  return cachResponse || fetch(req);
}

async function networkFirst(req){
  const cache = await caches.open("dettesNotes-static");

  try {
    const res = fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}