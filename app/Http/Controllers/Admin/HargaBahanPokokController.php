<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HargaBahanPokok;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HargaBahanPokokController extends Controller
{
    public function index(): Response
    {
        // Order by tanggal ASC for graph and chronological display
        $hargaBahanPokoks = HargaBahanPokok::orderBy('tanggal', 'asc')->get();

        return Inertia::render('harga-bahan-pokok/index', [
            'hargaBahanPokoks' => $hargaBahanPokoks,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tanggal' => 'required|date_format:Y-m-d|unique:harga_bahan_pokoks,tanggal',
            'daging_sapi' => 'required|integer|min:0',
            'ayam_potong' => 'required|integer|min:0',
            'ayam_kampung' => 'required|integer|min:0',
            'cabe_rawit_merah' => 'required|integer|min:0',
            'cabe_rawit_hijau' => 'required|integer|min:0',
            'cabe_keriting' => 'required|integer|min:0',
            'cabe_merah_besar' => 'required|integer|min:0',
            'telur' => 'required|integer|min:0',
            'bawang_merah' => 'required|integer|min:0',
            'bawang_putih' => 'required|integer|min:0',
            'bawang_bombay' => 'required|integer|min:0',
            'minyak_goreng_medium' => 'required|integer|min:0',
            'minyak_goreng_premium' => 'required|integer|min:0',
            'gula_pasir' => 'required|integer|min:0',
            'kacang_tanah' => 'required|integer|min:0',
            'kentang' => 'required|integer|min:0',
            'wortel' => 'required|integer|min:0',
            'tomat' => 'required|integer|min:0',
            'beras_medium' => 'required|integer|min:0',
            'beras_premium' => 'required|integer|min:0',
        ]);

        HargaBahanPokok::create($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Harga bahan pokok berhasil ditambahkan.']);
    }

    public function update(Request $request, HargaBahanPokok $hargaBahanPokok): RedirectResponse
    {
        $validated = $request->validate([
            'tanggal' => 'required|date_format:Y-m-d|unique:harga_bahan_pokoks,tanggal,' . $hargaBahanPokok->id,
            'daging_sapi' => 'required|integer|min:0',
            'ayam_potong' => 'required|integer|min:0',
            'ayam_kampung' => 'required|integer|min:0',
            'cabe_rawit_merah' => 'required|integer|min:0',
            'cabe_rawit_hijau' => 'required|integer|min:0',
            'cabe_keriting' => 'required|integer|min:0',
            'cabe_merah_besar' => 'required|integer|min:0',
            'telur' => 'required|integer|min:0',
            'bawang_merah' => 'required|integer|min:0',
            'bawang_putih' => 'required|integer|min:0',
            'bawang_bombay' => 'required|integer|min:0',
            'minyak_goreng_medium' => 'required|integer|min:0',
            'minyak_goreng_premium' => 'required|integer|min:0',
            'gula_pasir' => 'required|integer|min:0',
            'kacang_tanah' => 'required|integer|min:0',
            'kentang' => 'required|integer|min:0',
            'wortel' => 'required|integer|min:0',
            'tomat' => 'required|integer|min:0',
            'beras_medium' => 'required|integer|min:0',
            'beras_premium' => 'required|integer|min:0',
        ]);

        $hargaBahanPokok->update($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Harga bahan pokok berhasil diperbarui.']);
    }

    public function destroy(HargaBahanPokok $hargaBahanPokok): RedirectResponse
    {
        $hargaBahanPokok->delete();

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Harga bahan pokok berhasil dihapus.']);
    }
}
