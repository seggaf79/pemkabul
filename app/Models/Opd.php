<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Opd extends Model
{
    use HasFactory;

    protected $table = 'opds';

    protected $appends = [
        'foto_kantor_url',
    ];

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'alamat',
        'telepon',
        'email',
        'website',
        'instagram',
        'facebook',
        'nama_kepala',
        'foto_kantor',
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
            if ($model->isDirty('nama') && !$model->isDirty('slug')) {
                $model->slug = Str::slug($model->nama);
            }
        });
    }

    /* ── Accessors ─────────────────────────────────── */

    public function getFotoKantorUrlAttribute(): ?string
    {
        return $this->foto_kantor ? asset('storage/' . $this->foto_kantor) : null;
    }
}
