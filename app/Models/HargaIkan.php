<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HargaIkan extends Model
{
    protected $fillable = [
        'tanggal',
        'ikan_tongkol',
        'ikan_bandeng_besar',
        'ikan_kembung',
        'ikan_layang',
        'ikan_putih',
        'ikan_kakap_merah',
        'ikan_mas',
        'ikan_kakap_putih',
        'ikan_nila',
        'ikan_lele',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];
}
