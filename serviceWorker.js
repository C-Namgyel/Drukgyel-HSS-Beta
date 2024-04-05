var staticDevCoffee;

const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/code.js",
  "/404.html",
  "functions.js",
  "/assets/about.svg",
  "/assets/announcement.svg",
  "/assets/attendance.svg",
  "/assets/book.svg",
  "/assets/contacts.svg",
  "/assets/exit.svg",
  "/assets/google.png",
  "/assets/home.svg",
  "/assets/logo.png",
  "/assets/menu.svg",
  "/assets/mike.svg",
  "/assets/report.svg",
  "/assets/sandglass.svg"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
      caches.open(staticDevCoffee).then(cache => {
        cache.addAll(assets)
      })
    )
  })
  
  self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })
  