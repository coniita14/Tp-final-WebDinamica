# 🧉 Yerbapedia — Catálogo de yerbas mate

**TP Integrador · Programación Web Dinámica · 6° 1° · EPET Nº 30 · 2026**

Aplicación completa para llevar registro de las yerbas mate que fui probando: marca, tipo, origen, precio, puntaje, si tiene palo y cuándo la probé.

- **`api/`** → API REST en **Laravel 13** con base de datos **SQLite**.
- **`web/`** → Frontend en **Next.js 16** (App Router) que consume la API.
- **PWA** → se puede instalar desde el navegador y abre sin conexión.

---

## 1. Tema y entidad

La entidad es **Yerba** (tabla `yerbas`).

| Campo          | Tipo         | Obligatorio | Ejemplo                       | Validación                                                        |
| -------------- | ------------ | ----------- | ----------------------------- | ----------------------------------------------------------------- |
| `nombre`       | texto        | Sí          | Playadito Suave               | texto, máx. 100                                                   |
| `marca`        | texto        | Sí          | Playadito                     | texto, máx. 60                                                    |
| `tipo`         | texto        | Sí          | suave                         | uno de: tradicional, suave, despalada, compuesta, barbacua        |
| `origen`       | texto        | Sí          | Corrientes                    | texto, máx. 60                                                    |
| `precio`       | **número**   | Sí          | 6800                          | numérico, mínimo 0 (precio del kilo)                              |
| `puntaje`      | **número**   | Sí          | 9                             | entero entre 1 y 10                                               |
| `con_palo`     | **booleano** | Sí          | true                          | verdadero o falso                                                 |
| `fecha_prueba` | **fecha**    | No          | 2026-03-14                    | fecha válida, no puede ser futura                                 |
| `descripcion`  | texto largo  | No          | Muy suave y rendidora…        | texto, máx. 1000                                                  |

---

## 2. Requisitos para correrlo

| Programa | Versión mínima | Para qué |
| -------- | -------------- | -------- |
| PHP      | 8.3            | Laravel 13 (con las extensiones `pdo_sqlite` y `sqlite3` activadas) |
| Composer | 2.x            | instalar las dependencias de Laravel |
| Node.js  | 20.9           | Next.js 16 |
| Chrome / Edge | actual    | probar la instalación y el modo offline |

> **Si usás XAMPP en Windows:** si al migrar aparece `could not find driver`, abrí `php.ini` (en XAMPP: *Config → PHP (php.ini)*), buscá las líneas `;extension=pdo_sqlite` y `;extension=sqlite3`, sacales el `;` del principio, guardá y volvé a abrir la terminal.

No hace falta instalar MySQL: la base de datos es un archivo SQLite que se crea en el paso 3.1.

---

## 3. Cómo correrlo paso a paso

Se necesitan **dos terminales**: una para la API y otra para el frontend.

### 3.1 API (Laravel) — terminal 1

```bash
cd api

# 1. Instalar dependencias
composer install

# 2. Crear el archivo de configuración a partir de la plantilla
#    (en Windows con CMD: copy .env.example .env)
cp .env.example .env

# 3. Generar la clave de la aplicación
php artisan key:generate

# 4. Crear el archivo de la base de datos SQLite (funciona igual en Windows, Linux y Mac)
php -r "touch('database/database.sqlite');"

# 5. Crear las tablas y cargar los 8 registros de ejemplo
php artisan migrate --seed

# 6. Iniciar la API
php artisan serve
```

La API queda en **http://127.0.0.1:8000/api/yerbas**. Dejá esta terminal abierta.

> Para volver los datos al estado inicial en cualquier momento: `php artisan migrate:fresh --seed`

### 3.2 Frontend (Next.js) — terminal 2

```bash
cd web

# 1. Instalar dependencias
npm install

# 2. Crear el archivo de configuración con la URL de la API
#    (en Windows con CMD: copy .env.example .env.local)
cp .env.example .env.local

# 3. Compilar e iniciar
npm run build
npm start
```

Abrir **http://localhost:3000**.

> También funciona con `npm run dev` para desarrollar, pero **para probar la PWA (instalar y offline) conviene usar `npm run build` + `npm start`**, que es la versión de producción.
>
> Si no se crea `.env.local`, la app usa igual `http://127.0.0.1:8000/api` por defecto.

