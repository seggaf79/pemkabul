import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MoreHorizontal, Pencil, Trash2, Calendar, ShieldAlert, LineChart as ChartIcon, Table, Sparkles, TrendingUp, DollarSign, Fish } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface HargaIkan {
    id: number;
    tanggal: string;
    ikan_tongkol: number;
    ikan_bandeng_besar: number;
    ikan_kembung: number;
    ikan_layang: number;
    ikan_putih: number;
    ikan_kakap_merah: number;
    ikan_mas: number;
    ikan_kakap_putih: number;
    ikan_nila: number;
    ikan_lele: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    hargaIkans: HargaIkan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Harga Ikan', href: '/admin/harga-ikan' },
];

const commodities = [
    { key: 'ikan_tongkol', name: 'Ikan Tongkol (1 Kg)', category: 'Ikan Laut' },
    { key: 'ikan_bandeng_besar', name: 'Ikan Bandeng Besar (1 Kg)', category: 'Ikan Laut' },
    { key: 'ikan_kembung', name: 'Ikan Kembung (1 Kg)', category: 'Ikan Laut' },
    { key: 'ikan_layang', name: 'Ikan Layang (1 Kg)', category: 'Ikan Laut' },
    { key: 'ikan_putih', name: 'Ikan Putih (1 Kg)', category: 'Ikan Laut' },
    { key: 'ikan_kakap_merah', name: 'Ikan Kakap Merah (1 Kg)', category: 'Ikan Laut' },
    { key: 'ikan_kakap_putih', name: 'Ikan Kakap Putih (1 Kg)', category: 'Ikan Laut' },
    
    { key: 'ikan_mas', name: 'Ikan Mas (1 Kg)', category: 'Ikan Air Tawar' },
    { key: 'ikan_nila', name: 'Ikan Nila (1 Kg)', category: 'Ikan Air Tawar' },
    { key: 'ikan_lele', name: 'Ikan Lele (1 Kg)', category: 'Ikan Air Tawar' },
];

const formatIndonesianDate = (dateStr: string) => {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    return `${day} ${months[month]} ${year}`;
};

