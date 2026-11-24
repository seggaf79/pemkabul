import { useState, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Pencil, Trash2, Link as LinkIcon, ImagePlus, RefreshCcw, ShieldAlert, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface LinkWebsite {
    id: number;
    nama: string;
    url: string;
    logo?: string;
    logo_url?: string;
    deskripsi?: string;
    urutan: number;
    status: 'aktif' | 'nonaktif';
}

interface Props {
    links: LinkWebsite[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manajemen Link Website', href: '/admin/link-website' },
];

export default function LinkWebsiteIndex({ links }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editTarget, setEditTarget] = useState<LinkWebsite | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<LinkWebsite | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'POST',
        nama: '',
        url: '',
        logo: null as File | null,
        deskripsi: '',
        status: 'aktif' as 'aktif' | 'nonaktif',
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setData('_method', 'POST');
        setPreview(null);
        setMode('create');
        setEditTarget(null);
        setIsOpen(true);
    };

    const openEdit = (item: LinkWebsite) => {
        reset();
        clearErrors();
        setData({
            _method: 'PUT',
            nama: item.nama,
            url: item.url,
            logo: null,
            deskripsi: item.deskripsi || '',
            status: item.status,
        });
        setPreview(item.logo_url || null);
        setMode('edit');
        setEditTarget(item);
        setIsOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const resetFile = () => {
        setData('logo', null);
        setPreview(mode === 'edit' && editTarget ? (editTarget.logo_url || null) : null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            post('/admin/link-website', {
                onSuccess: () => { setIsOpen(false); toast.success('Link website berhasil ditambahkan'); },
            });
        } else if (editTarget) {
            post(`/admin/link-website/${editTarget.id}`, {
                onSuccess: () => { setIsOpen(false); toast.success('Link website berhasil diperbarui'); },
            });
        }
    };

    const toggleStatus = (item: LinkWebsite) => {
        const newStatus = item.status === 'aktif' ? 'nonaktif' : 'aktif';
        // Menggunakan POST dengan _method PUT karena kita pakai file/form-data rules
        router.post(`/admin/link-website/${item.id}`, {
            _method: 'PUT',
            nama: item.nama,
            url: item.url,
            deskripsi: item.deskripsi || '',
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Status berhasil diubah`)
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/link-website/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Link website berhasil dihapus'); },
        });
    };

    return (
        <>
            <Head title="Manajemen Link Website" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Link Website</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola tautan ke website instansi atau mitra terkait</p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Link
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-16">Logo</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama Website</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">URL Tujuan</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground w-24">Status</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground w-20">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {links.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                        <LinkIcon className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada data link website</p>
                                    </td>
                                </tr>
                            ) : (
                                links.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border bg-muted/50">
                                                {item.logo_url ? (
                                                    <img src={item.logo_url} alt={item.nama} className="h-full w-full object-contain p-1" />
                                                ) : (
                                                    <LinkIcon className="h-5 w-5 text-muted-foreground/50" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-foreground">
                                            <div className="flex flex-col">
                                                <span>{item.nama}</span>
                                                {item.deskripsi && <span className="text-xs text-muted-foreground font-normal line-clamp-1">{item.deskripsi}</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell truncate max-w-[200px]">
                                            <a href={item.url} target="_blank" rel="noreferrer" className="hover:underline hover:text-primary flex items-center gap-1">
                                                {item.url} <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge variant={item.status === 'aktif' ? 'default' : 'secondary'} className={item.status === 'aktif' ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20' : ''}>
                                                {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
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
                                                    <DropdownMenuItem onClick={() => toggleStatus(item)}>
                                                        {item.status === 'aktif' ? (
                                                            <><EyeOff className="mr-2 h-4 w-4" /> Nonaktifkan</>
                                                        ) : (
                                                            <><Eye className="mr-2 h-4 w-4" /> Aktifkan</>
                                                        )}
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
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{mode === 'create' ? 'Tambah Link Website' : 'Edit Link Website'}</DialogTitle>
                        <DialogDescription>
                            Isi detail informasi website terkait. Logo bersifat opsional namun sangat disarankan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div className="flex gap-5 flex-col md:flex-row">
                            {/* Logo Upload */}
                            <div className="w-full md:w-1/3">
                                <Label className="mb-2 block">Logo Website</Label>
                                <div 
                                    className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" />
                                            {data.logo && (
                                                <Button type="button" variant="secondary" size="icon" className="absolute right-2 top-2 h-7 w-7 rounded-full shadow-md" onClick={(e) => { e.stopPropagation(); resetFile(); }}>
                                                    <RefreshCcw className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                                            <ImagePlus className="h-8 w-8 opacity-50" />
                                            <span className="text-xs font-medium">Klik unggah</span>
                                        </div>
                                    )}
                                </div>
                                <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                {errors.logo && <p className="mt-1 text-xs text-destructive">{errors.logo}</p>}
                            </div>

                            {/* Details */}
                            <div className="w-full md:w-2/3 space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="nama">Nama Website <span className="text-destructive">*</span></Label>
                                    <Input id="nama" value={data.nama} onChange={e => setData('nama', e.target.value)} required placeholder="Cth: Kementerian Dalam Negeri" />
                                    {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                                </div>
                                
                                <div className="space-y-1.5">
                                    <Label htmlFor="url">URL Tujuan <span className="text-destructive">*</span></Label>
                                    <Input id="url" type="url" value={data.url} onChange={e => setData('url', e.target.value)} required placeholder="https://..." />
                                    {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                            <Textarea id="deskripsi" rows={2} value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} placeholder="Opsional: penjelasan singkat website" />
                            {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Status Tampil</Label>
                            <Select value={data.status} onValueChange={(val: 'aktif'|'nonaktif') => setData('status', val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aktif">Aktif (Ditampilkan)</SelectItem>
                                    <SelectItem value="nonaktif">Nonaktif (Sembunyikan)</SelectItem>
                                </SelectContent>
                            </Select>
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
                            Hapus Link
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Yakin ingin menghapus link <strong>{deleteTarget?.nama}</strong>? Logo yang diunggah juga akan dihapus secara permanen.
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

LinkWebsiteIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
