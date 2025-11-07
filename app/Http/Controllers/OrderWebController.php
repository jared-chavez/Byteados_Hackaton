<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class OrderWebController extends Controller
{
    protected $orderService;
    protected $cartService;

    public function __construct(OrderService $orderService, CartService $cartService)
    {
        $this->orderService = $orderService;
        $this->cartService = $cartService;
    }

    /**
     * Display user's order history.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        $orders = Order::where('user_id', $user->id)
            ->with(['items.product.category'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Asegurar que los valores numéricos sean floats
        $orders->getCollection()->transform(function ($order) {
            $order->subtotal = (float) $order->subtotal;
            $order->tax = (float) $order->tax;
            $order->total = (float) $order->total;
            
            $order->items->each(function ($item) {
                $item->price = (float) $item->price;
                $item->subtotal = (float) $item->subtotal;
            });
            
            return $order;
        });

        return Inertia::render('OrderHistory', [
            'orders' => $orders,
        ]);
    }

    /**
     * Store a new order from cart.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:card',
            'card_number' => 'required|string|min:13|max:19',
            'card_expiry_month' => 'required|string|size:2',
            'card_expiry_year' => 'required|string|size:4',
            'card_cvv' => 'required|string|min:3|max:4',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Validar que la fecha de expiración no sea anterior a la fecha actual
        $expiryMonth = (int) $validated['card_expiry_month'];
        $expiryYear = (int) $validated['card_expiry_year'];
        $now = now();
        
        if ($expiryYear < $now->year || ($expiryYear === $now->year && $expiryMonth < $now->month)) {
            return back()->withErrors([
                'card_expiry_month' => 'La fecha de expiración no puede ser anterior a la fecha actual',
            ]);
        }

        $user = $request->user();
        $sessionId = $user ? null : Session::getId();
        $cart = $this->cartService->getOrCreateCart($user, $sessionId);

        if ($cart->isEmpty()) {
            return back()->withErrors([
                'cart' => 'El carrito está vacío',
            ]);
        }

        // Verificar que el usuario esté autenticado para crear orden
        if (!$user) {
            return back()->withErrors([
                'auth' => 'Debes iniciar sesión para realizar una orden',
            ]);
        }

        try {
            $order = $this->orderService->createOrderFromCart(
                $cart,
                $validated['notes'] ?? null,
                $validated['payment_method']
            );

            return redirect()->route('order.confirmation', $order->id);
        } catch (\Exception $e) {
            return back()->withErrors([
                'order' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display order confirmation page.
     */
    public function confirmation(Request $request, $id): Response
    {
        $order = Order::with(['items.product.category', 'user'])->findOrFail($id);

        // Verificar que la orden pertenezca al usuario
        $user = $request->user();
        if ($user && $order->user_id !== $user->id) {
            abort(403);
        }

        // Asegurar que los valores numéricos sean floats
        $order->subtotal = (float) $order->subtotal;
        $order->tax = (float) $order->tax;
        $order->total = (float) $order->total;
        
        // Asegurar que los items tengan valores numéricos correctos
        $order->items->each(function ($item) {
            $item->price = (float) $item->price;
            $item->subtotal = (float) $item->subtotal;
        });

        return Inertia::render('OrderConfirmation', [
            'order' => $order,
        ]);
    }
}

