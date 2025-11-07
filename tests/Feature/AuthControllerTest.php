<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de registro de usuario
     */
    public function test_user_can_register()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Juan Pérez',
            'email' => '21123456@alumno.utc.edu.mx',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'user_type' => 'student',
            'phone' => '1234567890',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'user_type',
                    ],
                    'token',
                ],
                'message',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => '21123456@alumno.utc.edu.mx',
            'user_type' => 'student',
        ]);
    }

    /**
     * Test de login de usuario
     */
    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@utc.edu.mx',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@utc.edu.mx',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user',
                    'token',
                ],
                'message',
            ])
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test de login con credenciales incorrectas
     */
    public function test_user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@utc.edu.mx',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@utc.edu.mx',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422);
    }

    /**
     * Test de obtener usuario autenticado
     */
    public function test_authenticated_user_can_get_profile()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user' => [
                        'id',
                        'name',
                        'email',
                    ],
                ],
            ]);
    }

    /**
     * Test de logout
     */
    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }
}

