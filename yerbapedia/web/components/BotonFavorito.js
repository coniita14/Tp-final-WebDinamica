'use client';

import { useEffect, useState } from 'react';

const CLAVE = 'yerbapedia-favoritas';

// Lee la lista de ids favoritos guardada en el navegador.
function leerFavoritas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? [];
  } catch {
    return [];
  }
}

// Client Component con estado propio: marca/desmarca una yerba como favorita.
// Se guarda en localStorage para que no se pierda al recargar.
export default function BotonFavorito({ id }) {
  const [esFavorita, setEsFavorita] = useState(false);

  // localStorage sólo existe en el navegador, por eso se lee después de montar.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEsFavorita(leerFavoritas().includes(id));
  }, [id]);

  function alternar() {
    const favoritas = leerFavoritas();
    const nuevas = esFavorita ? favoritas.filter((f) => f !== id) : [...favoritas, id];
    try {
      localStorage.setItem(CLAVE, JSON.stringify(nuevas));
    } catch {
      // si el navegador no deja guardar, igual cambia en pantalla
    }
    setEsFavorita(!esFavorita);
  }

  return (
    <button
      type="button"
      onClick={alternar}
      className={`favorito ${esFavorita ? 'favorito-activo' : ''}`}
      aria-pressed={esFavorita}
    >
      {esFavorita ? '★ Favorita' : '☆ Marcar favorita'}
    </button>
  );
}
