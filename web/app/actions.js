'use server';

// Server Actions: se ejecutan en el servidor de Next cuando se manda un formulario.
// Desde acá llamamos a la API de Laravel (POST, PUT y DELETE).

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { API_URL } from '@/lib/api';

// Pasa los datos del formulario al formato que espera la API.
function leerFormulario(formData) {
  return {
    nombre: formData.get('nombre'),
    marca: formData.get('marca'),
    tipo: formData.get('tipo'),
    origen: formData.get('origen'),
    precio: formData.get('precio'),
    puntaje: formData.get('puntaje'),
    con_palo: formData.get('con_palo') === 'on', // el checkbox manda "on" si está tildado
    fecha_prueba: formData.get('fecha_prueba') || null,
    descripcion: formData.get('descripcion') || null,
  };
}

// Manda los datos a la API y devuelve { ok, yerba } o { ok: false, estado para el formulario }.
async function enviarALaApi(url, metodo, datos) {
  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(datos),
    });

    if (res.status === 422) {
      // Error de validación: Laravel devuelve { message, errors: { campo: [mensajes] } }
      const cuerpo = await res.json();
      return {
        ok: false,
        estado: { mensaje: 'Revisá los campos marcados.', errores: cuerpo.errors, valores: datos },
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        estado: { mensaje: `La API respondió con un error (${res.status}).`, errores: {}, valores: datos },
      };
    }

    return { ok: true, yerba: await res.json() };
  } catch {
    return {
      ok: false,
      estado: { mensaje: 'No se pudo conectar con la API.', errores: {}, valores: datos },
    };
  }
}

// Crear (POST /api/yerbas)
export async function crearYerba(estadoAnterior, formData) {
  const datos = leerFormulario(formData);
  const resultado = await enviarALaApi(`${API_URL}/yerbas`, 'POST', datos);

  if (!resultado.ok) {
    return { ...resultado.estado, intento: (estadoAnterior?.intento ?? 0) + 1 };
  }

  revalidatePath('/');
  // redirect() va fuera del try/catch porque funciona tirando un error especial.
  redirect(`/yerbas/${resultado.yerba.id}`);
}

// Editar (PUT /api/yerbas/{id}). El id llega con .bind() desde la página.
export async function actualizarYerba(id, estadoAnterior, formData) {
  const datos = leerFormulario(formData);
  const resultado = await enviarALaApi(`${API_URL}/yerbas/${id}`, 'PUT', datos);

  if (!resultado.ok) {
    return { ...resultado.estado, intento: (estadoAnterior?.intento ?? 0) + 1 };
  }

  revalidatePath('/');
  revalidatePath(`/yerbas/${id}`);
  redirect(`/yerbas/${id}`);
}

// Borrar (DELETE /api/yerbas/{id})
export async function borrarYerba(id) {
  try {
    await fetch(`${API_URL}/yerbas/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
  } catch {
    // Si la API está caída no podemos borrar; volvemos al listado igual
    // y ahí se va a ver el mensaje de error de conexión.
  }

  revalidatePath('/');
  redirect('/');
}
