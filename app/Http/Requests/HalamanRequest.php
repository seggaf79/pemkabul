<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HalamanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('halaman')?->id;

        return [
            'kategori_halaman_id' => ['required', 'exists:kategori_halaman,id'],
            'judul'               => ['required', 'string', 'max:255'],
            'slug'                => ['nullable', 'string', 'max:255', 'unique:halaman,slug,' . $id],
            'konten'              => ['nullable', 'string'],
            'gambar'              => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'status'              => ['required', 'in:draft,published'],
            'urutan'              => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'kategori_halaman_id' => 'Kategori Halaman',
            'judul'               => 'Judul',
            'slug'                => 'Slug',
            'konten'              => 'Konten',
            'gambar'              => 'Gambar',
            'status'              => 'Status',
            'urutan'              => 'Urutan',
        ];
    }
}
