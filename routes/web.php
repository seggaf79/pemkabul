<?php

use App\Http\Controllers\Admin\DownloadController;
use App\Http\Controllers\Admin\HalamanController;
use App\Http\Controllers\Admin\KategoriDownloadController;
use App\Http\Controllers\Admin\KategoriHalamanController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\KategoriFotoController;
use App\Http\Controllers\Admin\FotoController;
use App\Http\Controllers\Admin\LinkWebsiteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/halaman/{slug}', [\App\Http\Controllers\HomeController::class, 'halaman'])->name('public.halaman');
Route::get('/kategori/{slug}', [\App\Http\Controllers\HomeController::class, 'kategoriHalaman'])->name('public.kategori');
Route::get('/download', [\App\Http\Controllers\HomeController::class, 'downloadIndex'])->name('public.download.index');
Route::get('/kategori-download/{slug}', [\App\Http\Controllers\HomeController::class, 'downloadKategori'])->name('public.download.kategori');
Route::get('/unduh/{download}', [\App\Http\Controllers\Admin\DownloadController::class, 'unduh'])->name('public.download.unduh');
Route::get('/preview/{download}', [\App\Http\Controllers\Admin\DownloadController::class, 'preview'])->name('public.download.preview');
Route::get('/opd', [\App\Http\Controllers\HomeController::class, 'opdIndex'])->name('public.opd.index');
Route::get('/opd/{slug}', [\App\Http\Controllers\HomeController::class, 'opdShow'])->name('public.opd.show');
Route::get('/gallery', [\App\Http\Controllers\HomeController::class, 'galleryIndex'])->name('public.gallery.index');
Route::get('/kategori-foto/{slug}', [\App\Http\Controllers\HomeController::class, 'galleryKategori'])->name('public.gallery.kategori');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Kategori Halaman
        Route::resource('kategori-halaman', KategoriHalamanController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['kategori-halaman' => 'kategoriHalaman']);

        // Halaman
        Route::resource('halaman', HalamanController::class)
            ->parameters(['halaman' => 'halaman']);

        // OPD Daerah
        Route::resource('opd', \App\Http\Controllers\Admin\OpdController::class)
            ->except(['show'])
            ->parameters(['opd' => 'opd']);

        // Slider
        Route::resource('slider', SliderController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
        Route::post('slider/reorder', [SliderController::class, 'reorder'])->name('slider.reorder');

        // Kategori Download
        Route::resource('kategori-download', KategoriDownloadController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['kategori-download' => 'kategoriDownload']);

        // Download
        Route::resource('download', DownloadController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
            ->parameters(['download' => 'download']);
        Route::get('download/{download}/unduh', [DownloadController::class, 'unduh'])->name('download.unduh');
        Route::get('download/{download}/preview', [DownloadController::class, 'preview'])->name('download.preview');

        // Kategori Foto
        Route::resource('kategori-foto', KategoriFotoController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Foto
        Route::resource('foto', FotoController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
        Route::post('foto/reorder', [FotoController::class, 'reorder'])->name('foto.reorder');

        // Kategori Video
        Route::resource('kategori-video', \App\Http\Controllers\Admin\KategoriVideoController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Video
        Route::resource('video', \App\Http\Controllers\Admin\VideoController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
        Route::post('video/reorder', [\App\Http\Controllers\Admin\VideoController::class, 'reorder'])->name('video.reorder');

        // Link Website
        Route::resource('link-website', LinkWebsiteController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::post('link-website/reorder', [LinkWebsiteController::class, 'reorder'])->name('link-website.reorder');

        // Graph Chart
        Route::resource('graph-chart', \App\Http\Controllers\Admin\GraphChartController::class)
            ->except(['show']);

        // Pengguna / User
        Route::resource('user', \App\Http\Controllers\Admin\UserController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Agenda Kegiatan
        Route::resource('agenda', \App\Http\Controllers\Admin\AgendaController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Data Dasar
        Route::resource('data-dasar', \App\Http\Controllers\Admin\DataDasarController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Harga Bahan Pokok
        Route::resource('harga-bahan-pokok', \App\Http\Controllers\Admin\HargaBahanPokokController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Harga Ikan
        Route::resource('harga-ikan', \App\Http\Controllers\Admin\HargaIkanController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        // Menu Utama
        Route::resource('menu', \App\Http\Controllers\Admin\MenuController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });
});

require __DIR__.'/settings.php';
