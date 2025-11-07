<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Listar usuarios (estudiantes y maestros)
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Filtros
        if ($request->has('user_type')) {
            $query->where('user_type', $request->user_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%")
                  ->orWhere('teacher_id', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Mostrar detalle de usuario
     */
    public function show($id)
    {
        $user = User::with(['orders', 'carts'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Actualizar usuario
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'status' => 'sometimes|in:active,inactive,suspended',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->fresh(),
            ],
            'message' => 'Usuario actualizado exitosamente',
        ]);
    }

    /**
     * Cambiar estado de usuario
     */
    public function updateStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $user->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->fresh(),
            ],
            'message' => "Estado del usuario actualizado a: {$validated['status']}",
        ]);
    }

    /**
     * Órdenes de un usuario
     */
    public function orders(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $orders = $user->orders()
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'orders' => $orders,
            ],
        ]);
    }
}
