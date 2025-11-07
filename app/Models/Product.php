<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'price',
        'cost',
        'stock',
        'min_stock',
        'image_url',
        'image_blob',
        'barcode',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost' => 'decimal:2',
        'stock' => 'integer',
        'min_stock' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function inventoryLogs()
    {
        return $this->hasMany(InventoryLog::class);
    }

    public function isActive()
    {
        return $this->status === 'active';
    }

    public function isLowStock()
    {
        return $this->stock <= $this->min_stock;
    }

    public function hasStock($quantity = 1)
    {
        return $this->stock >= $quantity;
    }

    public function getImageUrlAttribute($value)
    {
        if ($value) {
            return $value;
        }
        
        if ($this->image_blob) {
            return route('api.images.product', $this->id);
        }
        
        return null;
    }
}