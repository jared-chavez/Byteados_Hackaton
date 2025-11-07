<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Aquí se definen las rutas de la API. Estas rutas están cargadas por el
| RouteServiceProvider y todas ellas tendrán el prefijo "api".
|
*/

// ============================================
// Rutas de Autenticación de Usuarios
// ============================================
Route::prefix('auth')->group(function () {
    // Rutas públicas
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Rutas protegidas (requieren autenticación)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// ============================================
// Rutas de Autenticación de Administradores
// ============================================
Route::prefix('admin/auth')->group(function () {
    // Login público
    Route::post('/login', [AdminAuthController::class, 'login']);
    
    // Rutas protegidas (requieren autenticación de admin)
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);
    });
});

// ============================================
// Rutas Públicas de Productos y Categorías
// ============================================
// Productos (públicas)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/{id}/stock', [ProductController::class, 'stock']);

// Categorías (públicas)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/categories/{id}/products', [CategoryController::class, 'products']);

// ============================================
// Rutas Administrativas de Productos
// ============================================
Route::prefix('admin/products')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/', [ProductController::class, 'store']);
    Route::put('/{id}', [ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
    Route::post('/{id}/stock/adjust', [ProductController::class, 'adjustStock']);
});

// ============================================
// Rutas Administrativas de Categorías
// ============================================
Route::prefix('admin/categories')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/', [CategoryController::class, 'store']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{id}', [CategoryController::class, 'destroy']);
});

// ============================================
// Rutas Administrativas de Inventario
// ============================================
Route::prefix('admin/inventory')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/', [InventoryController::class, 'index']);
    Route::get('/low-stock', [InventoryController::class, 'lowStock']);
    Route::get('/logs', [InventoryController::class, 'logs']);
    Route::post('/adjust', [InventoryController::class, 'adjust']);
    Route::post('/stock-in', [InventoryController::class, 'stockIn']);
    Route::post('/stock-out', [InventoryController::class, 'stockOut']);
    Route::get('/reports', [InventoryController::class, 'reports']);
});

// ============================================
// Rutas Protegidas de Usuarios
// ============================================
// Carrito
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/items', [CartController::class, 'addItem']);
        Route::put('/items/{id}', [CartController::class, 'updateItem']);
        Route::delete('/items/{id}', [CartController::class, 'removeItem']);
        Route::delete('/', [CartController::class, 'clear']);
        Route::get('/summary', [CartController::class, 'summary']);
    });

    // Órdenes
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::delete('/{id}', [OrderController::class, 'cancel']);
        Route::get('/{id}/items', [OrderController::class, 'items']);
    });
});

// ============================================
// Rutas Administrativas de Órdenes
// ============================================
Route::prefix('admin/orders')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/', [OrderController::class, 'index']); // Todas las órdenes con filtros
    Route::get('/stats', [OrderController::class, 'stats']);
    Route::put('/{id}/status', [OrderController::class, 'updateStatus']);
});

// ============================================
// Rutas Administrativas - Gestión de Usuarios
// ============================================
Route::prefix('admin/users')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/', [AdminUserController::class, 'index']);
    Route::get('/{id}', [AdminUserController::class, 'show']);
    Route::put('/{id}', [AdminUserController::class, 'update']);
    Route::put('/{id}/status', [AdminUserController::class, 'updateStatus']);
    Route::get('/{id}/orders', [AdminUserController::class, 'orders']);
});

// ============================================
// Rutas Administrativas - Gestión de Administradores
// ============================================
Route::prefix('admin/admins')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/', [AdminController::class, 'index']);
    Route::post('/', [AdminController::class, 'store']);
    Route::get('/{id}', [AdminController::class, 'show']);
    Route::put('/{id}', [AdminController::class, 'update']);
    Route::put('/{id}/status', [AdminController::class, 'updateStatus']);
    Route::put('/{id}/permissions', [AdminController::class, 'updatePermissions']);
});

// ============================================
// Rutas Administrativas - Dashboard
// ============================================
Route::prefix('admin/dashboard')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::get('/recent-orders', [DashboardController::class, 'recentOrders']);
    Route::get('/low-stock-alerts', [DashboardController::class, 'lowStockAlerts']);
    Route::get('/trends', [DashboardController::class, 'trends']);
});

