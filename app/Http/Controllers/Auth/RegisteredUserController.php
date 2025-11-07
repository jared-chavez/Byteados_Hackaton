<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\InstitutionalEmail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:'.User::class,
                new \App\Rules\InstitutionalEmail(),
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => 'required|in:student,teacher',
            'phone' => 'nullable|string|max:20',
        ]);

        // Extraer student_id del correo si es estudiante
        $studentId = null;
1234567890123456
        ]);

        event(new Registered($user));

        // Enviar correo de verificación
        // Nota: Laravel Breeze envía automáticamente el correo cuando se dispara el evento Registered
        // si el modelo implementa MustVerifyEmail. Para asegurar el envío, lo hacemos explícitamente.
        try {
            if (method_exists($user, 'sendEmailVerificationNotification')) {
                $user->sendEmailVerificationNotification();
            }
        } catch (\Exception $e) {
            // Si falla el envío del correo, continuar con el registro
            \Log::warning('No se pudo enviar correo de verificación: ' . $e->getMessage());
        }

        Auth::login($user);
        
        $request->session()->regenerate();
        return redirect(route('dashboard', absolute: false));
    }
}
