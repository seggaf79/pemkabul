<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Download extends Model
{
    use HasFactory;

    protected $table = 'downloads';

    protected $appends = [
        'file_url',
        'sampul_url',
        'ukuran_format',
    ];

    protected $fillable = [
        'kategori_download_id',
        'judul',
        'slug',
        'deskripsi',
        'file',
        'nama_file_asli',
        'tipe_file',
        'ukuran_file',
        'sampul',
        'status',
        'jumlah_unduhan',
        'urutan',
    ];

    protected $casts = [
        'ukuran_file'     => 'integer',
        'jumlah_unduhan'  => 'integer',
        'urutan'          => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->judul);
            }
        });

        static::updating(function (self $model) {
            if ($model->isDirty('judul') && ! $model->isDirty('slug')) {
                $model->slug = Str::slug($model->judul);
            }
        });
    }

    public function kategoriDownload(): BelongsTo
    {
        return $this->belongsTo(KategoriDownload::class, 'kategori_download_id');
    }

    public function logs()
    {
        return $this->hasMany(DownloadLog::class);
    }

    /* ── Accessors ─────────────────────────────────── */

    public function getFileUrlAttribute(): ?string
    {
        return $this->file ? asset('storage/' . $this->file) : null;
    }

    public function getSampulUrlAttribute(): ?string
    {
        return $this->sampul ? asset('storage/' . $this->sampul) : null;
    }

    /** Ukuran file dalam format human-readable */
    public function getUkuranFormatAttribute(): string
    {
        $bytes = $this->ukuran_file ?? 0;
        if ($bytes >= 1_048_576) return round($bytes / 1_048_576, 2) . ' MB';
        if ($bytes >= 1_024) return round($bytes / 1_024, 2) . ' KB';
        return $bytes . ' B';
    }
}
