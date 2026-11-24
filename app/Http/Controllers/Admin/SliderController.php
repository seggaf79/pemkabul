<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SliderRequest;
use App\Models\Slider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SliderController extends Controller
{
    public function index(): Response
    {
        $sliders = Slider::orderBy('urutan')->orderBy('created_at')->get()->map(function ($slider) {
            $slider->gambar_url = $slider->gambar_url;
            return $slider;
        });

        return Inertia::render('slider/index', [
            'sliders' => $sliders,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('slider/create');
    }

    public function store(SliderRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['gambar'] = $request->file('gambar')->store('sliders', 'public');

        Slider::create($data);

        return redirect()->route('admin.slider.index')
            ->with('success', 'Slider berhasil ditambahkan.');
    }

    public function edit(Slider $slider): Response
    {
        $slider->gambar_url = $slider->gambar_url;

        return Inertia::render('slider/edit', [
            'slider' => $slider,
        ]);
    }

    public function update(SliderRequest $request, Slider $slider): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('gambar')) {
            Storage::disk('public')->delete($slider->gambar);
            $data['gambar'] = $request->file('gambar')->store('sliders', 'public');
        } else {
            unset($data['gambar']);
        }

        $slider->update($data);

        return redirect()->route('admin.slider.index')
            ->with('success', 'Slider berhasil diperbarui.');
    }

    public function destroy(Slider $slider): RedirectResponse
    {
        Storage::disk('public')->delete($slider->gambar);
        $slider->delete();

        return redirect()->route('admin.slider.index')
            ->with('success', 'Slider berhasil dihapus.');
    }

    /**
     * Update urutan slider via AJAX (drag & drop).
     */
    public function reorder(): RedirectResponse
    {
        $orders = request()->validate([
            'orders'   => ['required', 'array'],
            'orders.*' => ['integer', 'exists:sliders,id'],
        ])['orders'];

        foreach ($orders as $index => $id) {
            Slider::where('id', $id)->update(['urutan' => $index + 1]);
        }

        return back()->with('success', 'Urutan slider berhasil diperbarui.');
    }
}
