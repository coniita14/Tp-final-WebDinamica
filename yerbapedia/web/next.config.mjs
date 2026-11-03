/** @type {import('next').NextConfig} */
const nextConfig = {
  // Usamos el modelo de caché "clásico": cada fetch decide si se cachea
  // (en este proyecto todos usan cache: 'no-store' para ver siempre datos frescos).
  cacheComponents: false,

  // El Service Worker no tiene que quedar cacheado por el navegador,
  // así siempre se baja la última versión.
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        ],
      },
    ];
  },
};

export default nextConfig;
