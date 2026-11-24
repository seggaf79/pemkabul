<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DownloadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id       = $this->route('download')?->id;
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'kategori_download_id' => ['required', 'exists:kategori_download,id'],
            'judul'                => ['required', 'string', 'max:255'],
            'slug'                 => ['nullable', 'string', 'max:255', 'unique:downloads,slug,' . $id],
            'deskripsi'            => ['nullable', 'string'],
            'file'                 => [
                $isUpdate ? 'nullable' : 'required',
                'file',
                'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,jpg,jpeg,png,webp',
                'max:51200', // 50 MB
            ],
            'sampul'               => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'status'               => ['required', 'in:aktif,nonaktif'],
            'urutan'               => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'kategori_download_id' => 'Kategori',
            'judul'                => 'Judul',
            'slug'                 => 'Slug',
            'deskripsi'            => 'Deskripsi',
            'file'                 => 'File',
            'sampul'               => 'Sampul',
            'status'               => 'Status',
            'urutan'               => 'Urutan',
        ];
    }
}
