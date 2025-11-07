<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Obtener carrito del usuario
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $sessionId = $user ? null : Session::getId();
        
        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load(['items.product.category']);

        return response()->json([
            'success' => true,
            'data' => [
                'cart' => $cart,
                'total' => $cart->total,
                'total_items' => $cart->total_items,
            ],
        ]);
    }

    /**
     * Agregar item al carrito
     */
    public function addItem(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'special_instructions' => 'nullable|string|max:500',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Verificar que el producto esté activo
        if (!$product->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'El producto no está disponible',
            ], 422);
        }

        $user = $request->user();
        $sessionId = $user ? null : Session::getId();
        $cart = $this->cartService->getOrCreateCart($user, $sessionId);

        try {
            $cartItem = $this->cartService->addItem(
                $cart,
                $product,
                $validated['quantity'],
                $validated['special_instructions'] ?? null
            );

            $cart->load(['items.product.category']);

            return response()->json([
                'success' => true,
                'data' => [
                    'cart' => $cart->fresh(),
                    'cart_item' => $cartItem->load('product'),
                    'total' => $cart->total,
                ],
                'message' => 'Producto agregado al carrito',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Actualizar cantidad de item
     */
    public function updateItem(Request $request, $id)
    {
        $cartItem = CartItem::with('cart')->findOrFail($id);

        // Verificar que el item pertenezca al usuario
        $user = $request->user();
        if ($user && $cartItem->cart->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        if (!$user && $cartItem->cart->session_id !== Session::getId()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
            'special_instructions' => 'nullable|string|max:500',
        ]);

        try {
            $cartItem = $this->cartService->updateItem(
                $cartItem,
                $validated['quantity'],
                $validated['special_instructions'] ?? null
            );

            $cart = $cartItem->cart->fresh();
            $cart->load(['items.product.category']);

            return response()->json([
                'success' => true,
                'data' => [
                    'cart' => $cart,
                    'cart_item' => $cartItem->load('product'),
                    'total' => $cart->total,
                ],
                'message' => 'Item actualizado',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Eliminar item del carrito
     */
    public function removeItem(Request $request, $id)
    {
        $cartItem = CartItem::with('cart')->findOrFail($id);

        // Verificar que el item pertenezca al usuario
        $user = $request->user();
        if ($user && $cartItem->cart->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        if (!$user && $cartItem->cart->session_id !== Session::getId()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $this->cartService->removeItem($cartItem);

        $cart = $cartItem->cart->fresh();
        $cart->load(['items.product.category']);

        return response()->json([
            'success' => true,
            'data' => [
                'cart' => $cart,
                'total' => $cart->total,
            ],
            'message' => 'Item eliminado del carrito',
        ]);
    }

    /**
     * Vaciar carrito
     */
    public function clear(Request $request)
    {
        $user = $request->user();
        $sessionId = $user ? null : Session::getId();
        
        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $this->cartService->clearCart($cart);

        return response()->json([
            'success' => true,
            'message' => 'Carrito vaciado',
        ]);
    }

    /**
     * Resumen del carrito
     */
    public function summary(Request $request)
    {
        $user = $request->user();
        $sessionId = $user ? null : Session::getId();
        
        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load('items.product');

        return response()->json([
            'success' => true,
            'data' => [
                'total_items' => $cart->total_items,
                'total' => $cart->total,
                'items_count' => $cart->items->count(),
            ],
        ]);
    }
}
