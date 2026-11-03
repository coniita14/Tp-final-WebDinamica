import { crearYerba } from '@/app/actions';
import FormularioYerba from '@/components/FormularioYerba';

export const metadata = { title: 'Nueva yerba · Yerbapedia' };

export default function NuevaYerba() {
  return (
    <section className="detalle">
      <h1>Cargar una yerba nueva</h1>
      <FormularioYerba accion={crearYerba} textoBoton="Guardar yerba" />
    </section>
  );
}
