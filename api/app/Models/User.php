<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'student_id',
        'teacher_id',
        'user_type',
        'password',
        'phone',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    /**
     * Verificar si el usuario es estudiante
     */
    public function isStudent(): bool
    {
        return $this->user_type === 'student';
    }
    
    /**
     * Verificar si el usuario es maestro
     */
    public function isTeacher(): bool
    {
        return $this->user_type === 'teacher';
    }

    /**
     * Obtener los carritos del usuario
     */
    public function carts()
    {
        return $this->hasMany(\App\Models\Cart::class);
    }

    /**
     * Obtener las órdenes del usuario
     */
    public function orders()
    {
        return $this->hasMany(\App\Models\Order::class);
    }
}
