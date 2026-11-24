<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriFoto extends Model
{
    protected $fillable = ['nama', 'slug'];

    public function fotos()
    {
        return $this->hasMany(Foto::class);
    }
}
