<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;

class OrderService
{
    protected $inventoryService;

    public function __construct(\App\Services\InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Crear orden desde carrito
     */
    public function createOrderFromCart(Cart $cart, ?string $notes = null, ?string $paymentMethod = null): Order
    {
        if ($cart->items->isEmpty()) {
            throw new \Exception('El carrito está vacío');
        }

        // Verificar stock de todos los items
        $this->checkStockAvailability($cart->items);

        // Calcular total
        $total = $this->calculateTotal($cart->items);

        // Generar número de orden
        $orderNumber = $this->generateOrderNumber();

        // Crear orden
        $order = Order::create([
            'order_number' => $orderNumber,
            'user_id' => $cart->user_id,
            'status' => 'pending',
            'total' => $total,
            'payment_status' => 'pending',
            'payment_method' => $paymentMethod,
            'notes' => $notes,
        ]);

        // Crear items de la orden
        foreach ($cart->items as $cartItem) {
            $product = $cartItem->product;
            
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $cartItem->quantity,
                'unit_price' => $product->price,
                'subtotal' => $cartItem->quantity * $product->price,
                'special_instructions' => $cartItem->special_instructions,
            ]);
        }

        // Marcar carrito como convertido
        $cart->update(['status' => 'converted']);

        return $order->load('items.product');
    }

    /**
     * Calcular total de items
     */
    public function calculateTotal(Collection $items): float
    {
        return $items->sum(function ($item) {
            $product = $item instanceof \App\Models\CartItem ? $item->product : $item->product;
            return $item->quantity * $product->price;
        });
    }

    /**
     * Verificar disponibilidad de stock
     */
    public function checkStockAvailability(Collection $items): void
    {
        foreach ($items as $item) {
            $product = $item instanceof \App\Models\CartItem ? $item->product : $item->product;
            
            if (!$product->hasStock($item->quantity)) {
                throw new \Exception(
                    "Stock insuficiente para el producto '{$product->name}'. " .
                    "Stock disponible: {$product->stock}, solicitado: {$item->quantity}"
                );
            }
        }
    }

    /**
     * Actualizar estado de orden
     */
    public function updateOrderStatus(Order $order, string $status): Order
    {
        $validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
        
        if (!in_array($status, $validStatuses)) {
            throw new \Exception("Estado inválido: {$status}");
        }

        // Si se confirma la orden, reducir stock
        if ($status === 'confirmed' && $order->status === 'pending') {
            foreach ($order->items as $orderItem) {
                $this->inventoryService->reduceStockFromOrder(
                    $orderItem->product,
                    $orderItem->quantity,
                    $order
                );
            }
        }

        $order->update(['status' => $status]);

        if ($status === 'completed') {
            $order->markAsCompleted();
        }

        return $order->fresh();
    }

    /**
     * Generar número único de orden
     */
    public function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "UTC-{$date}-";
        
        // Obtener el último número de orden del día
        $lastOrder = Order::where('order_number', 'like', "{$prefix}%")
            ->orderBy('order_number', 'desc')
            ->first();

        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->order_number, -5);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 5, '0', STR_PAD_LEFT);
    }
}

