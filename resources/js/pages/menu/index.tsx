import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MoreHorizontal, Pencil, Trash2, List, ShieldAlert, CornerDownRight } from 'lucide-react';
import { toast } from 'sonner';

interface Menu {
    id: number;
    nama: string;
    tipe: 'url_bebas' | 'halaman' | 'modul' | 'kategori_halaman' | 'kategori_download' | 'kategori_foto' | 'kategori_video';
    url: string | null;
    parent_id: number | null;
    urutan: number;
    target: '_self' | '_blank';
    children?: Menu[];
}

interface KategoriOption {
    id: number;
    nama?: string;
    judul?: string;
    slug: string;
}

interface Props {
    menus: Menu[];
    halamans: KategoriOption[];
    kategoriHalamans: KategoriOption[];
    kategoriDownloads: KategoriOption[];
    kategoriFotos: KategoriOption[];
    kategoriVideos: KategoriOption[];
    moduls: { nama: string; url: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Menu Utama', href: '/admin/menu' },
];

export default function MenuIndex({ menus, halamans, kategoriHalamans, kategoriDownloads, kategoriFotos, kategoriVideos, moduls }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editTarget, setEditTarget] = useState<Menu | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null);

    const { data, setData, post, put, processing, errors, reset, transform } = useForm<{
        nama: string;
        tipe: 'url_bebas' | 'halaman' | 'modul' | 'kategori_halaman' | 'kategori_download' | 'kategori_foto' | 'kategori_video';
        url: string;
        parent_id: string; // use string for easy select value handling
        urutan: number;
        target: '_self' | '_blank';
    }>({
        nama: '',
        tipe: 'url_bebas',
        url: '',
        parent_id: 'none',
        urutan: 0,
        target: '_self',
    });

    const openCreate = () => {
        reset();
        setMode('create');
        setEditTarget(null);
        setIsOpen(true);
    };

    const openEdit = (item: Menu) => {
        reset();
        // Determine the raw value for url based on tipe, 
        // because url stores the resolved url, we might need to match it or just show the resolved url.
        // If it's halaman, ideally we find the ID by slug. For simplicity we let user re-select or we just match the slug.
        let rawUrl = item.url || '';
        if (item.tipe === 'halaman') {
            const slug = rawUrl.replace('/halaman/', '');
            const h = halamans.find(h => h.slug === slug);
            if (h) rawUrl = h.id.toString();
        } else if (item.tipe === 'kategori_halaman') {
            const slug = rawUrl.replace('/kategori/', '');
            const h = kategoriHalamans.find(h => h.slug === slug);
            if (h) rawUrl = h.id.toString();
        } else if (item.tipe === 'kategori_download') {
            const slug = rawUrl.replace('/kategori-download/', '');
            const h = kategoriDownloads.find(h => h.slug === slug);
            if (h) rawUrl = h.id.toString();
        } else if (item.tipe === 'kategori_foto') {
            const slug = rawUrl.replace('/kategori-foto/', '');
            const h = kategoriFotos.find(h => h.slug === slug);
            if (h) rawUrl = h.id.toString();
        } else if (item.tipe === 'kategori_video') {
            const slug = rawUrl.replace('/kategori-video/', '');
            const h = kategoriVideos.find(h => h.slug === slug);
            if (h) rawUrl = h.id.toString();
        }

        setData({
            nama: item.nama,
            tipe: item.tipe,
            url: rawUrl,
            parent_id: item.parent_id ? item.parent_id.toString() : 'none',
            urutan: item.urutan,
            target: item.target,
        });
        setMode('edit');
        setEditTarget(item);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        transform((data) => ({
            ...data,
            parent_id: data.parent_id === 'none' ? null : parseInt(data.parent_id),
        }));

        if (mode === 'create') {
            post('/admin/menu', {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Menu berhasil ditambahkan'); },
            });
        } else if (editTarget) {
            put(`/admin/menu/${editTarget.id}`, {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Menu berhasil diperbarui'); },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/menu/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Menu berhasil dihapus'); },
        });
    };

    return (
        <>
            <Head title="Manajemen Menu Utama" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Menu Utama</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola struktur navigasi utama situs Anda</p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Menu
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-1/3">Nama Menu</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tautan</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground w-24">Urutan</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground w-20">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {menus.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                                        <List className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada menu yang dikelola</p>
                                    </td>
                                </tr>
                            ) : (
                                menus.map((parent) => (
                                    <React.Fragment key={parent.id}>
                                        <tr className="hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium text-foreground">{parent.nama}</td>
                                            <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{parent.url || '-'}</td>
                                            <td className="px-4 py-3 text-center">{parent.urutan}</td>
                                            <td className="px-4 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEdit(parent)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(parent)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                        {/* Sub Menus */}
                                        {parent.children?.map(child => (
                                            <tr key={child.id} className="hover:bg-muted/30 bg-muted/10">
                                                <td className="px-4 py-3 pl-10 flex items-center gap-2 text-muted-foreground">
                                                    <CornerDownRight className="h-4 w-4 opacity-50" />
                                                    {child.nama}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{child.url || '-'}</td>
                                                <td className="px-4 py-3 text-center">{child.urutan}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEdit(child)}>
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(child)}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
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
                        <DialogTitle>{mode === 'create' ? 'Tambah Menu' : 'Edit Menu'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="nama">Nama Menu <span className="text-destructive">*</span></Label>
                            <Input id="nama" value={data.nama} onChange={e => setData('nama', e.target.value)} required placeholder="Contoh: Beranda" />
                            {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Tipe Tautan</Label>
                            <Select value={data.tipe} onValueChange={(val: any) => { setData('tipe', val); setData('url', ''); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="url_bebas">URL Bebas / Tautan Eksternal</SelectItem>
                                    <SelectItem value="halaman">Halaman Statis</SelectItem>
                                    <SelectItem value="modul">Modul Sistem</SelectItem>
                                    <SelectItem value="kategori_halaman">Kategori Halaman</SelectItem>
                                    <SelectItem value="kategori_download">Kategori Download</SelectItem>
                                    <SelectItem value="kategori_foto">Kategori Gallery Foto</SelectItem>
                                    <SelectItem value="kategori_video">Kategori Gallery Video</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.tipe && <p className="text-xs text-destructive">{errors.tipe}</p>}
                        </div>

                        {data.tipe === 'url_bebas' && (
                            <div className="space-y-1.5">
                                <Label htmlFor="url">URL Bebas</Label>
                                <Input id="url" value={data.url} onChange={e => setData('url', e.target.value)} placeholder="https://..." required />
                                {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
                            </div>
                        )}

                        {data.tipe === 'halaman' && (
                            <div className="space-y-1.5">
                                <Label>Pilih Halaman</Label>
                                <Select value={data.url} onValueChange={val => setData('url', val)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Halaman..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {halamans.map(h => (
                                            <SelectItem key={h.id} value={h.id.toString()}>{h.judul}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {data.tipe === 'modul' && (
                            <div className="space-y-1.5">
                                <Label>Pilih Modul</Label>
                                <Select value={data.url} onValueChange={val => setData('url', val)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Modul..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {moduls.map((m, i) => (
                                            <SelectItem key={i} value={m.url}>{m.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {data.tipe === 'kategori_halaman' && (
                            <div className="space-y-1.5">
                                <Label>Pilih Kategori Halaman</Label>
                                <Select value={data.url} onValueChange={val => setData('url', val)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kategori..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kategoriHalamans.map(h => (
                                            <SelectItem key={h.id} value={h.id.toString()}>{h.nama || h.judul}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {data.tipe === 'kategori_download' && (
                            <div className="space-y-1.5">
                                <Label>Pilih Kategori Download</Label>
                                <Select value={data.url} onValueChange={val => setData('url', val)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kategori..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kategoriDownloads.map(h => (
                                            <SelectItem key={h.id} value={h.id.toString()}>{h.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {data.tipe === 'kategori_foto' && (
                            <div className="space-y-1.5">
                                <Label>Pilih Kategori Foto</Label>
                                <Select value={data.url} onValueChange={val => setData('url', val)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kategori..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kategoriFotos.map(h => (
                                            <SelectItem key={h.id} value={h.id.toString()}>{h.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {data.tipe === 'kategori_video' && (
                            <div className="space-y-1.5">
                                <Label>Pilih Kategori Video</Label>
                                <Select value={data.url} onValueChange={val => setData('url', val)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kategori..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kategoriVideos.map(h => (
                                            <SelectItem key={h.id} value={h.id.toString()}>{h.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label>Menu Induk (Opsional)</Label>
                            <Select value={data.parent_id} onValueChange={val => setData('parent_id', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tidak ada (Menu Utama)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- Tidak ada (Menu Utama) --</SelectItem>
                                    {menus.filter(m => m.id !== editTarget?.id).map(m => (
                                        <SelectItem key={m.id} value={m.id.toString()}>{m.nama}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[10px] text-muted-foreground">Pilih menu induk jika ini adalah sub-menu.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Urutan</Label>
                                <Input type="number" min="0" value={data.urutan} onChange={e => setData('urutan', parseInt(e.target.value))} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Target Tab</Label>
                                <Select value={data.target} onValueChange={(val: any) => setData('target', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_self">Tab Saat Ini (_self)</SelectItem>
                                        <SelectItem value="_blank">Tab Baru (_blank)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                            Hapus Menu
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus menu <strong className="text-foreground">{deleteTarget?.nama}</strong>?
                        {deleteTarget?.children?.length ? ' Sub-menu di bawahnya juga mungkin akan terhapus atau kehilangan menu induk.' : ''}
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

MenuIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
