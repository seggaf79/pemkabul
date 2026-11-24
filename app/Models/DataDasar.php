<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataDasar extends Model
{
    protected $fillable = [
        'tahun',
        'luas_wilayah',
        'jumlah_kecamatan',
        'jumlah_desa',
        'jumlah_puskesmas',
        'jumlah_penduduk',
        'ipm',
        'umk',
        'url_facebook',
        'url_instagram',
        'url_tiktok',
    ];
}
