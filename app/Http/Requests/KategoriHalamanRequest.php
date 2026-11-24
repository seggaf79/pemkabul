<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KategoriHalamanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('kategori_halaman')?->id;

        return [
            'nama'      => ['required', 'string', 'max:255'],
            'slug'      => ['nullable', 'string', 'max:255', 'unique:kategori_halaman,slug,' . $id],
            'deskripsi' => ['nullable', 'string'],
            'urutan'    => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nama'      => 'Nama Kategori',
            'slug'      => 'Slug',
            'deskripsi' => 'Deskripsi',
            'urutan'    => 'Urutan',
        ];
    }
}
