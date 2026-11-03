// Service Worker de Yerbapedia
// Estrategia: NETWORK-FIRST (primero la red, si falla, la caché).
//  - Con internet: siempre se ven los datos nuevos y de paso se guarda una copia.
//  - Sin internet: se muestra la última copia guardada.
//  - Si la página nunca se visitó: se muestra la página propia /offline.

const CACHE = 'yerbapedia-v1';

// Lo que se guarda apenas se instala el Service Worker.
const PRECARGA = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// 1) INSTALL: guardamos la precarga.
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Una por una, para que si falla alguna no se caiga toda la instalación.
      Promise.all(PRECARGA.map((url) => cache.add(url).catch(() => null)))
    )
  );
  self.skipWaiting(); // se activa enseguida, sin esperar a cerrar pestañas
});

// 2) ACTIVATE: borramos cachés de versiones viejas.
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nombres) =>
        Promise.all(nombres.filter((n) => n !== CACHE).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

// Mensaje desde la página: "guardá estos archivos".
// En la primera visita, el JS y el CSS se bajan ANTES de que el Service Worker
// esté activo, así que la página nos pasa la lista para guardarlos también.
self.addEventListener('message', (evento) => {
  if (evento.data?.tipo === 'GUARDAR_ARCHIVOS') {
    caches.open(CACHE).then((cache) =>
      Promise.all(evento.data.urls.map((url) => cache.add(url).catch(() => null)))
    );
  }
});

// 3) FETCH: cada pedido del navegador pasa por acá.
self.addEventListener('fetch', (evento) => {
  const pedido = evento.request;
  const url = new URL(pedido.url);

  // Sólo manejamos GET de nuestro propio sitio.
  // (Los POST de los formularios / Server Actions van directo a la red.)
  if (pedido.method !== 'GET' || url.origin !== self.location.origin) return;

  // No tocamos la recarga en caliente del modo desarrollo.
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  evento.respondWith(redPrimero(pedido));
});

async function redPrimero(pedido) {
  const cache = await caches.open(CACHE);

  try {
    const respuesta = await fetch(pedido);
    // Guardamos una copia sólo si la respuesta salió bien.
    if (respuesta.ok) {
      cache.put(pedido, respuesta.clone());
    }
    return respuesta;
  } catch {
    // Sin red: buscamos en la caché.
    const guardada = await cache.match(pedido, { ignoreVary: true });
    if (guardada) return guardada;

    // Si era una página (navegación) y no la teníamos, mostramos /offline.
    if (pedido.mode === 'navigate') {
      const offline = await cache.match('/offline', { ignoreVary: true });
      if (offline) return offline;
    }

    return new Response('Sin conexión', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
