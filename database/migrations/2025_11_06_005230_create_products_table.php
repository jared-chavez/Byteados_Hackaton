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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
            $table->decimal('price', 10, 2);
            $table->decimal('cost', 10, 2)->nullable()->comment('Costo de producción');
            $table->integer('stock')->default(0)->comment('Cantidad disponible');
            $table->integer('min_stock')->default(0)->comment('Mínimo antes de alertar');
            $table->string('image_url')->nullable();
            $table->enum('status', ['active', 'inactive', 'out_of_stock'])->default('active');
            $table->string('barcode')->nullable()->unique()->comment('Código de barras para escaneo');
            $table->timestamps();
            
            $table->index('category_id');
            $table->index('status');
            $table->index('barcode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
