
const STATIC_CACHE = "district-static-v5";
const DYNAMIC_CACHE = "district-dynamic-v5";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/offline.html",
];



self.addEventListener("install", (event) => {
  console.log("Installing Service Worker");

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Activating Service Worker");

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  // self.clients.claim();
});


async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);

   const cachedResponse = await cache.match(request);

   const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

   if (cachedResponse) {
    networkPromise; 
    return cachedResponse;
  }

   const networkResponse = await networkPromise;

  if (networkResponse) {
    return networkResponse;
  }

  return new Response(
    JSON.stringify({
      message: "Offline and no cached data",
    }),
    {
      status: 503,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (err) {

     if (request.mode === "navigate") {
      return caches.match("/offline.html");
    }

    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

   if (url.pathname.startsWith("/api")) {
    event.respondWith(staleWhileRevalidate(event.request));
    
    return;
  }

   event.respondWith(cacheFirst(event.request));
});

// self.addEventListener("fetch", (event) => {
//   if (event.request.method !== "GET") {
//     return;
//   }

//   event.respondWith(
//     caches.match(event.request).then((cached) => {
//       if (cached) {
//         return cached;
//       }

//       return fetch(event.request)
//         .then((response) => {
//           return caches.open(DYNAMIC_CACHE).then((cache) => {
//             cache.put(event.request, response.clone());
//             return response;
//           });
//         })
//         .catch(() => {
//           if (event.request.mode === "navigate") {
//             return caches.match("/index.html");
//           }
//         });
//     })
//   );
// });












// self.addEventListener("install", (event) => {
//   console.log("Service Worker Installed");
// });

// self.addEventListener("activate", (event) => {

//   console.log("Service Worker Activated");
//   return self.clients.claim();
// });

// self.addEventListener("fetch", (event) => {
//   console.log("Fetching:", event.request.url);
// });


///////////////////////////////////////////
//  for background sunc 

const DB_NAME = "district-db";
const STORE_NAME = "pending-movies";

function openDB() {
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


async function getPendingMovies() {

  const db = await openDB();

  return new Promise((resolve) => {

    const tx = db.transaction(STORE_NAME);

    const request = tx.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => resolve(request.result);

  });

}

async function deletePendingMovie(id) {

  const db = await openDB();

  const tx = db.transaction(STORE_NAME, "readwrite");

  tx.objectStore(STORE_NAME).delete(id);

}

self.addEventListener("sync", (event) => {
console.log("SYNC EVENT FIRED", event.tag);
  if (event.tag === "sync-new-movies") {

    event.waitUntil(syncMovies());

  }

});

async function syncMovies() {

  const movies = await getPendingMovies();

  for (const item of movies) {

    try {

      await fetch("http://localhost:5000/api/movies", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-user-id": String(item.adminId),
        },

        body: JSON.stringify(item.movie),

      });

      await deletePendingMovie(item.id);
      
       await self.registration.showNotification("District", {
        body: `"${item.movie.title}" synced successfully.`,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
      });
      console.log("Movie Synced");

    } catch (err) {

      console.log("Still Offline");

    }

  }

}


self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  event.waitUntil(
    clients.openWindow(`/movies/${movieId}`)
  );

});









