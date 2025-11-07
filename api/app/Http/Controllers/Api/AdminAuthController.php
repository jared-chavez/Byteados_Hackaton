<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    /**
     * Login de administrador
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        if ($admin->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Tu cuenta está inactiva o suspendida.',
            ], 403);
        }

        // Actualizar último login
        $admin->update(['last_login_at' => now()]);

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $admin,
                'token' => $token,
            ],
            'message' => 'Login exitoso',
        ]);
    }

    /**
     * Logout de administrador
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }

    /**
     * Obtener administrador autenticado
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $request->user(),
            ],
        ]);
    }
}