### 3.3 Probar la PWA

1. Con la API y el frontend corriendo, abrir **http://localhost:3000** en Chrome.
2. **Instalar:** en la barra de direcciones aparece el ícono de instalar (⊕ / monitor con flecha). También desde el menú ⋮ → *Transmitir, guardar y compartir* → *Instalar Yerbapedia*.
3. **Verificar el Service Worker:** F12 → pestaña **Application** → **Service Workers**: tiene que figurar `sw.js` como *activated and is running*. En **Manifest** se ven el nombre, los colores y los íconos.
4. **Modo offline:** navegar un poco (listado y alguna yerba), después en F12 → **Network** elegir **Offline** (o tildar *Offline* en Application → Service Workers) y recargar:
   - El **listado** abre con la última versión guardada, y el buscador sigue funcionando.
   - Las **yerbas que ya se visitaron** también abren.
   - Una página que **nunca se visitó** muestra la pantalla propia **"Sin conexión"**.
   - Arriba aparece una franja amarilla avisando que no hay conexión.

---

## 4. Endpoints de la API

`Route::apiResource('yerbas', YerbaController::class)` crea estas 5 rutas:

| Método    | Ruta                 | Acción            | Respuestas posibles |
| --------- | -------------------- | ----------------- | ------------------- |
| GET       | `/api/yerbas`        | Listar todas      | 200                 |
| GET       | `/api/yerbas/{id}`   | Ver una           | 200, 404            |
| POST      | `/api/yerbas`        | Crear             | 201, 422            |
| PUT/PATCH | `/api/yerbas/{id}`   | Actualizar        | 200, 404, 422       |
| DELETE    | `/api/yerbas/{id}`   | Borrar            | 200, 404            |

- Los errores de validación (422) vienen así:
  ```json
  {
    "message": "El campo marca es obligatorio. (y 3 errores más)",
    "errors": {
      "marca": ["El campo marca es obligatorio."],
      "puntaje": ["El campo puntaje tiene que estar entre 1 y 10."]
    }
  }
  ```
- El 404 viene así: `{ "message": "No existe ninguna yerba con ese id." }`
- En `bootstrap/app.php` está configurado que todo lo que empieza con `/api` responda **siempre en JSON**, aunque la petición no mande el header `Accept: application/json`.

---

## 5. Pruebas en Thunder Client

En la raíz del repo está **`thunder-collection_yerbapedia.json`**: se importa en Thunder Client (*Collections → ☰ → Import*) y trae las 11 peticiones con un test que verifica el código de respuesta.

**Importante:** correrlas **en orden** y con la base recién cargada (`php artisan migrate:fresh --seed`), porque la 07, 08, 10 y 11 usan la yerba con id 9 que se crea en la prueba 04.

| #  | Petición | Body | Esperado | Obtenido | Respuesta |
| -- | -------- | ---- | :------: | :------: | --------- |
| 01 | `GET /api/yerbas` | — | 200 | 200 ✅ | Lista con las 8 yerbas |
| 02 | `GET /api/yerbas/1` | — | 200 | 200 ✅ | La yerba "Playadito Suave" |
| 03 | `GET /api/yerbas/999` | — | 404 | 404 ✅ | `No existe ninguna yerba con ese id.` |
| 04 | `POST /api/yerbas` | Yerba completa y válida ("Mañanita Suave") | 201 | 201 ✅ | La yerba creada, con `id: 9` |
| 05 | `POST /api/yerbas` | `{}` (vacío) | 422 | 422 ✅ | 7 errores: nombre, marca, tipo, origen, precio, puntaje y con palo son obligatorios |
| 06 | `POST /api/yerbas` | tipo `"de mango"`, precio `-5`, puntaje `15`, con_palo `"tal vez"`, fecha `2030-01-01` | 422 | 422 ✅ | Un mensaje claro por cada campo mal cargado |
| 07 | `PUT /api/yerbas/9` | `{"precio": 4500, "puntaje": 7}` | 200 | 200 ✅ | La yerba con precio y puntaje actualizados |
| 08 | `PUT /api/yerbas/9` | `{"puntaje": "diez"}` | 422 | 422 ✅ | `El campo puntaje tiene que ser un número entero.` |
| 09 | `PUT /api/yerbas/999` | `{"puntaje": 5}` | 404 | 404 ✅ | `No existe ninguna yerba con ese id.` |
| 10 | `DELETE /api/yerbas/9` | — | 200 | 200 ✅ | `La yerba se eliminó correctamente.` |
| 11 | `DELETE /api/yerbas/9` (otra vez) | — | 404 | 404 ✅ | `No existe ninguna yerba con ese id.` |

