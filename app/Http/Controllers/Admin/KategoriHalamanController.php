<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\KategoriHalamanRequest;
use App\Models\KategoriHalaman;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KategoriHalamanController extends Controller
{
    public function index(): Response
    {
        $kategoriHalamanS = KategoriHalaman::withCount('halamanS')
            ->orderBy('urutan')
            ->orderBy('nama')
            ->get();

        return Inertia::render('kategori-halaman/index', [
            'kategoriHalamanS' => $kategoriHalamanS,
        ]);
    }

    public function store(KategoriHalamanRequest $request): RedirectResponse
    {
        KategoriHalaman::create($request->validated());

        return redirect()->route('admin.kategori-halaman.index')
            ->with('success', 'Kategori halaman berhasil ditambahkan.');
    }

    public function update(KategoriHalamanRequest $request, KategoriHalaman $kategoriHalaman): RedirectResponse
    {
        $kategoriHalaman->update($request->validated());

        return redirect()->route('admin.kategori-halaman.index')
            ->with('success', 'Kategori halaman berhasil diperbarui.');
    }

    public function destroy(KategoriHalaman $kategoriHalaman): RedirectResponse
    {
        $kategoriHalaman->delete();

        return redirect()->route('admin.kategori-halaman.index')
            ->with('success', 'Kategori halaman berhasil dihapus.');
    }
}
