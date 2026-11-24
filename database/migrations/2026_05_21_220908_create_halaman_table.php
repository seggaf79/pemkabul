<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('halaman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_halaman_id')->constrained('kategori_halaman')->onDelete('cascade');
            $table->string('judul');
            $table->string('slug')->unique();
            $table->longText('konten')->nullable();
            $table->string('gambar')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('halaman');
    }
};
