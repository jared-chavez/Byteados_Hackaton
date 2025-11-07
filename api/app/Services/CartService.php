<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Session;

class CartService
{
    /**
     * Obtener o crear carrito para un usuario o sesión
     */
    public function getOrCreateCart(?User $user = null, ?string $sessionId = null): Cart
    {
        if ($user) {
            // Buscar carrito activo del usuario
            $cart = Cart::where('user_id', $user->id)
                ->where('status', 'active')
                ->first();

            if (!$cart) {
                $cart = Cart::create([
                    'user_id' => $user->id,
                    'status' => 'active',
                    'expires_at' => now()->addDays(7), // Expira en 7 días
                ]);
            }

            return $cart;
        }

        // Para usuarios no autenticados, usar session_id
        if (!$sessionId) {
            $sessionId = Session::getId();
        }

        $cart = Cart::where('session_id', $sessionId)
            ->where('status', 'active')
            ->first();

        if (!$cart) {
            $cart = Cart::create([
                'session_id' => $sessionId,
                'status' => 'active',
                'expires_at' => now()->addDays(1), // Expira en 1 día para invitados
            ]);
        }

        return $cart;
    }

    /**
     * Agregar item al carrito
     */
    public function addItem(Cart $cart, Product $product, int $quantity = 1, ?string $specialInstructions = null): CartItem
    {
        // Verificar stock disponible
        if (!$product->hasStock($quantity)) {
            throw new \Exception("Stock insuficiente. Stock disponible: {$product->stock}, solicitado: {$quantity}");
        }

        // Verificar si el producto ya está en el carrito
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            // Actualizar cantidad
            $newQuantity = $cartItem->quantity + $quantity;
            
            // Verificar stock nuevamente con la nueva cantidad
            if (!$product->hasStock($newQuantity)) {
                throw new \Exception("Stock insuficiente para la cantidad total solicitada");
            }

            $cartItem->update([
                'quantity' => $newQuantity,
                'special_instructions' => $specialInstructions ?? $cartItem->special_instructions,
            ]);

            return $cartItem->fresh();
        }

        // Crear nuevo item
        return CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'special_instructions' => $specialInstructions,
        ]);
    }

    /**
     * Actualizar cantidad de un item
     */
    public function updateItem(CartItem $cartItem, int $quantity, ?string $specialInstructions = null): CartItem
    {
        $product = $cartItem->product;

        // Verificar stock disponible
        if (!$product->hasStock($quantity)) {
            throw new \Exception("Stock insuficiente. Stock disponible: {$product->stock}, solicitado: {$quantity}");
        }

        $cartItem->update([
            'quantity' => $quantity,
            'special_instructions' => $specialInstructions ?? $cartItem->special_instructions,
        ]);

        return $cartItem->fresh();
    }

    /**
     * Eliminar item del carrito
     */
    public function removeItem(CartItem $cartItem): bool
    {
        return $cartItem->delete();
    }

    /**
     * Calcular total del carrito
     */
    public function calculateCartTotal(Cart $cart): float
    {
        return $cart->items->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });
    }

    /**
     * Fusionar carritos (cuando un usuario hace login)
     */
    public function mergeCarts(Cart $sessionCart, Cart $userCart): Cart
    {
        foreach ($sessionCart->items as $sessionItem) {
            $existingItem = CartItem::where('cart_id', $userCart->id)
                ->where('product_id', $sessionItem->product_id)
                ->first();

            if ($existingItem) {
                // Sumar cantidades
                $newQuantity = $existingItem->quantity + $sessionItem->quantity;
                
                // Verificar stock
                if ($sessionItem->product->hasStock($newQuantity)) {
                    $existingItem->update(['quantity' => $newQuantity]);
                }
            } else {
                // Agregar item al carrito del usuario
                $sessionItem->update(['cart_id' => $userCart->id]);
            }
        }

        // Marcar carrito de sesión como convertido
        $sessionCart->update(['status' => 'converted']);

        return $userCart->fresh();
    }

    /**
     * Vaciar carrito
     */
    public function clearCart(Cart $cart): void
    {
        $cart->items()->delete();
    }
}

