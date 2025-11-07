<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Listar categorías (público)
     */
    public function index(Request $request)
    {
        $query = Category::query();

        // Solo categorías activas para usuarios no autenticados
        if (!$request->user()) {
            $query->where('status', 'active');
        }

        $categories = $query->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Mostrar categoría específica (público)
     */
    public function show($id)
    {
        $category = Category::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'category' => $category,
            ],
        ]);
    }

    /**
     * Obtener productos de una categoría (público)
     */
    public function products(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $query = $category->products();

        // Solo productos activos para usuarios no autenticados
        if (!$request->user()) {
            $query->where('status', 'active');
        }

        $products = $query->orderBy('name')->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => [
                'category' => $category,
                'products' => $products,
            ],
        ]);
    }

    /**
     * Crear categoría (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'image_base64' => 'nullable|string', // Para recibir imagen en base64
            'display_order' => 'nullable|integer|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        // Procesar imagen base64 si se proporciona
        if ($request->has('image_base64')) {
            $imageService = app(\App\Services\ImageService::class);
            $imageBlob = $imageService->base64ToBlob($request->image_base64);
            if ($imageBlob) {
                $validated['image_blob'] = $imageBlob;
            }
        }

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'category' => $category,
            ],
            'message' => 'Categoría creada exitosamente',
        ], 201);
    }

    /**
     * Actualizar categoría (admin)
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'display_order' => 'nullable|integer|min:0',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'category' => $category,
            ],
            'message' => 'Categoría actualizada exitosamente',
        ]);
    }

    /**
     * Eliminar categoría (admin)
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Verificar que no tenga productos
        if ($category->products()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar una categoría que tiene productos asociados',
            ], 422);
        }

        // En lugar de eliminar, desactivar
        $category->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'message' => 'Categoría desactivada exitosamente',
        ]);
    }
}
