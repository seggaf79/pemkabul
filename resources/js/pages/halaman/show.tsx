import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Halaman } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2, Calendar, Tag, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    halaman: Halaman;
}

export default function HalamanShow({ halaman }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Halaman', href: '/admin/halaman' },
        { title: halaman.judul, href: `/admin/halaman/${halaman.id}` },
    ];

    const handleDelete = () => {
        if (!confirm(`Hapus halaman "${halaman.judul}"?`)) return;
        router.delete(`/admin/halaman/${halaman.id}`, {
            onSuccess: () => toast.success('Halaman berhasil dihapus'),
        });
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
        });

    return (
        <>
            <Head title={halaman.judul} />

            <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/halaman">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{halaman.judul}</h1>
                            <p className="text-muted-foreground text-sm mt-0.5">Detail Halaman</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/halaman/${halaman.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Gambar */}
                        {halaman.gambar_url && (
                            <div className="rounded-xl overflow-hidden border shadow-sm">
                                <img
                                    src={halaman.gambar_url}
                                    alt={halaman.judul}
                                    className="w-full object-cover max-h-80"
                                />
                            </div>
                        )}

                        {/* Konten */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="font-semibold mb-4 text-base">Konten</h2>
                            {halaman.konten ? (
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: halaman.konten }}
                                />
                            ) : (
                                <p className="text-muted-foreground italic text-sm">Tidak ada konten.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-5">
                        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                            <h2 className="font-semibold">Informasi</h2>

                            <div className="space-y-3 text-sm">
                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge
                                        variant={halaman.status === 'published' ? 'default' : 'secondary'}
                                        className={halaman.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}
                                    >
                                        {halaman.status === 'published' ? 'Published' : 'Draft'}
                                    </Badge>
                                </div>

                                {/* Kategori */}
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                        <Tag className="h-3.5 w-3.5" />
                                        Kategori
                                    </span>
                                    <Badge variant="outline">{halaman.kategori_halaman?.nama}</Badge>
                                </div>

                                {/* Slug */}
                                <div className="flex items-start justify-between gap-2">
                                    <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                                        <Hash className="h-3.5 w-3.5" />
                                        Slug
                                    </span>
                                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs break-all">
                                        {halaman.slug}
                                    </code>
                                </div>

                                {/* Urutan */}
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Urutan</span>
                                    <span className="font-medium">{halaman.urutan}</span>
                                </div>

                                <div className="border-t pt-3 space-y-2">
                                    {/* Dibuat */}
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Dibuat: {formatDate(halaman.created_at)}</span>
                                    </div>
                                    {/* Diperbarui */}
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Diperbarui: {formatDate(halaman.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" asChild className="w-full">
                            <Link href="/admin/halaman">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Daftar
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

HalamanShow.layout = (page: React.ReactNode) => {
    const halaman = (page as any).props?.halaman as Halaman | undefined;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Halaman', href: '/admin/halaman' },
        { title: halaman?.judul ?? 'Detail', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
