import { useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type KategoriDownload } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, ImageIcon, FileUp, FileText, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    kategoriDownloads: KategoriDownload[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Download', href: '/admin/download' },
    { title: 'Tambah File', href: '/admin/download/create' },
];

const ALLOWED_TYPES = 'PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, JPG, PNG, WEBP';

function formatBytes(bytes: number): string {
    if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(2) + ' MB';
    if (bytes >= 1_024) return (bytes / 1_024).toFixed(2) + ' KB';
    return bytes + ' B';
}

export default function DownloadCreate({ kategoriDownloads }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const sampulRef = useRef<HTMLInputElement>(null);
    const [sampulPreview, setSampulPreview] = useState<string | null>(null);
    const [fileInfo, setFileInfo] = useState<{ name: string; size: string; ext: string } | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        kategori_download_id: string;
        judul: string;
        slug: string;
        deskripsi: string;
        file: File | null;
        sampul: File | null;
        status: string;
        urutan: number;
    }>({
        kategori_download_id: '',
        judul: '',
        slug: '',
        deskripsi: '',
        file: null,
        sampul: null,
        status: 'aktif',
        urutan: 0,
    });

    const autoSlug = (v: string) =>
        v.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setData('file', f);
        const ext = f.name.split('.').pop()?.toUpperCase() ?? '';
        setFileInfo({ name: f.name, size: formatBytes(f.size), ext });
        // Auto-isi judul dari nama file jika belum diisi
        if (!data.judul) {
            const title = f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
            setData('judul', title);
            setData('slug', autoSlug(title));
        }
    };

    const handleSampulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setData('sampul', f);
        setSampulPreview(URL.createObjectURL(f));
    };

    const removeSampul = () => {
        setData('sampul', null);
        setSampulPreview(null);
        if (sampulRef.current) sampulRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/download', { forceFormData: true });
    };

    return (
        <>
            <Head title="Tambah File Download" />
            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/download"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah File Download</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">Upload file baru untuk publik</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main */}
                        <div className="space-y-5 lg:col-span-2">
                            {/* Upload File */}
                            <div className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
                                <h2 className="font-semibold">File Upload <span className="text-destructive">*</span></h2>
                                <p className="text-xs text-muted-foreground">Format: {ALLOWED_TYPES} · Maks 50 MB</p>

                                {fileInfo ? (
                                    <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-background">
                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{fileInfo.name}</p>
                                            <p className="text-xs text-muted-foreground">{fileInfo.ext} · {fileInfo.size}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { setData('file', null); setFileInfo(null); if (fileRef.current) fileRef.current.value = ''; }}
                                            className="rounded-full p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 p-10 transition-colors hover:border-primary/40 hover:bg-primary/5"
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                            <FileUp className="h-7 w-7 text-muted-foreground/50" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">Klik untuk memilih file</p>
                                            <p className="mt-1 text-xs text-muted-foreground">{ALLOWED_TYPES}</p>
                                            <p className="text-xs text-muted-foreground">Maks 50 MB</p>
                                        </div>
                                    </button>
                                )}

                                <input ref={fileRef} type="file" className="hidden"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.jpg,.jpeg,.png,.webp"
                                    onChange={handleFileChange}
                                />
                                {!fileInfo && (
                                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Pilih File
                                    </Button>
                                )}
                                {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
                            </div>

                            {/* Info */}
                            <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
                                <h2 className="font-semibold">Informasi File</h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="dl-judul">Judul <span className="text-destructive">*</span></Label>
                                    <Input id="dl-judul" value={data.judul}
                                        onChange={(e) => { setData('judul', e.target.value); setData('slug', autoSlug(e.target.value)); }}
                                        placeholder="Judul file download..." />
                                    {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="dl-slug">Slug</Label>
                                    <Input id="dl-slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="judul-file-download" />
                                    {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="dl-deskripsi">Deskripsi</Label>
                                    <textarea
                                        id="dl-deskripsi"
                                        rows={4}
                                        className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        placeholder="Deskripsi singkat tentang file ini..."
                                    />
                                    {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                                </div>
                            </div>

                            {/* Sampul */}
                            <div className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-semibold">Gambar Sampul</h2>
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Opsional</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Gambar thumbnail untuk ditampilkan di daftar download (JPG/PNG/WEBP · maks 2 MB)</p>

                                {sampulPreview ? (
                                    <div className="group relative inline-block">
                                        <img src={sampulPreview} alt="Sampul" className="h-32 w-48 rounded-lg border object-cover" />
                                        <button type="button" onClick={removeSampul}
                                            className="absolute right-1.5 top-1.5 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 shadow transition-opacity group-hover:opacity-100">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => sampulRef.current?.click()}
                                        className="flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/40 hover:bg-primary/5">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                    </button>
                                )}

                                <input ref={sampulRef} type="file" accept="image/*" className="hidden" onChange={handleSampulChange} />
                                <Button type="button" variant="outline" size="sm" onClick={() => sampulRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4" /> Pilih Sampul
                                </Button>
                                {errors.sampul && <p className="text-xs text-destructive">{errors.sampul}</p>}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div className="sticky top-4 space-y-4 rounded-xl border bg-card p-5 shadow-sm">
                                <h2 className="font-semibold">Pengaturan</h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="dl-kategori">Kategori <span className="text-destructive">*</span></Label>
                                    <Select value={data.kategori_download_id} onValueChange={(v) => setData('kategori_download_id', v)}>
                                        <SelectTrigger id="dl-kategori"><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                                        <SelectContent>
                                            {kategoriDownloads.length === 0 ? (
                                                <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                                                    Belum ada kategori.{' '}
                                                    <a href="/admin/kategori-download" className="text-primary underline">Buat dulu</a>
                                                </div>
                                            ) : (
                                                kategoriDownloads.map((k) => <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>)
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.kategori_download_id && <p className="text-xs text-destructive">{errors.kategori_download_id}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="dl-status">Status</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger id="dl-status"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aktif">Aktif</SelectItem>
                                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="dl-urutan">Urutan</Label>
                                    <Input id="dl-urutan" type="number" min={0} value={data.urutan} onChange={(e) => setData('urutan', Number(e.target.value))} />
                                    {errors.urutan && <p className="text-xs text-destructive">{errors.urutan}</p>}
                                </div>

                                {/* Info tip */}
                                <div className="flex gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 p-3 text-xs text-blue-700 dark:text-blue-300">
                                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    <p>Tipe file, ukuran, dan nama asli akan terdeteksi otomatis saat upload.</p>
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? 'Mengupload...' : 'Simpan File'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild className="w-full">
                                        <Link href="/admin/download">Batal</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

DownloadCreate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
