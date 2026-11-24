import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, FolderHeart, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface KategoriFoto {
    id: number;
    nama: string;
    slug: string;
    fotos_count?: number;
}

interface Props {
    kategoris: KategoriFoto[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori Foto', href: '/admin/kategori-foto' },
];

type Mode = 'create' | 'edit';

export default function KategoriFotoIndex({ kategoris }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<Mode>('create');
    const [editTarget, setEditTarget] = useState<KategoriFoto | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<KategoriFoto | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: '',
    });

    const openCreate = () => {
        reset();
        setMode('create');
        setEditTarget(null);
        setIsOpen(true);
    };

    const openEdit = (item: KategoriFoto) => {
        setData({ nama: item.nama });
        setMode('edit');
        setEditTarget(item);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            post('/admin/kategori-foto', {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Kategori foto berhasil ditambahkan'); },
            });
        } else if (editTarget) {
            put(`/admin/kategori-foto/${editTarget.id}`, {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Kategori foto berhasil diperbarui'); },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/kategori-foto/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Kategori foto berhasil dihapus'); },
            onError: () => { setDeleteTarget(null); toast.error('Gagal menghapus kategori'); }
        });
    };

    const totalFoto = kategoris.reduce((s, k) => s + (k.fotos_count ?? 0), 0);

    return (
        <>
            <Head title="Kategori Foto" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kategori Foto</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola kategori untuk mengelompokkan galeri foto</p>
                    </div>
                    <Button onClick={openCreate} id="btn-tambah-kategori-foto">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <FolderHeart className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Kategori</p>
                                <p className="text-2xl font-bold">{kategoris.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                <ImageIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Foto</p>
                                <p className="text-2xl font-bold">{totalFoto}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">No</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama Kategori</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Jumlah Foto</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {kategoris.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                        <FolderHeart className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada kategori foto</p>
                                    </td>
                                </tr>
                            ) : (
                                kategoris.map((item, idx) => (
                                    <tr key={item.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                        <td className="px-4 py-3 font-medium">{item.nama}</td>
                                        <td className="px-4 py-3">
                                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.slug}</code>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge variant="secondary">{item.fotos_count ?? 0} foto</Badge>
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
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setDeleteTarget(item)}
                                                        disabled={(item.fotos_count ?? 0) > 0}
                                                    >
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

            {/* Create / Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{mode === 'create' ? 'Tambah Kategori Foto' : 'Edit Kategori Foto'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="nama">Nama Kategori <span className="text-destructive">*</span></Label>
                            <Input
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="cth: Kegiatan Bupati"
                            />
                            {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : mode === 'create' ? 'Simpan' : 'Perbarui'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle>Hapus Kategori</DialogTitle></DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Hapus kategori <strong className="text-foreground">{deleteTarget?.nama}</strong>?
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

KategoriFotoIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
