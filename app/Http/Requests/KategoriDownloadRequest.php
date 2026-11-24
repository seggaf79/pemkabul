<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KategoriDownloadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('kategori_download')?->id;

        return [
            'nama'      => ['required', 'string', 'max:255'],
            'slug'      => ['nullable', 'string', 'max:255', 'unique:kategori_download,slug,' . $id],
            'deskripsi' => ['nullable', 'string'],
            'ikon'      => ['nullable', 'string', 'max:100'],
            'urutan'    => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nama'      => 'Nama Kategori',
            'slug'      => 'Slug',
            'deskripsi' => 'Deskripsi',
            'ikon'      => 'Ikon',
            'urutan'    => 'Urutan',
        ];
    }
}
