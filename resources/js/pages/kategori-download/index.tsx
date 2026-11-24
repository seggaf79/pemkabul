import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type KategoriDownload } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, FolderDown, Download, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    kategoriDownloads: KategoriDownload[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori Download', href: '/admin/kategori-download' },
];

type Mode = 'create' | 'edit';

// Daftar ikon yang bisa dipilih
const ICON_OPTIONS = [
    'FileText', 'FileSpreadsheet', 'FileImage', 'FileArchive',
    'BookOpen', 'Newspaper', 'Briefcase', 'Building2',
    'Scale', 'ClipboardList', 'BarChart2', 'Map',
];

export default function KategoriDownloadIndex({ kategoriDownloads }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<Mode>('create');
    const [editTarget, setEditTarget] = useState<KategoriDownload | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<KategoriDownload | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: '',
        slug: '',
        deskripsi: '',
        ikon: '',
        urutan: 0,
    });

    const autoSlug = (v: string) =>
        v.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

    const openCreate = () => {
        reset();
        setMode('create');
        setEditTarget(null);
        setIsOpen(true);
    };

    const openEdit = (item: KategoriDownload) => {
        setData({ nama: item.nama, slug: item.slug, deskripsi: item.deskripsi ?? '', ikon: item.ikon ?? '', urutan: item.urutan });
        setMode('edit');
        setEditTarget(item);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            post('/admin/kategori-download', {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Kategori berhasil ditambahkan'); },
            });
        } else if (editTarget) {
            put(`/admin/kategori-download/${editTarget.id}`, {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Kategori berhasil diperbarui'); },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/kategori-download/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Kategori berhasil dihapus'); },
        });
    };

    const totalDownload = kategoriDownloads.reduce((s, k) => s + (k.downloads_count ?? 0), 0);

    return (
        <>
            <Head title="Kategori Download" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kategori Download</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola kategori untuk mengelompokkan file unduhan</p>
                    </div>
                    <Button onClick={openCreate} id="btn-tambah-kategori-download">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Tag className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Kategori</p>
                                <p className="text-2xl font-bold">{kategoriDownloads.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                <Download className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total File</p>
                                <p className="text-2xl font-bold">{totalDownload}</p>
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
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Deskripsi</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Jumlah File</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Urutan</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {kategoriDownloads.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                        <FolderDown className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada kategori download</p>
                                    </td>
                                </tr>
                            ) : (
                                kategoriDownloads.map((item, idx) => (
                                    <tr key={item.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 font-medium">
                                                {item.ikon && (
                                                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                                                        {item.ikon.slice(0, 2)}
                                                    </span>
                                                )}
                                                {item.nama}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.slug}</code>
                                        </td>
                                        <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                                            {item.deskripsi || <span className="italic opacity-40">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge variant="secondary">{item.downloads_count ?? 0} file</Badge>
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
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setDeleteTarget(item)}
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{mode === 'create' ? 'Tambah Kategori Download' : 'Edit Kategori Download'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="kd-nama">Nama Kategori <span className="text-destructive">*</span></Label>
                            <Input
                                id="kd-nama"
                                value={data.nama}
                                onChange={(e) => {
                                    setData('nama', e.target.value);
                                    if (mode === 'create') setData('slug', autoSlug(e.target.value));
                                }}
                                placeholder="cth: Peraturan Daerah"
                            />
                            {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="kd-slug">Slug</Label>
                            <Input id="kd-slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="peraturan-daerah" />
                            {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="kd-deskripsi">Deskripsi</Label>
                            <textarea
                                id="kd-deskripsi"
                                className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                rows={2}
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                placeholder="Deskripsi singkat kategori..."
                            />
                            {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="kd-ikon">Ikon (nama Lucide)</Label>
                                <Input id="kd-ikon" value={data.ikon} onChange={(e) => setData('ikon', e.target.value)} placeholder="FileText" />
                                {errors.ikon && <p className="text-xs text-destructive">{errors.ikon}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="kd-urutan">Urutan</Label>
                                <Input id="kd-urutan" type="number" min={0} value={data.urutan} onChange={(e) => setData('urutan', Number(e.target.value))} />
                                {errors.urutan && <p className="text-xs text-destructive">{errors.urutan}</p>}
                            </div>
                        </div>

                        <DialogFooter>
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
                        Semua file download dalam kategori ini juga akan terhapus.
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

KategoriDownloadIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
