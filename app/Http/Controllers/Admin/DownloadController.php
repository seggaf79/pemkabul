<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DownloadRequest;
use App\Models\Download;
use App\Models\KategoriDownload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DownloadController extends Controller
{
    public function index(): Response
    {
        $query = Download::with('kategoriDownload')
            ->orderBy('urutan')
            ->orderBy('judul');

        if (request()->filled('kategori')) {
            $query->where('kategori_download_id', request('kategori'));
        }
        if (request()->filled('search')) {
            $query->where('judul', 'like', '%' . request('search') . '%');
        }
        if (request()->filled('status')) {
            $query->where('status', request('status'));
        }
        if (request()->filled('tipe')) {
            $query->where('tipe_file', request('tipe'));
        }

        $downloads = $query->paginate(12)->withQueryString();

        $downloads->getCollection()->transform(function ($d) {
            $d->file_url    = $d->file_url;
            $d->sampul_url  = $d->sampul_url;
            $d->ukuran_format = $d->ukuran_format;
            return $d;
        });

        $kategoriDownloads = KategoriDownload::orderBy('nama')->get(['id', 'nama']);

        $tipeList = Download::whereNotNull('tipe_file')
            ->distinct()
            ->pluck('tipe_file')
            ->sort()
            ->values();

        return Inertia::render('download/index', [
            'downloads'         => $downloads,
            'kategoriDownloads' => $kategoriDownloads,
            'tipeList'          => $tipeList,
            'filters'           => request()->only(['kategori', 'search', 'status', 'tipe']),
        ]);
    }

    public function create(): Response
    {
        $kategoriDownloads = KategoriDownload::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('download/create', [
            'kategoriDownloads' => $kategoriDownloads,
        ]);
    }

    public function store(DownloadRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Simpan file
        $file = $request->file('file');
        $data['file']           = $file->store('downloads/files', 'public');
        $data['nama_file_asli'] = $file->getClientOriginalName();
        $data['tipe_file']      = strtolower($file->getClientOriginalExtension());
        $data['ukuran_file']    = $file->getSize();

        // Simpan sampul
        if ($request->hasFile('sampul')) {
            $data['sampul'] = $request->file('sampul')->store('downloads/sampul', 'public');
        }

        Download::create($data);

        return redirect()->route('admin.download.index')
            ->with('success', 'File download berhasil ditambahkan.');
    }

    public function edit(Download $download): Response
    {
        $download->file_url      = $download->file_url;
        $download->sampul_url    = $download->sampul_url;
        $download->ukuran_format = $download->ukuran_format;

        $kategoriDownloads = KategoriDownload::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('download/edit', [
            'download'          => $download,
            'kategoriDownloads' => $kategoriDownloads,
        ]);
    }

    public function update(DownloadRequest $request, Download $download): RedirectResponse
    {
        $data = $request->validated();

        // Ganti file jika ada upload baru
        if ($request->hasFile('file')) {
            Storage::disk('public')->delete($download->file);
            $file = $request->file('file');
            $data['file']           = $file->store('downloads/files', 'public');
            $data['nama_file_asli'] = $file->getClientOriginalName();
            $data['tipe_file']      = strtolower($file->getClientOriginalExtension());
            $data['ukuran_file']    = $file->getSize();
        } else {
            unset($data['file']);
        }

        // Ganti sampul jika ada upload baru
        if ($request->hasFile('sampul')) {
            if ($download->sampul) {
                Storage::disk('public')->delete($download->sampul);
            }
            $data['sampul'] = $request->file('sampul')->store('downloads/sampul', 'public');
        } else {
            unset($data['sampul']);
        }

        $download->update($data);

        return redirect()->route('admin.download.index')
            ->with('success', 'File download berhasil diperbarui.');
    }

    public function destroy(Download $download): RedirectResponse
    {
        Storage::disk('public')->delete($download->file);
        if ($download->sampul) {
            Storage::disk('public')->delete($download->sampul);
        }
        $download->delete();

        return redirect()->route('admin.download.index')
            ->with('success', 'File download berhasil dihapus.');
    }

    /**
     * Redirect ke file + increment counter unduhan.
     */
    public function unduh(Download $download): HttpResponse|\Illuminate\Http\RedirectResponse
    {
        $download->increment('jumlah_unduhan');

        $download->logs()->create([
            'ip_address' => request()->ip(),
        ]);

        return redirect($download->file_url);
    }

    /**
     * Tampilkan preview file di browser (khususnya untuk PDF)
     */
    public function preview(Download $download)
    {
        if (!Storage::disk('public')->exists($download->file)) {
            abort(404, 'File tidak ditemukan.');
        }

        $path = Storage::disk('public')->path($download->file);
        
        $contentType = mime_content_type($path);
        
        return response()->file($path, [
            'Content-Type' => $contentType,
            'Content-Disposition' => 'inline; filename="' . $download->nama_file_asli . '"'
        ]);
    }
}
