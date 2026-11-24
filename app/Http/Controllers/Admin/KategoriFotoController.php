<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KategoriFoto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class KategoriFotoController extends Controller
{
    public function index()
    {
        $kategoris = KategoriFoto::withCount('fotos')->latest()->get();
        return Inertia::render('kategori-foto/index', [
            'kategoris' => $kategoris
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:kategori_fotos,nama',
        ]);

        KategoriFoto::create([
            'nama' => $request->nama,
            'slug' => Str::slug($request->nama),
        ]);

        return back()->with('success', 'Kategori foto berhasil ditambahkan.');
    }

    public function update(Request $request, KategoriFoto $kategori_foto)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:kategori_fotos,nama,' . $kategori_foto->id,
        ]);

        $kategori_foto->update([
            'nama' => $request->nama,
            'slug' => Str::slug($request->nama),
        ]);

        return back()->with('success', 'Kategori foto berhasil diperbarui.');
    }

    public function destroy(KategoriFoto $kategori_foto)
    {
        if ($kategori_foto->fotos()->count() > 0) {
            return back()->with('error', 'Tidak dapat menghapus kategori yang masih memiliki foto.');
        }

        $kategori_foto->delete();

        return back()->with('success', 'Kategori foto berhasil dihapus.');
    }
}
