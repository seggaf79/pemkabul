<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GraphChart extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'tipe',
        'data',
        'keterangan',
        'status',
    ];

    protected $casts = [
        'data' => 'array',
    ];
}
