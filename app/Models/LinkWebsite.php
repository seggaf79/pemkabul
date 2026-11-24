<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class LinkWebsite extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'url',
        'logo',
        'deskripsi',
        'urutan',
        'status',
    ];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute()
    {
        return $this->logo ? Storage::disk('public')->url($this->logo) : null;
    }
}
