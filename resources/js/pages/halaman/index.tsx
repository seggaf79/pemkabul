import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Halaman, type KategoriHalaman, type PaginatedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, FileText, Search, ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    halamanS: PaginatedData<Halaman>;
    kategoriHalamanS: KategoriHalaman[];
    filters: {
        kategori?: string;
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Halaman', href: '/admin/halaman' },
];

export default function HalamanIndex({ halamanS, kategoriHalamanS, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilter = (params: Record<string, string>) => {
        router.get('/admin/halaman', { ...filters, ...params }, { preserveState: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const handleDelete = (halaman: Halaman) => {
        if (!confirm(`Hapus halaman "${halaman.judul}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        router.delete(`/admin/halaman/${halaman.id}`, {
            onSuccess: () => toast.success('Halaman berhasil dihapus'),
        });
    };

    return (
        <>
            <Head title="Halaman" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Halaman</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Kelola konten halaman website
                        </p>
                    </div>
                    <Button asChild id="btn-tambah-halaman">
                        <Link href="/admin/halaman/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Halaman
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search-halaman"
                                className="pl-9 w-64"
                                placeholder="Cari judul halaman..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="secondary">Cari</Button>
                    </form>

                    <Select
                        value={filters.kategori ?? 'all'}
                        onValueChange={(v) => applyFilter({ kategori: v === 'all' ? '' : v })}
                    >
                        <SelectTrigger id="filter-kategori" className="w-48">
                            <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {kategoriHalamanS.map((k) => (
                                <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={(v) => applyFilter({ status: v === 'all' ? '' : v })}
                    >
                        <SelectTrigger id="filter-status" className="w-36">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>

                    {(filters.kategori || filters.search || filters.status) && (
                        <Button variant="ghost" onClick={() => router.get('/admin/halaman')}>
                            Reset Filter
                        </Button>
                    )}
                </div>

                {/* Table */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">No</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Gambar</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Judul</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Urutan</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {halamanS.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                        <FileText className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada halaman</p>
                                    </td>
                                </tr>
                            ) : (
                                halamanS.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {(halamanS.current_page - 1) * halamanS.per_page + index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.gambar_url ? (
                                                <img
                                                    src={item.gambar_url}
                                                    alt={item.judul}
                                                    className="h-12 w-16 rounded object-cover border"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-16 items-center justify-center rounded border bg-muted">
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{item.judul}</div>
                                            <code className="text-xs text-muted-foreground">{item.slug}</code>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline">{item.kategori_halaman?.nama}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge
                                                variant={item.status === 'published' ? 'default' : 'secondary'}
                                                className={item.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}
                                            >
                                                {item.status === 'published' ? 'Published' : 'Draft'}
                                            </Badge>
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
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/halaman/${item.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/halaman/${item.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDelete(item)}
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

                {/* Pagination */}
                {halamanS.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            Menampilkan {halamanS.from}–{halamanS.to} dari {halamanS.total} halaman
                        </span>
                        <div className="flex gap-1">
                            {halamanS.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

HalamanIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
