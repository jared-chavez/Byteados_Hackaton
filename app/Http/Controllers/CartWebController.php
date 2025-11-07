<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class CartWebController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Display the cart page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $sessionId = $user ? null : Session::getId();
        
        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load(['items.product.category']);

        // Debug: verificar que el carrito tenga items
        \Log::info('Cart loaded', [
            'cart_id' => $cart->id,
            'user_id' => $cart->user_id,
            'session_id' => $cart->session_id,
            'items_count' => $cart->items->count(),
            'current_session' => $sessionId,
        ]);

        return Inertia::render('Cart', [
            'cart' => $cart,
            'total' => $cart->total,
            'total_items' => $cart->total_items,
        ]);
    }
}

