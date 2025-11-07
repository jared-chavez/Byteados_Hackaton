<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\InventoryService;
use Illuminate\Support\Facades\DB;

class OrderService
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function createOrderFromCart(Cart $cart, ?string $notes = null, ?string $paymentMethod = null): Order
    {
        if ($cart->isEmpty()) {
            throw new \Exception('El carrito está vacío');
        }

        return DB::transaction(function () use ($cart, $notes, $paymentMethod) {
            // Verificar stock disponible
            foreach ($cart->items as $item) {
                if (!$item->product->hasStock($item->quantity)) {
                    throw new \Exception("Stock insuficiente para {$item->product->name}");
                }
            }

            // Calcular totales
            $subtotal = $cart->total;
            $tax = $subtotal * 0.16; // 16% IVA
            $total = $subtotal + $tax;

            // Crear orden
            // Si se proporciona un método de pago, asumimos que el pago se completó
            $order = Order::create([
                'user_id' => $cart->user_id,
                'status' => 'pending',
                'payment_status' => $paymentMethod ? 'paid' : 'pending',
                'payment_method' => $paymentMethod,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => $notes,
            ]);

            // Crear items de la orden
            foreach ($cart->items as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'product_description' => $cartItem->product->description,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'subtotal' => $cartItem->subtotal,
                    'special_instructions' => $cartItem->special_instructions,
                ]);

                // Reducir stock
                $this->inventoryService->stockOut(
                    $cartItem->product,
                    $cartItem->quantity,
                    null,
                    "Venta - Orden #{$order->order_number}",
                    $order->id,
                    Order::class
                );
            }

            // Limpiar carrito
            $cart->clear();

            return $order->load(['items.product', 'user']);
        });
    }

    public function updateOrderStatus(Order $order, string $status): Order
    {
        $validTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['preparing', 'cancelled'],
            'preparing' => ['ready', 'cancelled'],
            'ready' => ['completed'],
            'completed' => [],
            'cancelled' => [],
        ];

        if (!in_array($status, $validTransitions[$order->status] ?? [])) {
            throw new \Exception("No se puede cambiar de {$order->status} a {$status}");
        }

        $order->update(['status' => $status]);

        if ($status === 'completed') {
            $order->complete();
        } elseif ($status === 'cancelled') {
            $this->restoreStock($order);
            $order->cancel();
        }

        return $order;
    }

    protected function restoreStock(Order $order): void
    {
        foreach ($order->items as $item) {
            if ($item->product) {
                $this->inventoryService->stockIn(
                    $item->product,
                    $item->quantity,
                    null,
                    "Devolución - Orden cancelada #{$order->order_number}",
                    $order->id,
                    Order::class
                );
            }
        }
    }
}