import { useState, useRef } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, Users, Upload, X, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    foto_url: string;
    created_at: string;
}

interface Props {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengguna', href: '/admin/user' },
];

type Mode = 'create' | 'edit';

export default function UserIndex({ users }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<Mode>('create');
    const [editTarget, setEditTarget] = useState<User | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const fotoRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        _method?: string;
        name: string;
        email: string;
        password?: string;
        foto: File | null;
        hapus_foto?: boolean;
    }>({
        name: '',
        email: '',
        password: '',
        foto: null,
        hapus_foto: false,
    });

    const openCreate = () => {
        reset();
        setMode('create');
        setEditTarget(null);
        setFotoPreview(null);
        setIsOpen(true);
    };

    const openEdit = (item: User) => {
        reset();
        setData({
            _method: 'PUT',
            name: item.name,
            email: item.email,
            password: '',
            foto: null,
            hapus_foto: false,
        });
        setMode('edit');
        setEditTarget(item);
        setFotoPreview(item.foto_url);
        setIsOpen(true);
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setData('hapus_foto', false);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const removeFoto = () => {
        setData('foto', null);
        setData('hapus_foto', true);
        setFotoPreview(null);
        if (fotoRef.current) fotoRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            post('/admin/user', {
                forceFormData: true,
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Pengguna berhasil ditambahkan'); },
            });
        } else if (editTarget) {
            post(`/admin/user/${editTarget.id}`, {
                forceFormData: true,
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Pengguna berhasil diperbarui'); },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/user/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Pengguna berhasil dihapus'); },
        });
    };

    return (
        <>
            <Head title="Manajemen Pengguna" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola admin dan pengguna sistem</p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Pengguna</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Terdaftar</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                                        <Users className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada pengguna terdaftar</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={item.foto_url} alt={item.name} className="h-10 w-10 rounded-full object-cover border" />
                                                <div>
                                                    <p className="font-medium flex items-center gap-2">
                                                        {item.name}
                                                        {auth.user.id === item.id && (
                                                            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">ANDA</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.email}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                                                    {auth.user.id !== item.id && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(item)}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
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
                        <DialogTitle>{mode === 'create' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}</DialogTitle>
                        {mode === 'edit' && (
                            <DialogDescription>Kosongkan password jika tidak ingin mengubahnya.</DialogDescription>
                        )}
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Foto Profil Upload */}
                        <div className="flex flex-col items-center gap-3 pb-2">
                            <div className="relative group">
                                {fotoPreview ? (
                                    <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-muted shadow-sm">
                                        <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                            <button type="button" onClick={removeFoto} className="p-1 rounded-full bg-destructive text-white shadow">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/50 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
                                        <Users className="h-8 w-8 text-muted-foreground/40" />
                                    </div>
                                )}
                                {!fotoPreview && (
                                    <button
                                        type="button"
                                        onClick={() => fotoRef.current?.click()}
                                        className="absolute bottom-0 right-0 rounded-full border bg-background p-1.5 shadow-sm hover:bg-accent"
                                    >
                                        <Upload className="h-3.5 w-3.5 text-foreground" />
                                    </button>
                                )}
                            </div>
                            <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                            {errors.foto && <p className="text-xs text-destructive">{errors.foto}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="user-name">Nama Lengkap <span className="text-destructive">*</span></Label>
                            <Input id="user-name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="John Doe" />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="user-email">Email <span className="text-destructive">*</span></Label>
                            <Input id="user-email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="john@example.com" />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="user-password">Password {mode === 'create' && <span className="text-destructive">*</span>}</Label>
                            <Input 
                                id="user-password" 
                                type="password" 
                                value={data.password} 
                                onChange={(e) => setData('password', e.target.value)} 
                                placeholder={mode === 'create' ? "Minimal 8 karakter" : "Biarkan kosong jika tidak diubah"} 
                            />
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
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
                            Hapus Pengguna
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus pengguna <strong className="text-foreground">{deleteTarget?.name}</strong>? 
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>Hapus Permanen</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

UserIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
