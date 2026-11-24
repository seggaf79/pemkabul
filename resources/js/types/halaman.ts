export interface Slider {
    id: number;
    judul: string;
    subjudul: string | null;
    deskripsi: string | null;
    gambar: string;
    gambar_url: string;
    url_tujuan: string | null;
    teks_tombol: string | null;
    posisi_teks: 'kiri' | 'tengah' | 'kanan';
    status: 'aktif' | 'nonaktif';
    urutan: number;
    created_at: string;
    updated_at: string;
}

export interface KategoriHalaman {
    id: number;
    nama: string;
    slug: string;
    deskripsi: string | null;
    urutan: number;
    halaman_s_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Halaman {
    id: number;
    kategori_halaman_id: number;
    kategori_halaman?: KategoriHalaman;
    judul: string;
    slug: string;
    konten: string | null;
    gambar: string | null;
    gambar_url: string | null;
    status: 'draft' | 'published';
    urutan: number;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface KategoriDownload {
    id: number;
    nama: string;
    slug: string;
    deskripsi: string | null;
    ikon: string | null;
    urutan: number;
    downloads_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Download {
    id: number;
    kategori_download_id: number;
    kategori_download?: KategoriDownload;
    judul: string;
    slug: string;
    deskripsi: string | null;
    file: string;
    file_url: string;
    nama_file_asli: string | null;
    tipe_file: string | null;
    ukuran_file: number | null;
    ukuran_format: string;
    sampul: string | null;
    sampul_url: string | null;
    status: 'aktif' | 'nonaktif';
    jumlah_unduhan: number;
    urutan: number;
    created_at: string;
    updated_at: string;
}
