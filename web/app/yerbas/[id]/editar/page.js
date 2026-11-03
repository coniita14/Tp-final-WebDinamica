import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerYerba } from '@/lib/api';
import { actualizarYerba } from '@/app/actions';
import FormularioYerba from '@/components/FormularioYerba';

export const metadata = { title: 'Editar yerba · Yerbapedia' };

export default async function EditarYerba({ params }) {
  const { id } = await params;
  const { yerba, error, status } = await obtenerYerba(id);

  if (status === 404) {
    notFound();
  }

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
    <section className="detalle">
      <h1>Editar: {yerba.nombre}</h1>
      <FormularioYerba
        accion={actualizarYerba.bind(null, yerba.id)}
        yerba={yerba}
        textoBoton="Guardar cambios"
        volverA={`/yerbas/${yerba.id}`}
      />
    </section>
  );
}
