<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Foto;
use App\Models\KategoriFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FotoController extends Controller
{
    public function index()
    {
        $fotos = Foto::with('kategori')->orderBy('urutan')->latest()->get();
        return Inertia::render('foto/index', [
            'fotos' => $fotos
        ]);
    }

    public function create()
    {
        return Inertia::render('foto/create', [
            'kategoris' => KategoriFoto::orderBy('nama')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_foto_id' => 'required|exists:kategori_fotos,id',
            'foto' => 'required|image|max:5120', // max 5MB
            'deskripsi' => 'nullable|string',
            'lokasi' => 'nullable|string|max:255',
            'waktu_pemotretan' => 'nullable|date',
            'fotografer' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $path = $request->file('foto')->store('gallery', 'public');

        $maxUrutan = Foto::max('urutan') ?? 0;

        Foto::create([
            'kategori_foto_id' => $request->kategori_foto_id,
            'foto' => $path,
            'deskripsi' => $request->deskripsi,
            'lokasi' => $request->lokasi,
            'waktu_pemotretan' => $request->waktu_pemotretan,
            'fotografer' => $request->fotografer,
            'status' => $request->status,
            'urutan' => $maxUrutan + 1,
        ]);

        return redirect()->route('admin.foto.index')->with('success', 'Foto berhasil diunggah.');
    }

    public function edit(Foto $foto)
    {
        return Inertia::render('foto/edit', [
            'foto' => $foto,
            'kategoris' => KategoriFoto::orderBy('nama')->get()
        ]);
    }

    public function update(Request $request, Foto $foto)
    {
        $request->validate([
            'kategori_foto_id' => 'required|exists:kategori_fotos,id',
            'foto' => 'nullable|image|max:5120',
            'deskripsi' => 'nullable|string',
            'lokasi' => 'nullable|string|max:255',
            'waktu_pemotretan' => 'nullable|date',
            'fotografer' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $data = $request->only([
            'kategori_foto_id', 'deskripsi', 'lokasi', 'waktu_pemotretan', 'fotografer', 'status'
        ]);

        if ($request->hasFile('foto')) {
            if ($foto->foto) {
                Storage::disk('public')->delete($foto->foto);
            }
            $data['foto'] = $request->file('foto')->store('gallery', 'public');
        }

        $foto->update($data);

        // If it's an AJAX request (like toggling status), return back
        if ($request->wantsJson() || str_contains($request->headers->get('referer', ''), '/foto')) {
            if (url()->previous() === route('admin.foto.edit', $foto)) {
                return redirect()->route('admin.foto.index')->with('success', 'Foto berhasil diperbarui.');
            }
            return back()->with('success', 'Status foto diperbarui.');
        }

        return redirect()->route('admin.foto.index')->with('success', 'Foto berhasil diperbarui.');
    }

    public function destroy(Foto $foto)
    {
        if ($foto->foto) {
            Storage::disk('public')->delete($foto->foto);
        }
        $foto->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*' => 'integer|exists:fotos,id',
        ]);

        foreach ($request->orders as $index => $id) {
            Foto::where('id', $id)->update(['urutan' => $index + 1]);
        }

        return back()->with('success', 'Urutan foto berhasil disimpan.');
    }
}
