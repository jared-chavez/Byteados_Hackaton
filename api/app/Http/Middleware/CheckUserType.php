<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserType
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$types  Tipos de usuario permitidos (student, teacher)
     */
    public function handle(Request $request, Closure $next, string ...$types): Response
    {
        $user = $request->user();
        
        // Verificar que el usuario autenticado es un User (no un Admin)
        if (!$user || !($user instanceof \App\Models\User)) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado. Se requiere autenticación de usuario.',
            ], 403);
        }
        
        // Verificar que el usuario esté activo
        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Tu cuenta está inactiva o suspendida.',
            ], 403);
        }
        
        // Si se especificaron tipos, verificar que el usuario sea de uno de esos tipos
        if (!empty($types) && !in_array($user->user_type, $types)) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado. Tipo de usuario no permitido.',
            ], 403);
        }
        
        return $next($request);
    }
}
