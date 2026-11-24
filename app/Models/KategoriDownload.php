<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class KategoriDownload extends Model
{
    use HasFactory;

    protected $table = 'kategori_download';

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'ikon',
        'urutan',
    ];

    protected $casts = [
        'urutan' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->nama);
            }
        });

        static::updating(function (self $model) {
            if ($model->isDirty('nama') && ! $model->isDirty('slug')) {
                $model->slug = Str::slug($model->nama);
            }
        });
    }

    public function downloads(): HasMany
    {
        return $this->hasMany(Download::class, 'kategori_download_id');
    }
}
