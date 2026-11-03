'use client';

import { useEffect } from 'react';

// Registra el Service Worker (public/sw.js) cuando carga la página.
// No dibuja nada en pantalla.
export default function RegistrarServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((registro) => console.log('[PWA] Service Worker registrado:', registro.scope))
      .catch((error) => console.error('[PWA] No se pudo registrar el Service Worker:', error));

    // Cuando el Service Worker está listo, le pasamos los archivos JS/CSS
    // que ya se cargaron, para que los guarde y la app funcione offline.
    navigator.serviceWorker.ready.then((registro) => {
      const urls = performance
        .getEntriesByType('resource')
        .map((recurso) => recurso.name)
        .filter((url) => url.startsWith(location.origin) && url.includes('/_next/static/'));
      urls.push(location.href);
      registro.active?.postMessage({ tipo: 'GUARDAR_ARCHIVOS', urls });
    });
  }, []);

  return null;
}
