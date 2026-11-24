import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Plus, Trash2, Video as VideoIcon } from 'lucide-react';

interface KategoriVideo {
    id: number;
    nama: string;
    slug: string;
    deskripsi?: string;
    videos_count: number;
}

interface Props {
    kategoris: KategoriVideo[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori Video', href: '/admin/kategori-video' },
];

export default function KategoriVideoIndex({ kategoris }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        nama: '',
        deskripsi: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const openEdit = (kategori: KategoriVideo) => {
        setSelectedId(kategori.id);
        setFormData({
            nama: kategori.nama,
            deskripsi: kategori.deskripsi || '',
        });
        setErrors({});
        setIsEditOpen(true);
    };

    const openDelete = (id: number) => {
        setSelectedId(id);
        setIsDeleteOpen(true);
    };

    const closeModals = () => {
        setIsCreateOpen(false);
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        setFormData({ nama: '', deskripsi: '' });
        setErrors({});
        setTimeout(() => setSelectedId(null), 300);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        router.post('/admin/kategori-video', formData, {
            onSuccess: () => closeModals(),
            onError: (err) => setErrors(err),
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        router.put(`/admin/kategori-video/${selectedId}`, formData, {
            onSuccess: () => closeModals(),
            onError: (err) => setErrors(err),
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleDelete = () => {
        setIsProcessing(true);
        router.delete(`/admin/kategori-video/${selectedId}`, {
            onSuccess: () => closeModals(),
            onFinish: () => setIsProcessing(false)
        });
    };

    return (
        <>
            <Head title="Kategori Video" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kategori Video</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kategori untuk mengelompokkan galeri video Anda
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {kategoris.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                            Belum ada kategori video.
                        </div>
                    ) : (
                        kategoris.map((item) => (
                            <Card key={item.id} className="flex flex-col">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 text-primary">
                                            <VideoIcon className="h-5 w-5" />
                                            <CardTitle className="text-lg">{item.nama}</CardTitle>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(item)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDelete(item.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <CardDescription className="text-xs font-mono bg-muted inline-flex w-fit px-1.5 py-0.5 rounded mt-1">/{item.slug}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {item.deskripsi || <span className="italic opacity-50">Tanpa deskripsi</span>}
                                    </p>
                                </CardContent>
                                <div className="border-t px-6 py-3 bg-muted/20 text-xs font-medium text-muted-foreground">
                                    {item.videos_count} Video
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Kategori Video</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Kategori</Label>
                                <Input id="nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Contoh: Kegiatan Bupati" autoFocus />
                                {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea id="deskripsi" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} placeholder="Opsional" rows={3} />
                                {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModals}>Batal</Button>
                            <Button type="submit" disabled={isProcessing}>{isProcessing ? 'Menyimpan...' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Kategori Video</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama-edit">Nama Kategori</Label>
                                <Input id="nama-edit" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} autoFocus />
                                {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deskripsi-edit">Deskripsi</Label>
                                <Textarea id="deskripsi-edit" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} rows={3} />
                                {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModals}>Batal</Button>
                            <Button type="submit" disabled={isProcessing}>{isProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kategori Video</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kategori ini? 
                            Semua video yang terkait dengan kategori ini juga akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={closeModals}>Batal</Button>
                        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isProcessing}>
                            {isProcessing ? 'Menghapus...' : 'Hapus Kategori'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

KategoriVideoIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
