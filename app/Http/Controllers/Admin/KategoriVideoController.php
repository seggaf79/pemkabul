<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KategoriVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KategoriVideoController extends Controller
{
    public function index()
    {
        $kategoris = KategoriVideo::withCount('videos')
            ->latest()
            ->get();

        return Inertia::render('kategori-video/index', [
            'kategoris' => $kategoris
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $slug = Str::slug($request->nama);
        $count = KategoriVideo::where('slug', 'LIKE', "{$slug}%")->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        KategoriVideo::create([
            'nama' => $request->nama,
            'slug' => $slug,
            'deskripsi' => $request->deskripsi,
        ]);

        return back()->with('success', 'Kategori Video berhasil ditambahkan');
    }

    public function update(Request $request, KategoriVideo $kategoriVideo)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $slug = Str::slug($request->nama);
        if ($kategoriVideo->nama !== $request->nama) {
            $count = KategoriVideo::where('slug', 'LIKE', "{$slug}%")->where('id', '!=', $kategoriVideo->id)->count();
            if ($count > 0) {
                $slug = $slug . '-' . ($count + 1);
            }
        } else {
            $slug = $kategoriVideo->slug;
        }

        $kategoriVideo->update([
            'nama' => $request->nama,
            'slug' => $slug,
            'deskripsi' => $request->deskripsi,
        ]);

        return back()->with('success', 'Kategori Video berhasil diperbarui');
    }

    public function destroy(KategoriVideo $kategoriVideo)
    {
        $kategoriVideo->delete();
        return back()->with('success', 'Kategori Video berhasil dihapus');
    }
}
