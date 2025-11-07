<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class InventoryLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'admin_id',
        'type',
        'quantity',
        'previous_stock',
        'new_stock',
        'reason',
        'reference_id',
        'reference_type',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'previous_stock' => 'integer',
            'new_stock' => 'integer',
        ];
    }

    /**
     * Obtener el producto relacionado
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Obtener el administrador que hizo el cambio
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    /**
     * Obtener la referencia polimórfica (Order, etc.)
     */
    public function reference(): MorphTo
    {
        return $this->morphTo('reference');
    }
}
