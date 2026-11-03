import { obtenerYerbas } from '@/lib/api';
import ListaYerbas from '@/components/ListaYerbas';

// Página principal (Server Component): pide el listado a la API.
export default async function Inicio() {
  const { yerbas, error } = await obtenerYerbas();

  return (
    <>
      <section className="portada">
        <h1>Catálogo de yerbas mate</h1>
        <p>
          Todas las yerbas que fui probando, con su tipo, origen, precio y puntaje del 1 al 10.
        </p>
      </section>

      {error ? (
        <div className="alerta alerta-error" role="alert">
          <strong>No se pudo cargar el listado.</strong>
          <p>{error}</p>
        </div>
      ) : (
        <ListaYerbas yerbas={yerbas} />
      )}
    </>
  );
}
