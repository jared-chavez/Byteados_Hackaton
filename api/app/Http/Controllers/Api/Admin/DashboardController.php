<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Admin;
use App\Models\InventoryLog;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Estadísticas generales del dashboard
     */
    public function stats(Request $request)
    {
        // Estadísticas generales
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $totalAdmins = Admin::count();
        $activeAdmins = Admin::where('status', 'active')->count();

        // Estadísticas de productos
        $totalProducts = Product::count();
        $activeProducts = Product::where('status', 'active')->count();
        $outOfStockProducts = Product::where('status', 'out_of_stock')->count();
        $lowStockCount = $this->inventoryService->checkLowStock()->count();

        // Estadísticas de órdenes
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        // Ingresos
        $totalRevenue = Order::where('payment_status', 'paid')
            ->where('status', 'completed')
            ->sum('total');

        // Estadísticas del día
        $todayOrders = Order::whereDate('created_at', today())->count();
        $todayRevenue = Order::whereDate('created_at', today())
            ->where('payment_status', 'paid')
            ->where('status', 'completed')
            ->sum('total');

        // Estadísticas de la semana
        $weekOrders = Order::where('created_at', '>=', now()->startOfWeek())->count();
        $weekRevenue = Order::where('created_at', '>=', now()->startOfWeek())
            ->where('payment_status', 'paid')
            ->where('status', 'completed')
            ->sum('total');

        // Estadísticas del mes
        $monthOrders = Order::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $monthRevenue = Order::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->where('payment_status', 'paid')
            ->where('status', 'completed')
            ->sum('total');

        return response()->json([
            'success' => true,
            'data' => [
                'users' => [
                    'total' => $totalUsers,
                    'active' => $activeUsers,
                    'inactive' => $totalUsers - $activeUsers,
                ],
                'admins' => [
                    'total' => $totalAdmins,
                    'active' => $activeAdmins,
                    'inactive' => $totalAdmins - $activeAdmins,
                ],
                'products' => [
                    'total' => $totalProducts,
                    'active' => $activeProducts,
                    'out_of_stock' => $outOfStockProducts,
                    'low_stock' => $lowStockCount,
                ],
                'orders' => [
                    'total' => $totalOrders,
                    'pending' => $pendingOrders,
                    'completed' => $completedOrders,
                    'cancelled' => $cancelledOrders,
                ],
                'revenue' => [
                    'total' => $totalRevenue,
                    'today' => $todayRevenue,
                    'week' => $weekRevenue,
                    'month' => $monthRevenue,
                ],
                'today' => [
                    'orders' => $todayOrders,
                    'revenue' => $todayRevenue,
                ],
                'week' => [
                    'orders' => $weekOrders,
                    'revenue' => $weekRevenue,
                ],
                'month' => [
                    'orders' => $monthOrders,
                    'revenue' => $monthRevenue,
                ],
            ],
        ]);
    }

    /**
     * Órdenes recientes
     */
    public function recentOrders(Request $request)
    {
        $limit = $request->get('limit', 10);

        $orders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $orders,
            ],
        ]);
    }

    /**
     * Alertas de stock bajo
     */
    public function lowStockAlerts()
    {
        $lowStockProducts = $this->inventoryService->checkLowStock();

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $lowStockProducts->load('category'),
                'count' => $lowStockProducts->count(),
            ],
        ]);
    }

    /**
     * Gráficos y tendencias (opcional - para futuro)
     */
    public function trends(Request $request)
    {
        $days = $request->get('days', 30);

        // Órdenes por día (últimos N días)
        $ordersByDay = Order::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Ingresos por día
        $revenueByDay = Order::selectRaw('DATE(created_at) as date, SUM(total) as revenue')
            ->where('created_at', '>=', now()->subDays($days))
            ->where('payment_status', 'paid')
            ->where('status', 'completed')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Productos más vendidos
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.id', 'products.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->where('order_items.created_at', '>=', now()->subDays($days))
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders_by_day' => $ordersByDay,
                'revenue_by_day' => $revenueByDay,
                'top_products' => $topProducts,
            ],
        ]);
    }
}
