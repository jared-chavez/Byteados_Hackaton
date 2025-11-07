<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     * Usa el hash del manifest para invalidar caché cuando cambian los assets.
     */
    public function version(Request $request): ?string
    {
        // Obtener la versión del manifest de Vite
        $manifestPath = public_path('build/manifest.json');
        
        if (file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
            // Usar el hash del archivo app.jsx como versión
            if (isset($manifest['resources/js/app.jsx']['file'])) {
                // Extraer el hash del nombre del archivo (ej: app-DPzbanP8.js -> DPzbanP8)
                preg_match('/app-([a-zA-Z0-9]+)\.js/', $manifest['resources/js/app.jsx']['file'], $matches);
                if (isset($matches[1])) {
                    return $matches[1];
                }
            }
        }
        
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = Auth::guard('web')->user();
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_type' => $user->user_type ?? null,
                ] : null,
            ],
        ];
    }
}
