import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Youtube, Video as VideoIcon } from 'lucide-react';
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
}

interface Props {
    kategoris: { id: number; nama: string }[];
    video: Video;
}

export default function VideoEdit({ kategoris, video }: Props) {
    const [youtubeId, setYoutubeId] = useState<string | null>(video.youtube_id);

    const { data, setData, put, processing, errors } = useForm({
        kategori_video_id: video.kategori_video_id.toString(),
        judul: video.judul,
        youtube_url: video.youtube_url,
        deskripsi: video.deskripsi || '',
        waktu_publish: video.waktu_publish,
        status: video.status,
    });

    // Extract Youtube ID for live preview
    useEffect(() => {
        if (!data.youtube_url) {
            setYoutubeId(null);
            return;
        }
        
        try {
            const match = data.youtube_url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
            if (match && match[1]) {
                setYoutubeId(match[1]);
            } else {
                setYoutubeId(null);
            }
        } catch (e) {
            setYoutubeId(null);
        }
    }, [data.youtube_url]);

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/video/${video.id}`);
    };

    return (
        <>
            <Head title={`Edit Video: ${video.judul}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/video">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Video</h1>
                        <p className="text-sm text-muted-foreground">Ubah informasi video YouTube</p>
                    </div>
                </div>

                <form onSubmit={submitForm} className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <VideoIcon className="h-4 w-4" /> Informasi Video
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                
                                <div className="space-y-1.5">
                                    <Label htmlFor="youtube_url">URL YouTube <span className="text-destructive">*</span></Label>
                                    <div className="relative">
                                        <Youtube className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="youtube_url"
                                            value={data.youtube_url}
                                            onChange={(e) => setData('youtube_url', e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="pl-9"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Masukkan link lengkap video YouTube Anda.</p>
                                    {errors.youtube_url && <p className="text-xs text-destructive">{errors.youtube_url}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="judul">Judul Video <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="judul"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        placeholder="Cth: Sambutan Bupati pada Acara HUT Bulungan"
                                        required
                                    />
                                    {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="kategori_video_id">Kategori Video <span className="text-destructive">*</span></Label>
                                    <Select 
                                        value={data.kategori_video_id} 
                                        onValueChange={(val) => setData('kategori_video_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kategoris.length === 0 && (
                                                <SelectItem value="empty" disabled>Belum ada kategori. Buat terlebih dahulu.</SelectItem>
                                            )}
                                            {kategoris.map((k) => (
                                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kategori_video_id && <p className="text-xs text-destructive">{errors.kategori_video_id}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                                    <Textarea
                                        id="deskripsi"
                                        rows={3}
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        placeholder="Tuliskan keterangan mengenai video ini..."
                                    />
                                    {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="waktu_publish">Tanggal Pemutaran</Label>
                                        <Input
                                            id="waktu_publish"
                                            type="date"
                                            value={data.waktu_publish}
                                            onChange={(e) => setData('waktu_publish', e.target.value)}
                                            required
                                        />
                                        {errors.waktu_publish && <p className="text-xs text-destructive">{errors.waktu_publish}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="status">Status Publish <span className="text-destructive">*</span></Label>
                                        <Select 
                                            value={data.status} 
                                            onValueChange={(val) => setData('status', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="aktif">Aktif (Ditampilkan)</SelectItem>
                                                <SelectItem value="nonaktif">Nonaktif (Sembunyikan)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end border-t">
                                    <Button type="button" variant="outline" className="mr-3" asChild>
                                        <Link href="/admin/video">Batal</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Youtube className="h-4 w-4 text-red-500" /> Pratinjau Video
                                </CardTitle>
                                <CardDescription>
                                    Masukkan URL YouTube yang valid untuk melihat pratinjau.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                                    {youtubeId ? (
                                        <iframe 
                                            className="w-full h-full"
                                            src={`https://www.youtube.com/embed/${youtubeId}`} 
                                            title="YouTube video player" 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <div className="flex flex-col items-center text-muted-foreground p-6 text-center">
                                            <Youtube className="h-10 w-10 mb-2 opacity-20" />
                                            <p className="text-sm">Pratinjau tidak tersedia.<br/>Tautan YouTube belum diisi atau formatnya salah.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </form>
            </div>
        </>
    );
}

VideoEdit.layout = (page: React.ReactNode) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gallery Video', href: '/admin/video' },
        { title: 'Edit Video', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
