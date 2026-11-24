import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Download, type KategoriDownload, type PaginatedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Plus, MoreHorizontal, Pencil, Trash2, Search, Download as DownloadIcon,
    FileText, FileSpreadsheet, FileImage, FileArchive, File,
    Eye, EyeOff, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
    downloads: PaginatedData<Download>;
    kategoriDownloads: KategoriDownload[];
    tipeList: string[];
    filters: { kategori?: string; search?: string; status?: string; tipe?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Download', href: '/admin/download' },
];

/* ── Helpers ─────────────────────────────────────── */
function FileIcon({ tipe, className }: { tipe: string | null; className?: string }) {
    const t = tipe?.toLowerCase() ?? '';
    if (['pdf'].includes(t)) return <FileText className={cn('text-red-500', className)} />;
    if (['doc', 'docx'].includes(t)) return <FileText className={cn('text-blue-600', className)} />;
    if (['xls', 'xlsx'].includes(t)) return <FileSpreadsheet className={cn('text-green-600', className)} />;
    if (['ppt', 'pptx'].includes(t)) return <FileText className={cn('text-orange-500', className)} />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(t)) return <FileImage className={cn('text-purple-500', className)} />;
    if (['zip', 'rar'].includes(t)) return <FileArchive className={cn('text-yellow-600', className)} />;
    return <File className={cn('text-muted-foreground', className)} />;
}

const TIPE_COLOR: Record<string, string> = {
    pdf: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300',
    doc: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
    docx: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
    xls: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
    xlsx: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
    ppt: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
    pptx: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
    zip: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300',
    rar: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300',
};

export default function DownloadIndex({ downloads, kategoriDownloads, tipeList, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [previewDownload, setPreviewDownload] = useState<Download | null>(null);

    const applyFilter = (params: Record<string, string>) => {
        router.get('/admin/download', { ...filters, ...params }, { preserveState: true, replace: true });
    };

    const handleDelete = (item: Download) => {
        if (!confirm(`Hapus file "${item.judul}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        router.delete(`/admin/download/${item.id}`, {
            onSuccess: () => toast.success('File berhasil dihapus'),
        });
    };

    const totalUnduhan = downloads.data.reduce((s, d) => s + d.jumlah_unduhan, 0);

    return (
        <>
            <Head title="Manajemen Download" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Download</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola file unduhan yang tersedia untuk publik</p>
                    </div>
                    <Button asChild id="btn-tambah-download">
                        <Link href="/admin/download/create">
                            <Plus className="mr-2 h-4 w-4" /> Tambah File
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        { label: 'Total File', value: downloads.total, color: 'bg-primary/10 text-primary' },
                        { label: 'Aktif', value: downloads.data.filter(d => d.status === 'aktif').length, color: 'bg-green-500/10 text-green-600' },
                        { label: 'Nonaktif', value: downloads.data.filter(d => d.status === 'nonaktif').length, color: 'bg-orange-500/10 text-orange-600' },
                        { label: 'Total Unduhan', value: totalUnduhan, color: 'bg-blue-500/10 text-blue-600' },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
                            <p className={cn('mb-1 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', s.color)}>{s.label}</p>
                            <p className="text-2xl font-bold">{s.value.toLocaleString('id-ID')}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilter({ search }); }} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="search-download" className="w-64 pl-9" placeholder="Cari judul file..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <Button type="submit" variant="secondary">Cari</Button>
                    </form>

                    <Select value={filters.kategori ?? 'all'} onValueChange={(v) => applyFilter({ kategori: v === 'all' ? '' : v })}>
                        <SelectTrigger id="filter-kategori-dl" className="w-48"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {kategoriDownloads.map((k) => <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    {tipeList.length > 0 && (
                        <Select value={filters.tipe ?? 'all'} onValueChange={(v) => applyFilter({ tipe: v === 'all' ? '' : v })}>
                            <SelectTrigger id="filter-tipe" className="w-36"><SelectValue placeholder="Semua Tipe" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tipe</SelectItem>
                                {tipeList.map((t) => <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}

                    <Select value={filters.status ?? 'all'} onValueChange={(v) => applyFilter({ status: v === 'all' ? '' : v })}>
                        <SelectTrigger id="filter-status-dl" className="w-36"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>

                    {(filters.kategori || filters.search || filters.status || filters.tipe) && (
                        <Button variant="ghost" onClick={() => router.get('/admin/download')}>Reset</Button>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">No</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">File</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Tipe</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Ukuran</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Unduhan</th>
                                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {downloads.data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                        <DownloadIcon className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                        <p>Belum ada file download</p>
                                    </td>
                                </tr>
                            ) : (
                                downloads.data.map((item, idx) => (
                                    <tr key={item.id} className={cn('transition-colors hover:bg-muted/30', item.status === 'nonaktif' && 'opacity-60')}>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {(downloads.current_page - 1) * downloads.per_page + idx + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-start gap-3">
                                                {item.sampul_url ? (
                                                    <img src={item.sampul_url} alt="" className="h-10 w-10 shrink-0 rounded object-cover border" />
                                                ) : (
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border bg-muted">
                                                        <FileIcon tipe={item.tipe_file} className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium line-clamp-1">{item.judul}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{item.nama_file_asli}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline">{item.kategori_download?.nama}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {item.tipe_file && (
                                                <span className={cn(
                                                    'inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium uppercase',
                                                    TIPE_COLOR[item.tipe_file] ?? 'bg-muted text-muted-foreground border-border',
                                                )}>
                                                    {item.tipe_file}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-muted-foreground">{item.ukuran_format}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="flex items-center justify-center gap-1 text-muted-foreground">
                                                <DownloadIcon className="h-3.5 w-3.5" />
                                                {item.jumlah_unduhan.toLocaleString('id-ID')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge
                                                variant={item.status === 'aktif' ? 'default' : 'secondary'}
                                                className={item.status === 'aktif' ? 'bg-green-500 hover:bg-green-600' : ''}
                                            >
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
                                                        <Link href={`/admin/download/${item.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {item.tipe_file === 'pdf' && (
                                                        <DropdownMenuItem onClick={() => setPreviewDownload(item)}>
                                                            <Eye className="mr-2 h-4 w-4" /> Preview PDF
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem asChild>
                                                        <a href={`/admin/download/${item.id}/unduh`} target="_blank" rel="noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4" /> Unduh / Preview
                                                        </a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(item)}>
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

                {/* Pagination */}
                {downloads.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Menampilkan {downloads.from}–{downloads.to} dari {downloads.total} file</span>
                        <div className="flex gap-1">
                            {downloads.links.map((link, i) => (
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

            {/* Preview Dialog */}
            <Dialog open={!!previewDownload} onOpenChange={(open) => !open && setPreviewDownload(null)}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-4">
                    <DialogHeader>
                        <DialogTitle className="line-clamp-1">{previewDownload?.judul}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 w-full bg-muted/30 rounded-md overflow-hidden mt-2 relative">
                        {previewDownload && (
                            <iframe 
                                src={`/admin/download/${previewDownload.id}/preview`} 
                                className="w-full h-full border-0 absolute inset-0" 
                                title="PDF Preview"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

DownloadIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
