<?php

namespace App\Services;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminService
{
    /**
     * Crear administrador
     */
    public function createAdmin(array $data): Admin
    {
        return Admin::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'admin_id' => $data['admin_id'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'staff',
            'permissions' => $data['permissions'] ?? [],
            'phone' => $data['phone'] ?? null,
            'status' => $data['status'] ?? 'active',
        ]);
    }

    /**
     * Actualizar permisos de administrador
     */
    public function updatePermissions(Admin $admin, array $permissions): Admin
    {
        $admin->update(['permissions' => $permissions]);
        return $admin->fresh();
    }

    /**
     * Verificar si un administrador tiene un permiso específico
     */
    public function checkPermission(Admin $admin, string $permission): bool
    {
        return $admin->hasPermission($permission);
    }

    /**
     * Verificar si un administrador puede realizar una acción
     */
    public function canPerformAction(Admin $admin, string $action): bool
    {
        // Super admin puede hacer todo
        if ($admin->isSuperAdmin()) {
            return true;
        }

        // Verificar permisos específicos según el rol
        $rolePermissions = [
            'admin' => [
                'manage_products',
                'manage_categories',
                'manage_inventory',
                'manage_orders',
                'view_reports',
                'manage_users',
            ],
            'staff' => [
                'manage_orders',
                'view_reports',
            ],
            'warehouse_manager' => [
                'manage_inventory',
                'view_reports',
            ],
        ];

        $allowedPermissions = $rolePermissions[$admin->role] ?? [];
        
        // Verificar si el permiso está en los del rol o en los permisos personalizados
        return in_array($action, $allowedPermissions) || $admin->hasPermission($action);
    }
}

