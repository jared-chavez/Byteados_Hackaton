<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CartService
{
    public function getOrCreateCart(?User $user = null, ?string $sessionId = null): Cart
    {
        $query = Cart::query();

        if ($user) {
            $query->where('user_id', $user->id);
        } else {
            $query->where('session_id', $sessionId);
        }

        $cart = $query->first();

        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user?->id,
                'session_id' => $user ? null : $sessionId,
                'status' => 'active',
                'expires_at' => now()->addMinutes(1), // Carritos expiran en 1 minuto (prueba)
            ]);
        } else {
            // Solo renovar expiración si el carrito está expirado, no en cada acceso
            if ($cart->isExpired()) {
                $cart->update([
                    'status' => 'active',
                    'expires_at' => now()->addMinutes(1),
                ]);
            }
            // Si no está expirado, no actualizar expires_at para evitar que updated_at cambie
        }

        return $cart;
    }

    public function addItem(Cart $cart, Product $product, int $quantity, ?string $specialInstructions = null): CartItem
    {
        if (!$product->hasStock($quantity)) {
            throw new \Exception('Stock insuficiente para este producto');
        }

        return DB::transaction(function () use ($cart, $product, $quantity, $specialInstructions) {
            // Renovar expiración del carrito al agregar items
            $cart->update([
                'expires_at' => now()->addMinutes(1),
                'status' => 'active',
            ]);

            $existingItem = $cart->items()
                ->where('product_id', $product->id)
                ->first();

            if ($existingItem) {
                $newQuantity = $existingItem->quantity + $quantity;
                
                if (!$product->hasStock($newQuantity)) {
                    throw new \Exception('Stock insuficiente para la cantidad solicitada');
                }

                $existingItem->update([
                    'quantity' => $newQuantity,
                    'price' => $product->price,
                    'special_instructions' => $specialInstructions,
                ]);

                return $existingItem;
            }

            return CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price,
                'special_instructions' => $specialInstructions,
            ]);
        });
    }

    public function updateItem(CartItem $cartItem, int $quantity, ?string $specialInstructions = null): CartItem
    {
        if (!$cartItem->product->hasStock($quantity)) {
            throw new \Exception('Stock insuficiente para la cantidad solicitada');
        }

        $cartItem->update([
            'quantity' => $quantity,
            'price' => $cartItem->product->price,
            'special_instructions' => $specialInstructions,
        ]);

        return $cartItem;
    }

    public function removeItem(CartItem $cartItem): void
    {
        $cartItem->delete();
    }

    public function clearCart(Cart $cart): void
    {
        $cart->items()->delete();
    }

    /**
     * Limpiar carritos expirados
     */
    public function cleanExpiredCarts(int $minutesOld = 1): int
    {
        $expiredCarts = Cart::where('expires_at', '<', now())
            ->orWhere(function ($query) use ($minutesOld) {
                $query->whereNull('expires_at')
                    ->where('created_at', '<', now()->subMinutes($minutesOld));
            })
            ->get();

        $count = 0;
        foreach ($expiredCarts as $cart) {
            // Eliminar items del carrito
            $cart->items()->delete();
            // Marcar como abandonado o eliminar
            $cart->markAsAbandoned();
            $count++;
        }

        return $count;
    }

    /**
     * Eliminar carritos abandonados antiguos
     */
    public function deleteOldAbandonedCarts(int $daysOld = 30): int
    {
        $deleted = Cart::where('status', 'abandoned')
            ->where('updated_at', '<', now()->subDays($daysOld))
            ->delete();

        return $deleted;
    }

    public function mergeCarts(Cart $sessionCart, Cart $userCart): Cart
    {
        return DB::transaction(function () use ($sessionCart, $userCart) {
            foreach ($sessionCart->items as $sessionItem) {
                $existingItem = $userCart->items()
                    ->where('product_id', $sessionItem->product_id)
                    ->first();

                if ($existingItem) {
                    $existingItem->update([
                        'quantity' => $existingItem->quantity + $sessionItem->quantity,
                        'price' => $sessionItem->product->price,
                    ]);
                } else {
                    CartItem::create([
                        'cart_id' => $userCart->id,
                        'product_id' => $sessionItem->product_id,
                        'quantity' => $sessionItem->quantity,
                        'price' => $sessionItem->price,
                        'special_instructions' => $sessionItem->special_instructions,
                    ]);
                }
            }

            $sessionCart->delete();
            return $userCart;
        });
    }
}