<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    /**
     * Display the menu page.
     */
    public function index(): Response
    {
        $categories = Category::where('status', 'active')
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        $products = Product::where('status', 'active')
            ->with('category')
            ->orderBy('name')
            ->get();

        return Inertia::render('Menu', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}

