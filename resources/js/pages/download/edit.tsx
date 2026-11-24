import { useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Download, type KategoriDownload } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, ImageIcon, FileText, RefreshCw, Info } from 'lucide-react';

interface Props {
    download: Download;
    kategoriDownloads: KategoriDownload[];
}

function formatBytes(bytes: number): string {
    if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(2) + ' MB';
    if (bytes >= 1_024) return (bytes / 1_024).toFixed(2) + ' KB';
    return bytes + ' B';
}

export default function DownloadEdit({ download, kategoriDownloads }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const sampulRef = useRef<HTMLInputElement>(null);
    const [sampulPreview, setSampulPreview] = useState<string | null>(download.sampul_url ?? null);
    const [newFileInfo, setNewFileInfo] = useState<{ name: string; size: string; ext: string } | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Download', href: '/admin/download' },
        { title: `Edit: ${download.judul}`, href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        kategori_download_id: string;
        judul: string;
        slug: string;
        deskripsi: string;
        file: File | null;
        sampul: File | null;
        status: string;
        urutan: number;
    }>({
        _method: 'PUT',
        kategori_download_id: String(download.kategori_download_id),
        judul: download.judul,
        slug: download.slug,
        deskripsi: download.deskripsi ?? '',
        file: null,
        sampul: null,
        status: download.status,
        urutan: download.urutan,
    });

    const autoSlug = (v: string) =>
        v.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setData('file', f);
        const ext = f.name.split('.').pop()?.toUpperCase() ?? '';
        setNewFileInfo({ name: f.name, size: formatBytes(f.size), ext });
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
        post(`/admin/download/${download.id}`, { forceFormData: true });
    };

    return (
        <>
            <Head title={`Edit: ${download.judul}`} />
            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/download"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit File Download</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">{download.judul}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main */}
                        <div className="space-y-5 lg:col-span-2">
                            {/* File saat ini + ganti */}
                            <div className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
                                <h2 className="font-semibold">File</h2>

                                {/* File saat ini */}
                                <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-background">
                                        <FileText className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground mb-0.5">File saat ini</p>
                                        <p className="truncate font-medium">{download.nama_file_asli}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {download.tipe_file?.toUpperCase()} · {download.ukuran_format}
                                        </p>
                                    </div>
                                    <a href={download.file_url} target="_blank" rel="noreferrer"
                                        className="shrink-0 rounded-md border px-2 py-1 text-xs hover:bg-muted transition-colors">
                                        Preview
                                    </a>
                                </div>

                                {/* Ganti file */}
                                {newFileInfo ? (
                                    <div className="flex items-center gap-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <RefreshCw className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-primary mb-0.5 font-medium">File baru dipilih</p>
                                            <p className="truncate text-sm">{newFileInfo.name}</p>
                                            <p className="text-xs text-muted-foreground">{newFileInfo.ext} · {newFileInfo.size}</p>
                                        </div>
                                        <button type="button"
                                            onClick={() => { setData('file', null); setNewFileInfo(null); if (fileRef.current) fileRef.current.value = ''; }}
                                            className="shrink-0 rounded-full p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Ganti File
                                    </Button>
                                )}

                                <input ref={fileRef} type="file" className="hidden"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.jpg,.jpeg,.png,.webp"
                                    onChange={handleFileChange}
                                />
                                {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
                            </div>

                            {/* Info */}
                            <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
                                <h2 className="font-semibold">Informasi File</h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="dl-judul">Judul <span className="text-destructive">*</span></Label>
                                    <Input id="dl-judul" value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
                                    {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="dl-slug">Slug</Label>
                                    <Input id="dl-slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
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

                                {sampulPreview ? (
                                    <div className="group relative inline-block">
                                        <img src={sampulPreview} alt="Sampul" className="h-32 w-48 rounded-lg border object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-black/40">
                                            <button type="button" onClick={() => sampulRef.current?.click()}
                                                className="rounded-full bg-primary p-1.5 text-primary-foreground shadow">
                                                <Upload className="h-3.5 w-3.5" />
                                            </button>
                                            <button type="button" onClick={removeSampul}
                                                className="rounded-full bg-destructive p-1.5 text-destructive-foreground shadow">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => sampulRef.current?.click()}
                                        className="flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/40 hover:bg-primary/5">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                    </button>
                                )}

                                <input ref={sampulRef} type="file" accept="image/*" className="hidden" onChange={handleSampulChange} />
                                <Button type="button" variant="outline" size="sm" onClick={() => sampulRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4" /> {sampulPreview ? 'Ganti Sampul' : 'Pilih Sampul'}
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
                                        <SelectTrigger id="dl-kategori"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {kategoriDownloads.map((k) => <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>)}
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

                                {/* Stat unduhan */}
                                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                                    <p className="text-muted-foreground text-xs mb-1">Total Unduhan</p>
                                    <p className="text-2xl font-bold">{download.jumlah_unduhan.toLocaleString('id-ID')}</p>
                                </div>

                                <div className="flex flex-col gap-2 pt-1">
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? 'Menyimpan...' : 'Perbarui File'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild className="w-full">
                                        <Link href="/admin/download">Kembali ke Daftar</Link>
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

DownloadEdit.layout = (page: React.ReactNode) => {
    const dl = (page as any).props?.download as Download | undefined;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Download', href: '/admin/download' },
        { title: dl ? `Edit: ${dl.judul}` : 'Edit', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
