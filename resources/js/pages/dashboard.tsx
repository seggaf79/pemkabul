import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FileText, Download, Images, Eye, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface GrafikData {
    name: string;
    unduhan: number;
}

interface TopHalaman {
    id: number;
    judul: string;
    slug: string;
    views: number;
}

interface Props {
    total_halaman: number;
    total_slider: number;
    total_download: number;
    top_halaman: TopHalaman[];
    grafik_unduhan: GrafikData[];
    tahun_berjalan: number;
}

export default function Dashboard({
    total_halaman,
    total_slider,
    total_download,
    top_halaman,
    grafik_unduhan,
    tahun_berjalan,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                {/* 1. Top 3 Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jumlah Halaman</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total_halaman}</div>
                            <p className="text-xs text-muted-foreground">Total halaman yang telah dipublikasikan</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Unduhan</CardTitle>
                            <Download className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total_download}</div>
                            <p className="text-xs text-muted-foreground">Total klik unduhan file di sistem</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jumlah Slider</CardTitle>
                            <Images className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total_slider}</div>
                            <p className="text-xs text-muted-foreground">Banner slider di halaman utama</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. Bottom Section: Chart and Top Pages */}
                <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
                    
                    {/* Grafik */}
                    <Card className="col-span-4 md:col-span-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Grafik Unduhan ({tahun_berjalan})
                            </CardTitle>
                            <CardDescription>
                                Menampilkan riwayat jumlah file yang diunduh pengunjung per bulan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-0">
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={grafik_unduhan} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                            dx={-10}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'hsl(var(--background))', 
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: '8px'
                                            }} 
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="unduhan" 
                                            name="Jumlah Unduhan" 
                                            stroke="hsl(var(--primary))" 
                                            strokeWidth={3} 
                                            activeDot={{ r: 6 }} 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top 5 Halaman */}
                    <Card className="col-span-3 md:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-primary" />
                                5 Halaman Terpopuler
                            </CardTitle>
                            <CardDescription>
                                Halaman dengan jumlah akses terbanyak
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 mt-4">
                                {top_halaman.length === 0 ? (
                                    <div className="text-center text-sm text-muted-foreground py-10">
                                        Belum ada data halaman
                                    </div>
                                ) : (
                                    top_halaman.map((page, index) => (
                                        <div key={page.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                    {index + 1}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none line-clamp-1">{page.judul}</p>
                                                    <p className="text-xs text-muted-foreground">/{page.slug}</p>
                                                </div>
                                            </div>
                                            <div className="font-medium text-sm flex items-center gap-1.5 text-muted-foreground">
                                                {page.views} <Eye className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
