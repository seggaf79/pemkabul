<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\KategoriVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::with('kategori_video')
            ->orderBy('urutan')
            ->latest()
            ->get();

        return Inertia::render('video/index', [
            'videos' => $videos
        ]);
    }

    public function create()
    {
        $kategoris = KategoriVideo::orderBy('nama')->get();
        return Inertia::render('video/create', [
            'kategoris' => $kategoris
        ]);
    }

    private function extractYoutubeId($url)
    {
        preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/\s]{11})%i', $url, $match);
        return $match[1] ?? null;
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_video_id' => 'required|exists:kategori_videos,id',
            'judul' => 'required|string|max:255',
            'youtube_url' => 'required|url',
            'deskripsi' => 'nullable|string',
            'waktu_publish' => 'required|date',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $youtube_id = $this->extractYoutubeId($request->youtube_url);
        if (!$youtube_id) {
            return back()->withErrors(['youtube_url' => 'Format URL YouTube tidak valid.'])->withInput();
        }

        Video::create([
            'kategori_video_id' => $request->kategori_video_id,
            'judul' => $request->judul,
            'youtube_url' => $request->youtube_url,
            'youtube_id' => $youtube_id,
            'deskripsi' => $request->deskripsi,
            'waktu_publish' => $request->waktu_publish,
            'status' => $request->status,
        ]);

        return redirect('/admin/video')->with('success', 'Video berhasil ditambahkan');
    }

    public function edit(Video $video)
    {
        $kategoris = KategoriVideo::orderBy('nama')->get();
        return Inertia::render('video/edit', [
            'video' => $video,
            'kategoris' => $kategoris
        ]);
    }

    public function update(Request $request, Video $video)
    {
        $request->validate([
            'kategori_video_id' => 'required|exists:kategori_videos,id',
            'judul' => 'required|string|max:255',
            'youtube_url' => 'required|url',
            'deskripsi' => 'nullable|string',
            'waktu_publish' => 'required|date',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $youtube_id = $this->extractYoutubeId($request->youtube_url);
        if (!$youtube_id) {
            return back()->withErrors(['youtube_url' => 'Format URL YouTube tidak valid.'])->withInput();
        }

        $video->update([
            'kategori_video_id' => $request->kategori_video_id,
            'judul' => $request->judul,
            'youtube_url' => $request->youtube_url,
            'youtube_id' => $youtube_id,
            'deskripsi' => $request->deskripsi,
            'waktu_publish' => $request->waktu_publish,
            'status' => $request->status,
        ]);

        return redirect('/admin/video')->with('success', 'Video berhasil diperbarui');
    }

    public function destroy(Video $video)
    {
        $video->delete();
        return back()->with('success', 'Video berhasil dihapus');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:videos,id',
            'items.*.urutan' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            Video::where('id', $item['id'])->update(['urutan' => $item['urutan']]);
        }

        return response()->json(['success' => true]);
    }
}
