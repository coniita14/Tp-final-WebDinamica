<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // En /api/* los errores siempre se devuelven como JSON
        // (aunque Thunder Client no mande el header Accept: application/json).
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Cuando findOrFail() no encuentra el registro, Laravel tira un 404.
        // Acá le cambiamos el mensaje para que sea claro y en castellano.
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null; // fuera de la API, Laravel responde como siempre
            }

            $mensaje = $e->getPrevious() instanceof ModelNotFoundException
                ? 'No existe ninguna yerba con ese id.'
                : 'La ruta pedida no existe en la API.';

            return response()->json(['message' => $mensaje], 404);
        });
    })->create();
