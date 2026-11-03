<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Yerba extends Model
{
    /**
     * Campos que se pueden cargar con Yerba::create() o $yerba->update().
     */
    protected $fillable = [
        'nombre',
        'marca',
        'tipo',
        'origen',
        'precio',
        'puntaje',
        'con_palo',
        'fecha_prueba',
        'descripcion',
    ];

    /**
     * Para que el JSON devuelva los tipos correctos
     * (true/false en vez de 1/0, número en vez de texto, fecha sin hora).
     */
    protected function casts(): array
    {
        return [
            'precio' => 'float',
            'puntaje' => 'integer',
            'con_palo' => 'boolean',
            'fecha_prueba' => 'date:Y-m-d',
        ];
    }
}
