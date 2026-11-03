<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Se ejecuta con: php artisan migrate --seed  (o php artisan db:seed)
     */
    public function run(): void
    {
        $this->call(YerbaSeeder::class);
    }
}
