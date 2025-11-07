<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/menu', [\App\Http\Controllers\MenuController::class, 'index'])->name('menu.index');

// Formulario de contacto - OCULTO TEMPORALMENTE
// Route::get('/contact', [\App\Http\Controllers\ContactController::class, 'index'])->name('contact.index');
// Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

Route::middleware(['auth', 'session.activity'])->group(function () {
    Route::get('/cart', [\App\Http\Controllers\CartWebController::class, 'index'])->name('cart.index');
    Route::get('/checkout', [\App\Http\Controllers\CheckoutController::class, 'index'])->name('checkout.index');
});

Route::middleware(['auth', 'session.activity'])->group(function () {
    Route::get('/orders', [\App\Http\Controllers\OrderWebController::class, 'index'])->name('orders.index');
    Route::post('/orders', [\App\Http\Controllers\OrderWebController::class, 'store'])->name('order.store');
    Route::get('/orders/{id}/confirmation', [\App\Http\Controllers\OrderWebController::class, 'confirmation'])->name('order.confirmation');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'session.activity'])->name('dashboard');

Route::middleware(['auth', 'session.activity'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
