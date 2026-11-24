import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Pencil, Trash2, BarChart2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface GraphChart {
    id: number;
    nama: string;
    tipe: 'bar' | 'line' | 'pie' | 'area';
    data: any;
    keterangan?: string;
    status: 'aktif' | 'nonaktif';
}

interface Props {
    charts: GraphChart[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Grafik & Statistik', href: '/admin/graph-chart' },
];

export default function GraphChartIndex({ charts }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<GraphChart | null>(null);

    const toggleStatus = (item: GraphChart) => {
        const newStatus = item.status === 'aktif' ? 'nonaktif' : 'aktif';
        router.put(`/admin/graph-chart/${item.id}`, {
            ...item,
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Status berhasil diubah`)
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/graph-chart/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Grafik berhasil dihapus'); },
        });
    };

    const getTypeLabel = (tipe: string) => {
        switch (tipe) {
            case 'bar': return 'Bar Chart';
            case 'line': return 'Line Chart';
            case 'pie': return 'Pie Chart';
            case 'area': return 'Area Chart';
            default: return tipe;
        }
    };

    return (
        <>
            <Head title="Manajemen Grafik & Statistik" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Grafik & Statistik</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola berbagai macam grafik berbasis data (Multi-value)</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/graph-chart/create">
                            <Plus className="mr-2 h-4 w-4" /> Buat Grafik Baru
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama Grafik</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">Tipe</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground w-24">Status</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground w-20">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {charts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                                        <BarChart2 className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada data grafik</p>
                                    </td>
                                </tr>
                            ) : (
                                charts.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3 font-medium text-foreground">
                                            <div className="flex flex-col">
                                                <span>{item.nama}</span>
                                                {item.keterangan && <span className="text-xs text-muted-foreground font-normal line-clamp-1">{item.keterangan}</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            <Badge variant="outline" className="bg-background">
                                                {getTypeLabel(item.tipe)}
                                            </Badge>
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
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/graph-chart/${item.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit Grafik
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

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-destructive" />
                            Hapus Grafik
                        </DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Yakin ingin menghapus grafik <strong>{deleteTarget?.nama}</strong>?
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

GraphChartIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
