<?php

namespace App\Services;

use App\Models\InventoryLog;
use App\Models\Product;
use App\Models\Admin;
use Illuminate\Database\Eloquent\Model;

class InventoryService
{
    /**
     * Ajustar stock de un producto
     */
    public function adjustStock(
        Product $product,
        int $quantity,
        string $type,
        ?Admin $admin = null,
        ?string $reason = null,
        ?Model $reference = null
    ): InventoryLog {
        $previousStock = $product->stock;
        $newStock = $previousStock + $quantity;

        // Actualizar stock del producto
        $product->update(['stock' => $newStock]);

        // Actualizar status si es necesario
        if ($newStock <= 0) {
            $product->update(['status' => 'out_of_stock']);
        } elseif ($product->status === 'out_of_stock' && $newStock > 0) {
            $product->update(['status' => 'active']);
        }

        // Crear log
        return InventoryLog::create([
            'product_id' => $product->id,
            'admin_id' => $admin?->id,
            'type' => $type,
            'quantity' => $quantity,
            'previous_stock' => $previousStock,
            'new_stock' => $newStock,
            'reason' => $reason,
            'reference_id' => $reference?->id,
            'reference_type' => $reference ? get_class($reference) : null,
        ]);
    }

    /**
     * Entrada de stock
     */
    public function stockIn(
        Product $product,
        int $quantity,
        ?Admin $admin = null,
        ?string $reason = null
    ): InventoryLog {
        return $this->adjustStock($product, abs($quantity), 'stock_in', $admin, $reason);
    }

    /**
     * Salida de stock
     */
    public function stockOut(
        Product $product,
        int $quantity,
        ?Admin $admin = null,
        ?string $reason = null
    ): InventoryLog {
        // Verificar que hay suficiente stock
        if ($product->stock < $quantity) {
            throw new \Exception("Stock insuficiente. Stock disponible: {$product->stock}, solicitado: {$quantity}");
        }

        return $this->adjustStock($product, -abs($quantity), 'stock_out', $admin, $reason);
    }

    /**
     * Registrar movimiento de inventario
     */
    public function logMovement(
        Product $product,
        string $type,
        int $quantity,
        ?Admin $admin = null,
        ?string $reason = null,
        ?Model $reference = null
    ): InventoryLog {
        return $this->adjustStock($product, $quantity, $type, $admin, $reason, $reference);
    }

    /**
     * Verificar productos con stock bajo
     */
    public function checkLowStock(): \Illuminate\Database\Eloquent\Collection
    {
        return Product::whereColumn('stock', '<=', 'min_stock')
            ->where('status', '!=', 'inactive')
            ->get();
    }

    /**
     * Reducir stock al confirmar orden
     */
    public function reduceStockFromOrder(Product $product, int $quantity, Model $order): InventoryLog
    {
        return $this->adjustStock(
            $product,
            -abs($quantity),
            'sale',
            null,
            "Venta - Orden #{$order->id}",
            $order
        );
    }
}

