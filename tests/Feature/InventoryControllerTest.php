<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Admin::factory()->create();
        $this->token = $this->admin->createToken('admin_token')->plainTextToken;
    }

    /**
     * Test de listar inventario
     */
    public function test_admin_can_list_inventory()
    {
        $category = Category::factory()->create();
        Product::factory()->count(5)->create([
            'category_id' => $category->id,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->getJson('/api/admin/inventory');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'stock',
                            'min_stock',
                        ],
                    ],
                ],
            ]);
    }

    /**
     * Test de obtener productos con stock bajo
     */
    public function test_admin_can_get_low_stock_products()
    {
        $category = Category::factory()->create();
        
        // Producto con stock bajo
        Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 5,
            'min_stock' => 10,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->getJson('/api/admin/inventory/low-stock');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'products',
                    'count',
                ],
            ]);
    }

    /**
     * Test de ajustar inventario
     */
    public function test_admin_can_adjust_inventory()
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 50,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson('/api/admin/inventory/adjust', [
                'product_id' => $product->id,
                'quantity' => 10,
                'reason' => 'Ajuste manual',
                'type' => 'in',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $product->refresh();
        $this->assertEquals(60, $product->stock);
    }

    /**
     * Test de entrada de stock
     */
    public function test_admin_can_add_stock()
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 50,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson('/api/admin/inventory/stock-in', [
                'product_id' => $product->id,
                'quantity' => 20,
                'reason' => 'Compra de proveedor',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $product->refresh();
        $this->assertEquals(70, $product->stock);
    }

    /**
     * Test de salida de stock
     */
    public function test_admin_can_remove_stock()
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 50,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson('/api/admin/inventory/stock-out', [
                'product_id' => $product->id,
                'quantity' => 15,
                'reason' => 'Pérdida o daño',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $product->refresh();
        $this->assertEquals(35, $product->stock);
    }
}

