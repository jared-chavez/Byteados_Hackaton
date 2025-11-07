<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de listar categorías (público)
     */
    public function test_can_list_categories()
    {
        Category::factory()->count(5)->create(['status' => 'active']);

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'status',
                    ],
                ],
            ]);
    }

    /**
     * Test de ver categoría específica
     */
    public function test_can_show_category()
    {
        $category = Category::factory()->create(['status' => 'active']);

        $response = $this->getJson("/api/categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'category' => [
                        'id',
                        'name',
                    ],
                ],
            ]);
    }

    /**
     * Test de crear categoría (admin)
     */
    public function test_admin_can_create_category()
    {
        $admin = Admin::factory()->create();
        $token = $admin->createToken('admin_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/categories', [
                'name' => 'Bebidas Calientes',
                'description' => 'Cafés, tés y bebidas calientes',
                'display_order' => 1,
                'status' => 'active',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'category' => [
                        'id',
                        'name',
                    ],
                ],
                'message',
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Bebidas Calientes',
        ]);
    }

    /**
     * Test de actualizar categoría (admin)
     */
    public function test_admin_can_update_category()
    {
        $admin = Admin::factory()->create();
        $token = $admin->createToken('admin_token')->plainTextToken;

        $category = Category::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/admin/categories/{$category->id}", [
                'name' => 'Categoría Actualizada',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Categoría Actualizada',
        ]);
    }
}

