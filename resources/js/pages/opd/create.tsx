import { useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/rich-text-editor';
import { ArrowLeft, Upload, X, ImageIcon, Building, Phone, Mail, Globe, Instagram, Facebook, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'OPD Daerah', href: '/admin/opd' },
    { title: 'Tambah OPD', href: '/admin/opd/create' },
];

export default function OpdCreate() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        nama: string;
        deskripsi: string;
        alamat: string;
        telepon: string;
        email: string;
        website: string;
        instagram: string;
        facebook: string;
        nama_kepala: string;
        foto_kantor: File | null;
        urutan: number;
    }>({
        nama: '',
        deskripsi: '',
        alamat: '',
        telepon: '',
        email: '',
        website: '',
        instagram: '',
        facebook: '',
        nama_kepala: '',
        foto_kantor: null,
        urutan: 0,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto_kantor', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('foto_kantor', null);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/opd', { forceFormData: true });
    };

    return (
        <>
            <Head title="Tambah OPD Daerah" />

            <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/opd">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah OPD Daerah</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Tambahkan Organisasi Perangkat Daerah baru</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content (Left/Center) */}
                        <div className="lg:col-span-2 space-y-5">

                            {/* === SECTION 1: Identitas OPD === */}
                            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    Identitas OPD
                                </h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="nama">Nama OPD <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Contoh: Dinas Komunikasi dan Informatika Kab. Bulungan"
                                    />
                                    {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="deskripsi">Deskripsi / Tupoksi</Label>
                                    <RichTextEditor
                                        value={data.deskripsi}
                                        onChange={(v) => setData('deskripsi', v)}
                                        placeholder="Uraikan tugas pokok dan fungsi OPD ini..."
                                    />
                                    {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="alamat">Alamat Kantor</Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        placeholder="Alamat lengkap kantor..."
                                        rows={2}
                                    />
                                    {errors.alamat && <p className="text-xs text-destructive">{errors.alamat}</p>}
                                </div>
                            </div>

                            {/* === SECTION 2: Informasi Kontak & Sosial Media === */}
                            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    Informasi Kontak & Sosial Media
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="telepon" className="flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5" /> Nomor Telepon
                                        </Label>
                                        <Input
                                            id="telepon"
                                            value={data.telepon}
                                            onChange={(e) => setData('telepon', e.target.value)}
                                            placeholder="(0552) XXXXX"
                                        />
                                        {errors.telepon && <p className="text-xs text-destructive">{errors.telepon}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5" /> Email Resmi
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="opd@bulungan.go.id"
                                        />
                                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="website" className="flex items-center gap-1.5">
                                            <Globe className="h-3.5 w-3.5" /> Website
                                        </Label>
                                        <Input
                                            id="website"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        {errors.website && <p className="text-xs text-destructive">{errors.website}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="instagram" className="flex items-center gap-1.5">
                                            <Instagram className="h-3.5 w-3.5" /> Instagram
                                        </Label>
                                        <Input
                                            id="instagram"
                                            value={data.instagram}
                                            onChange={(e) => setData('instagram', e.target.value)}
                                            placeholder="@username atau URL"
                                        />
                                        {errors.instagram && <p className="text-xs text-destructive">{errors.instagram}</p>}
                                    </div>

                                    <div className="space-y-1.5 sm:col-span-2">
                                        <Label htmlFor="facebook" className="flex items-center gap-1.5">
                                            <Facebook className="h-3.5 w-3.5" /> Facebook
                                        </Label>
                                        <Input
                                            id="facebook"
                                            value={data.facebook}
                                            onChange={(e) => setData('facebook', e.target.value)}
                                            placeholder="https://facebook.com/..."
                                        />
                                        {errors.facebook && <p className="text-xs text-destructive">{errors.facebook}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* === SECTION 3: Kepala OPD & Foto Kantor === */}
                            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Kepala OPD & Foto Kantor
                                </h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="nama_kepala">Nama Kepala OPD</Label>
                                    <Input
                                        id="nama_kepala"
                                        value={data.nama_kepala}
                                        onChange={(e) => setData('nama_kepala', e.target.value)}
                                        placeholder="Nama lengkap beserta gelar, misal: Dr. H. Budi Santoso, S.H., M.M."
                                    />
                                    {errors.nama_kepala && <p className="text-xs text-destructive">{errors.nama_kepala}</p>}
                                </div>

                                {/* Foto Kantor */}
                                <div className="space-y-3">
                                    <Label>Foto Kantor</Label>

                                    {preview ? (
                                        <div className="relative group">
                                            <img
                                                src={preview}
                                                alt="Preview foto kantor"
                                                className="w-full max-h-72 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
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
                                                <p className="text-sm font-medium">Klik untuk upload foto kantor</p>
                                                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP hingga 2MB</p>
                                            </div>
                                        </button>
                                    )}

                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    {!preview && (
                                        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Pilih Foto
                                        </Button>
                                    )}

                                    {errors.foto_kantor && <p className="text-xs text-destructive">{errors.foto_kantor}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Settings */}
                        <div className="space-y-5">
                            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4 sticky top-4">
                                <h2 className="font-semibold">Pengaturan</h2>

                                <div className="space-y-1.5">
                                    <Label htmlFor="urutan">Urutan Tampil</Label>
                                    <Input
                                        id="urutan"
                                        type="number"
                                        min={0}
                                        value={data.urutan}
                                        onChange={(e) => setData('urutan', Number(e.target.value))}
                                    />
                                    <p className="text-[11px] text-muted-foreground">Angka lebih kecil tampil lebih dahulu.</p>
                                    {errors.urutan && <p className="text-xs text-destructive">{errors.urutan}</p>}
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? 'Menyimpan...' : 'Simpan OPD'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild className="w-full">
                                        <Link href="/admin/opd">Batal</Link>
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

OpdCreate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
