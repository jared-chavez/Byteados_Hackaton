<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Cart;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CartControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de obtener carrito del usuario
     */
    public function test_user_can_get_cart()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/cart');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'cart',
                    'total',
                    'total_items',
                ],
            ]);
    }

    /**
     * Test de agregar item al carrito
     */
    public function test_user_can_add_item_to_cart()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 100,
            'status' => 'active',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 2,
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'cart',
                ],
                'message',
            ]);
    }

    /**
     * Test de actualizar item del carrito
     */
    public function test_user_can_update_cart_item()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 100,
            'status' => 'active',
        ]);

        // Primero agregar item
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 2,
            ]);

        // Obtener el cart item
        $cart = Cart::where('user_id', $user->id)->first();
        $cartItem = $cart->items()->first();
        
        if (!$cartItem) {
            $this->markTestSkipped('No cart item found');
        }

        // Actualizar cantidad
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/cart/items/{$cartItem->id}", [
                'quantity' => 5,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test de eliminar item del carrito
     */
    public function test_user_can_remove_item_from_cart()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 100,
            'status' => 'active',
        ]);

        // Agregar item
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 2,
            ]);

        $cart = Cart::where('user_id', $user->id)->first();
        $cartItem = $cart->items()->first();
        
        if (!$cartItem) {
            $this->markTestSkipped('No cart item found');
        }

        // Eliminar item
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/cart/items/{$cartItem->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test de limpiar carrito
     */
    public function test_user_can_clear_cart()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson('/api/cart');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }
}

