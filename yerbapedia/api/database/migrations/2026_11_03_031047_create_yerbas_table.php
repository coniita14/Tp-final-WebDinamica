<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Crea la tabla "yerbas".
     */
    public function up(): void
    {
        Schema::create('yerbas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');                    // texto: "Playadito Suave"
            $table->string('marca');                     // texto: "Playadito"
            $table->string('tipo');                      // tradicional, suave, despalada, compuesta, barbacuá
            $table->string('origen');                    // provincia o país
            $table->decimal('precio', 10, 2);            // número: precio del paquete de 1 kg
            $table->unsignedTinyInteger('puntaje');      // número del 1 al 10
            $table->boolean('con_palo')->default(true);  // booleano
            $table->date('fecha_prueba')->nullable();    // fecha en que la probé
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Borra la tabla.
     */
    public function down(): void
    {
        Schema::dropIfExists('yerbas');
    }
};
