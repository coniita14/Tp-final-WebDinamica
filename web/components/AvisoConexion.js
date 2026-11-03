'use client';

import { useEffect, useState } from 'react';

// Muestra una franja arriba cuando el navegador se queda sin internet.
export default function AvisoConexion() {
  const [sinConexion, setSinConexion] = useState(false);

  useEffect(() => {
    const actualizar = () => setSinConexion(!navigator.onLine);
    actualizar();
    window.addEventListener('online', actualizar);
    window.addEventListener('offline', actualizar);
    return () => {
      window.removeEventListener('online', actualizar);
      window.removeEventListener('offline', actualizar);
    };
  }, []);

  if (!sinConexion) return null;

  return (
    <div className="aviso-offline" role="status">
      Estás sin conexión: ves la última versión guardada. Crear, editar y borrar no van a funcionar.
    </div>
  );
}
