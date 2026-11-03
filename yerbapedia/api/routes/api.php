<?php

use App\Http\Controllers\YerbaController;
use Illuminate\Support\Facades\Route;

// Crea las 5 rutas del CRUD:
// GET /api/yerbas, POST /api/yerbas, GET /api/yerbas/{id},
// PUT/PATCH /api/yerbas/{id}, DELETE /api/yerbas/{id}
Route::apiResource('yerbas', YerbaController::class);
