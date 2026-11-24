<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SliderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'judul'       => ['required', 'string', 'max:255'],
            'subjudul'    => ['nullable', 'string', 'max:255'],
            'deskripsi'   => ['nullable', 'string', 'max:500'],
            'gambar'      => [$isUpdate ? 'nullable' : 'required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'url_tujuan'  => ['nullable', 'url', 'max:500'],
            'teks_tombol' => ['nullable', 'string', 'max:100'],
            'posisi_teks' => ['required', 'in:kiri,tengah,kanan'],
            'status'      => ['required', 'in:aktif,nonaktif'],
            'urutan'      => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'judul'       => 'Judul',
            'subjudul'    => 'Sub Judul',
            'deskripsi'   => 'Deskripsi',
            'gambar'      => 'Gambar',
            'url_tujuan'  => 'URL Tujuan',
            'teks_tombol' => 'Teks Tombol',
            'posisi_teks' => 'Posisi Teks',
            'status'      => 'Status',
            'urutan'      => 'Urutan',
        ];
    }
}
