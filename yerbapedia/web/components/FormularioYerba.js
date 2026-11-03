'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { TIPOS } from '@/lib/formato';

// Muestra el primer mensaje de error de un campo (los manda Laravel con el 422).
function ErrorCampo({ errores, campo }) {
  if (!errores?.[campo]) return null;
  return <span className="error-campo">{errores[campo][0]}</span>;
}

// Formulario para crear o editar una yerba.
// "accion" es una Server Action; "yerba" viene cargada sólo cuando se edita.
export default function FormularioYerba({ accion, yerba = null, textoBoton, volverA = '/' }) {
  const [estado, accionFormulario, enviando] = useActionState(accion, {
    mensaje: '',
    errores: {},
    valores: null,
    intento: 0,
  });

  // Si hubo error, volvemos a mostrar lo que escribió el usuario; si no, los datos de la yerba.
  const v = estado.valores ?? yerba ?? {};
  const errores = estado.errores ?? {};

  return (
    // La "key" hace que el formulario se vuelva a armar con los valores después de cada intento.
    <form action={accionFormulario} className="formulario" key={estado.intento} noValidate>
      {estado.mensaje && (
        <div className="alerta alerta-error" role="alert">
          {estado.mensaje}
        </div>
      )}

      <div className="fila">
        <label className="campo">
          <span>Nombre *</span>
          <input name="nombre" defaultValue={v.nombre ?? ''} placeholder="Ej: Playadito Suave" />
          <ErrorCampo errores={errores} campo="nombre" />
        </label>

        <label className="campo">
          <span>Marca *</span>
          <input name="marca" defaultValue={v.marca ?? ''} placeholder="Ej: Playadito" />
          <ErrorCampo errores={errores} campo="marca" />
        </label>
      </div>

      <div className="fila">
        <label className="campo">
          <span>Tipo *</span>
          <select name="tipo" defaultValue={v.tipo ?? ''}>
            <option value="" disabled>Elegí un tipo</option>
            {Object.entries(TIPOS).map(([valor, nombre]) => (
              <option key={valor} value={valor}>
                {nombre}
              </option>
            ))}
          </select>
          <ErrorCampo errores={errores} campo="tipo" />
        </label>

        <label className="campo">
          <span>Origen *</span>
          <input name="origen" defaultValue={v.origen ?? ''} placeholder="Ej: Misiones" />
          <ErrorCampo errores={errores} campo="origen" />
        </label>
      </div>

      <div className="fila">
        <label className="campo">
          <span>Precio del kilo ($) *</span>
          <input name="precio" type="number" min="0" step="1" defaultValue={v.precio ?? ''} />
          <ErrorCampo errores={errores} campo="precio" />
        </label>

        <label className="campo">
          <span>Puntaje (1 a 10) *</span>
          <input name="puntaje" type="number" min="1" max="10" defaultValue={v.puntaje ?? ''} />
          <ErrorCampo errores={errores} campo="puntaje" />
        </label>
      </div>

      <div className="fila">
        <label className="campo">
          <span>Fecha en que la probé</span>
          <input name="fecha_prueba" type="date" defaultValue={v.fecha_prueba ?? ''} />
          <ErrorCampo errores={errores} campo="fecha_prueba" />
        </label>

        <label className="campo campo-check">
          <input name="con_palo" type="checkbox" defaultChecked={v.con_palo ?? true} />
          <span>Tiene palo</span>
          <ErrorCampo errores={errores} campo="con_palo" />
        </label>
      </div>

      <label className="campo">
        <span>Descripción</span>
        <textarea name="descripcion" rows="4" defaultValue={v.descripcion ?? ''} placeholder="¿Qué te pareció?" />
        <ErrorCampo errores={errores} campo="descripcion" />
      </label>

      <div className="acciones">
        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? 'Guardando…' : textoBoton}
        </button>
        <Link href={volverA} className="boton boton-secundario">Cancelar</Link>
      </div>
    </form>
  );
}
