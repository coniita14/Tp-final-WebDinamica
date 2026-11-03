// Funciones chiquitas para mostrar los datos lindos.

export const TIPOS = {
  tradicional: 'Tradicional',
  suave: 'Suave',
  despalada: 'Despalada',
  compuesta: 'Compuesta',
  barbacua: 'Barbacuá',
};

export function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio);
}

// "2026-03-14" → "14/03/2026" (sin usar Date para no tener problemas de zona horaria)
export function formatearFecha(fecha) {
  if (!fecha) return 'Todavía no la probé';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}
