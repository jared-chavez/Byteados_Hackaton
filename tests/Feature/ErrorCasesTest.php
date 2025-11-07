<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Admin;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ErrorCasesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Usuario normal no puede acceder a rutas de admin
     */
    public function test_user_cannot_access_admin_routes()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(403);
    }

    /**
     * Test: No se puede crear orden con carrito vacío
     */
    public function test_cannot_create_order_with_empty_cart()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/orders', [
                'payment_method' => 'cash',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Test: No se puede agregar producto inactivo al carrito
     */
    public function test_cannot_add_inactive_product_to_cart()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'status' => 'inactive',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 1,
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Test: No se puede agregar más cantidad de la disponible en stock
     */
    public function test_cannot_add_more_than_available_stock()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 5,
            'status' => 'active',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 10, // Más de lo disponible
            ]);

        $response->assertStatus(422);
    }

    /**
     * Test: No se puede cancelar orden ya completada
     */
    public function test_cannot_cancel_completed_order()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/orders/{$order->id}");

        $response->assertStatus(422);
    }

    /**
     * Test: Validación de email institucional
     */
    public function test_registration_requires_valid_institutional_email()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'invalid-email@gmail.com', // Email no institucional
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'user_type' => 'student',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test: Usuario no puede ver órdenes de otros usuarios
     */
    public function test_user_cannot_view_other_users_orders()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $token1 = $user1->createToken('auth_token')->plainTextToken;

        $order = Order::factory()->create([
            'user_id' => $user2->id,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token1)
            ->getJson("/api/orders/{$order->id}");

        $response->assertStatus(403);
    }
}

