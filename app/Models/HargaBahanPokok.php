<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HargaBahanPokok extends Model
{
    protected $fillable = [
        'tanggal',
        'daging_sapi',
        'ayam_potong',
        'ayam_kampung',
        'cabe_rawit_merah',
        'cabe_rawit_hijau',
        'cabe_keriting',
        'cabe_merah_besar',
        'telur',
        'bawang_merah',
        'bawang_putih',
        'bawang_bombay',
        'minyak_goreng_medium',
        'minyak_goreng_premium',
        'gula_pasir',
        'kacang_tanah',
        'kentang',
        'wortel',
        'tomat',
        'beras_medium',
        'beras_premium',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];
}
