import { useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Slider } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ArrowLeft,
    Upload,
    X,
    ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link2,
    MousePointerClick,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    slider: Slider;
}

type PosisiTeks = 'kiri' | 'tengah' | 'kanan';

export default function SliderEdit({ slider }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>(slider.gambar_url);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Slider', href: '/admin/slider' },
        { title: `Edit: ${slider.judul}`, href: `/admin/slider/${slider.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        judul: string;
        subjudul: string;
        deskripsi: string;
        gambar: File | null;
        url_tujuan: string;
        teks_tombol: string;
        posisi_teks: PosisiTeks;
        status: string;
        urutan: number;
    }>({
        _method: 'PUT',
        judul: slider.judul,
        subjudul: slider.subjudul ?? '',
        deskripsi: slider.deskripsi ?? '',
        gambar: null,
        url_tujuan: slider.url_tujuan ?? '',
        teks_tombol: slider.teks_tombol ?? '',
        posisi_teks: slider.posisi_teks,
        status: slider.status,
        urutan: slider.urutan,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('gambar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/slider/${slider.id}`, { forceFormData: true });
    };

    return (
        <>
            <Head title={`Edit Slider: ${slider.judul}`} />
            <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/slider"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Slider</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">{slider.judul}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* ── Left: Image + Content ── */}
                        <div className="space-y-5 lg:col-span-2">
                            {/* Gambar */}
                            <div className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
                                <h2 className="font-semibold">Gambar Slider</h2>
                                <p className="text-xs text-muted-foreground">
                                    Biarkan kosong untuk mempertahankan gambar saat ini
                                </p>

                                {/* Live preview */}
                                <div className="group relative overflow-hidden rounded-lg border">
                                    <div className="relative aspect-[16/6] bg-muted">
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                        <div
                                            className={cn(
                                                'absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6',
                                                data.posisi_teks === 'tengah' && 'items-center text-center',
                                                data.posisi_teks === 'kanan' && 'items-end text-right',
                                                data.posisi_teks === 'kiri' && 'items-start text-left',
                                            )}
                                        >
                                            <p className="text-base font-bold text-white drop-shadow">
                                                {data.judul || 'Judul Slider'}
                                            </p>
                                            {data.subjudul && (
                                                <p className="text-sm text-white/80">{data.subjudul}</p>
                                            )}
                                            {data.teks_tombol && (
                                                <span className="mt-2 inline-flex items-center rounded-md bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/30">
                                                    {data.teks_tombol}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            className="rounded-full bg-primary p-1.5 text-primary-foreground shadow"
                                            title="Ganti gambar"
                                        >
                                            <Upload className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <p className="border-t px-4 py-2 text-xs text-muted-foreground">
                                        Live preview · Hover untuk ganti gambar
                                    </p>
                                </div>

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4" /> Ganti Gambar
                                </Button>
                                {errors.gambar && <p className="text-xs text-destructive">{errors.gambar}</p>}
                            </div>

                            {/* Konten */}
                            <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
                                <h2 className="font-semibold">Konten Teks</h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="judul">Judul <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="judul"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        placeholder="Selamat Datang di Kabupaten Bulungan"
                                    />
                                    {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="subjudul">Sub Judul</Label>
                                    <Input
                                        id="subjudul"
                                        value={data.subjudul}
                                        onChange={(e) => setData('subjudul', e.target.value)}
                                        placeholder="Teks pendukung di bawah judul..."
                                    />
                                    {errors.subjudul && <p className="text-xs text-destructive">{errors.subjudul}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <textarea
                                        id="deskripsi"
                                        rows={3}
                                        maxLength={500}
                                        className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        placeholder="Deskripsi singkat..."
                                    />
                                    <p className="text-right text-xs text-muted-foreground">{data.deskripsi.length}/500</p>
                                    {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                                </div>

                                {/* Posisi Teks */}
                                <div className="space-y-1.5">
                                    <Label>Posisi Teks</Label>
                                    <div className="flex gap-2">
                                        {(['kiri', 'tengah', 'kanan'] as PosisiTeks[]).map((pos) => (
                                            <button
                                                key={pos}
                                                type="button"
                                                onClick={() => setData('posisi_teks', pos)}
                                                className={cn(
                                                    'flex flex-1 flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors',
                                                    data.posisi_teks === pos
                                                        ? 'border-primary bg-primary/10 text-primary font-medium'
                                                        : 'hover:bg-muted/50 text-muted-foreground',
                                                )}
                                            >
                                                {pos === 'kiri' && <AlignLeft className="h-4 w-4" />}
                                                {pos === 'tengah' && <AlignCenter className="h-4 w-4" />}
                                                {pos === 'kanan' && <AlignRight className="h-4 w-4" />}
                                                <span className="capitalize">{pos}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.posisi_teks && <p className="text-xs text-destructive">{errors.posisi_teks}</p>}
                                </div>
                            </div>

                            {/* Link & Tombol */}
                            <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
                                <h2 className="font-semibold">Tautan & Tombol</h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="url_tujuan" className="flex items-center gap-1.5">
                                        <Link2 className="h-3.5 w-3.5" /> URL Tujuan
                                    </Label>
                                    <Input
                                        id="url_tujuan"
                                        type="url"
                                        value={data.url_tujuan}
                                        onChange={(e) => setData('url_tujuan', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    {errors.url_tujuan && <p className="text-xs text-destructive">{errors.url_tujuan}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="teks_tombol" className="flex items-center gap-1.5">
                                        <MousePointerClick className="h-3.5 w-3.5" /> Teks Tombol
                                    </Label>
                                    <Input
                                        id="teks_tombol"
                                        value={data.teks_tombol}
                                        onChange={(e) => setData('teks_tombol', e.target.value)}
                                        placeholder="cth: Selengkapnya..."
                                    />
                                    {errors.teks_tombol && <p className="text-xs text-destructive">{errors.teks_tombol}</p>}
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Settings ── */}
                        <div>
                            <div className="sticky top-4 space-y-4 rounded-xl border bg-card p-5 shadow-sm">
                                <h2 className="font-semibold">Pengaturan</h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aktif">Aktif</SelectItem>
                                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
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
                                    <p className="text-xs text-muted-foreground">Angka lebih kecil tampil lebih awal</p>
                                    {errors.urutan && <p className="text-xs text-destructive">{errors.urutan}</p>}
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? 'Menyimpan...' : 'Perbarui Slider'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild className="w-full">
                                        <Link href="/admin/slider">Kembali ke Daftar</Link>
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

SliderEdit.layout = (page: React.ReactNode) => {
    const slider = (page as any).props?.slider as Slider | undefined;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Slider', href: '/admin/slider' },
        { title: slider ? `Edit: ${slider.judul}` : 'Edit', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
