<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Services\OrderService;
use App\Services\CartService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;
    protected $cartService;

    public function __construct(OrderService $orderService, CartService $cartService)
    {
        $this->orderService = $orderService;
        $this->cartService = $cartService;
    }

    /**
     * Listar órdenes del usuario autenticado
     * O todas las órdenes si es admin
     */
    public function index(Request $request)
    {
        $query = Order::with(['items.product', 'user']);

        // Si no es admin, solo mostrar órdenes del usuario
        $user = $request->user();
        if (!$user || !($user instanceof \App\Models\Admin)) {
            $query->where('user_id', $user->id);
        }

        // Filtros para admin
        if ($user instanceof \App\Models\Admin) {
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('payment_status')) {
                $query->where('payment_status', $request->payment_status);
            }

            if ($request->has('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Mostrar detalle de orden
     */
    public function show(Request $request, $id)
    {
        $order = Order::with(['items.product.category', 'user'])->findOrFail($id);

        // Verificar permisos
        $user = $request->user();
        if (!$user instanceof \App\Models\Admin && $order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order,
            ],
        ]);
    }

    /**
     * Crear orden desde carrito
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
            'payment_method' => 'nullable|in:cash,paypal,card',
        ]);

        $user = $request->user();
        $cart = $this->cartService->getOrCreateCart($user);

        if ($cart->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'El carrito está vacío',
            ], 422);
        }

        try {
            $order = $this->orderService->createOrderFromCart(
                $cart,
                $validated['notes'] ?? null,
                $validated['payment_method'] ?? null
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'order' => $order,
                ],
                'message' => 'Orden creada exitosamente',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Cancelar orden (solo usuario propietario)
     */
    public function cancel(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $user = $request->user();

        // Verificar que la orden pertenezca al usuario
        if ($order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        if (!$order->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'La orden no puede ser cancelada en su estado actual',
            ], 422);
        }

        $order->cancel();

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order->fresh(),
            ],
            'message' => 'Orden cancelada exitosamente',
        ]);
    }

    /**
     * Actualizar estado de orden (admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,ready,completed,cancelled',
        ]);

        try {
            $order = $this->orderService->updateOrderStatus($order, $validated['status']);

            return response()->json([
                'success' => true,
                'data' => [
                    'order' => $order->load(['items.product', 'user']),
                ],
                'message' => 'Estado de orden actualizado',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Obtener items de una orden
     */
    public function items($id)
    {
        $order = Order::with(['items.product.category'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order,
                'items' => $order->items,
            ],
        ]);
    }

    /**
     * Estadísticas de órdenes (admin)
     */
    public function stats(Request $request)
    {
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        $totalRevenue = Order::where('payment_status', 'paid')
            ->where('status', 'completed')
            ->sum('total');

        $todayOrders = Order::whereDate('created_at', today())->count();
        $todayRevenue = Order::whereDate('created_at', today())
            ->where('payment_status', 'paid')
            ->where('status', 'completed')
            ->sum('total');

        // Órdenes por estado
        $ordersByStatus = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        // Órdenes por método de pago
        $ordersByPaymentMethod = Order::selectRaw('payment_method, COUNT(*) as count')
            ->whereNotNull('payment_method')
            ->groupBy('payment_method')
            ->get()
            ->pluck('count', 'payment_method');

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_orders' => $totalOrders,
                    'pending_orders' => $pendingOrders,
                    'completed_orders' => $completedOrders,
                    'cancelled_orders' => $cancelledOrders,
                    'total_revenue' => $totalRevenue,
                ],
                'today' => [
                    'orders' => $todayOrders,
                    'revenue' => $todayRevenue,
                ],
                'orders_by_status' => $ordersByStatus,
                'orders_by_payment_method' => $ordersByPaymentMethod,
            ],
        ]);
    }
}
