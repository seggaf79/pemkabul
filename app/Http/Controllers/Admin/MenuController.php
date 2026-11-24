<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Halaman;
use App\Models\KategoriHalaman;
use App\Models\KategoriDownload;
use App\Models\KategoriFoto;
use App\Models\KategoriVideo;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::with('children')->whereNull('parent_id')->orderBy('urutan')->get();
        $halamans = Halaman::where('status', 'published')->get(['id', 'judul', 'slug']);
        
        $kategoriHalamans = KategoriHalaman::get(['id', 'nama', 'slug']);
        $kategoriDownloads = KategoriDownload::get(['id', 'nama', 'slug']);
        $kategoriFotos = KategoriFoto::get(['id', 'nama', 'slug']);
        $kategoriVideos = KategoriVideo::get(['id', 'nama', 'slug']);
        
        $moduls = [
            ['nama' => 'Halaman Download', 'url' => '/download'],
            ['nama' => 'Gallery Foto', 'url' => '/gallery'],
            ['nama' => 'Gallery Video', 'url' => '/video'],
            ['nama' => 'Agenda Kegiatan', 'url' => '/agenda'],
            ['nama' => 'OPD Daerah', 'url' => '/opd'],
        ];

        return Inertia::render('menu/index', [
            'menus' => $menus,
            'halamans' => $halamans,
            'kategoriHalamans' => $kategoriHalamans,
            'kategoriDownloads' => $kategoriDownloads,
            'kategoriFotos' => $kategoriFotos,
            'kategoriVideos' => $kategoriVideos,
            'moduls' => $moduls,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:url_bebas,halaman,modul,kategori_halaman,kategori_download,kategori_foto,kategori_video',
            'url' => 'nullable|string',
            'target' => 'required|in:_self,_blank',
            'parent_id' => 'nullable|exists:menus,id',
            'urutan' => 'nullable|integer',
        ]);

        $url = $this->resolveUrl($validated['tipe'], $request->input('url'));
        
        Menu::create([
            'nama' => $validated['nama'],
            'tipe' => $validated['tipe'],
            'url' => $url,
            'parent_id' => $validated['parent_id'],
            'urutan' => $validated['urutan'] ?? 0,
            'target' => $validated['target'],
        ]);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Menu berhasil ditambahkan.']);
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:url_bebas,halaman,modul,kategori_halaman,kategori_download,kategori_foto,kategori_video',
            'url' => 'nullable|string',
            'target' => 'required|in:_self,_blank',
            'parent_id' => 'nullable|exists:menus,id',
            'urutan' => 'nullable|integer',
        ]);

        $url = $this->resolveUrl($validated['tipe'], $request->input('url'));

        $menu->update([
            'nama' => $validated['nama'],
            'tipe' => $validated['tipe'],
            'url' => $url,
            'parent_id' => $validated['parent_id'],
            'urutan' => $validated['urutan'] ?? 0,
            'target' => $validated['target'],
        ]);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Menu berhasil diperbarui.']);
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();
        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Menu berhasil dihapus.']);
    }

    private function resolveUrl($tipe, $inputValue)
    {
        if ($tipe === 'halaman') {
            $halaman = Halaman::find($inputValue);
            return $halaman ? '/halaman/' . $halaman->slug : '#';
        }
        
        if ($tipe === 'kategori_halaman') {
            $kat = KategoriHalaman::find($inputValue);
            return $kat ? '/kategori/' . $kat->slug : '#';
        }
        
        if ($tipe === 'kategori_download') {
            $kat = KategoriDownload::find($inputValue);
            return $kat ? '/kategori-download/' . $kat->slug : '#';
        }

        if ($tipe === 'kategori_foto') {
            $kat = KategoriFoto::find($inputValue);
            return $kat ? '/kategori-foto/' . $kat->slug : '#';
        }
        
        if ($tipe === 'kategori_video') {
            $kat = KategoriVideo::find($inputValue);
            return $kat ? '/kategori-video/' . $kat->slug : '#';
        }
        
        if ($tipe === 'modul' || $tipe === 'url_bebas') {
            return $inputValue;
        }

        return '#';
    }
}
