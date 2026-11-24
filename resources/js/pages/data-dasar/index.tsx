import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, Database, Facebook, Instagram, ShieldAlert, Globe, Map, Users, Building, ShieldCheck, Landmark } from 'lucide-react';
import { toast } from 'sonner';

interface DataDasar {
    id: number;
    tahun: string;
    luas_wilayah: string;
    jumlah_kecamatan: string;
    jumlah_desa: string;
    jumlah_puskesmas: string;
    jumlah_penduduk: string;
    ipm: string;
    umk: string;
    url_facebook: string | null;
    url_instagram: string | null;
    url_tiktok: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    dataDasars: DataDasar[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Data Dasar', href: '/admin/data-dasar' },
];

export default function DataDasarIndex({ dataDasars }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editTarget, setEditTarget] = useState<DataDasar | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<DataDasar | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm<{
        tahun: string;
        luas_wilayah: string;
        jumlah_kecamatan: string;
        jumlah_desa: string;
        jumlah_puskesmas: string;
        jumlah_penduduk: string;
        ipm: string;
        umk: string;
        url_facebook: string;
        url_instagram: string;
        url_tiktok: string;
    }>({
        tahun: '',
        luas_wilayah: '',
        jumlah_kecamatan: '',
        jumlah_desa: '',
        jumlah_puskesmas: '',
        jumlah_penduduk: '',
        ipm: '',
        umk: '',
        url_facebook: '',
        url_instagram: '',
        url_tiktok: '',
    });

    const openCreate = () => {
        reset();
        setMode('create');
        setEditTarget(null);
        setIsOpen(true);
    };

