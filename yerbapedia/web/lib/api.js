// Funciones para pedirle datos a la API de Laravel.
// Se usan desde Server Components, así que el fetch lo hace el servidor de Next
// (no el navegador) y no hay problemas de CORS.

export const API_URL = process.env.API_URL || 'http://127.0.0.1:8000/api';

// Trae todas las yerbas.
// Devuelve { yerbas, error }: si algo falla, "error" tiene un mensaje para mostrar.
export async function obtenerYerbas() {
  try {
    const res = await fetch(`${API_URL}/yerbas`, { cache: 'no-store' });

    if (!res.ok) {
      return { yerbas: [], error: `La API respondió con un error (${res.status}).` };
    }

    const yerbas = await res.json();
    return { yerbas, error: null };
  } catch {
    // fetch tira una excepción si ni siquiera se pudo conectar (API apagada).
    return {
      yerbas: [],
      error: 'No se pudo conectar con la API. Revisá que esté corriendo "php artisan serve".',
    };
  }
}

// Trae una yerba por id.
// Devuelve { yerba, error, status } para que la página decida qué mostrar.
export async function obtenerYerba(id) {
  try {
    const res = await fetch(`${API_URL}/yerbas/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      return { yerba: null, error: `La API respondió con un error (${res.status}).`, status: res.status };
    }

    const yerba = await res.json();
    return { yerba, error: null, status: res.status };
  } catch {
    return {
      yerba: null,
      error: 'No se pudo conectar con la API. Revisá que esté corriendo "php artisan serve".',
      status: 0,
    };
  }
}
