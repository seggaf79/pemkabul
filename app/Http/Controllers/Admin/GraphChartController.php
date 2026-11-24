<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GraphChart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GraphChartController extends Controller
{
    public function index()
    {
        $charts = GraphChart::latest()->get();
        return Inertia::render('graph-chart/index', [
            'charts' => $charts
        ]);
    }

    public function create()
    {
        return Inertia::render('graph-chart/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:bar,line,pie,area',
            'data' => 'required|array',
            'keterangan' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        GraphChart::create($request->all());

        return redirect()->route('admin.graph-chart.index')->with('success', 'Grafik berhasil dibuat.');
    }

    public function edit(GraphChart $graphChart)
    {
        return Inertia::render('graph-chart/edit', [
            'chart' => $graphChart
        ]);
    }

    public function update(Request $request, GraphChart $graphChart)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:bar,line,pie,area',
            'data' => 'required|array',
            'keterangan' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $graphChart->update($request->all());

        if ($request->wantsJson() || str_contains($request->headers->get('referer', ''), '/graph-chart')) {
            if (url()->previous() === route('admin.graph-chart.edit', $graphChart)) {
                return redirect()->route('admin.graph-chart.index')->with('success', 'Grafik berhasil diperbarui.');
            }
            return back()->with('success', 'Grafik berhasil diperbarui.');
        }

        return redirect()->route('admin.graph-chart.index')->with('success', 'Grafik berhasil diperbarui.');
    }

    public function destroy(GraphChart $graphChart)
    {
        $graphChart->delete();
        return back()->with('success', 'Grafik berhasil dihapus.');
    }
}
