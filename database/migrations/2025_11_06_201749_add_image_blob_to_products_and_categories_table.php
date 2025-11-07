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
        Schema::table('products', function (Blueprint $table) {
            // Agregar columna para imagen BLOB (LONGBLOB en MySQL)
            $table->binary('image_blob')->nullable()->after('image_url');
            // Mantener image_url por compatibilidad, pero será opcional
        });

        Schema::table('categories', function (Blueprint $table) {
            // Agregar columna para imagen BLOB (LONGBLOB en MySQL)
            $table->binary('image_blob')->nullable()->after('image_url');
            // Mantener image_url por compatibilidad, pero será opcional
        });

        // Cambiar a LONGBLOB usando SQL directo para MySQL
        \DB::statement('ALTER TABLE products MODIFY image_blob LONGBLOB');
        \DB::statement('ALTER TABLE categories MODIFY image_blob LONGBLOB');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('image_blob');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('image_blob');
        });
    }
};
