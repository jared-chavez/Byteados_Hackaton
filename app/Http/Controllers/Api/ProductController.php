<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Listar productos (público)
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

        if ($request->has('min_stock') && $request->min_stock === 'true') {
            $query->whereColumn('stock', '<=', 'min_stock');
        }

        // Solo productos activos para usuarios no autenticados
        if (!$request->user()) {
            $query->where('status', 'active');
        }

        $products = $query->orderBy('name')->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Mostrar producto específico (público)
     */
    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'product' => $product,
            ],
        ]);
    }

    /**
     * Obtener stock actual (público - solo lectura)
     */
    public function stock($id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'stock' => $product->stock,
                'min_stock' => $product->min_stock,
                'is_low_stock' => $product->isLowStock(),
                'status' => $product->status,
            ],
        ]);
    }

    /**
     * Crear producto (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'image_url' => 'nullable|url',
            'image_base64' => 'nullable|string', // Para recibir imagen en base64
            'barcode' => 'nullable|string|unique:products,barcode',
            'status' => 'required|in:active,inactive,out_of_stock',
        ]);

        // Procesar imagen base64 si se proporciona
        if ($request->has('image_base64')) {
            $imageService = app(\App\Services\ImageService::class);
            $imageBlob = $imageService->base64ToBlob($request->image_base64);
            if ($imageBlob) {
                $validated['image_blob'] = $imageBlob;
            }
        }

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'product' => $product->load('category'),
            ],
            'message' => 'Producto creado exitosamente',
        ], 201);
    }

    /**
     * Actualizar producto (admin)
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|exists:categories,id',
            'price' => 'sometimes|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'min_stock' => 'sometimes|integer|min:0',
            'image_url' => 'nullable|url',
            'barcode' => 'nullable|string|unique:products,barcode,' . $id,
            'status' => 'sometimes|in:active,inactive,out_of_stock',
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'product' => $product->load('category'),
            ],
            'message' => 'Producto actualizado exitosamente',
        ]);
    }

    /**
     * Eliminar/desactivar producto (admin)
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // En lugar de eliminar, desactivar
        $product->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'message' => 'Producto desactivado exitosamente',
        ]);
    }

    /**
     * Ajustar stock (admin)
     */
    public function adjustStock(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'required|integer',
            'reason' => 'nullable|string',
        ]);

        // El servicio de inventario manejará el ajuste
        // Por ahora, actualización directa
        $previousStock = $product->stock;
        $newStock = $previousStock + $validated['quantity'];

        if ($newStock < 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede reducir el stock por debajo de 0',
            ], 422);
        }

        $product->update(['stock' => $newStock]);

        return response()->json([
            'success' => true,
            'data' => [
                'product' => $product,
                'previous_stock' => $previousStock,
                'new_stock' => $newStock,
            ],
            'message' => 'Stock ajustado exitosamente',
        ]);
    }
}
