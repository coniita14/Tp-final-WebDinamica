'use client';

import { useFormStatus } from 'react-dom';

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="boton boton-peligro" disabled={pending}>
      {pending ? 'Borrando…' : 'Borrar'}
    </button>
  );
}

// Formulario con un solo botón que llama a la Server Action de borrar.
// Antes de mandarlo pide confirmación.
export default function BotonBorrar({ accion, nombre }) {
  function confirmar(evento) {
    if (!window.confirm(`¿Seguro que querés borrar "${nombre}"?`)) {
      evento.preventDefault();
    }
  }

  return (
    <form action={accion} onSubmit={confirmar}>
      <BotonEnviar />
    </form>
  );
}
