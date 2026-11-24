import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Images,
    MapPin,
    Calendar,
    Camera,
    Eye,
    EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface Foto {
    id: number;
    kategori_foto_id: number;
    foto: string;
    foto_url: string;
    deskripsi?: string;
    lokasi?: string;
    waktu_pemotretan?: string;
    fotografer?: string;
    status: 'aktif' | 'nonaktif';
    urutan: number;
    kategori?: {
        id: number;
        nama: string;
    };
}

interface Props {
    fotos: Foto[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Gallery Foto', href: '/admin/foto' },
];

export default function FotoIndex({ fotos }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Foto | null>(null);

    const toggleStatus = (item: Foto) => {
        const newStatus = item.status === 'aktif' ? 'nonaktif' : 'aktif';
        router.put(
            `/admin/foto/${item.id}`,
            { ...item, status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Foto berhasil di${newStatus === 'aktif' ? 'aktifkan' : 'nonaktifkan'}`)
            }
        );
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/foto/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Foto berhasil dihapus'); },
        });
    };

    return (
        <>
            <Head title="Gallery Foto" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gallery Foto</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola koleksi foto untuk ditampilkan di galeri publik</p>
                    </div>
                    <Button asChild id="btn-tambah-foto">
                        <Link href="/admin/foto/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Foto
                        </Link>
                    </Button>
                </div>

                {fotos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Images className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="mb-1 font-semibold">Belum ada foto</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Tambahkan foto pertama Anda ke dalam galeri
                        </p>
                        <Button asChild>
                            <Link href="/admin/foto/create">
                                <Plus className="mr-2 h-4 w-4" /> Tambah Foto
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {fotos.map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md",
                                    item.status === 'nonaktif' && "opacity-75 grayscale-[0.5]"
                                )}
                            >
                                {/* Foto Image */}
                                <div className="relative aspect-video overflow-hidden bg-muted">
                                    <img
                                        src={item.foto_url}
                                        alt={item.deskripsi || 'Foto'}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute right-2 top-2 z-10 flex gap-2">
                                        <Badge className="bg-black/60 text-white backdrop-blur-sm border-0">
                                            {item.kategori?.nama}
                                        </Badge>
                                        {item.status === 'nonaktif' && (
                                            <Badge variant="destructive" className="bg-red-500/80 backdrop-blur-sm">
                                                <EyeOff className="mr-1 h-3 w-3" />
                                                Nonaktif
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex flex-1 flex-col gap-3 p-4">
                                    {item.deskripsi ? (
                                        <p className="line-clamp-2 text-sm font-medium">{item.deskripsi}</p>
                                    ) : (
                                        <p className="italic text-sm text-muted-foreground">Tanpa deskripsi</p>
                                    )}

                                    <div className="mt-auto space-y-1.5 text-xs text-muted-foreground">
                                        {item.lokasi && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span className="truncate">{item.lokasi}</span>
                                            </div>
                                        )}
                                        {item.waktu_pemotretan && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{dayjs(item.waktu_pemotretan).format('DD MMMM YYYY')}</span>
                                            </div>
                                        )}
                                        {item.fotografer && (
                                            <div className="flex items-center gap-1.5">
                                                <Camera className="h-3.5 w-3.5" />
                                                <span className="truncate">{item.fotografer}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer actions */}
                                <div className="flex items-center justify-end border-t bg-muted/20 px-3 py-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/foto/${item.id}/edit`}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toggleStatus(item)}>
                                                {item.status === 'aktif' ? (
                                                    <><EyeOff className="mr-2 h-4 w-4" /> Nonaktifkan</>
                                                ) : (
                                                    <><Eye className="mr-2 h-4 w-4" /> Aktifkan</>
                                                )}
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
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle>Hapus Foto</DialogTitle></DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus foto ini? File gambar juga akan dihapus dari server.
                    </p>
                    <div className="mt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

FotoIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
