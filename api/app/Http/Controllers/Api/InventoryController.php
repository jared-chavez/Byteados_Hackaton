<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\InventoryLog;
use App\Services\InventoryService;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Listar todo el inventario (admin)
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Filtros
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('name')->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Productos con stock bajo (admin)
     */
    public function lowStock()
    {
        $lowStockProducts = $this->inventoryService->checkLowStock();

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $lowStockProducts,
                'count' => $lowStockProducts->count(),
            ],
        ]);
    }

    /**
     * Historial de movimientos de inventario (admin)
     */
    public function logs(Request $request)
    {
        $query = InventoryLog::with(['product', 'admin']);

        // Filtros
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('admin_id')) {
            $query->where('admin_id', $request->admin_id);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }

    /**
     * Ajuste manual de stock (admin)
     */
    public function adjust(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer',
            'reason' => 'nullable|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $admin = $request->user();

        $log = $this->inventoryService->adjustStock(
            $product,
            $validated['quantity'],
            'adjustment',
            $admin,
            $validated['reason'] ?? 'Ajuste manual'
        );

        return response()->json([
            'success' => true,
            'data' => [
                'log' => $log->load(['product', 'admin']),
                'product' => $product->fresh(),
            ],
            'message' => 'Stock ajustado exitosamente',
        ]);
    }

    /**
     * Entrada de stock (admin)
     */
    public function stockIn(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $admin = $request->user();

        $log = $this->inventoryService->stockIn(
            $product,
            $validated['quantity'],
            $admin,
            $validated['reason'] ?? 'Entrada de stock'
        );

        return response()->json([
            'success' => true,
            'data' => [
                'log' => $log->load(['product', 'admin']),
                'product' => $product->fresh(),
            ],
            'message' => 'Stock ingresado exitosamente',
        ]);
    }

    /**
     * Salida de stock (admin)
     */
    public function stockOut(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $admin = $request->user();

        try {
            $log = $this->inventoryService->stockOut(
                $product,
                $validated['quantity'],
                $admin,
                $validated['reason'] ?? 'Salida de stock'
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'log' => $log->load(['product', 'admin']),
                    'product' => $product->fresh(),
                ],
                'message' => 'Stock retirado exitosamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Reportes de inventario (admin)
     */
    public function reports(Request $request)
    {
        $totalProducts = Product::count();
        $activeProducts = Product::where('status', 'active')->count();
        $outOfStockProducts = Product::where('status', 'out_of_stock')->count();
        $lowStockCount = $this->inventoryService->checkLowStock()->count();

        // Movimientos del día
        $todayMovements = InventoryLog::whereDate('created_at', today())->count();

        // Movimientos por tipo
        $movementsByType = InventoryLog::selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->get()
            ->pluck('count', 'type');

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_products' => $totalProducts,
                    'active_products' => $activeProducts,
                    'out_of_stock_products' => $outOfStockProducts,
                    'low_stock_count' => $lowStockCount,
                ],
                'today_movements' => $todayMovements,
                'movements_by_type' => $movementsByType,
            ],
        ]);
    }
}
