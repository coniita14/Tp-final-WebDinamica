import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerYerba } from '@/lib/api';
import { TIPOS, formatearFecha, formatearPrecio } from '@/lib/formato';
import { borrarYerba } from '@/app/actions';
import BotonFavorito from '@/components/BotonFavorito';
import BotonBorrar from '@/components/BotonBorrar';

// Página de detalle con ruta dinámica: /yerbas/1, /yerbas/2, ...
export default async function DetalleYerba({ params }) {
  const { id } = await params;
  const { yerba, error, status } = await obtenerYerba(id);

  // Si la API devolvió 404, mostramos la página "no encontrada" (not-found.js).
  if (status === 404) {
    notFound();
  }

  // Cualquier otro error: mensaje y link para volver, sin romper la página.
  if (error) {
    return (
      <div className="alerta alerta-error" role="alert">
        <strong>No se pudo cargar la yerba.</strong>
        <p>{error}</p>
        <Link href="/">← Volver al listado</Link>
      </div>
    );
  }

  return (
    <article className="detalle">
      <Link href="/" className="volver">← Volver al listado</Link>

      <div className="detalle-cabecera">
        <div>
          <span className={`etiqueta etiqueta-${yerba.tipo}`}>{TIPOS[yerba.tipo]}</span>
          <h1>{yerba.nombre}</h1>
          <p className="detalle-marca">{yerba.marca}</p>
        </div>
        <BotonFavorito id={yerba.id} />
      </div>

      <div className="puntaje">
        <div className="puntaje-barra">
          <div className="puntaje-relleno" style={{ width: `${yerba.puntaje * 10}%` }} />
        </div>
        <span>{yerba.puntaje}/10</span>
      </div>

      <dl className="ficha">
        <div>
          <dt>Origen</dt>
          <dd>{yerba.origen}</dd>
        </div>
        <div>
          <dt>Precio (1 kg)</dt>
          <dd>{formatearPrecio(yerba.precio)}</dd>
        </div>
        <div>
          <dt>¿Tiene palo?</dt>
          <dd>{yerba.con_palo ? 'Sí, con palo' : 'No, sin palo'}</dd>
        </div>
        <div>
          <dt>La probé el</dt>
          <dd>{formatearFecha(yerba.fecha_prueba)}</dd>
        </div>
      </dl>

      {yerba.descripcion && <p className="descripcion">{yerba.descripcion}</p>}

      <div className="acciones">
        <Link href={`/yerbas/${yerba.id}/editar`} className="boton">Editar</Link>
        <BotonBorrar accion={borrarYerba.bind(null, yerba.id)} nombre={yerba.nombre} />
      </div>
    </article>
  );
}
