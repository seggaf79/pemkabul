import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoreHorizontal, Pencil, Plus, Trash2, EyeOff, Eye, Youtube, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

interface Video {
    id: number;
    kategori_video_id: number;
    judul: string;
    youtube_url: string;
    youtube_id: string;
    deskripsi?: string;
    waktu_publish: string;
    status: 'aktif' | 'nonaktif';
    kategori_video?: { id: number; nama: string };
}

interface Props {
    videos: Video[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Gallery Video', href: '/admin/video' },
];

export default function VideoIndex({ videos }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);

    const toggleStatus = (video: Video) => {
        router.put(`/admin/video/${video.id}`, {
            ...video,
            status: video.status === 'aktif' ? 'nonaktif' : 'aktif'
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/video/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null)
        });
    };

    return (
        <>
            <Head title="Gallery Video" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gallery Video</h1>
                        <p className="text-sm text-muted-foreground">Kelola galeri video YouTube</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/video/create">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Video
                        </Link>
                    </Button>
                </div>

                {videos.length === 0 ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Youtube className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="mb-1 font-semibold">Belum ada Video</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Tambahkan video YouTube pertama Anda ke dalam galeri
                        </p>
                        <Button asChild>
                            <Link href="/admin/video/create">
                                <Plus className="mr-2 h-4 w-4" /> Tambah Video
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {videos.map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md",
                                    item.status === 'nonaktif' && "opacity-75 grayscale-[0.5]"
                                )}
                            >
                                {/* Video Thumbnail */}
                                <div className="relative aspect-video overflow-hidden bg-muted flex items-center justify-center group">
                                    <img 
                                        src={`https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`} 
                                        alt={item.judul}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition flex items-center justify-center pointer-events-none">
                                        <div className="bg-red-600/90 rounded-xl px-4 py-2 backdrop-blur-sm drop-shadow-md">
                                            <Youtube className="text-white h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="absolute right-2 top-2 z-10 flex gap-2">
                                        <Badge className="bg-black/60 text-white backdrop-blur-sm border-0">
                                            {item.kategori_video?.nama}
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
                                    <h4 className="font-semibold line-clamp-1" title={item.judul}>{item.judul}</h4>
                                    
                                    {item.deskripsi ? (
                                        <p className="line-clamp-2 text-sm text-muted-foreground">{item.deskripsi}</p>
                                    ) : (
                                        <p className="italic text-sm text-muted-foreground">Tanpa deskripsi</p>
                                    )}

                                    <div className="mt-auto space-y-1.5 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{dayjs(item.waktu_publish).format('DD MMMM YYYY')}</span>
                                        </div>
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
                                                <Link href={`/admin/video/${item.id}/edit`}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toggleStatus(item)}>
                                                {item.status === 'aktif' ? (
                                                    <><EyeOff className="mr-2 h-4 w-4" /> Sembunyikan</>
                                                ) : (
                                                    <><Eye className="mr-2 h-4 w-4" /> Tampilkan</>
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
                    <DialogHeader><DialogTitle>Hapus Video</DialogTitle></DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus Video ini dari galeri?
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

VideoIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
