<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Listar administradores
     */
    public function index(Request $request)
    {
        $query = Admin::query();

        // Filtros
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('admin_id', 'like', "%{$search}%");
            });
        }

        $admins = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $admins,
        ]);
    }

    /**
     * Mostrar detalle de administrador
     */
    public function show($id)
    {
        $admin = Admin::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $admin,
            ],
        ]);
    }

    /**
     * Crear nuevo administrador
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'admin_id' => 'required|string|unique:admins,admin_id',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:super_admin,admin,staff,warehouse_manager',
            'permissions' => 'nullable|array',
            'phone' => 'nullable|string|max:20',
        ]);

        $admin = Admin::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'admin_id' => $validated['admin_id'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'permissions' => $validated['permissions'] ?? [],
            'phone' => $validated['phone'] ?? null,
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $admin,
            ],
            'message' => 'Administrador creado exitosamente',
        ], 201);
    }

    /**
     * Actualizar administrador
     */
    public function update(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:admins,email,' . $id,
            'admin_id' => 'sometimes|string|unique:admins,admin_id,' . $id,
            'password' => 'sometimes|string|min:8|confirmed',
            'role' => 'sometimes|in:super_admin,admin,staff,warehouse_manager',
            'phone' => 'nullable|string|max:20',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $admin->update($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $admin->fresh(),
            ],
            'message' => 'Administrador actualizado exitosamente',
        ]);
    }

    /**
     * Cambiar estado de administrador
     */
    public function updateStatus(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);

        // No permitir desactivar a sí mismo
        if ($admin->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes cambiar tu propio estado',
            ], 422);
        }

        $validated = $request->validate([
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $admin->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $admin->fresh(),
            ],
            'message' => "Estado del administrador actualizado a: {$validated['status']}",
        ]);
    }

    /**
     * Actualizar permisos de administrador
     */
    public function updatePermissions(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);

        // Solo super_admin puede cambiar permisos
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Solo los super administradores pueden cambiar permisos',
            ], 403);
        }

        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string',
        ]);

        $admin->update(['permissions' => $validated['permissions']]);

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $admin->fresh(),
            ],
            'message' => 'Permisos actualizados exitosamente',
        ]);
    }
}
