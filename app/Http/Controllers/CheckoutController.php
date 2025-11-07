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
            return redirect()->route('login')->with('message', 'Debes iniciar sesión para realizar el checkout');
        }

        $sessionId = null;
        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load(['items.product.category']);

        if ($cart->isEmpty()) {
            return redirect()->route('cart.index');
        }

        return Inertia::render('Checkout', [
            'cart' => $cart,
            'subtotal' => $cart->total,
            'tax' => $cart->total * 0.16,
            'total' => $cart->total * 1.16,
        ]);
    }
}

