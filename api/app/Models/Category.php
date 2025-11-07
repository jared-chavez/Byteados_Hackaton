<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_url',
        'display_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
        ];
    }

    /**
     * Obtener los productos de esta categoría
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Obtener solo productos activos
     */
    public function activeProducts(): HasMany
    {
        return $this->products()->where('status', 'active');
    }
}
