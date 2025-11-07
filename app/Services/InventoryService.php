<?php

namespace App\Services;

use App\Models\Product;
use App\Models\InventoryLog;
use App\Models\Admin;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class InventoryService
{
    public function adjustStock(
        Product $product,
        int $quantity,
        string $type = 'adjustment',
        ?Admin $admin = null,
        string $reason = 'Ajuste manual',
        ?int $referenceId = null,
        ?string $referenceType = null
    ): InventoryLog {
        return DB::transaction(function () use ($product, $quantity, $type, $admin, $reason, $referenceId, $referenceType) {
            $previousStock = $product->stock;
            $newStock = $previousStock + $quantity;

            if ($newStock < 0) {
                throw new \Exception('El stock no puede ser negativo');
            }

            $product->update(['stock' => $newStock]);

            // Actualizar estado del producto si es necesario
            if ($newStock == 0) {
                $product->update(['status' => 'out_of_stock']);
            } elseif ($product->status === 'out_of_stock' && $newStock > 0) {
                $product->update(['status' => 'active']);
            }

            return InventoryLog::create([
                'product_id' => $product->id,
                'admin_id' => $admin?->id,
                'type' => $type,
                'quantity' => $quantity,
                'previous_stock' => $previousStock,
                'new_stock' => $newStock,
                'reason' => $reason,
                'reference_id' => $referenceId,
                'reference_type' => $referenceType,
            ]);
        });
    }

    public function stockIn(
        Product $product,
        int $quantity,
        ?Admin $admin = null,
        string $reason = 'Entrada de stock',
        ?int $referenceId = null,
        ?string $referenceType = null
    ): InventoryLog {
        return $this->adjustStock($product, $quantity, 'stock_in', $admin, $reason, $referenceId, $referenceType);
    }

    public function stockOut(
        Product $product,
        int $quantity,
        ?Admin $admin = null,
        string $reason = 'Salida de stock',
        ?int $referenceId = null,
        ?string $referenceType = null
    ): InventoryLog {
        if ($product->stock < $quantity) {
            throw new \Exception('Stock insuficiente');
        }

        return $this->adjustStock($product, -$quantity, 'stock_out', $admin, $reason, $referenceId, $referenceType);
    }

    public function checkLowStock(): Collection
    {
        return Product::whereColumn('stock', '<=', 'min_stock')
            ->where('status', '!=', 'inactive')
            ->with('category')
            ->get();
    }

    public function getStockMovements(Product $product, int $days = 30): Collection
    {
        return $product->inventoryLogs()
            ->with('admin')
            ->where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'desc')
            ->get();
    }
}