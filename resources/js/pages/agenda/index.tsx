import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, Calendar, MapPin, Archive, ShieldAlert, ArrowLeft, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Agenda {
    id: number;
    nama_kegiatan: string;
    tanggal: string;
    lokasi: string;
    jam: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    agendas: Agenda[];
    isArsip: boolean;
}

const formatIndonesianDate = (dateStr: string) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    // Split the YYYY-MM-DD safely to avoid timezone offset issues in standard JS Date constructor
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const d = new Date(year, month, day);
    if (isNaN(d.getTime())) return dateStr;
    
    return `${days[d.getDay()]}, ${day} ${months[month]} ${year}`;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Agenda Kegiatan', href: '/admin/agenda' },
];

export default function AgendaIndex({ agendas, isArsip }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editTarget, setEditTarget] = useState<Agenda | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Agenda | null>(null);

    const { data, setData, post, put, processing, errors, reset, transform } = useForm<{
        nama_kegiatan: string;
        tanggal: string;
        lokasi: string;
        jam: string;
    }>({
        nama_kegiatan: '',
        tanggal: '',
        lokasi: '',
        jam: '',
    });

    const openCreate = () => {
        reset();
        setMode('create');
        setEditTarget(null);
        setIsOpen(true);
    };

    const openEdit = (item: Agenda) => {
        setData({
            nama_kegiatan: item.nama_kegiatan,
            tanggal: item.tanggal,
            lokasi: item.lokasi,
            jam: item.jam || '',
        });
        setMode('edit');
        setEditTarget(item);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post('/admin/agenda', {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Agenda kegiatan berhasil ditambahkan'); },
            });
        } else if (editTarget) {
            put(`/admin/agenda/${editTarget.id}`, {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Agenda kegiatan berhasil diperbarui'); },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/agenda/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Agenda kegiatan berhasil dihapus'); },
        });
    };

    const toggleArsip = () => {
        router.get('/admin/agenda', { arsip: isArsip ? undefined : 'true' });
    };


    return (
        <>
            <Head title={isArsip ? 'Arsip Agenda Kegiatan' : 'Agenda Kegiatan'} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isArsip ? 'Arsip Agenda Kegiatan' : 'Agenda Kegiatan'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {isArsip 
                                ? 'Daftar kegiatan Pemerintah Kabupaten Bulungan yang telah selesai dilaksanakan' 
                                : 'Kelola jadwal dan agenda kegiatan Pemerintah Kabupaten Bulungan'
                            }
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={toggleArsip}
                            className="w-full sm:w-auto"
                        >
                            {isArsip ? (
                                <>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Agenda Aktif
                                </>
                            ) : (
                                <>
                                    <Archive className="mr-2 h-4 w-4" /> Arsip Kegiatan
                                </>
                            )}
                        </Button>
                        <Button onClick={openCreate} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Kegiatan
                        </Button>
                    </div>
                </div>

                {agendas.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-8 text-center shadow-sm">
                        <div className="rounded-full bg-primary/10 p-4 text-primary">
                            <Calendar className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">Belum ada agenda</h3>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                            {isArsip 
                                ? 'Tidak ada riwayat agenda kegiatan yang telah lewat.' 
                                : 'Semua agenda kegiatan aktif akan muncul di sini. Mulailah dengan membuat kegiatan baru!'
                            }
                        </p>
                        <Button onClick={openCreate} className="mt-6" variant="secondary">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Kegiatan
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {agendas.map((item) => (
                            <div 
                                key={item.id} 
                                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <div className="inline-flex items-center gap-2 rounded-lg bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{formatIndonesianDate(item.tanggal)}</span>
                                            </div>
                                            {item.jam && (
                                                <div className="inline-flex items-center gap-2 rounded-lg bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{item.jam}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border bg-background/50 hover:bg-background">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEdit(item)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="text-destructive focus:text-destructive" 
                                                        onClick={() => setDeleteTarget(item)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                            {item.nama_kegiatan}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                                    <span className="truncate">{item.lokasi}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === 'create' ? 'Tambah Agenda Kegiatan' : 'Edit Agenda Kegiatan'}
                        </DialogTitle>
                        <DialogDescription>
                            Isi detail agenda kegiatan di bawah ini dengan lengkap.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="nama_kegiatan">Nama Kegiatan <span className="text-destructive">*</span></Label>
                            <Input 
                                id="nama_kegiatan" 
                                value={data.nama_kegiatan} 
                                onChange={e => setData('nama_kegiatan', e.target.value)} 
                                required 
                                placeholder="Contoh: Rapat Koordinasi Wilayah Pemkab" 
                            />
                            {errors.nama_kegiatan && <p className="text-xs text-destructive">{errors.nama_kegiatan}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="tanggal">Tanggal Kegiatan <span className="text-destructive">*</span></Label>
                            <Input 
                                id="tanggal" 
                                type="date" 
                                value={data.tanggal} 
                                onChange={e => setData('tanggal', e.target.value)} 
                                required 
                            />
                            {errors.tanggal && <p className="text-xs text-destructive">{errors.tanggal}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="jam">Jam / Waktu Kegiatan <span className="text-destructive">*</span></Label>
                            <Input 
                                id="jam" 
                                value={data.jam} 
                                onChange={e => setData('jam', e.target.value)} 
                                required 
                                placeholder="Contoh: 09:00 WITA atau 08:30 - Selesai" 
                            />
                            {errors.jam && <p className="text-xs text-destructive">{errors.jam}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="lokasi">Lokasi Kegiatan <span className="text-destructive">*</span></Label>
                            <Input 
                                id="lokasi" 
                                value={data.lokasi} 
                                onChange={e => setData('lokasi', e.target.value)} 
                                required 
                                placeholder="Contoh: Ruang Rapat Lantai 2 Kantor Bupati" 
                            />
                            {errors.lokasi && <p className="text-xs text-destructive">{errors.lokasi}</p>}
                        </div>

                        <DialogFooter className="pt-2">
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
                            Hapus Agenda Kegiatan
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus agenda kegiatan <strong className="text-foreground">{deleteTarget?.nama_kegiatan}</strong>? Tindakan ini tidak dapat dibatalkan.
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

AgendaIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
