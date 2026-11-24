<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LinkWebsite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LinkWebsiteController extends Controller
{
    public function index()
    {
        $links = LinkWebsite::orderBy('urutan')->latest()->get();
        return Inertia::render('link-website/index', [
            'links' => $links
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'url' => 'required|url',
            'logo' => 'nullable|image|max:2048', // max 2MB
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $path = null;
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('link-website', 'public');
        }

        $maxUrutan = LinkWebsite::max('urutan') ?? 0;

        LinkWebsite::create([
            'nama' => $request->nama,
            'url' => $request->url,
            'logo' => $path,
            'deskripsi' => $request->deskripsi,
            'status' => $request->status,
            'urutan' => $maxUrutan + 1,
        ]);

        return redirect()->back()->with('success', 'Link website berhasil ditambahkan.');
    }

    public function update(Request $request, LinkWebsite $linkWebsite)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'url' => 'required|url',
            'logo' => 'nullable|image|max:2048',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $data = $request->only(['nama', 'url', 'deskripsi', 'status']);

        if ($request->hasFile('logo')) {
            if ($linkWebsite->logo) {
                Storage::disk('public')->delete($linkWebsite->logo);
            }
            $data['logo'] = $request->file('logo')->store('link-website', 'public');
        }

        $linkWebsite->update($data);

        // Allow AJAX status toggle
        if ($request->wantsJson() || str_contains($request->headers->get('referer', ''), '/link-website')) {
            return back()->with('success', 'Link website berhasil diperbarui.');
        }

        return redirect()->back()->with('success', 'Link website berhasil diperbarui.');
    }

    public function destroy(LinkWebsite $linkWebsite)
    {
        if ($linkWebsite->logo) {
            Storage::disk('public')->delete($linkWebsite->logo);
        }
        $linkWebsite->delete();

        return redirect()->back()->with('success', 'Link website berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*' => 'integer|exists:link_websites,id',
        ]);

        foreach ($request->orders as $index => $id) {
            LinkWebsite::where('id', $id)->update(['urutan' => $index + 1]);
        }

        return redirect()->back()->with('success', 'Urutan berhasil disimpan.');
    }
}
