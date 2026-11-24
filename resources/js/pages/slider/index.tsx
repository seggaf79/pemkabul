import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Slider } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    GripVertical,
    Images,
    Eye,
    EyeOff,
    ExternalLink,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
    sliders: Slider[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Slider', href: '/admin/slider' },
];

export default function SliderIndex({ sliders: initialSliders }: Props) {
    const [sliders, setSliders] = useState<Slider[]>(initialSliders);
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const dragOver = useRef<number | null>(null);

    /* ── Toggle status ───────────────────────────────── */
    const toggleStatus = (slider: Slider) => {
        const newStatus = slider.status === 'aktif' ? 'nonaktif' : 'aktif';
        router.put(
            `/admin/slider/${slider.id}`,
            {
                judul: slider.judul,
                subjudul: slider.subjudul ?? '',
                deskripsi: slider.deskripsi ?? '',
                url_tujuan: slider.url_tujuan ?? '',
                teks_tombol: slider.teks_tombol ?? '',
                posisi_teks: slider.posisi_teks,
                status: newStatus,
                urutan: slider.urutan,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSliders((prev) =>
                        prev.map((s) => (s.id === slider.id ? { ...s, status: newStatus } : s)),
                    );
                    toast.success(`Slider ${newStatus === 'aktif' ? 'diaktifkan' : 'dinonaktifkan'}`);
                },
            },
        );
    };

    /* ── Delete ──────────────────────────────────────── */
    const handleDelete = (slider: Slider) => {
        if (!confirm(`Hapus slider "${slider.judul}"?`)) return;
        router.delete(`/admin/slider/${slider.id}`, {
            onSuccess: () => {
                setSliders((prev) => prev.filter((s) => s.id !== slider.id));
                toast.success('Slider berhasil dihapus');
            },
        });
    };

    /* ── Move up / down ──────────────────────────────── */
    const moveItem = (index: number, dir: -1 | 1) => {
        const newList = [...sliders];
        const target = index + dir;
        if (target < 0 || target >= newList.length) return;
        [newList[index], newList[target]] = [newList[target], newList[index]];
        setSliders(newList);
        saveOrder(newList);
    };

    /* ── Drag & Drop handlers ────────────────────────── */
    const handleDragStart = (id: number) => setDraggingId(id);

    const handleDragEnter = (id: number) => {
        dragOver.current = id;
    };

    const handleDragEnd = () => {
        if (draggingId === null || dragOver.current === null || draggingId === dragOver.current) {
            setDraggingId(null);
            return;
        }
        const newList = [...sliders];
        const from = newList.findIndex((s) => s.id === draggingId);
        const to = newList.findIndex((s) => s.id === dragOver.current);
        const [moved] = newList.splice(from, 1);
        newList.splice(to, 0, moved);
        setSliders(newList);
        saveOrder(newList);
        setDraggingId(null);
        dragOver.current = null;
    };

    const saveOrder = (list: Slider[]) => {
        router.post(
            '/admin/slider/reorder',
            { orders: list.map((s) => s.id) },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Urutan slider disimpan'),
            },
        );
    };

    /* ── Stat counts ─────────────────────────────────── */
    const aktifCount = sliders.filter((s) => s.status === 'aktif').length;

    return (
        <>
            <Head title="Manajemen Slider" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Slider</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola banner slider yang tampil di halaman utama
                        </p>
                    </div>
                    <Button asChild id="btn-tambah-slider">
                        <Link href="/admin/slider/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Slider
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        { label: 'Total Slider', value: sliders.length, color: 'bg-primary/10 text-primary' },
                        { label: 'Aktif', value: aktifCount, color: 'bg-green-500/10 text-green-600' },
                        { label: 'Nonaktif', value: sliders.length - aktifCount, color: 'bg-orange-500/10 text-orange-600' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-xl border bg-card p-5 shadow-sm">
                            <div className={cn('mb-1 inline-flex rounded-md px-2 py-0.5 text-xs font-medium', stat.color)}>
                                {stat.label}
                            </div>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Hint */}
                {sliders.length > 1 && (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <GripVertical className="h-3.5 w-3.5" />
                        Seret kartu untuk mengubah urutan tampil slider
                    </p>
                )}

                {/* Empty state */}
                {sliders.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Images className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="mb-1 font-semibold">Belum ada slider</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Tambahkan slider pertama untuk ditampilkan di halaman utama
                        </p>
                        <Button asChild>
                            <Link href="/admin/slider/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Slider
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Slider Cards Grid */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {sliders.map((slider, index) => (
                        <div
                            key={slider.id}
                            draggable
                            onDragStart={() => handleDragStart(slider.id)}
                            onDragEnter={() => handleDragEnter(slider.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className={cn(
                                'group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200',
                                'hover:shadow-md hover:border-primary/30',
                                draggingId === slider.id && 'opacity-40 scale-95',
                                slider.status === 'nonaktif' && 'opacity-70',
                            )}
                        >
                            {/* Drag handle */}
                            <div className="absolute left-2 top-2 z-10 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="rounded-md bg-black/40 p-1 backdrop-blur-sm">
                                    <GripVertical className="h-4 w-4 text-white" />
                                </div>
                            </div>

                            {/* Urutan badge */}
                            <div className="absolute right-2 top-2 z-10">
                                <div className="rounded-full bg-black/50 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                                    #{index + 1}
                                </div>
                            </div>

                            {/* Gambar */}
                            <div className="relative aspect-[16/7] overflow-hidden bg-muted">
                                <img
                                    src={slider.gambar_url}
                                    alt={slider.judul}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Overlay teks preview */}
                                <div
                                    className={cn(
                                        'absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4',
                                        slider.posisi_teks === 'tengah' && 'items-center text-center',
                                        slider.posisi_teks === 'kanan' && 'items-end text-right',
                                        slider.posisi_teks === 'kiri' && 'items-start text-left',
                                    )}
                                >
                                    <p className="text-sm font-bold text-white drop-shadow line-clamp-1">{slider.judul}</p>
                                    {slider.subjudul && (
                                        <p className="text-xs text-white/80 line-clamp-1">{slider.subjudul}</p>
                                    )}
                                </div>

                                {/* Nonaktif overlay */}
                                {slider.status === 'nonaktif' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                        <Badge variant="secondary" className="bg-black/60 text-white border-0">
                                            <EyeOff className="mr-1 h-3 w-3" />
                                            Nonaktif
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="flex flex-1 flex-col gap-2 p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="truncate font-semibold">{slider.judul}</h3>
                                        {slider.subjudul && (
                                            <p className="truncate text-sm text-muted-foreground">{slider.subjudul}</p>
                                        )}
                                    </div>
                                    <Badge
                                        variant={slider.status === 'aktif' ? 'default' : 'secondary'}
                                        className={cn(
                                            'shrink-0',
                                            slider.status === 'aktif' && 'bg-green-500 hover:bg-green-600',
                                        )}
                                    >
                                        {slider.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </div>

                                {slider.deskripsi && (
                                    <p className="line-clamp-2 text-xs text-muted-foreground">{slider.deskripsi}</p>
                                )}

                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-auto pt-1">
                                    <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                                        Teks: <strong className="capitalize">{slider.posisi_teks}</strong>
                                    </span>
                                    {slider.url_tujuan && (
                                        <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                                            <ExternalLink className="h-3 w-3" />
                                            Memiliki link
                                        </span>
                                    )}
                                    {slider.teks_tombol && (
                                        <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5">
                                            Tombol: "{slider.teks_tombol}"
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="flex items-center justify-between border-t px-4 py-2">
                                {/* Move buttons */}
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        disabled={index === 0}
                                        onClick={() => moveItem(index, -1)}
                                        title="Pindah ke atas"
                                    >
                                        <ArrowUp className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        disabled={index === sliders.length - 1}
                                        onClick={() => moveItem(index, 1)}
                                        title="Pindah ke bawah"
                                    >
                                        <ArrowDown className="h-3.5 w-3.5" />
                                    </Button>
                                </div>

                                {/* Actions */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/slider/${slider.id}/edit`}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toggleStatus(slider)}>
                                            {slider.status === 'aktif' ? (
                                                <>
                                                    <EyeOff className="mr-2 h-4 w-4" />
                                                    Nonaktifkan
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Aktifkan
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleDelete(slider)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

SliderIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
