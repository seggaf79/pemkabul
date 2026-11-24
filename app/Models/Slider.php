<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory;

    protected $table = 'sliders';

    protected $fillable = [
        'judul',
        'subjudul',
        'deskripsi',
        'gambar',
        'url_tujuan',
        'teks_tombol',
        'posisi_teks',
        'status',
        'urutan',
    ];

    protected $casts = [
        'urutan' => 'integer',
        'status' => 'string',
        'posisi_teks' => 'string',
    ];

    public function getGambarUrlAttribute(): ?string
    {
        return $this->gambar ? asset('storage/' . $this->gambar) : null;
    }

    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif')->orderBy('urutan');
    }
}
