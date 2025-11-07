<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Bebidas Calientes',
                'description' => 'Cafés, tés y bebidas calientes',
                'display_order' => 1,
                'status' => 'active',
            ],
            [
                'name' => 'Bebidas Frías',
                'description' => 'Refrescos, jugos y bebidas frías',
                'display_order' => 2,
                'status' => 'active',
            ],
            [
                'name' => 'Comida Rápida',
                'description' => 'Hamburguesas, hot dogs y comida rápida',
                'display_order' => 3,
                'status' => 'active',
            ],
            [
                'name' => 'Snacks',
                'description' => 'Papas, nachos y botanas',
                'display_order' => 4,
                'status' => 'active',
            ],
            [
                'name' => 'Postres',
                'description' => 'Pasteles, galletas y dulces',
                'display_order' => 5,
                'status' => 'active',
            ],
            [
                'name' => 'Comida del Día',
                'description' => 'Platillos del día y especialidades',
                'display_order' => 6,
                'status' => 'active',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
