<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_url',
        'image_blob',
        'display_order',
        'status',
    ];

    protected $casts = [
        'display_order' => 'integer',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function isActive()
    {
        return $this->status === 'active';
    }

    public function getImageUrlAttribute($value)
    {
        if ($value) {
            return $value;
        }
        
        if ($this->image_blob) {
            return route('api.images.category', $this->id);
        }
        
        return null;
    }
}