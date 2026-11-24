<?php

namespace App\Http\Controllers;

use App\Models\Download;
use App\Models\DownloadLog;
use App\Models\Halaman;
use App\Models\Slider;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Cards
        $totalHalaman = Halaman::count();
        $totalSlider = Slider::count();
        $totalDownload = Download::sum('jumlah_unduhan');

        // 2. Top 5 Halaman Terpopuler
        $topHalaman = Halaman::orderByDesc('views')
            ->take(5)
            ->get(['id', 'judul', 'slug', 'views']);

        // 3. Grafik Unduhan (12 Bulan Tahun Berjalan)
        $currentYear = Carbon::now()->year;
        
        $downloadLogs = DownloadLog::whereYear('created_at', $currentYear)
            ->selectRaw('MONTH(created_at) as bulan, COUNT(*) as total')
            ->groupBy('bulan')
            ->pluck('total', 'bulan')
            ->toArray();

        $bulanIndo = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];

        $grafikUnduhan = [];
        for ($i = 1; $i <= 12; $i++) {
            $grafikUnduhan[] = [
                'name' => $bulanIndo[$i],
                'unduhan' => $downloadLogs[$i] ?? 0,
            ];
        }

        return Inertia::render('dashboard', [
            'total_halaman' => $totalHalaman,
            'total_slider' => $totalSlider,
            'total_download' => (int) $totalDownload,
            'top_halaman' => $topHalaman,
            'grafik_unduhan' => $grafikUnduhan,
            'tahun_berjalan' => $currentYear,
        ]);
    }
}
