<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\DataDasar;
use App\Models\Foto;
use App\Models\KategoriFoto;
use App\Models\GraphChart;
use App\Models\HargaBahanPokok;
use App\Models\HargaIkan;
use App\Models\LinkWebsite;
use App\Models\Menu;
use App\Models\Slider;
use App\Models\Video;
use App\Models\Download;
use App\Models\KategoriDownload;
use App\Models\Halaman;
use App\Models\KategoriHalaman;
use App\Models\Opd;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // 1. Navigation Menu Utama
        $menus = Menu::whereNull('parent_id')
            ->with(['children' => function($q) {
                $q->orderBy('urutan');
            }])
            ->orderBy('urutan')
            ->get();

        // 2. Sliders
        $sliders = Slider::orderBy('urutan')->get();

        // 3. Data Dasar (Last Year)
        $data_dasar = DataDasar::orderBy('tahun', 'desc')->first();

        // 4. Videos (6 Latest)
        $videos = Video::where('status', 'aktif')
            ->orderBy('created_at', 'desc')
            ->orderBy('urutan')
            ->take(6)
            ->get();

        // 5. Agendas (Active: today and future)
        $agendas = Agenda::where('tanggal', '>=', now()->setTimezone('Asia/Makassar')->toDateString())
            ->orderBy('tanggal', 'asc')
            ->get();

        // 6. Foto Gallery (10 photos)
        $fotos = Foto::orderBy('created_at', 'desc')
            ->orderBy('urutan')
            ->take(10)
            ->get();

        // 7. Harga Bahan Pokok (Chronological for Recharts & tables)
        $hargaBahanPokoks = HargaBahanPokok::orderBy('tanggal', 'asc')->get();

        // 8. Harga Ikan (Chronological for Recharts & tables)
        $hargaIkans = HargaIkan::orderBy('tanggal', 'asc')->get();

        // 9. Grafik & Statistik (Active, latest 5)
        $graphCharts = GraphChart::where('status', 'aktif')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 10. Links / Aplikasi Daerah
        $links = LinkWebsite::orderBy('urutan')->get();

        // 11. Downloads (Active, latest 10)
        $downloads = Download::where('status', 'aktif')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('welcome', [
            'menus' => $menus,
            'sliders' => $sliders,
            'dataDasar' => $data_dasar,
            'videos' => $videos,
            'agendas' => $agendas,
            'fotos' => $fotos,
            'hargaBahanPokoks' => $hargaBahanPokoks,
            'hargaIkans' => $hargaIkans,
            'graphCharts' => $graphCharts,
            'links' => $links,
            'downloads' => $downloads,
        ]);
    }

    public function halaman(string $slug): Response
    {
        $halaman = \App\Models\Halaman::where('slug', $slug)
            ->firstOrFail();

        // Increment views
        $halaman->increment('views');

        // Load menus for navbar
        $menus = Menu::whereNull('parent_id')
            ->with(['children' => function($q) {
                $q->orderBy('urutan');
            }])
            ->orderBy('urutan')
            ->get();

        // Load data dasar for footer social media
        $data_dasar = DataDasar::orderBy('tahun', 'desc')->first();

        // Load active agendas
        $agendas = Agenda::where('tanggal', '>=', now()->setTimezone('Asia/Makassar')->toDateString())
            ->orderBy('tanggal', 'asc')
            ->get();

        // Load active latest 5 downloads
        $downloads = Download::where('status', 'aktif')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('halaman/public', [
            'menus' => $menus,
            'dataDasar' => $data_dasar,
            'agendas' => $agendas,
            'downloads' => $downloads,
            'halaman' => [
                'id' => $halaman->id,
                'judul' => $halaman->judul,
                'slug' => $halaman->slug,
                'konten' => $halaman->konten,
                'gambar_url' => $halaman->gambar ? asset('storage/' . $halaman->gambar) : null,
                'views' => $halaman->views,
                'updated_at' => $halaman->updated_at ? $halaman->updated_at->toISOString() : null,
            ]
        ]);
    }

    public function downloadIndex(Request $request): Response
    {
        $menus = Menu::whereNull('parent_id')
            ->with(['children' => function($q) {
                $q->orderBy('urutan');
            }])
            ->orderBy('urutan')
            ->get();

        $data_dasar = DataDasar::orderBy('tahun', 'desc')->first();

        $agendas = Agenda::where('tanggal', '>=', now()->setTimezone('Asia/Makassar')->toDateString())
            ->orderBy('tanggal', 'asc')
            ->get();

        $latestDownloads = Download::where('status', 'aktif')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $downloads = Download::where('status', 'aktif')
            ->with('kategoriDownload')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $categories = KategoriDownload::orderBy('urutan')->orderBy('nama')->get();

        return Inertia::render('download-public/index', [
            'menus' => $menus,
            'dataDasar' => $data_dasar,
            'agendas' => $agendas,
            'latestDownloads' => $latestDownloads,
            'downloads' => $downloads,
            'categories' => $categories,
        ]);
    }

    public function downloadKategori(string $slug, Request $request): Response
    {
        $kategori = KategoriDownload::where('slug', $slug)->firstOrFail();

        $menus = Menu::whereNull('parent_id')
            ->with(['children' => function($q) {
                $q->orderBy('urutan');
            }])
            ->orderBy('urutan')
            ->get();

        $data_dasar = DataDasar::orderBy('tahun', 'desc')->first();

        $agendas = Agenda::where('tanggal', '>=', now()->setTimezone('Asia/Makassar')->toDateString())
            ->orderBy('tanggal', 'asc')
            ->get();

        $latestDownloads = Download::where('status', 'aktif')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $downloads = Download::where('status', 'aktif')
            ->where('kategori_download_id', $kategori->id)
            ->with('kategoriDownload')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $categories = KategoriDownload::orderBy('urutan')->orderBy('nama')->get();

        return Inertia::render('download-public/kategori', [
            'kategori' => $kategori,
            'menus' => $menus,
            'dataDasar' => $data_dasar,
            'agendas' => $agendas,
            'latestDownloads' => $latestDownloads,
            'downloads' => $downloads,
            'categories' => $categories,
        ]);
    }

    public function kategoriHalaman(string $slug, Request $request): Response
    {
        $kategori = KategoriHalaman::where('slug', $slug)->firstOrFail();

        $menus = Menu::whereNull('parent_id')
            ->with(['children' => function($q) {
                $q->orderBy('urutan');
            }])
            ->orderBy('urutan')
            ->get();

        $data_dasar = DataDasar::orderBy('tahun', 'desc')->first();

        $agendas = Agenda::where('tanggal', '>=', now()->setTimezone('Asia/Makassar')->toDateString())
            ->orderBy('tanggal', 'asc')
            ->get();

        $downloads = Download::where('status', 'aktif')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $halamanList = Halaman::where('kategori_halaman_id', $kategori->id)
            ->where('status', 'published')
            ->orderBy('urutan')
            ->orderBy('judul')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('halaman/kategori', [
            'kategori' => $kategori,
            'menus' => $menus,
            'dataDasar' => $data_dasar,
            'agendas' => $agendas,
            'downloads' => $downloads,
            'halamanList' => $halamanList,
        ]);
    }

    public function opdIndex(Request $request): Response
    {
        $menus = Menu::whereNull('parent_id')
            ->with(['children' => function($q) {
                $q->orderBy('urutan');
            }])
            ->orderBy('urutan')
            ->get();

        $data_dasar = DataDasar::orderBy('tahun', 'desc')->first();

        $agendas = Agenda::where('tanggal', '>=', now()->setTimezone('Asia/Makassar')->toDateString())
            ->orderBy('tanggal', 'asc')
            ->get();

        $downloads = Download::where('status', 'aktif')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $query = Opd::orderBy('urutan')->orderBy('nama');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', '%' . $search . '%')
                  ->orWhere('nama_kepala', 'like', '%' . $search . '%');
            });
        }

        $opds = $query->paginate(10)->withQueryString();

        return Inertia::render('opd-public/index', [
            'menus' => $menus,
            'dataDasar' => $data_dasar,
            'agendas' => $agendas,
            'downloads' => $downloads,
            'opds' => $opds,
            'filters' => $request->only(['search']),
        ]);
    }

    public function opdShow(string $slug): Response
    {
        $opd = Opd::where('slug', $slug)->firstOrFail();

        $menus = Menu::whereNull('parent_id')
            ->with(['children' => function($q) {
                $q->orderBy('urutan');
            }])
            ->orderBy('urutan')
            ->get();

        $data_dasar = DataDasar::orderBy('tahun', 'desc')->first();

        $agendas = Agenda::where('tanggal', '>=', now()->setTimezone('Asia/Makassar')->toDateString())
            ->orderBy('tanggal', 'asc')
            ->get();

        $downloads = Download::where('status', 'aktif')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('opd-public/show', [
            'menus' => $menus,
            'dataDasar' => $data_dasar,
            'agendas' => $agendas,
            'downloads' => $downloads,
            'opd' => $opd,
        ]);
    }

    public function galleryIndex(Request $request): Response
    {
        $menus = Menu::whereNull('parent_id')
            ->with(['children' => function($q) {
                $q->orderBy('urutan');
            }])
            ->orderBy('urutan')
            ->get();

        $data_dasar = DataDasar::orderBy('tahun', 'desc')->first();

        $agendas = Agenda::where('tanggal', '>=', now()->setTimezone('Asia/Makassar')->toDateString())
            ->orderBy('tanggal', 'asc')
            ->get();

        $downloads = Download::where('status', 'aktif')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 3x5 Grid means 15 items per page
        $fotos = Foto::where('status', 'aktif')
            ->with('kategori')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $categories = KategoriFoto::orderBy('nama')->get();

        return Inertia::render('foto-public/index', [
            'menus' => $menus,
            'dataDasar' => $data_dasar,
            'agendas' => $agendas,
            'downloads' => $downloads,
            'fotos' => $fotos,
            'categories' => $categories,
        ]);
    }

    public function galleryKategori(string $slug, Request $request): Response
    {
        $kategori = KategoriFoto::where('slug', $slug)->firstOrFail();

        $menus = Menu::whereNull('parent_id')
            ->with(['children' => function($q) {
                $q->orderBy('urutan');
            }])
            ->orderBy('urutan')
            ->get();

        $data_dasar = DataDasar::orderBy('tahun', 'desc')->first();

        $agendas = Agenda::where('tanggal', '>=', now()->setTimezone('Asia/Makassar')->toDateString())
            ->orderBy('tanggal', 'asc')
            ->get();

        $downloads = Download::where('status', 'aktif')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 3x3 Grid means 9 items per page for category page
        $fotos = Foto::where('status', 'aktif')
            ->where('kategori_foto_id', $kategori->id)
            ->with('kategori')
            ->orderBy('urutan')
            ->orderBy('created_at', 'desc')
            ->paginate(9)
            ->withQueryString();

        $categories = KategoriFoto::orderBy('nama')->get();

        return Inertia::render('foto-public/kategori', [
            'kategori' => $kategori,
            'menus' => $menus,
            'dataDasar' => $data_dasar,
            'agendas' => $agendas,
            'downloads' => $downloads,
            'fotos' => $fotos,
            'categories' => $categories,
        ]);
    }
}
