<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Display the checkout page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Verificar que el usuario esté autenticado
        if (!$user) {
            // Usar Inertia::location para redirecciones en lugar de redirect()
            return Inertia::location(route('login'));
        }

        $sessionId = null;
        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load(['items.product.category']);

        if ($cart->isEmpty()) {
            // Usar Inertia::location para redirecciones en lugar de redirect()
            return Inertia::location(route('cart.index'));
        }

        return Inertia::render('Checkout', [
            'cart' => $cart,
            'subtotal' => $cart->total,
            'tax' => $cart->total * 0.16,
            'total' => $cart->total * 1.16,
        ]);
    }
}

