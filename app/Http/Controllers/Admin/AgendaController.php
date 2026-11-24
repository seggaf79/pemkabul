<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AgendaController extends Controller
{
    public function index(Request $request): Response
    {
        $isArsip = $request->boolean('arsip');
        $today = Carbon::today()->toDateString();
        
        $query = Agenda::query();
        
        if ($isArsip) {
            // Agenda yang sudah lewat (tanggal < hari ini)
            $agendas = $query->where('tanggal', '<', $today)
                             ->orderBy('tanggal', 'desc')
                             ->get();
        } else {
            // Agenda hari ini dan yang akan datang (tanggal >= hari ini)
            $agendas = $query->where('tanggal', '>=', $today)
                             ->orderBy('tanggal', 'asc')
                             ->get();
        }

        return Inertia::render('agenda/index', [
            'agendas' => $agendas,
            'isArsip' => $isArsip,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_kegiatan' => 'required|string|max:255',
            'tanggal' => 'required|date_format:Y-m-d',
            'lokasi' => 'required|string|max:255',
            'jam' => 'required|string|max:255',
        ]);

        Agenda::create($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Agenda kegiatan berhasil ditambahkan.']);
    }

    public function update(Request $request, Agenda $agenda): RedirectResponse
    {
        $validated = $request->validate([
            'nama_kegiatan' => 'required|string|max:255',
            'tanggal' => 'required|date_format:Y-m-d',
            'lokasi' => 'required|string|max:255',
            'jam' => 'required|string|max:255',
        ]);

        $agenda->update($validated);

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Agenda kegiatan berhasil diperbarui.']);
    }

    public function destroy(Agenda $agenda): RedirectResponse
    {
        $agenda->delete();

        return redirect()->back()->with('toast', ['type' => 'success', 'message' => 'Agenda kegiatan berhasil dihapus.']);
    }
}
