import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type KategoriHalaman } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, Layers, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    kategoriHalamanS: KategoriHalaman[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori Halaman', href: '/admin/kategori-halaman' },
];

type FormMode = 'create' | 'edit';

export default function KategoriHalamanIndex({ kategoriHalamanS }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<FormMode>('create');
    const [editTarget, setEditTarget] = useState<KategoriHalaman | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<KategoriHalaman | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: '',
        slug: '',
        deskripsi: '',
        urutan: 0,
    });

    const openCreate = () => {
        reset();
        setMode('create');
        setEditTarget(null);
        setIsOpen(true);
    };

    const openEdit = (item: KategoriHalaman) => {
        setData({
            nama: item.nama,
            slug: item.slug,
            deskripsi: item.deskripsi ?? '',
            urutan: item.urutan,
        });
        setMode('edit');
        setEditTarget(item);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            post('/admin/kategori-halaman', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    toast.success('Kategori berhasil ditambahkan');
                },
            });
        } else if (editTarget) {
            put(`/admin/kategori-halaman/${editTarget.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    toast.success('Kategori berhasil diperbarui');
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/kategori-halaman/${deleteTarget.id}`, {
            onSuccess: () => {
                setDeleteTarget(null);
                toast.success('Kategori berhasil dihapus');
            },
        });
    };

    const autoSlug = (nama: string) => {
        return nama
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    return (
        <>
            <Head title="Kategori Halaman" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kategori Halaman</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Kelola kategori untuk mengorganisir halaman konten
                        </p>
                    </div>
                    <Button onClick={openCreate} id="btn-tambah-kategori">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Layers className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Kategori</p>
                                <p className="text-2xl font-bold">{kategoriHalamanS.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                <FolderOpen className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Halaman</p>
                                <p className="text-2xl font-bold">
                                    {kategoriHalamanS.reduce((sum, k) => sum + (k.halaman_s_count ?? 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">No</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama Kategori</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Deskripsi</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Jumlah Halaman</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Urutan</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {kategoriHalamanS.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                        <Layers className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada kategori halaman</p>
                                    </td>
                                </tr>
                            ) : (
                                kategoriHalamanS.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium">{item.nama}</td>
                                        <td className="px-4 py-3">
                                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.slug}</code>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                                            {item.deskripsi || <span className="italic opacity-50">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge variant="secondary">{item.halaman_s_count ?? 0} halaman</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">{item.urutan}</td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEdit(item)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setDeleteTarget(item)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === 'create' ? 'Tambah Kategori Halaman' : 'Edit Kategori Halaman'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="nama">Nama Kategori <span className="text-destructive">*</span></Label>
                            <Input
                                id="nama"
                                value={data.nama}
                                onChange={(e) => {
                                    setData('nama', e.target.value);
                                    if (mode === 'create') {
                                        setData('slug', autoSlug(e.target.value));
                                    }
                                }}
                                placeholder="cth: Informasi Publik"
                            />
                            {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="informasi-publik"
                            />
                            {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <textarea
                                id="deskripsi"
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                rows={3}
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                placeholder="Deskripsi singkat kategori..."
                            />
                            {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
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

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : mode === 'create' ? 'Simpan' : 'Perbarui'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Kategori</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus kategori{' '}
                        <strong className="text-foreground">{deleteTarget?.nama}</strong>?
                        Semua halaman dalam kategori ini juga akan terhapus.
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

KategoriHalamanIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
