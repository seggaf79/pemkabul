<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DownloadLog extends Model
{
    protected $fillable = ['download_id', 'ip_address'];

    public function download()
    {
        return $this->belongsTo(Download::class);
    }
}
