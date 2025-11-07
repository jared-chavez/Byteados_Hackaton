<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Verificar que el usuario autenticado es un Admin (no un User regular)
        if (!$user || !($user instanceof \App\Models\Admin)) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado. Se requiere autenticación de administrador.',
            ], 403);
        }
        
        // Verificar que el admin esté activo
        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Tu cuenta de administrador está inactiva o suspendida.',
            ], 403);
        }
        
        return $next($request);
    }
}