---

## 6. Qué tiene la app

### Backend (Laravel)
- Proyecto nuevo creado desde cero.
- Modelo `Yerba` con `$fillable` y `casts` (para que `con_palo` llegue como `true/false` y `precio` como número).
- Migración `create_yerbas_table`.
- `YerbaController` con los 5 métodos del CRUD y `Route::apiResource`.
- Validación con `$request->validate()` en `store` y `update`, con mensajes en castellano.
- `findOrFail()` en `show`, `update` y `destroy` → 404.
- Seeder `YerbaSeeder` con 8 yerbas.

### Frontend (Next.js)
- **Layout** con encabezado y navegación con `Link` (`app/layout.js`).
- **Listado** tomado de la API (`app/page.js`, Server Component).
- **Detalle** con ruta dinámica `app/yerbas/[id]/page.js`.
- **Manejo de errores con `res.ok`** (`lib/api.js`): si la API devuelve error o está apagada, se muestra un mensaje y la página no se rompe. Si devuelve 404 se muestra la página "No encontramos esa yerba".
- **Client Components con estado propio** (`'use client'` + `useState`):
  - `BotonFavorito` → marca/desmarca favorita y lo guarda en `localStorage`.
  - `ListaYerbas` → buscador y filtro por tipo.
  - `FormularioYerba` → muestra los errores de validación que manda la API.

### PWA
- `public/manifest.json` con nombre, nombre corto, íconos (192, 512 y maskable), colores y `display: standalone`.
- `public/sw.js`: Service Worker registrado desde `components/RegistrarServiceWorker.js`.
- Se puede instalar desde Chrome / Edge.
- Funciona offline.

### Extras hechos
- ✅ **Formulario para crear** desde el frontend con **Server Action** (`app/actions.js` → `crearYerba`).
- ✅ **Editar y borrar** desde el frontend (Server Actions `actualizarYerba` y `borrarYerba`).
- ✅ **Buscador y filtro** en el listado (por nombre, marca u origen, y por tipo).
- ✅ **Página propia de "sin conexión"** (`app/offline/page.js`) **y caché network-first**: el Service Worker siempre intenta primero la red y guarda una copia; si no hay red, usa la copia.
- ❌ App publicada online.
- ❌ App empaquetada como TWA.

---

## 7. Estructura del repositorio

```
mi-proyecto/
├── api/                                  (Laravel)
│   ├── app/Http/Controllers/YerbaController.php
│   ├── app/Models/Yerba.php
│   ├── bootstrap/app.php                 (JSON en /api y mensaje del 404)
│   ├── database/migrations/..._create_yerbas_table.php
│   ├── database/seeders/YerbaSeeder.php
│   ├── lang/es.json
│   └── routes/api.php
├── web/                                  (Next.js)
│   ├── app/
│   │   ├── layout.js                     (encabezado + registro del SW)
│   │   ├── page.js                       (listado)
│   │   ├── actions.js                    (Server Actions: crear, editar, borrar)
│   │   ├── not-found.js
│   │   ├── offline/page.js               (página sin conexión)
│   │   └── yerbas/
│   │       ├── nueva/page.js
│   │       └── [id]/
│   │           ├── page.js               (detalle)
│   │           └── editar/page.js
│   ├── components/                       (Client Components)
│   ├── lib/api.js                        (fetch a la API con res.ok)
│   └── public/
│       ├── manifest.json
│       ├── sw.js
│       └── icons/
├── thunder-collection_yerbapedia.json
└── README.md
```

---

## 8. Informe teórico

### 1. Códigos de estado

