<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\ImageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas públicas
Route::prefix('v1')->middleware(['web'])->group(function () {
    
    // Autenticación de usuarios
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });

    // Autenticación de administradores
    Route::prefix('admin/auth')->group(function () {
        Route::post('login', [AdminAuthController::class, 'login']);
        
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AdminAuthController::class, 'logout']);
            Route::get('me', [AdminAuthController::class, 'me']);
        });
    });

    // Productos (público)
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('{id}', [ProductController::class, 'show']);
        Route::get('{id}/stock', [ProductController::class, 'stock']);
    });

    // Categorías (público)
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('{id}', [CategoryController::class, 'show']);
        Route::get('{id}/products', [CategoryController::class, 'products']);
    });

    // Imágenes (público)
    Route::prefix('images')->group(function () {
        Route::get('products/{id}', [ImageController::class, 'productImage'])->name('api.images.product');
        Route::get('categories/{id}', [ImageController::class, 'categoryImage'])->name('api.images.category');
    });

    // Carrito (requiere autenticación opcional) - Usa sesión web
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('items', [CartController::class, 'addItem']);
        Route::put('items/{id}', [CartController::class, 'updateItem']);
        Route::delete('items/{id}', [CartController::class, 'removeItem']);
        Route::delete('clear', [CartController::class, 'clear']);
        Route::get('summary', [CartController::class, 'summary']);
    });

    // Rutas que requieren autenticación de usuario
    Route::middleware('auth:sanctum')->group(function () {
        
        // Órdenes de usuario
        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index']);
            Route::get('{id}', [OrderController::class, 'show']);
            Route::post('/', [OrderController::class, 'store']);
            Route::post('{id}/cancel', [OrderController::class, 'cancel']);
            Route::get('{id}/items', [OrderController::class, 'items']);
        });
    });

    // Rutas de administrador
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        
        // Gestión de productos
        Route::prefix('products')->group(function () {
            Route::post('/', [ProductController::class, 'store']);
            Route::put('{id}', [ProductController::class, 'update']);
            Route::delete('{id}', [ProductController::class, 'destroy']);
            Route::post('{id}/adjust-stock', [ProductController::class, 'adjustStock']);
        });

        // Gestión de categorías
        Route::prefix('categories')->group(function () {
            Route::post('/', [CategoryController::class, 'store']);
            Route::put('{id}', [CategoryController::class, 'update']);
            Route::delete('{id}', [CategoryController::class, 'destroy']);
        });

        // Gestión de órdenes
        Route::prefix('orders')->group(function () {
            Route::put('{id}/status', [OrderController::class, 'updateStatus']);
            Route::get('stats', [OrderController::class, 'stats']);
        });

        // Inventario
        Route::prefix('inventory')->group(function () {
            Route::get('/', [InventoryController::class, 'index']);
            Route::get('low-stock', [InventoryController::class, 'lowStock']);
            Route::get('logs', [InventoryController::class, 'logs']);
            Route::post('adjust', [InventoryController::class, 'adjust']);
            Route::post('stock-in', [InventoryController::class, 'stockIn']);
            Route::post('stock-out', [InventoryController::class, 'stockOut']);
            Route::get('reports', [InventoryController::class, 'reports']);
        });

        // Subida de imágenes
        Route::prefix('images')->group(function () {
            Route::post('products/{id}', [ImageController::class, 'uploadProductImage']);
            Route::post('categories/{id}', [ImageController::class, 'uploadCategoryImage']);
        });
    });
});