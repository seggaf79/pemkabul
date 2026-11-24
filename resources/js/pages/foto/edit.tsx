import { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ImagePlus, X, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface KategoriFoto {
    id: number;
    nama: string;
}

interface Foto {
    id: number;
    kategori_foto_id: number;
    foto_url: string;
    deskripsi?: string;
    lokasi?: string;
    waktu_pemotretan?: string;
    fotografer?: string;
    status: string;
}

interface Props {
    foto: Foto;
    kategoris: KategoriFoto[];
}

export default function FotoEdit({ foto, kategoris }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(foto.foto_url);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        kategori_foto_id: foto.kategori_foto_id.toString(),
        foto: null as File | null,
        deskripsi: foto.deskripsi || '',
        lokasi: foto.lokasi || '',
        waktu_pemotretan: foto.waktu_pemotretan ? foto.waktu_pemotretan.split('T')[0] : '', // Extract just the date part if it's datetime
        fotografer: foto.fotografer || '',
        status: foto.status,
    });



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        } else {
            setData('foto', null);
            setPreview(foto.foto_url); // Revert to original if cancelled
        }
    };

    const resetFile = () => {
        setData('foto', null);
        setPreview(foto.foto_url);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/foto/${foto.id}`, {
            onSuccess: () => toast.success('Data foto berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui data. Periksa kembali form isian.')
        });
    };

    return (
        <>
            <Head title="Edit Data Foto" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/foto">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Data Foto</h1>
                        <p className="text-sm text-muted-foreground">Perbarui informasi atau ganti file gambar dari foto ini</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
                    
                    {/* Left Column - Image Upload */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">File Foto</CardTitle>
                                <CardDescription>Biarkan kosong jika tidak ingin mengubah gambar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div 
                                    className="relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                            {data.foto && (
                                                <Button 
                                                    type="button" 
                                                    variant="secondary" 
                                                    size="icon" 
                                                    className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-md"
                                                    onClick={(e) => { e.stopPropagation(); resetFile(); }}
                                                    title="Batal ubah foto"
                                                >
                                                    <RefreshCcw className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                                            <div className="rounded-full bg-background p-3 shadow-sm">
                                                <ImagePlus className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Klik untuk ganti gambar</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity">
                                        <span className="text-sm font-medium text-white px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                                            Ubah Foto
                                        </span>
                                    </div>
                                </div>
                                <Input 
                                    ref={fileInputRef} 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                />
                                {errors.foto && <p className="text-xs text-destructive">{errors.foto}</p>}
                                
                                {data.foto && (
                                    <p className="text-xs text-orange-600 font-medium">
                                        * File foto akan diganti saat Anda menyimpan.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Detail Informasi Foto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                
                                <div className="space-y-1.5">
                                    <Label htmlFor="kategori_foto_id">Kategori Foto <span className="text-destructive">*</span></Label>
                                    <Select 
                                        value={data.kategori_foto_id} 
                                        onValueChange={(val) => setData('kategori_foto_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kategoris.length === 0 && (
                                                <SelectItem value="empty" disabled>Belum ada kategori. Buat terlebih dahulu.</SelectItem>
                                            )}
                                            {kategoris.map((k) => (
                                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kategori_foto_id && <p className="text-xs text-destructive">{errors.kategori_foto_id}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                                    <Textarea
                                        id="deskripsi"
                                        rows={3}
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        placeholder="Tuliskan keterangan mengenai foto ini..."
                                    />
                                    {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="lokasi">Lokasi Pemotretan</Label>
                                        <Input
                                            id="lokasi"
                                            value={data.lokasi}
                                            onChange={(e) => setData('lokasi', e.target.value)}
                                            placeholder="Cth: Kantor Bupati Bulungan"
                                        />
                                        {errors.lokasi && <p className="text-xs text-destructive">{errors.lokasi}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="fotografer">Nama Fotografer</Label>
                                        <Input
                                            id="fotografer"
                                            value={data.fotografer}
                                            onChange={(e) => setData('fotografer', e.target.value)}
                                            placeholder="Cth: Humas / John Doe"
                                        />
                                        {errors.fotografer && <p className="text-xs text-destructive">{errors.fotografer}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="waktu_pemotretan">Tanggal Pemotretan</Label>
                                        <Input
                                            id="waktu_pemotretan"
                                            type="date"
                                            value={data.waktu_pemotretan}
                                            onChange={(e) => setData('waktu_pemotretan', e.target.value)}
                                        />
                                        {errors.waktu_pemotretan && <p className="text-xs text-destructive">{errors.waktu_pemotretan}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="status">Status Publish <span className="text-destructive">*</span></Label>
                                        <Select 
                                            value={data.status} 
                                            onValueChange={(val) => setData('status', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="aktif">Aktif (Ditampilkan)</SelectItem>
                                                <SelectItem value="nonaktif">Nonaktif (Sembunyikan)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end border-t">
                                    <Button type="button" variant="outline" className="mr-3" asChild>
                                        <Link href="/admin/foto">Batal</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Perbarui Foto'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </form>
            </div>
        </>
    );
}

FotoEdit.layout = (page: React.ReactNode) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gallery Foto', href: '/admin/foto' },
        { title: 'Edit Foto', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