**404:** `GET /api/yerbas/999`. En el controlador uso `Yerba::findOrFail($id)`: como no hay ninguna yerba con id 999, Laravel corta y responde 404 *Not Found*. Es el código correcto porque la petición está bien hecha, pero el recurso que se pide no existe. No es 200 (no hay nada que devolver), ni 400 (la URL es válida), ni 500 (el servidor no falló).

**422:** `POST /api/yerbas` con `"puntaje": 15` y sin `marca`. El JSON llega bien armado, pero los datos no cumplen las reglas de `$request->validate()`, entonces responde 422 *Unprocessable Content* con un mensaje por campo. No es 400 porque la petición se entendió perfectamente (el problema es el contenido, no el formato), y no es 500 porque el error es del cliente, no del servidor.

### 2. HTTPS

Si la app estuviera publicada en HTTP, todo viaja en texto plano. Alguien conectado al mismo Wi-Fi (por ejemplo el de la escuela) con un programa como Wireshark podría ver las URLs que visito, el JSON de las yerbas y todo lo que mando en el formulario de crear o editar, y hasta podría modificar las respuestas antes de que me lleguen. Con HTTPS eso va cifrado.
El Service Worker exige HTTPS (salvo en `localhost`, para poder desarrollar) porque intercepta **todas** las peticiones de la app y puede responder lo que quiera desde la caché. Si se pudiera instalar por HTTP, un atacante podría inyectar un Service Worker falso que quede instalado y controle la app aunque después me conecte a otra red.

### 3. CORS

CORS es una regla **del navegador**: bloquea que el JavaScript de una página (`localhost:3000`) lea respuestas de otro origen (`127.0.0.1:8000`) si ese servidor no lo permite. En mi app el listado y el detalle se piden desde Server Components y los formularios usan Server Actions: en los dos casos el `fetch` lo hace el **servidor de Next** (Node), no el navegador, así que CORS no se aplica.
Aparecería si, por ejemplo, el `BotonFavorito` o el buscador (que son Client Components) hicieran `fetch` directo a `http://127.0.0.1:8000/api/yerbas` desde el navegador. Ahí Laravel tendría que responder con el header `Access-Control-Allow-Origin` (lo maneja `config/cors.php`, que por defecto permite `api/*`).

### 4. PWA y TWA

No, mi app no necesita estar en Google Play. Al ser una PWA ya se puede instalar desde Chrome con su ícono, abre en una ventana propia (`display: standalone`) y funciona sin conexión gracias al Service Worker. Además, cada cambio que subo se actualiza solo, sin pasar por la revisión de una tienda. Empaquetarla como TWA solo tendría sentido si quisiera que la gente la encuentre buscando en Play Store; para eso habría que publicarla con HTTPS, verificar el dominio con Digital Asset Links y pagar la cuenta de desarrollador.

### 5. Decisiones: qué fue lo que más me costó

Lo que más me costó fue que el frontend no podía conectarse a la API aunque `php artisan serve` estaba andando: en el navegador la URL funcionaba, pero desde Next daba `ECONNREFUSED`. El problema era que Node resolvía `localhost` como IPv6 (`::1`) y Laravel escucha solo en IPv4; lo resolví usando `127.0.0.1` en la URL de la API.
Otra cosa fue que, cuando el formulario volvía con un 422, se borraba todo lo que había escrito. Lo arreglé devolviendo los valores desde la Server Action y volviendo a armar el formulario con esos valores.

---

## 9. Aclaraciones (lo que no funciona o hay que saber)

- **Crear, editar y borrar necesitan conexión.** En modo offline se pueden ver las páginas guardadas, pero si se intenta guardar algo aparece el mensaje "No se pudo conectar con la API".
- **Offline:** se ven las páginas que ya se visitaron con conexión. Una página que nunca se abrió muestra la pantalla "Sin conexión".
- **Los favoritos** se guardan en el navegador (`localStorage`), no en la base de datos: si se cambia de navegador no aparecen.
- **El Service Worker solo funciona en `localhost` o con HTTPS.** Si se abre la app desde otra compu de la red por su IP (por ejemplo `http://192.168.0.10:3000`), se ve, pero no se puede instalar ni usar offline.
- **No está publicada online ni empaquetada como TWA** (eran extras opcionales).
