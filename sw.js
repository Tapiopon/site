let CACHE_NAME = 'Tapiopon-v1.0.0'
self.addEventListener('fetch', function(e) { })
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll([
        'index.html',
        'mobile.css',
        'pc.css'
      ])
    })
  )
})
