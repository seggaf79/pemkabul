<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\KategoriDownloadRequest;
use App\Models\KategoriDownload;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KategoriDownloadController extends Controller
{
    public function index(): Response
    {
        $kategoriDownloads = KategoriDownload::withCount('downloads')
            ->orderBy('urutan')
            ->orderBy('nama')
            ->get();

        return Inertia::render('kategori-download/index', [
            'kategoriDownloads' => $kategoriDownloads,
        ]);
    }

    public function store(KategoriDownloadRequest $request): RedirectResponse
    {
        KategoriDownload::create($request->validated());

        return redirect()->route('admin.kategori-download.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(KategoriDownloadRequest $request, KategoriDownload $kategoriDownload): RedirectResponse
    {
        $kategoriDownload->update($request->validated());

        return redirect()->route('admin.kategori-download.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(KategoriDownload $kategoriDownload): RedirectResponse
    {
        $kategoriDownload->delete();

        return redirect()->route('admin.kategori-download.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }
}
