import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, Building, Search, ImageIcon, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Opd {
    id: number;
    nama: string;
    slug: string;
    deskripsi?: string | null;
    alamat?: string | null;
    telepon?: string | null;
    email?: string | null;
    website?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    nama_kepala?: string | null;
    foto_kantor?: string | null;
    foto_kantor_url?: string | null;
    urutan: number;
    created_at?: string;
}

interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number;
    to: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface Props {
    opds: PaginatedData<Opd>;
    filters: { search?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'OPD Daerah', href: '/admin/opd' },
];

export default function OpdIndex({ opds, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/opd', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (opd: Opd) => {
        if (!confirm(`Hapus OPD "${opd.nama}"? Foto kantor yang tersimpan juga akan dihapus. Tindakan ini tidak dapat dibatalkan.`)) return;
        router.delete(`/admin/opd/${opd.id}`, {
            onSuccess: () => toast.success('Data OPD berhasil dihapus.'),
        });
    };

    return (
        <>
            <Head title="OPD Daerah" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Building className="h-6 w-6 text-muted-foreground" />
                            OPD Daerah
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Kelola data Organisasi Perangkat Daerah Kabupaten Bulungan
                        </p>
                    </div>
                    <Button asChild id="btn-tambah-opd">
                        <Link href="/admin/opd/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah OPD
                        </Link>
                    </Button>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-wrap gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search-opd"
                                className="pl-9 w-72"
                                placeholder="Cari nama OPD atau kepala dinas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="secondary">Cari</Button>
                    </form>

                    {filters.search && (
                        <Button variant="ghost" onClick={() => router.get('/admin/opd')}>
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
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Foto</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama OPD</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kepala OPD</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kontak</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Urutan</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {opds.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                        <Building className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada data OPD</p>
                                    </td>
                                </tr>
                            ) : (
                                opds.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {(opds.current_page - 1) * opds.per_page + index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.foto_kantor_url ? (
                                                <img
                                                    src={item.foto_kantor_url}
                                                    alt={item.nama}
                                                    className="h-12 w-20 rounded object-cover border"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-20 items-center justify-center rounded border bg-muted">
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-semibold">{item.nama}</div>
                                            {item.alamat && (
                                                <div className="text-xs text-muted-foreground flex items-start gap-1 mt-0.5 max-w-xs">
                                                    <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-1">{item.alamat}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.nama_kepala ? (
                                                <div className="flex items-center gap-1.5 text-sm">
                                                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                    <span>{item.nama_kepala}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Belum ditetapkan</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-0.5 text-xs text-muted-foreground">
                                                {item.telepon && <div>📞 {item.telepon}</div>}
                                                {item.email && <div>✉️ {item.email}</div>}
                                                {item.website && (
                                                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        🌐 Website
                                                    </a>
                                                )}
                                            </div>
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
                                                        <Link href={`/admin/opd/${item.id}/edit`}>
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
                {opds.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            Menampilkan {opds.from}–{opds.to} dari {opds.total} OPD
                        </span>
                        <div className="flex gap-1">
                            {opds.links.map((link, i) => (
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

OpdIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
