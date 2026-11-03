<?php

namespace App\Http\Controllers;

use App\Models\Yerba;
use Illuminate\Http\Request;

class YerbaController extends Controller
{
    /**
     * Tipos de yerba que acepta la API.
     */
    private const TIPOS = ['tradicional', 'suave', 'despalada', 'compuesta', 'barbacua'];

    /**
     * Mensajes de validación en castellano.
     */
    private array $mensajes = [
        'required' => 'El campo :attribute es obligatorio.',
        'string' => 'El campo :attribute tiene que ser un texto.',
        'max' => 'El campo :attribute no puede tener más de :max caracteres.',
        'numeric' => 'El campo :attribute tiene que ser un número.',
        'integer' => 'El campo :attribute tiene que ser un número entero.',
        'min' => 'El campo :attribute no puede ser menor a :min.',
        'between' => 'El campo :attribute tiene que estar entre :min y :max.',
        'boolean' => 'El campo :attribute tiene que ser verdadero o falso.',
        'date' => 'El campo :attribute tiene que ser una fecha válida (AAAA-MM-DD).',
        'before_or_equal' => 'La :attribute no puede ser una fecha futura.',
        'in' => 'El :attribute tiene que ser uno de estos: tradicional, suave, despalada, compuesta o barbacua.',
    ];

    /**
     * Nombres "lindos" de los campos para los mensajes.
     */
    private array $nombresCampos = [
        'nombre' => 'nombre',
        'marca' => 'marca',
        'tipo' => 'tipo',
        'origen' => 'origen',
        'precio' => 'precio',
        'puntaje' => 'puntaje',
        'con_palo' => 'con palo',
        'fecha_prueba' => 'fecha de prueba',
        'descripcion' => 'descripción',
    ];

    /**
     * Reglas de validación. Al actualizar se usa "sometimes"
     * para poder mandar sólo los campos que cambian.
     */
    private function reglas(bool $actualizando = false): array
    {
        $obligatorio = $actualizando ? 'sometimes|required' : 'required';

        return [
            'nombre' => "$obligatorio|string|max:100",
            'marca' => "$obligatorio|string|max:60",
            'tipo' => "$obligatorio|in:".implode(',', self::TIPOS),
            'origen' => "$obligatorio|string|max:60",
            'precio' => "$obligatorio|numeric|min:0",
            'puntaje' => "$obligatorio|integer|between:1,10",
            'con_palo' => "$obligatorio|boolean",
            'fecha_prueba' => 'nullable|date|before_or_equal:today',
            'descripcion' => 'nullable|string|max:1000',
        ];
    }

    /**
     * GET /api/yerbas  → 200 con la lista.
     */
    public function index()
    {
        $yerbas = Yerba::orderBy('nombre')->get();

        return response()->json($yerbas, 200);
    }

    /**
     * POST /api/yerbas  → 201 si se creó, 422 si los datos no son válidos.
     */
    public function store(Request $request)
    {
        $datos = $request->validate($this->reglas(), $this->mensajes, $this->nombresCampos);

        $yerba = Yerba::create($datos);

        return response()->json($yerba, 201);
    }

    /**
     * GET /api/yerbas/{id}  → 200 con la yerba, 404 si no existe.
     */
    public function show(string $id)
    {
        $yerba = Yerba::findOrFail($id);

        return response()->json($yerba, 200);
    }

    /**
     * PUT/PATCH /api/yerbas/{id}  → 200 actualizada, 404 si no existe, 422 si los datos no son válidos.
     */
    public function update(Request $request, string $id)
    {
        $yerba = Yerba::findOrFail($id);

        $datos = $request->validate($this->reglas(true), $this->mensajes, $this->nombresCampos);

        $yerba->update($datos);

        return response()->json($yerba, 200);
    }

    /**
     * DELETE /api/yerbas/{id}  → 200 si se borró, 404 si no existe.
     */
    public function destroy(string $id)
    {
        $yerba = Yerba::findOrFail($id);
        $yerba->delete();

        return response()->json(['message' => 'La yerba se eliminó correctamente.'], 200);
    }
}
