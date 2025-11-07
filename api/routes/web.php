<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (No utilizadas - Frontend React maneja todas las rutas)
|--------------------------------------------------------------------------
|
| Este proyecto utiliza una arquitectura SPA (Single Page Application)
| con React. Todas las rutas de la aplicación están en routes/api.php
| para la API REST.
|
| El frontend React se sirve desde el puerto 3000 y se comunica con
| el backend a través del proxy configurado en vite.config.js.
|
*/

// Health check endpoint (opcional, para verificar que el servidor está activo)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'XpressUTC API is running',
        'timestamp' => now()->toIso8601String(),
    ]);
});
