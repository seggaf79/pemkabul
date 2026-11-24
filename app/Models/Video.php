<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'kategori_video_id',
        'judul',
        'youtube_url',
        'youtube_id',
        'deskripsi',
        'waktu_publish',
        'urutan',
        'status',
    ];

    public function kategori_video()
    {
        return $this->belongsTo(KategoriVideo::class);
    }
}
