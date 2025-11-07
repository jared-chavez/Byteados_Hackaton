<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        // Establecer la actividad inicial de la sesión
        $request->session()->put('last_activity', now()->timestamp);
        
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse|Response|JsonResponse
    {
        // Guardar información necesaria antes de destruir la sesión
        $isInertiaRequest = $request->header('X-Inertia');
        $loginRoute = route('login');
        
        // Cerrar sesión del usuario primero
        Auth::guard('web')->logout();

        // Invalidar la sesión (esto limpia todos los datos)
        $request->session()->invalidate();

        // Regenerar el token CSRF para la nueva sesión
        $request->session()->regenerateToken();

        // Si es una petición Inertia, usar Inertia::location para forzar recarga completa
        if ($isInertiaRequest) {
            return Inertia::location($loginRoute);
        }

        // Si es una petición AJAX/JSON
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Sesión cerrada exitosamente.',
                'redirect' => $loginRoute
            ], 200);
        }

        // Redirección normal
        return redirect($loginRoute)->with('status', 'Sesión cerrada exitosamente.');
    }
}
