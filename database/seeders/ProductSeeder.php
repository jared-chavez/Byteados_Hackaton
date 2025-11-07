<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener categorías
        $bebidasCalientes = Category::where('name', 'Bebidas Calientes')->first();
        $bebidasFrias = Category::where('name', 'Bebidas Frías')->first();
        $comidaRapida = Category::where('name', 'Comida Rápida')->first();
        $snacks = Category::where('name', 'Snacks')->first();
        $postres = Category::where('name', 'Postres')->first();
        $comidaDia = Category::where('name', 'Comida del Día')->first();

        $products = [
            // Bebidas Calientes
            [
                'name' => 'Café Americano',
                'description' => 'Café negro americano',
                'category_id' => $bebidasCalientes->id,
                'price' => 25.00,
                'cost' => 10.00,
                'stock' => 100,
                'min_stock' => 20,
                'status' => 'active',
                'barcode' => '7501234567890',
            ],
            [
                'name' => 'Café con Leche',
                'description' => 'Café con leche caliente',
                'category_id' => $bebidasCalientes->id,
                'price' => 30.00,
                'cost' => 12.00,
                'stock' => 80,
                'min_stock' => 15,
                'status' => 'active',
                'barcode' => '7501234567891',
            ],
            [
                'name' => 'Capuchino',
                'description' => 'Café capuchino con espuma',
                'category_id' => $bebidasCalientes->id,
                'price' => 35.00,
                'cost' => 15.00,
                'stock' => 60,
                'min_stock' => 10,
                'status' => 'active',
                'barcode' => '7501234567892',
            ],
            [
                'name' => 'Té de Manzanilla',
                'description' => 'Té de manzanilla caliente',
                'category_id' => $bebidasCalientes->id,
                'price' => 20.00,
                'cost' => 8.00,
                'stock' => 50,
                'min_stock' => 10,
                'status' => 'active',
                'barcode' => '7501234567893',
            ],
            [
                'name' => 'Chocolate Caliente',
                'description' => 'Chocolate caliente cremoso',
                'category_id' => $bebidasCalientes->id,
                'price' => 32.00,
                'cost' => 13.00,
                'stock' => 70,
                'min_stock' => 15,
                'status' => 'active',
                'barcode' => '7501234567894',
            ],

            // Bebidas Frías
            [
                'name' => 'Coca Cola',
                'description' => 'Refresco de cola 500ml',
                'category_id' => $bebidasFrias->id,
                'price' => 25.00,
                'cost' => 12.00,
                'stock' => 150,
                'min_stock' => 30,
                'status' => 'active',
                'barcode' => '7501234567895',
            ],
            [
                'name' => 'Agua Natural',
                'description' => 'Agua embotellada 500ml',
                'category_id' => $bebidasFrias->id,
                'price' => 15.00,
                'cost' => 6.00,
                'stock' => 200,
                'min_stock' => 50,
                'status' => 'active',
                'barcode' => '7501234567896',
            ],
            [
                'name' => 'Jugo de Naranja',
                'description' => 'Jugo de naranja natural',
                'category_id' => $bebidasFrias->id,
                'price' => 28.00,
                'cost' => 12.00,
                'stock' => 60,
                'min_stock' => 15,
                'status' => 'active',
                'barcode' => '7501234567897',
            ],
            [
                'name' => 'Frappé de Fresa',
                'description' => 'Frappé de fresa con crema',
                'category_id' => $bebidasFrias->id,
                'price' => 40.00,
                'cost' => 18.00,
                'stock' => 40,
                'min_stock' => 10,
                'status' => 'active',
                'barcode' => '7501234567898',
            ],

            // Comida Rápida
            [
                'name' => 'Hamburguesa Clásica',
                'description' => 'Hamburguesa con carne, lechuga, tomate y queso',
                'category_id' => $comidaRapida->id,
                'price' => 65.00,
                'cost' => 30.00,
                'stock' => 50,
                'min_stock' => 10,
                'status' => 'active',
                'barcode' => '7501234567899',
            ],
            [
                'name' => 'Hot Dog',
                'description' => 'Hot dog con todos los ingredientes',
                'category_id' => $comidaRapida->id,
                'price' => 45.00,
                'cost' => 20.00,
                'stock' => 60,
                'min_stock' => 15,
                'status' => 'active',
                'barcode' => '7501234567900',
            ],
            [
                'name' => 'Torta de Jamón',
                'description' => 'Torta de jamón con queso y vegetales',
                'category_id' => $comidaRapida->id,
                'price' => 50.00,
                'cost' => 22.00,
                'stock' => 40,
                'min_stock' => 10,
                'status' => 'active',
                'barcode' => '7501234567901',
            ],
            [
                'name' => 'Pizza Individual',
                'description' => 'Pizza individual de queso',
                'category_id' => $comidaRapida->id,
                'price' => 55.00,
                'cost' => 25.00,
                'stock' => 30,
                'min_stock' => 8,
                'status' => 'active',
                'barcode' => '7501234567902',
            ],

            // Snacks
            [
                'name' => 'Papas Fritas',
                'description' => 'Papas fritas crujientes',
                'category_id' => $snacks->id,
                'price' => 35.00,
                'cost' => 15.00,
                'stock' => 80,
                'min_stock' => 20,
                'status' => 'active',
                'barcode' => '7501234567903',
            ],
            [
                'name' => 'Nachos con Queso',
                'description' => 'Nachos con queso derretido',
                'category_id' => $snacks->id,
                'price' => 45.00,
                'cost' => 20.00,
                'stock' => 50,
                'min_stock' => 12,
                'status' => 'active',
                'barcode' => '7501234567904',
            ],
            [
                'name' => 'Palomitas',
                'description' => 'Palomitas de maíz',
                'category_id' => $snacks->id,
                'price' => 25.00,
                'cost' => 10.00,
                'stock' => 100,
                'min_stock' => 25,
                'status' => 'active',
                'barcode' => '7501234567905',
            ],

            // Postres
            [
                'name' => 'Pastel de Chocolate',
                'description' => 'Rebanada de pastel de chocolate',
                'category_id' => $postres->id,
                'price' => 40.00,
                'cost' => 18.00,
                'stock' => 30,
                'min_stock' => 8,
                'status' => 'active',
                'barcode' => '7501234567906',
            ],
            [
                'name' => 'Galletas',
                'description' => 'Paquete de 3 galletas caseras',
                'category_id' => $postres->id,
                'price' => 20.00,
                'cost' => 8.00,
                'stock' => 60,
                'min_stock' => 15,
                'status' => 'active',
                'barcode' => '7501234567907',
            ],
            [
                'name' => 'Flan',
                'description' => 'Flan napolitano',
                'category_id' => $postres->id,
                'price' => 30.00,
                'cost' => 12.00,
                'stock' => 40,
                'min_stock' => 10,
                'status' => 'active',
                'barcode' => '7501234567908',
            ],

            // Comida del Día
            [
                'name' => 'Comida Corrida',
                'description' => 'Comida corrida con sopa, arroz, guisado y agua',
                'category_id' => $comidaDia->id,
                'price' => 75.00,
                'cost' => 35.00,
                'stock' => 25,
                'min_stock' => 5,
                'status' => 'active',
                'barcode' => '7501234567909',
            ],
            [
                'name' => 'Enchiladas',
                'description' => 'Enchiladas rojas con pollo',
                'category_id' => $comidaDia->id,
                'price' => 70.00,
                'cost' => 32.00,
                'stock' => 20,
                'min_stock' => 5,
                'status' => 'active',
                'barcode' => '7501234567910',
            ],
            [
                'name' => 'Tacos de Guisado',
                'description' => 'Orden de 3 tacos de guisado del día',
                'category_id' => $comidaDia->id,
                'price' => 60.00,
                'cost' => 28.00,
                'stock' => 35,
                'min_stock' => 8,
                'status' => 'active',
                'barcode' => '7501234567911',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
