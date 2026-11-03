// Página propia de "sin conexión".
// El Service Worker la guarda al instalarse y la muestra cuando no hay internet
// y la página que se pidió no está en la caché.

export const metadata = { title: 'Sin conexión · Yerbapedia' };

// Es una página estática: no depende de la API.
export const dynamic = 'force-static';

export default function SinConexion() {
  return (
    <div className="pantalla-centro">
      <p className="emoji-grande" aria-hidden="true">🧉📡</p>
      <h1>Sin conexión</h1>
      <p>
        Parece que no tenés internet y esta página todavía no estaba guardada.
        <br />
        Mientras tanto, podés volver al listado: la última versión que viste quedó guardada.
      </p>
      {/* Usamos <a> y no <Link> para forzar una carga completa que pase por el Service Worker. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/" className="boton">Ir al listado</a>
    </div>
  );
}
