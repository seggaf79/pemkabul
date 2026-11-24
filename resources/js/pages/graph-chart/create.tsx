import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Settings2, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Grafik & Statistik', href: '/admin/graph-chart' },
    { title: 'Buat Grafik', href: '/admin/graph-chart/create' },
];

export default function GraphChartCreate() {
    // Internal state for the UI builder
    const [seriesKeys, setSeriesKeys] = useState<string[]>(['Seri 1']);
    const [items, setItems] = useState<any[]>([
        { name: 'Kategori 1', 'Seri 1': 10 },
        { name: 'Kategori 2', 'Seri 1': 20 }
    ]);
    const [newSeriesName, setNewSeriesName] = useState('');

    const { data, setData, post, processing, errors, transform } = useForm({
        nama: '',
        tipe: 'bar' as 'bar' | 'line' | 'pie' | 'area',
        data: {} as any, // We will populate this on submit
        keterangan: '',
        status: 'aktif' as 'aktif' | 'nonaktif',
    });

    const addSeries = () => {
        if (!newSeriesName.trim()) return;
        if (seriesKeys.includes(newSeriesName.trim())) {
            toast.error('Nama seri sudah ada');
            return;
        }
        const key = newSeriesName.trim();
        setSeriesKeys([...seriesKeys, key]);
        const newItems = items.map(item => ({ ...item, [key]: 0 }));
        setItems(newItems);
        setNewSeriesName('');
    };

    const removeSeries = (keyToRemove: string) => {
        if (seriesKeys.length <= 1) {
            toast.error('Minimal harus ada 1 seri data');
            return;
        }
        setSeriesKeys(seriesKeys.filter(k => k !== keyToRemove));
        const newItems = items.map(item => {
            const newItem = { ...item };
            delete newItem[keyToRemove];
            return newItem;
        });
        setItems(newItems);
    };

    const addRow = () => {
        const newRow: any = { name: `Kategori ${items.length + 1}` };
        seriesKeys.forEach(k => newRow[k] = 0);
        setItems([...items, newRow]);
    };

    const removeRow = (index: number) => {
        if (items.length <= 1) {
            toast.error('Minimal harus ada 1 baris data');
            return;
        }
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const updateItem = (index: number, key: string, value: string) => {
        const newItems = [...items];
        const updatedItem = { ...newItems[index] };
        if (key === 'name') {
            updatedItem[key] = value;
        } else {
            updatedItem[key] = value === '' ? '' : Number(value);
        }
        newItems[index] = updatedItem;
        setItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prepare JSON payload
        const finalData = {
            seriesKeys: seriesKeys,
            items: items
        };

        // Use a callback or update and post synchronously
        setData('data', finalData);
        
        // Inertia useForm sets state asynchronously, so we pass it directly to post options if needed,
        // but it's better to use transform or just standard axios/fetch if data is very dynamic.
        // Wait, Inertia supports `transform`
    };

    // Since we need to update `data.data` right before submit:
    const submitForm = () => {
        const finalData = { seriesKeys, items };
        transform((currentData) => ({
            ...currentData,
            data: finalData
        }));
        post('/admin/graph-chart', {
            onSuccess: () => toast.success('Grafik berhasil dibuat')
        });
    };

    const renderChart = () => {
        if (items.length === 0) return <div className="text-center text-muted-foreground pt-10">Data kosong</div>;

        switch (data.tipe) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={items} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Legend />
                            {seriesKeys.map((key, i) => (
                                <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={items} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Legend />
                            {seriesKeys.map((key, i) => (
                                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={items} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Legend />
                            {seriesKeys.map((key, i) => (
                                <Area key={key} type="monotone" dataKey={key} fill={COLORS[i % COLORS.length]} stroke={COLORS[i % COLORS.length]} fillOpacity={0.3} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                // Pie chart usually only takes 1 series to display nicely. We will use the first series key.
                const pieData = items.map(item => ({
                    name: item.name,
                    value: item[seriesKeys[0]] || 0
                }));
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Legend />
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <>
            <Head title="Buat Grafik Baru" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/graph-chart">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Buat Grafik Baru</h1>
                        <p className="text-sm text-muted-foreground">Konfigurasi dan masukkan data grafik Anda</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Left Column - Form Data */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Settings2 className="h-4 w-4" /> Pengaturan Dasar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Judul Grafik <span className="text-destructive">*</span></Label>
                                    <Input value={data.nama} onChange={e => setData('nama', e.target.value)} required placeholder="Contoh: Statistik Penduduk 2026" />
                                    {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Tipe Grafik <span className="text-destructive">*</span></Label>
                                        <Select value={data.tipe} onValueChange={(val: any) => setData('tipe', val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bar">Bar Chart (Batang)</SelectItem>
                                                <SelectItem value="line">Line Chart (Garis)</SelectItem>
                                                <SelectItem value="area">Area Chart (Area)</SelectItem>
                                                <SelectItem value="pie">Pie Chart (Lingkaran)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Status Tampil</Label>
                                        <Select value={data.status} onValueChange={(val: any) => setData('status', val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="aktif">Aktif</SelectItem>
                                                <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Deskripsi Singkat</Label>
                                    <Textarea rows={2} value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} placeholder="Opsional..." />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center justify-between">
                                    Data Editor (Multi-value)
                                </CardTitle>
                                <CardDescription>Atur nama seri dan masukkan nilai per kategori.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                
                                {/* Series Manager */}
                                <div className="bg-muted/50 p-3 rounded-lg border space-y-3">
                                    <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Variabel Seri (Legend)</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {seriesKeys.map((key) => (
                                            <div key={key} className="flex items-center gap-1 bg-background border px-2 py-1 rounded-md text-sm">
                                                <span>{key}</span>
                                                <button type="button" onClick={() => removeSeries(key)} className="text-muted-foreground hover:text-destructive">
                                                    <XIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 items-center pt-1">
                                        <Input 
                                            size={1} 
                                            className="h-8 text-sm" 
                                            placeholder="Nama Seri Baru..." 
                                            value={newSeriesName} 
                                            onChange={e => setNewSeriesName(e.target.value)} 
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSeries())}
                                        />
                                        <Button type="button" size="sm" onClick={addSeries} variant="secondary">Tambah Seri</Button>
                                    </div>
                                    {data.tipe === 'pie' && <p className="text-[10px] text-orange-600">* Pie chart hanya akan menampilkan seri pertama ({seriesKeys[0]}).</p>}
                                </div>

                                {/* Data Table */}
                                <div className="border rounded-lg overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="p-2 text-left font-medium w-1/3">Label / Kategori (X-Axis)</th>
                                                {seriesKeys.map(key => (
                                                    <th key={key} className="p-2 text-left font-medium">{key}</th>
                                                ))}
                                                <th className="p-2 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {items.map((item, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td className="p-2">
                                                        <Input className="h-8" value={item.name} onChange={e => updateItem(rowIndex, 'name', e.target.value)} />
                                                    </td>
                                                    {seriesKeys.map(key => (
                                                        <td key={key} className="p-2">
                                                            <Input className="h-8" type="number" value={item[key]} onChange={e => updateItem(rowIndex, key, e.target.value)} />
                                                        </td>
                                                    ))}
                                                    <td className="p-2 text-center">
                                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeRow(rowIndex)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addRow} className="w-full border-dashed">
                                    <Plus className="mr-2 h-4 w-4" /> Tambah Baris Data
                                </Button>
                                {errors.data && <p className="text-xs text-destructive">{errors.data}</p>}

                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Live Preview */}
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BarChart2 className="h-4 w-4" /> Live Preview
                                    </div>
                                    <Badge variant="outline" className="font-normal text-xs">{data.tipe.toUpperCase()}</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Pratinjau grafik akan otomatis menyesuaikan dengan data yang Anda masukkan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-xl p-4 bg-background">
                                    <h3 className="text-center font-bold mb-4">{data.nama || 'Judul Grafik'}</h3>
                                    {renderChart()}
                                </div>
                            </CardContent>
                            <div className="p-6 pt-0 mt-4 border-t">
                                <Button className="w-full mt-4" size="lg" onClick={(e) => { e.preventDefault(); submitForm(); }} disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Grafik'}
                                </Button>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </>
    );
}

// Just a simple X icon for the remove series button
function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}

GraphChartCreate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
