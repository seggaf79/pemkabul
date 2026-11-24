<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HargaIkan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HargaIkanController extends Controller
{
    public function index(): Response
    {
        // Order by tanggal ASC for graph and chronological display
        $hargaIkans = HargaIkan::orderBy('tanggal', 'asc')->get();

        return Inertia::render('harga-ikan/index', [
            'hargaIkans' => $hargaIkans,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tanggal' => 'required|date_format:Y-m-d|unique:harga_ikans,tanggal',
            'ikan_tongkol' => 'required|integer|min:0',
            'ikan_bandeng_besar' => 'required|integer|min:0',
            'ikan_kembung' => 'required|integer|min:0',
            'ikan_layang' => 'required|integer|min:0',
            'ikan_putih' => 'required|integer|min:0',
            'ikan_kakap_merah' => 'required|integer|min:0',
            'ikan_mas' => 'required|integer|min:0',
            'ikan_kakap_putih' => 'required|integer|min:0',
            'ikan_nila' => 'required|integer|min:0',
            'ikan_lele' => 'required|integer|min:0',
        ]);

        HargaIkan::create($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Harga ikan berhasil ditambahkan.']);
    }

    public function update(Request $request, HargaIkan $hargaIkan): RedirectResponse
    {
        $validated = $request->validate([
            'tanggal' => 'required|date_format:Y-m-d|unique:harga_ikans,tanggal,' . $hargaIkan->id,
            'ikan_tongkol' => 'required|integer|min:0',
            'ikan_bandeng_besar' => 'required|integer|min:0',
            'ikan_kembung' => 'required|integer|min:0',
            'ikan_layang' => 'required|integer|min:0',
            'ikan_putih' => 'required|integer|min:0',
            'ikan_kakap_merah' => 'required|integer|min:0',
            'ikan_mas' => 'required|integer|min:0',
            'ikan_kakap_putih' => 'required|integer|min:0',
            'ikan_nila' => 'required|integer|min:0',
            'ikan_lele' => 'required|integer|min:0',
        ]);

        $hargaIkan->update($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Harga ikan berhasil diperbarui.']);
    }

    public function destroy(HargaIkan $hargaIkan): RedirectResponse
    {
        $hargaIkan->delete();

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Harga ikan berhasil dihapus.']);
    }
}
