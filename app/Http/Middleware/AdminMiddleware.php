<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Admin;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !($user instanceof Admin)) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso denegado. Se requieren permisos de administrador.',
            ], 403);
        }

        if (!$user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Cuenta de administrador inactiva.',
            ], 403);
        }

        return $next($request);
    }
}
