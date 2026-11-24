<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('downloads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_download_id')->constrained('kategori_download')->onDelete('cascade');
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->string('file'); // path di storage
            $table->string('nama_file_asli')->nullable(); // nama file asli saat upload
            $table->string('tipe_file')->nullable(); // pdf, docx, xlsx, dll
            $table->unsignedBigInteger('ukuran_file')->nullable(); // bytes
            $table->string('sampul')->nullable(); // gambar sampul opsional
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->unsignedBigInteger('jumlah_unduhan')->default(0);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('downloads');
    }
};
