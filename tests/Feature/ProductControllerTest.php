<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de listar productos (público)
     */
    public function test_can_list_products()
    {
        $category = Category::factory()->create(['status' => 'active']);
        Product::factory()->count(5)->create([
            'category_id' => $category->id,
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'price',
                            'stock',
                            'category',
                        ],
                    ],
                ],
            ]);
    }

    /**
     * Test de ver producto específico
     */
    public function test_can_show_product()
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'status' => 'active',
        ]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'product' => [
                        'id',
                        'name',
                        'price',
                        'stock',
                    ],
                ],
            ]);
    }

    /**
     * Test de crear producto (admin)
     */
    public function test_admin_can_create_product()
    {
        $admin = Admin::factory()->create();
        $token = $admin->createToken('admin_token')->plainTextToken;
        
        $category = Category::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/products', [
                'name' => 'Café Americano',
                'description' => 'Café americano caliente',
                'category_id' => $category->id,
                'price' => 25.00,
                'cost' => 10.00,
                'stock' => 100,
                'min_stock' => 10,
                'status' => 'active',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'product' => [
                        'id',
                        'name',
                        'price',
                    ],
                ],
                'message',
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Café Americano',
            'price' => 25.00,
        ]);
    }

    /**
     * Test de actualizar producto (admin)
     */
    public function test_admin_can_update_product()
    {
        $admin = Admin::factory()->create();
        $token = $admin->createToken('admin_token')->plainTextToken;
        
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/admin/products/{$product->id}", [
                'name' => 'Café Actualizado',
                'price' => 30.00,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Café Actualizado',
            'price' => 30.00,
        ]);
    }

    /**
     * Test de obtener stock de producto
     */
    public function test_can_get_product_stock()
    {
        $product = Product::factory()->create([
            'stock' => 50,
            'min_stock' => 10,
        ]);

        $response = $this->getJson("/api/products/{$product->id}/stock");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'product_id',
                    'product_name',
                    'stock',
                    'min_stock',
                    'is_low_stock',
                    'status',
                ],
            ])
            ->assertJson([
                'data' => [
                    'stock' => 50,
                    'min_stock' => 10,
                ],
            ]);
    }
}

