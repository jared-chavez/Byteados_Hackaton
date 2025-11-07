<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'name' => 'Administrador Principal',
            'email' => 'admin@utc.edu.mx',
            'password' => Hash::make('admin123'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);

        Admin::create([
            'name' => 'Admin Cafetería',
            'email' => 'cafeteria@utc.edu.mx',
            'password' => Hash::make('cafe123'),
            'role' => 'admin',
            'status' => 'active',
        ]);
    }
}
