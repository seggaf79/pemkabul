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
        Schema::create('harga_ikans', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal')->unique();
            $table->integer('ikan_tongkol');
            $table->integer('ikan_bandeng_besar');
            $table->integer('ikan_kembung');
            $table->integer('ikan_layang');
            $table->integer('ikan_putih');
            $table->integer('ikan_kakap_merah');
            $table->integer('ikan_mas');
            $table->integer('ikan_kakap_putih');
            $table->integer('ikan_nila');
            $table->integer('ikan_lele');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('harga_ikans');
    }
};
