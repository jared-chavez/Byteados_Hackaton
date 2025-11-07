<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ImageController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Obtener imagen de producto
     */
    public function productImage($id): \Illuminate\Http\Response
    {
        $product = Product::findOrFail($id);

        if (!$product->image_blob) {
            return response('', 404);
        }

        $mimeType = $this->imageService->getBlobMimeType($product->image_blob);

        return response($product->image_blob, 200)
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Obtener imagen de categoría
     */
    public function categoryImage($id): \Illuminate\Http\Response
    {
        $category = Category::findOrFail($id);

        if (!$category->image_blob) {
            return response('', 404);
        }

        $mimeType = $this->imageService->getBlobMimeType($category->image_blob);

        return response($category->image_blob, 200)
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Subir imagen de producto (admin)
     */
    public function uploadProductImage(Request $request, $id): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,gif,webp|max:5120', // 5MB
        ]);

        $product = Product::findOrFail($id);

        try {
            $imageBlob = $this->imageService->processImageToBlob(
                $request->file('image'),
                maxWidth: 800,
                maxHeight: 800,
                quality: 85
            );

            if ($imageBlob) {
                $product->update(['image_blob' => $imageBlob]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Imagen subida exitosamente',
                    'data' => [
                        'product_id' => $product->id,
                        'image_url' => route('api.images.product', $product->id),
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la imagen',
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Subir imagen de categoría (admin)
     */
    public function uploadCategoryImage(Request $request, $id): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,gif,webp|max:5120', // 5MB
        ]);

        $category = Category::findOrFail($id);

        try {
            $imageBlob = $this->imageService->processImageToBlob(
                $request->file('image'),
                maxWidth: 800,
                maxHeight: 800,
                quality: 85
            );

            if ($imageBlob) {
                $category->update(['image_blob' => $imageBlob]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Imagen subida exitosamente',
                    'data' => [
                        'category_id' => $category->id,
                        'image_url' => route('api.images.category', $category->id),
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la imagen',
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}

