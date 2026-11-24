<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Opd;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OpdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Opd::orderBy('urutan')->orderBy('nama');

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%')
                ->orWhere('nama_kepala', 'like', '%' . $request->search . '%');
        }

        $opds = $query->paginate(12)->withQueryString();

        return Inertia::render('opd/index', [
            'opds' => $opds,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('opd/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'website' => 'nullable|url|max:255',
            'instagram' => 'nullable|string|max:100',
            'facebook' => 'nullable|url|max:255',
            'nama_kepala' => 'nullable|string|max:255',
            'foto_kantor' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'urutan' => 'required|integer|min:0',
        ]);

        if ($request->hasFile('foto_kantor')) {
            $validated['foto_kantor'] = $request->file('foto_kantor')->store('opd/photos', 'public');
        }

        Opd::create($validated);

        return redirect()->route('admin.opd.index')
            ->with('success', 'Data OPD berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Opd $opd): Response
    {
        return Inertia::render('opd/edit', [
            'opd' => $opd,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Opd $opd): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'website' => 'nullable|url|max:255',
            'instagram' => 'nullable|string|max:100',
            'facebook' => 'nullable|url|max:255',
            'nama_kepala' => 'nullable|string|max:255',
            'foto_kantor' => 'nullable', // custom verification below
            'urutan' => 'required|integer|min:0',
        ]);

        if ($request->hasFile('foto_kantor')) {
            $request->validate([
                'foto_kantor' => 'image|mimes:jpeg,png,jpg,webp|max:2048'
            ]);
            
            if ($opd->foto_kantor) {
                Storage::disk('public')->delete($opd->foto_kantor);
            }
            $validated['foto_kantor'] = $request->file('foto_kantor')->store('opd/photos', 'public');
        } else {
            // Keep original if not modified, or remove if cleared
            unset($validated['foto_kantor']);
        }

        $opd->update($validated);

        return redirect()->route('admin.opd.index')
            ->with('success', 'Data OPD berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Opd $opd): RedirectResponse
    {
        if ($opd->foto_kantor) {
            Storage::disk('public')->delete($opd->foto_kantor);
        }

        $opd->delete();

        return redirect()->route('admin.opd.index')
            ->with('success', 'Data OPD berhasil dihapus.');
    }
}
