<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Halaman extends Model
{
    use HasFactory;

    protected $table = 'halaman';

    protected $fillable = [
        'kategori_halaman_id',
        'judul',
        'slug',
        'konten',
        'gambar',
        'status',
        'urutan',
        'views',
    ];

    protected $casts = [
        'status' => 'string',
        'urutan' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Halaman $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->judul);
            }
        });

        static::updating(function (Halaman $model) {
            if ($model->isDirty('judul') && !$model->isDirty('slug')) {
                $model->slug = Str::slug($model->judul);
            }
        });
    }

    public function kategoriHalaman(): BelongsTo
    {
        return $this->belongsTo(KategoriHalaman::class, 'kategori_halaman_id');
    }

    public function getGambarUrlAttribute(): ?string
    {
        return $this->gambar ? asset('storage/' . $this->gambar) : null;
    }
}
