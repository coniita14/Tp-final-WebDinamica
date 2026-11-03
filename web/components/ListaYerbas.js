'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TIPOS, formatearPrecio } from '@/lib/formato';

// Client Component: recibe todas las yerbas desde el servidor
// y las filtra en el navegador según lo que escriba el usuario.
export default function ListaYerbas({ yerbas }) {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('todos');

  const texto = busqueda.trim().toLowerCase();

  const filtradas = yerbas.filter((yerba) => {
    const coincideTexto =
      yerba.nombre.toLowerCase().includes(texto) ||
      yerba.marca.toLowerCase().includes(texto) ||
      yerba.origen.toLowerCase().includes(texto);
    const coincideTipo = tipo === 'todos' || yerba.tipo === tipo;
    return coincideTexto && coincideTipo;
  });

  return (
    <>
      <div className="filtros">
        <label className="campo campo-busqueda">
          <span>Buscar</span>
          <input
            type="search"
            placeholder="Nombre, marca u origen…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>

        <label className="campo">
          <span>Tipo</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="todos">Todos</option>
            {Object.entries(TIPOS).map(([valor, nombre]) => (
              <option key={valor} value={valor}>
                {nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="contador">
        {filtradas.length} de {yerbas.length} yerbas
      </p>

      {filtradas.length === 0 ? (
        <p className="vacio">No hay yerbas que coincidan con la búsqueda.</p>
      ) : (
        <ul className="grilla">
          {filtradas.map((yerba) => (
            <li key={yerba.id}>
              <Link href={`/yerbas/${yerba.id}`} className="tarjeta">
                <div className="tarjeta-arriba">
                  <span className={`etiqueta etiqueta-${yerba.tipo}`}>{TIPOS[yerba.tipo]}</span>
                  <span className="puntaje-chico">★ {yerba.puntaje}/10</span>
                </div>
                <h2>{yerba.nombre}</h2>
                <p className="tarjeta-datos">
                  {yerba.marca} · {yerba.origen}
                </p>
                <p className="tarjeta-precio">{formatearPrecio(yerba.precio)} <small>/ kg</small></p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
