<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckSessionActivity
{
    /**
     * Handle an incoming request.
     *
     * Verifica la actividad de la sesión y actualiza el último acceso.
     * Si la sesión ha expirado, cierra la sesión automáticamente.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // No procesar si es una petición de logout (evitar conflictos)
        if ($request->routeIs('logout')) {
            return $next($request);
        }
        
        if (Auth::check()) {
            // Actualizar el último acceso en la sesión
            $request->session()->put('last_activity', now()->timestamp);
            
            // Verificar si la sesión ha expirado por inactividad
            $lastActivity = $request->session()->get('last_activity');
            $sessionLifetime = config('session.lifetime', 120) * 60; // Convertir minutos a segundos
            
            if ($lastActivity && (now()->timestamp - $lastActivity) > $sessionLifetime) {
                // La sesión ha expirado, cerrar sesión
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                // Si es una petición Inertia, usar Inertia::location para forzar recarga completa
                if ($request->header('X-Inertia')) {
                    return \Inertia\Inertia::location(route('login'));
                }
                
                // Si es una petición AJAX normal
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.',
                        'session_expired' => true,
                    ], 401);
                }
                
                return redirect()->route('login')->with('status', 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.');
            }
        }

        return $next($request);
    }
}

