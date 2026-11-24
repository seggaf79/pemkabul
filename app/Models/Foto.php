<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\Storage;

class Foto extends Model
{
    protected $fillable = [
        'kategori_foto_id',
        'foto',
        'deskripsi',
        'lokasi',
        'waktu_pemotretan',
        'fotografer',
        'status',
        'urutan',
    ];

    protected $casts = [
        'waktu_pemotretan' => 'date',
    ];

    protected $appends = ['foto_url'];

    public function kategori()
    {
        return $this->belongsTo(KategoriFoto::class, 'kategori_foto_id');
    }

    public function getFotoUrlAttribute()
    {
        return $this->foto ? Storage::url($this->foto) : null;
    }
}
