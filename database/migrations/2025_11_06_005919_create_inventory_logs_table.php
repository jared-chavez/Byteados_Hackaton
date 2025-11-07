<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventory_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->enum('type', ['stock_in', 'stock_out', 'adjustment', 'sale', 'expired', 'damaged']);
            $table->integer('quantity')->comment('Cantidad positiva o negativa');
            $table->integer('previous_stock')->comment('Stock antes del movimiento');
            $table->integer('new_stock')->comment('Stock después del movimiento');
            $table->text('reason')->nullable()->comment('Razón del movimiento');
            $table->foreignId('reference_id')->nullable()->comment('FK a order_id si es por venta');
            $table->string('reference_type')->nullable()->comment('Tipo de referencia (Order, etc.)');
            $table->timestamps();
            
            $table->index('product_id');
            $table->index('admin_id');
            $table->index('type');
            $table->index(['reference_id', 'reference_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_logs');
    }
};
