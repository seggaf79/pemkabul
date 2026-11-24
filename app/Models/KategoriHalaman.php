<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class KategoriHalaman extends Model
{
    use HasFactory;

    protected $table = 'kategori_halaman';

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'urutan',
    ];

    protected static function booted(): void
    {
        static::creating(function (KategoriHalaman $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->nama);
            }
        });

        static::updating(function (KategoriHalaman $model) {
            if ($model->isDirty('nama') && !$model->isDirty('slug')) {
                $model->slug = Str::slug($model->nama);
            }
        });
    }

    public function halamanS(): HasMany
    {
        return $this->hasMany(Halaman::class, 'kategori_halaman_id');
    }
}
