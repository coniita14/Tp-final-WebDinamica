<?php

namespace Database\Seeders;

use App\Models\Yerba;
use Illuminate\Database\Seeder;

class YerbaSeeder extends Seeder
{
    /**
     * Carga yerbas de ejemplo (precios aproximados del paquete de 1 kg).
     */
    public function run(): void
    {
        $yerbas = [
            [
                'nombre' => 'Playadito Suave',
                'marca' => 'Playadito',
                'tipo' => 'suave',
                'origen' => 'Corrientes',
                'precio' => 6800,
                'puntaje' => 9,
                'con_palo' => true,
                'fecha_prueba' => '2026-03-14',
                'descripcion' => 'Muy suave y rendidora. Ideal para empezar el día sin que te caiga pesado.',
            ],
            [
                'nombre' => 'Taragüi Con Palo',
                'marca' => 'Taragüi',
                'tipo' => 'tradicional',
                'origen' => 'Corrientes',
                'precio' => 5900,
                'puntaje' => 7,
                'con_palo' => true,
                'fecha_prueba' => '2026-04-02',
                'descripcion' => 'La clásica de todas las casas. Sabor intenso y amargo.',
            ],
            [
                'nombre' => 'Rosamonte Especial',
                'marca' => 'Rosamonte',
                'tipo' => 'tradicional',
                'origen' => 'Misiones',
                'precio' => 6200,
                'puntaje' => 8,
                'con_palo' => true,
                'fecha_prueba' => '2026-05-20',
                'descripcion' => 'Fuerte y con mucho cuerpo. Se lava rápido si el agua está muy caliente.',
            ],
            [
                'nombre' => 'CBSé Hierbas Serranas',
                'marca' => 'CBSé',
                'tipo' => 'compuesta',
                'origen' => 'Córdoba',
                'precio' => 4700,
                'puntaje' => 6,
                'con_palo' => true,
                'fecha_prueba' => '2026-06-08',
                'descripcion' => 'Compuesta con peperina, menta y burrito. Para los que no aguantan el amargo.',
            ],
            [
                'nombre' => 'Canarias Tradicional',
                'marca' => 'Canarias',
                'tipo' => 'despalada',
                'origen' => 'Uruguay',
                'precio' => 9800,
                'puntaje' => 8,
                'con_palo' => false,
                'fecha_prueba' => '2026-07-11',
                'descripcion' => 'Molienda muy fina, estilo uruguayo. Hay que armar bien el mate porque tapa la bombilla.',
            ],
            [
                'nombre' => 'La Merced de Campo',
                'marca' => 'La Merced',
                'tipo' => 'tradicional',
                'origen' => 'Misiones',
                'precio' => 7400,
                'puntaje' => 9,
                'con_palo' => true,
                'fecha_prueba' => '2026-08-23',
                'descripcion' => 'Sabor parejo y duradero. De las que más aguantan la cebada.',
            ],
            [
                'nombre' => 'Kurupí Menta y Boldo',
                'marca' => 'Kurupí',
                'tipo' => 'compuesta',
                'origen' => 'Paraguay',
                'precio' => 5200,
                'puntaje' => 7,
                'con_palo' => true,
                'fecha_prueba' => null,
                'descripcion' => 'Ideal para tereré con agua bien fría.',
            ],
            [
                'nombre' => 'Amanda Barbacuá',
                'marca' => 'Amanda',
                'tipo' => 'barbacua',
                'origen' => 'Misiones',
                'precio' => 6500,
                'puntaje' => 7,
                'con_palo' => true,
                'fecha_prueba' => '2026-09-30',
                'descripcion' => 'Secada con humo: tiene un gusto ahumado bien marcado.',
            ],
        ];

        foreach ($yerbas as $yerba) {
            Yerba::create($yerba);
        }
    }
}
