<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\HalamanRequest;
use App\Models\Halaman;
use App\Models\KategoriHalaman;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HalamanController extends Controller
{
    public function index(): Response
    {
        $query = Halaman::with('kategoriHalaman')
            ->orderBy('urutan')
            ->orderBy('judul');

        if (request()->filled('kategori')) {
            $query->where('kategori_halaman_id', request('kategori'));
        }

        if (request()->filled('search')) {
            $query->where('judul', 'like', '%' . request('search') . '%');
        }

        if (request()->filled('status')) {
            $query->where('status', request('status'));
        }

        $halamanS = $query->paginate(10)->withQueryString();

        // Append gambar_url to each item
        $halamanS->getCollection()->transform(function ($halaman) {
            $halaman->gambar_url = $halaman->gambar_url;
            return $halaman;
        });

        $kategoriHalamanS = KategoriHalaman::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('halaman/index', [
            'halamanS'         => $halamanS,
            'kategoriHalamanS' => $kategoriHalamanS,
            'filters'          => request()->only(['kategori', 'search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $kategoriHalamanS = KategoriHalaman::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('halaman/create', [
            'kategoriHalamanS' => $kategoriHalamanS,
        ]);
    }

    public function store(HalamanRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('halaman', 'public');
        }

        Halaman::create($data);

        return redirect()->route('admin.halaman.index')
            ->with('success', 'Halaman berhasil ditambahkan.');
    }

    public function show(Halaman $halaman): Response
    {
        $halaman->load('kategoriHalaman');
        $halaman->gambar_url = $halaman->gambar_url;

        return Inertia::render('halaman/show', [
            'halaman' => $halaman,
        ]);
    }

    public function edit(Halaman $halaman): Response
    {
        $halaman->gambar_url = $halaman->gambar_url;
        $kategoriHalamanS = KategoriHalaman::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('halaman/edit', [
            'halaman'          => $halaman,
            'kategoriHalamanS' => $kategoriHalamanS,
        ]);
    }

    public function update(HalamanRequest $request, Halaman $halaman): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('gambar')) {
            // Hapus gambar lama
            if ($halaman->gambar) {
                Storage::disk('public')->delete($halaman->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('halaman', 'public');
        } else {
            unset($data['gambar']);
        }

        $halaman->update($data);

        return redirect()->route('admin.halaman.index')
            ->with('success', 'Halaman berhasil diperbarui.');
    }

    public function destroy(Halaman $halaman): RedirectResponse
    {
        if ($halaman->gambar) {
            Storage::disk('public')->delete($halaman->gambar);
        }

        $halaman->delete();

        return redirect()->route('admin.halaman.index')
            ->with('success', 'Halaman berhasil dihapus.');
    }
}
