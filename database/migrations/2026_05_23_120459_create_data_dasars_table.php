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
        Schema::create('data_dasars', function (Blueprint $table) {
            $table->id();
            $table->string('tahun')->unique();
            $table->string('luas_wilayah');
            $table->string('jumlah_kecamatan');
            $table->string('jumlah_desa');
            $table->string('jumlah_puskesmas');
            $table->string('jumlah_penduduk');
            $table->string('ipm');
            $table->string('umk');
            $table->string('url_facebook')->nullable();
            $table->string('url_instagram')->nullable();
            $table->string('url_tiktok')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_dasars');
    }
};
