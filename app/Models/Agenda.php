<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    protected $fillable = [
        'nama_kegiatan',
        'tanggal',
        'lokasi',
        'jam',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];
}
