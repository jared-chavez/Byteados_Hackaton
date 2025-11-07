<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de listar órdenes del usuario
     */
    public function test_user_can_list_their_orders()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        // Crear algunas órdenes para el usuario
        Order::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/orders');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'order_number',
                            'status',
                            'total',
                        ],
                    ],
                ],
            ]);
    }

    /**
     * Test de crear orden desde el carrito
     */
    public function test_user_can_create_order()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 100,
            'status' => 'active',
        ]);

        // Primero agregar items al carrito
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 2,
            ]);

        // Ahora crear la orden desde el carrito
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/orders', [
                'payment_method' => 'cash',
                'notes' => 'Test order',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'order' => [
                        'id',
                        'order_number',
                        'status',
                        'total',
                    ],
                ],
                'message',
            ]);
    }

    /**
     * Test de ver detalle de orden
     */
    public function test_user_can_view_order_details()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $order = Order::factory()->create(['user_id' => $user->id]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'order' => [
                        'id',
                        'order_number',
                        'status',
                        'total',
                    ],
                ],
            ]);
    }

    /**
     * Test de cancelar orden
     */
    public function test_user_can_cancel_order()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'cancelled',
        ]);
    }
}

