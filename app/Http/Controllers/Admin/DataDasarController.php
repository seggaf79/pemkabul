<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataDasar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataDasarController extends Controller
{
    public function index(): Response
    {
        $dataDasars = DataDasar::orderBy('tahun', 'desc')->get();

        return Inertia::render('data-dasar/index', [
            'dataDasars' => $dataDasars,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun' => 'required|string|max:255|unique:data_dasars,tahun',
            'luas_wilayah' => 'required|string|max:255',
            'jumlah_kecamatan' => 'required|string|max:255',
            'jumlah_desa' => 'required|string|max:255',
            'jumlah_puskesmas' => 'required|string|max:255',
            'jumlah_penduduk' => 'required|string|max:255',
            'ipm' => 'required|string|max:255',
            'umk' => 'required|string|max:255',
            'url_facebook' => 'nullable|url|max:255',
            'url_instagram' => 'nullable|url|max:255',
            'url_tiktok' => 'nullable|url|max:255',
        ]);

        DataDasar::create($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Data dasar berhasil ditambahkan.']);
    }

    public function update(Request $request, DataDasar $dataDasar): RedirectResponse
    {
        $validated = $request->validate([
            'tahun' => 'required|string|max:255|unique:data_dasars,tahun,' . $dataDasar->id,
            'luas_wilayah' => 'required|string|max:255',
            'jumlah_kecamatan' => 'required|string|max:255',
            'jumlah_desa' => 'required|string|max:255',
            'jumlah_puskesmas' => 'required|string|max:255',
            'jumlah_penduduk' => 'required|string|max:255',
            'ipm' => 'required|string|max:255',
            'umk' => 'required|string|max:255',
            'url_facebook' => 'nullable|url|max:255',
            'url_instagram' => 'nullable|url|max:255',
            'url_tiktok' => 'nullable|url|max:255',
        ]);

        $dataDasar->update($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Data dasar berhasil diperbarui.']);
    }

    public function destroy(DataDasar $dataDasar): RedirectResponse
    {
        $dataDasar->delete();

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Data dasar berhasil dihapus.']);
    }
}
