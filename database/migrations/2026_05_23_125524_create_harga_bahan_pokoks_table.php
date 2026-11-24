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
        Schema::create('harga_bahan_pokoks', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal')->unique();
            $table->unsignedInteger('daging_sapi');
            $table->unsignedInteger('ayam_potong');
            $table->unsignedInteger('ayam_kampung');
            $table->unsignedInteger('cabe_rawit_merah');
            $table->unsignedInteger('cabe_rawit_hijau');
            $table->unsignedInteger('cabe_keriting');
            $table->unsignedInteger('cabe_merah_besar');
            $table->unsignedInteger('telur');
            $table->unsignedInteger('bawang_merah');
            $table->unsignedInteger('bawang_putih');
            $table->unsignedInteger('bawang_bombay');
            $table->unsignedInteger('minyak_goreng_medium');
            $table->unsignedInteger('minyak_goreng_premium');
            $table->unsignedInteger('gula_pasir');
            $table->unsignedInteger('kacang_tanah');
            $table->unsignedInteger('kentang');
            $table->unsignedInteger('wortel');
            $table->unsignedInteger('tomat');
            $table->unsignedInteger('beras_medium');
            $table->unsignedInteger('beras_premium');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('harga_bahan_pokoks');
    }
};