    const openEdit = (item: DataDasar) => {
        setData({
            tahun: item.tahun,
            luas_wilayah: item.luas_wilayah,
            jumlah_kecamatan: item.jumlah_kecamatan,
            jumlah_desa: item.jumlah_desa,
            jumlah_puskesmas: item.jumlah_puskesmas,
            jumlah_penduduk: item.jumlah_penduduk,
            ipm: item.ipm,
            umk: item.umk,
            url_facebook: item.url_facebook || '',
            url_instagram: item.url_instagram || '',
            url_tiktok: item.url_tiktok || '',
        });
        setMode('edit');
        setEditTarget(item);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post('/admin/data-dasar', {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Data dasar berhasil ditambahkan'); },
            });
        } else if (editTarget) {
            put(`/admin/data-dasar/${editTarget.id}`, {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Data dasar berhasil diperbarui'); },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/data-dasar/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Data dasar berhasil dihapus'); },
        });
    };

    return (
        <>
            <Head title="Data Dasar Kabupaten Bulungan" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Data Dasar Bulungan</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola statistik dasar dan media sosial Kabupaten Bulungan per tahun</p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Data Baru
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-20">Tahun</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Luas Wilayah</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Penduduk</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Kec./Desa</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">IPM</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">UMK</th>
                                <th className="px-4 py-3 text-center font-semibold text-muted-foreground w-36">Sosial Media</th>
                                <th className="px-4 py-3 text-right font-semibold text-muted-foreground w-20">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {dataDasars.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                        <Database className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada data dasar yang ditambahkan</p>
                                    </td>
                                </tr>
                            ) : (
                                dataDasars.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-bold text-foreground">
                                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                                                {item.tahun}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-foreground font-medium">{item.luas_wilayah}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.jumlah_penduduk}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {item.jumlah_kecamatan} Kec / {item.jumlah_desa} Desa
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-primary">{item.ipm}</td>
                                        <td className="px-4 py-3 text-foreground">{item.umk}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {item.url_facebook ? (
                                                    <a href={item.url_facebook} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue-500/10 p-1.5 text-blue-500 hover:bg-blue-500/20 transition-all">
                                                        <Facebook className="h-3.5 w-3.5" />
                                                    </a>
                                                ) : <span className="h-6 w-6 rounded-full bg-muted/30 border border-dashed flex items-center justify-center text-[10px] text-muted-foreground/30">-</span>}
                                                
                                                {item.url_instagram ? (
                                                    <a href={item.url_instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-pink-500/10 p-1.5 text-pink-500 hover:bg-pink-500/20 transition-all">
                                                        <Instagram className="h-3.5 w-3.5" />
                                                    </a>
                                                ) : <span className="h-6 w-6 rounded-full bg-muted/30 border border-dashed flex items-center justify-center text-[10px] text-muted-foreground/30">-</span>}
                                                
                                                {item.url_tiktok ? (
                                                    <a href={item.url_tiktok} target="_blank" rel="noopener noreferrer" className="rounded-full bg-foreground/10 p-1.5 text-foreground hover:bg-foreground/20 transition-all">
                                                        <Globe className="h-3.5 w-3.5" />
                                                    </a>
                                                ) : <span className="h-6 w-6 rounded-full bg-muted/30 border border-dashed flex items-center justify-center text-[10px] text-muted-foreground/30">-</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEdit(item)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(item)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{mode === 'create' ? 'Tambah Data Dasar' : 'Edit Data Dasar'}</DialogTitle>
                        <DialogDescription>Masukkan statistik dasar dan sosial media Kabupaten Bulungan.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Demografi & Wilayah */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-1 border-b">
                                <Map className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-semibold text-foreground">Data Wilayah & Demografi</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                    <Label htmlFor="tahun">Tahun Pendataan <span className="text-destructive">*</span></Label>
                                    <Input id="tahun" value={data.tahun} onChange={e => setData('tahun', e.target.value)} required placeholder="Contoh: 2025" />
                                    {errors.tahun && <p className="text-xs text-destructive">{errors.tahun}</p>}
                                </div>
                                
                                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                    <Label htmlFor="luas_wilayah">Luas Wilayah <span className="text-destructive">*</span></Label>
                                    <Input id="luas_wilayah" value={data.luas_wilayah} onChange={e => setData('luas_wilayah', e.target.value)} required placeholder="Contoh: 18.010,43 km²" />
                                    {errors.luas_wilayah && <p className="text-xs text-destructive">{errors.luas_wilayah}</p>}
                                </div>
                                
                                <div className="space-y-1.5 col-span-2">
                                    <Label htmlFor="jumlah_penduduk">Jumlah Penduduk <span className="text-destructive">*</span></Label>
                                    <Input id="jumlah_penduduk" value={data.jumlah_penduduk} onChange={e => setData('jumlah_penduduk', e.target.value)} required placeholder="Contoh: 151.034 Jiwa" />
                                    {errors.jumlah_penduduk && <p className="text-xs text-destructive">{errors.jumlah_penduduk}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Fasilitas & Ekonomi */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-1 border-b">
                                <Building className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-semibold text-foreground">Fasilitas & Ekonomi</h3>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5 col-span-3 sm:col-span-1">
                                    <Label htmlFor="jumlah_kecamatan">Jumlah Kecamatan <span className="text-destructive">*</span></Label>
                                    <Input id="jumlah_kecamatan" value={data.jumlah_kecamatan} onChange={e => setData('jumlah_kecamatan', e.target.value)} required placeholder="Contoh: 10" />
                                    {errors.jumlah_kecamatan && <p className="text-xs text-destructive">{errors.jumlah_kecamatan}</p>}
                                </div>
                                
                                <div className="space-y-1.5 col-span-3 sm:col-span-1">
                                    <Label htmlFor="jumlah_desa">Jumlah Desa <span className="text-destructive">*</span></Label>
                                    <Input id="jumlah_desa" value={data.jumlah_desa} onChange={e => setData('jumlah_desa', e.target.value)} required placeholder="Contoh: 74" />
                                    {errors.jumlah_desa && <p className="text-xs text-destructive">{errors.jumlah_desa}</p>}
                                </div>
                                
                                <div className="space-y-1.5 col-span-3 sm:col-span-1">
                                    <Label htmlFor="jumlah_puskesmas">Jumlah Puskesmas <span className="text-destructive">*</span></Label>
                                    <Input id="jumlah_puskesmas" value={data.jumlah_puskesmas} onChange={e => setData('jumlah_puskesmas', e.target.value)} required placeholder="Contoh: 12" />
                                    {errors.jumlah_puskesmas && <p className="text-xs text-destructive">{errors.jumlah_puskesmas}</p>}
                                </div>
                                
                                <div className="space-y-1.5 col-span-3 sm:col-span-1.5">
                                    <Label htmlFor="ipm">Indeks Pembangunan Manusia <span className="text-destructive">*</span></Label>
                                    <Input id="ipm" value={data.ipm} onChange={e => setData('ipm', e.target.value)} required placeholder="Contoh: 72,50" />
                                    {errors.ipm && <p className="text-xs text-destructive">{errors.ipm}</p>}
                                </div>

                                <div className="space-y-1.5 col-span-3 sm:col-span-1.5">
                                    <Label htmlFor="umk">UMK Bulungan <span className="text-destructive">*</span></Label>
                                    <Input id="umk" value={data.umk} onChange={e => setData('umk', e.target.value)} required placeholder="Contoh: Rp 3.480.627" />
                                    {errors.umk && <p className="text-xs text-destructive">{errors.umk}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Media Sosial */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-1 border-b">
                                <Globe className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-semibold text-foreground">Sosial Media Resmi</h3>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="url_facebook">URL Facebook</Label>
                                    <Input id="url_facebook" type="url" value={data.url_facebook} onChange={e => setData('url_facebook', e.target.value)} placeholder="https://facebook.com/..." />
                                    {errors.url_facebook && <p className="text-xs text-destructive">{errors.url_facebook}</p>}
                                </div>
                                
                                <div className="space-y-1.5">
                                    <Label htmlFor="url_instagram">URL Instagram</Label>
                                    <Input id="url_instagram" type="url" value={data.url_instagram} onChange={e => setData('url_instagram', e.target.value)} placeholder="https://instagram.com/..." />
                                    {errors.url_instagram && <p className="text-xs text-destructive">{errors.url_instagram}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="url_tiktok">URL Tiktok</Label>
                                    <Input id="url_tiktok" type="url" value={data.url_tiktok} onChange={e => setData('url_tiktok', e.target.value)} placeholder="https://tiktok.com/@..." />
                                    {errors.url_tiktok && <p className="text-xs text-destructive">{errors.url_tiktok}</p>}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-destructive" />
                            Hapus Data Dasar
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus data dasar tahun <strong className="text-foreground">{deleteTarget?.tahun}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DataDasarIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