const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export default function HargaIkanIndex({ hargaIkans }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editTarget, setEditTarget] = useState<HargaIkan | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<HargaIkan | null>(null);
    const [selectedCommodity, setSelectedCommodity] = useState<string>('ikan_tongkol');
    const [activeTab, setActiveTab] = useState<'tabel' | 'grafik'>('tabel');

    const { data, setData, post, put, processing, errors, reset } = useForm<{
        tanggal: string;
        ikan_tongkol: string;
        ikan_bandeng_besar: string;
        ikan_kembung: string;
        ikan_layang: string;
        ikan_putih: string;
        ikan_kakap_merah: string;
        ikan_mas: string;
        ikan_kakap_putih: string;
        ikan_nila: string;
        ikan_lele: string;
    }>({
        tanggal: '',
        ikan_tongkol: '',
        ikan_bandeng_besar: '',
        ikan_kembung: '',
        ikan_layang: '',
        ikan_putih: '',
        ikan_kakap_merah: '',
        ikan_mas: '',
        ikan_kakap_putih: '',
        ikan_nila: '',
        ikan_lele: '',
    });

    const openCreate = () => {
        reset();
        setMode('create');
        setEditTarget(null);
        setIsOpen(true);
    };

    const openEdit = (item: HargaIkan) => {
        setData({
            tanggal: item.tanggal,
            ikan_tongkol: item.ikan_tongkol.toString(),
            ikan_bandeng_besar: item.ikan_bandeng_besar.toString(),
            ikan_kembung: item.ikan_kembung.toString(),
            ikan_layang: item.ikan_layang.toString(),
            ikan_putih: item.ikan_putih.toString(),
            ikan_kakap_merah: item.ikan_kakap_merah.toString(),
            ikan_mas: item.ikan_mas.toString(),
            ikan_kakap_putih: item.ikan_kakap_putih.toString(),
            ikan_nila: item.ikan_nila.toString(),
            ikan_lele: item.ikan_lele.toString(),
        });
        setMode('edit');
        setEditTarget(item);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post('/admin/harga-ikan', {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Harga ikan berhasil ditambahkan'); },
            });
        } else if (editTarget) {
            put(`/admin/harga-ikan/${editTarget.id}`, {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Harga ikan berhasil diperbarui'); },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/harga-ikan/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Harga ikan berhasil dihapus'); },
        });
    };

    // Prepare chart data chronologically
    const chartData = hargaIkans.map(item => ({
        name: formatIndonesianDate(item.tanggal).split(' ').slice(0, 2).join(' '), // e.g. "23 Mei"
        price: item[selectedCommodity as keyof HargaIkan] as number,
    }));

    const activeCommodity = commodities.find(c => c.key === selectedCommodity);

    return (
        <>
            <Head title="Harga Ikan Bulungan" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Harga Ikan</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola, pantau, dan analisis fluktuasi harga komoditas ikan Kabupaten Bulungan</p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Catat Harga Baru
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted/70 p-1 border text-muted-foreground">
                        <button
                            type="button"
                            onClick={() => setActiveTab('tabel')}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 gap-2 ${
                                activeTab === 'tabel'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'hover:bg-background/50 hover:text-foreground'
                            }`}
                        >
                            <Table className="h-4 w-4" /> Tabel Harga
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('grafik')}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 gap-2 ${
                                activeTab === 'grafik'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'hover:bg-background/50 hover:text-foreground'
                            }`}
                        >
                            <ChartIcon className="h-4 w-4" /> Grafik Fluktuasi
                        </button>
                    </div>

                    {/* TABS: TABEL HARGA */}
                    {activeTab === 'tabel' && (
                        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left min-w-[1200px]">
                                    <thead className="border-b bg-muted/50 text-[10px] uppercase font-semibold text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 sticky left-0 bg-muted/80 backdrop-blur-sm z-10 w-32 border-r shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Tanggal</th>
                                            {commodities.map((c) => (
                                                <th key={c.key} className="px-4 py-3 text-center font-semibold">{c.name}</th>
                                            ))}
                                            <th className="px-4 py-3 text-right sticky right-0 bg-muted/80 backdrop-blur-sm z-10 w-20 border-l shadow-[-2px_0_5px_rgba(0,0,0,0.05)]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-foreground">
                                        {hargaIkans.length === 0 ? (
                                            <tr>
                                                <td colSpan={12} className="px-4 py-16 text-center text-sm text-muted-foreground">
                                                    <Calendar className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                                    <p>Belum ada data pencatatan harga komoditas ikan</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            // Render latest dates on top in the table for quick reading
                                            [...hargaIkans].reverse().map((item) => (
                                                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3 sticky left-0 bg-card z-10 font-bold border-r shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                                            {formatIndonesianDate(item.tanggal)}
                                                        </span>
                                                    </td>
                                                    {commodities.map((c) => (
                                                        <td key={c.key} className="px-4 py-3 text-center font-medium font-mono">
                                                            {formatRupiah(item[c.key as keyof HargaIkan] as number)}
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-3 text-right sticky right-0 bg-card z-10 border-l shadow-[-2px_0_5px_rgba(0,0,0,0.02)]">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => openEdit(item)}>
                                                                    <Pencil className="mr-2 h-4 w-4" /> Edit Catatan
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
                    )}

                    {/* TABS: GRAFIK TREN FLUKTUASI */}
                    {activeTab === 'grafik' && (
                        <div className="grid gap-6 md:grid-cols-4">
                            <div className="md:col-span-1 space-y-4">
                                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <h3 className="font-semibold text-sm">Visualisasi Tren</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Pilih jenis komoditas ikan di bawah ini untuk melihat kurva pergerakan harga secara kronologis per minggu.
                                    </p>
                                    <div className="space-y-1.5 pt-2">
                                        <Label>Pilih Jenis Ikan</Label>
                                        <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {commodities.map(c => (
                                                    <SelectItem key={c.key} value={c.key}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-primary" />
                                                Grafik Tren: {activeCommodity?.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">Sektor: {activeCommodity?.category}</p>
                                        </div>
                                    </div>

                                    {hargaIkans.length < 2 ? (
                                        <div className="h-[350px] flex flex-col items-center justify-center text-center text-muted-foreground">
                                            <ChartIcon className="h-8 w-8 opacity-20 mb-2" />
                                            <p className="text-sm font-medium">Data kurang untuk memuat grafik</p>
                                            <p className="text-xs max-w-xs mt-1">Harap catat harga minimal untuk 2 tanggal yang berbeda untuk melihat kurva fluktuasi.</p>
                                        </div>
                                    ) : (
                                        <div className="h-[350px] w-full pt-4 pr-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 10 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                                                    <YAxis 
                                                        stroke="#64748b" 
                                                        fontSize={11} 
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={(val) => `Rp ${val / 1000}k`}
                                                    />
                                                    <Tooltip 
                                                        formatter={(value: number) => [formatRupiah(value), activeCommodity?.name]}
                                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                                                    />
                                                    <Line 
                                                        type="monotone" 
                                                        dataKey="price" 
                                                        stroke="#2563eb" 
                                                        strokeWidth={3}
                                                        activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }} 
                                                        dot={{ r: 4, fill: '#ffffff', stroke: '#2563eb', strokeWidth: 2 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Fish className="h-5 w-5 text-primary" />
                            {mode === 'create' ? 'Catat Harga Ikan Baru' : 'Edit Catatan Harga Ikan'}
                        </DialogTitle>
                        <DialogDescription>Masukkan harga komoditas ikan dalam angka penuh tanpa koma/titik (Contoh: 35000).</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5 pb-3 border-b flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="tanggal" className="text-sm font-semibold flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-primary" /> Tanggal Pencatatan <span className="text-destructive">*</span>
                                </Label>
                                <p className="text-[10px] text-muted-foreground">Pilih tanggal dilakukannya survei harga ikan.</p>
                            </div>
                            <Input 
                                id="tanggal" 
                                type="date" 
                                className="w-48"
                                value={data.tanggal} 
                                onChange={e => setData('tanggal', e.target.value)} 
                                required 
                            />
                        </div>
                        {errors.tanggal && <p className="text-xs text-destructive -mt-4">{errors.tanggal}</p>}

                        {/* SEKTOR: IKAN LAUT */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-1 border-b">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground">Sektor Ikan Hasil Laut</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="ikan_tongkol">Ikan Tongkol (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_tongkol" type="number" min="0" value={data.ikan_tongkol} onChange={e => setData('ikan_tongkol', e.target.value)} required placeholder="Contoh: 35000" />
                                    {errors.ikan_tongkol && <p className="text-xs text-destructive">{errors.ikan_tongkol}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ikan_bandeng_besar">Ikan Bandeng Besar (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_bandeng_besar" type="number" min="0" value={data.ikan_bandeng_besar} onChange={e => setData('ikan_bandeng_besar', e.target.value)} required placeholder="Contoh: 40000" />
                                    {errors.ikan_bandeng_besar && <p className="text-xs text-destructive">{errors.ikan_bandeng_besar}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ikan_kembung">Ikan Kembung (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_kembung" type="number" min="0" value={data.ikan_kembung} onChange={e => setData('ikan_kembung', e.target.value)} required placeholder="Contoh: 38000" />
                                    {errors.ikan_kembung && <p className="text-xs text-destructive">{errors.ikan_kembung}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ikan_layang">Ikan Layang (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_layang" type="number" min="0" value={data.ikan_layang} onChange={e => setData('ikan_layang', e.target.value)} required placeholder="Contoh: 32000" />
                                    {errors.ikan_layang && <p className="text-xs text-destructive">{errors.ikan_layang}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ikan_putih">Ikan Putih (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_putih" type="number" min="0" value={data.ikan_putih} onChange={e => setData('ikan_putih', e.target.value)} required placeholder="Contoh: 60000" />
                                    {errors.ikan_putih && <p className="text-xs text-destructive">{errors.ikan_putih}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ikan_kakap_merah">Ikan Kakap Merah (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_kakap_merah" type="number" min="0" value={data.ikan_kakap_merah} onChange={e => setData('ikan_kakap_merah', e.target.value)} required placeholder="Contoh: 75000" />
                                    {errors.ikan_kakap_merah && <p className="text-xs text-destructive">{errors.ikan_kakap_merah}</p>}
                                </div>
                                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                    <Label htmlFor="ikan_kakap_putih">Ikan Kakap Putih (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_kakap_putih" type="number" min="0" value={data.ikan_kakap_putih} onChange={e => setData('ikan_kakap_putih', e.target.value)} required placeholder="Contoh: 70000" />
                                    {errors.ikan_kakap_putih && <p className="text-xs text-destructive">{errors.ikan_kakap_putih}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SEKTOR: IKAN AIR TAWAR */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-1 border-b">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground">Sektor Ikan Air Tawar & Budidaya</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="ikan_mas">Ikan Mas (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_mas" type="number" min="0" value={data.ikan_mas} onChange={e => setData('ikan_mas', e.target.value)} required placeholder="Contoh: 45000" />
                                    {errors.ikan_mas && <p className="text-xs text-destructive">{errors.ikan_mas}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ikan_nila">Ikan Nila (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_nila" type="number" min="0" value={data.ikan_nila} onChange={e => setData('ikan_nila', e.target.value)} required placeholder="Contoh: 40000" />
                                    {errors.ikan_nila && <p className="text-xs text-destructive">{errors.ikan_nila}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ikan_lele">Ikan Lele (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ikan_lele" type="number" min="0" value={data.ikan_lele} onChange={e => setData('ikan_lele', e.target.value)} required placeholder="Contoh: 30000" />
                                    {errors.ikan_lele && <p className="text-xs text-destructive">{errors.ikan_lele}</p>}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-destructive" />
                            Hapus Catatan Harga Ikan
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus catatan harga ikan tanggal <strong className="text-foreground">{formatIndonesianDate(deleteTarget?.tanggal || '')}</strong>? Tindakan ini tidak dapat dibatalkan.
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

HargaIkanIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
