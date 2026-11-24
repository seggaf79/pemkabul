import { useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Halaman, type KategoriHalaman } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/rich-text-editor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Upload, X, ImageIcon, Trash2 } from 'lucide-react';

interface Props {
    halaman: Halaman;
    kategoriHalamanS: KategoriHalaman[];
}

export default function HalamanEdit({ halaman, kategoriHalamanS }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(halaman.gambar_url ?? null);
    const [removeGambar, setRemoveGambar] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Halaman', href: '/admin/halaman' },
        { title: 'Edit: ' + halaman.judul, href: `/admin/halaman/${halaman.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        kategori_halaman_id: string;
        judul: string;
        slug: string;
        konten: string;
        gambar: File | null;
        status: string;
        urutan: number;
    }>({
        _method: 'PUT',
        kategori_halaman_id: String(halaman.kategori_halaman_id),
        judul: halaman.judul,
        slug: halaman.slug,
        konten: halaman.konten ?? '',
        gambar: null,
        status: halaman.status,
        urutan: halaman.urutan,
    });

    const autoSlug = (text: string) =>
        text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('gambar', file);
            setPreview(URL.createObjectURL(file));
            setRemoveGambar(false);
        }
    };

    const handleRemoveImage = () => {
        setData('gambar', null);
        setPreview(null);
        setRemoveGambar(true);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/halaman/${halaman.id}`, { forceFormData: true });
    };

    return (
        <>
            <Head title={`Edit: ${halaman.judul}`} />

            <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/halaman">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Halaman</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">{halaman.judul}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* Info */}
                            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                                <h2 className="font-semibold">Informasi Halaman</h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="judul">Judul <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="judul"
                                        value={data.judul}
                                        onChange={(e) => {
                                            setData('judul', e.target.value);
                                        }}
                                        placeholder="Judul halaman..."
                                    />
                                    {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="judul-halaman"
                                    />
                                    {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                                </div>
                            </div>

                            {/* Konten */}
                            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
                                <h2 className="font-semibold">Konten</h2>
                                <RichTextEditor
                                    value={data.konten}
                                    onChange={(v) => setData('konten', v)}
                                    placeholder="Tulis konten halaman di sini..."
                                />
                                {errors.konten && <p className="text-xs text-destructive">{errors.konten}</p>}
                            </div>

                            {/* Gambar */}
                            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
                                <h2 className="font-semibold">Gambar Halaman</h2>

                                {preview ? (
                                    <div className="relative group">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full max-h-72 object-cover rounded-lg border"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => fileRef.current?.click()}
                                                className="rounded-full bg-primary p-1.5 text-primary-foreground shadow"
                                                title="Ganti gambar"
                                            >
                                                <Upload className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="rounded-full bg-destructive p-1.5 text-destructive-foreground shadow"
                                                title="Hapus gambar"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/30 p-10 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium">Klik untuk upload gambar</p>
                                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP hingga 5MB</p>
                                        </div>
                                    </button>
                                )}

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />

                                {!preview && (
                                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Pilih Gambar
                                    </Button>
                                )}

                                {errors.gambar && <p className="text-xs text-destructive">{errors.gambar}</p>}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-5">
                            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4 sticky top-4">
                                <h2 className="font-semibold">Pengaturan</h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="kategori_halaman_id">Kategori <span className="text-destructive">*</span></Label>
                                    <Select
                                        value={data.kategori_halaman_id}
                                        onValueChange={(v) => setData('kategori_halaman_id', v)}
                                    >
                                        <SelectTrigger id="kategori_halaman_id">
                                            <SelectValue placeholder="Pilih kategori..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kategoriHalamanS.map((k) => (
                                                <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kategori_halaman_id && (
                                        <p className="text-xs text-destructive">{errors.kategori_halaman_id}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="urutan">Urutan</Label>
                                    <Input
                                        id="urutan"
                                        type="number"
                                        min={0}
                                        value={data.urutan}
                                        onChange={(e) => setData('urutan', Number(e.target.value))}
                                    />
                                    {errors.urutan && <p className="text-xs text-destructive">{errors.urutan}</p>}
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? 'Menyimpan...' : 'Perbarui Halaman'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild className="w-full">
                                        <Link href={`/admin/halaman/${halaman.id}`}>
                                            Lihat Halaman
                                        </Link>
                                    </Button>
                                    <Button type="button" variant="ghost" asChild className="w-full text-muted-foreground">
                                        <Link href="/admin/halaman">Kembali ke Daftar</Link>
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

HalamanEdit.layout = (page: React.ReactNode) => {
    const halaman = (page as any).props?.halaman as Halaman | undefined;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Halaman', href: '/admin/halaman' },
        { title: halaman ? `Edit: ${halaman.judul}` : 'Edit', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
