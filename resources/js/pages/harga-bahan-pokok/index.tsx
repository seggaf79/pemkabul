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
import { Plus, MoreHorizontal, Pencil, Trash2, Calendar, ShieldAlert, LineChart as ChartIcon, Table, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface HargaBahanPokok {
    id: number;
    tanggal: string;
    daging_sapi: number;
    ayam_potong: number;
    ayam_kampung: number;
    cabe_rawit_merah: number;
    cabe_rawit_hijau: number;
    cabe_keriting: number;
    cabe_merah_besar: number;
    telur: number;
    bawang_merah: number;
    bawang_putih: number;
    bawang_bombay: number;
    minyak_goreng_medium: number;
    minyak_goreng_premium: number;
    gula_pasir: number;
    kacang_tanah: number;
    kentang: number;
    wortel: number;
    tomat: number;
    beras_medium: number;
    beras_premium: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    hargaBahanPokoks: HargaBahanPokok[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Harga Bahan Pokok', href: '/admin/harga-bahan-pokok' },
];

const commodities = [
    { key: 'daging_sapi', name: 'Daging Sapi (1 Kg)', category: 'Daging & Telur' },
    { key: 'ayam_potong', name: 'Ayam Potong (1 Kg)', category: 'Daging & Telur' },
    { key: 'ayam_kampung', name: 'Ayam Kampung (1 Kg)', category: 'Daging & Telur' },
    { key: 'telur', name: 'Telur (1 Piring)', category: 'Daging & Telur' },
    
    { key: 'cabe_rawit_merah', name: 'Cabe Rawit Merah (1 Kg)', category: 'Cabe & Bawang' },
    { key: 'cabe_rawit_hijau', name: 'Cabe Rawit Hijau (1 Kg)', category: 'Cabe & Bawang' },
    { key: 'cabe_keriting', name: 'Cabe Keriting (1 Kg)', category: 'Cabe & Bawang' },
    { key: 'cabe_merah_besar', name: 'Cabe Merah Besar (1 Kg)', category: 'Cabe & Bawang' },
    { key: 'bawang_merah', name: 'Bawang Merah (1 Kg)', category: 'Cabe & Bawang' },
    { key: 'bawang_putih', name: 'Bawang Putih (1 Kg)', category: 'Cabe & Bawang' },
    { key: 'bawang_bombay', name: 'Bawang Bombay (1 Kg)', category: 'Cabe & Bawang' },

    { key: 'beras_medium', name: 'Beras Medium (1 Kg)', category: 'Beras & Sembako' },
    { key: 'beras_premium', name: 'Beras Premium (1 Kg)', category: 'Beras & Sembako' },
    { key: 'minyak_goreng_medium', name: 'Minyak Goreng Medium (1 Liter)', category: 'Beras & Sembako' },
    { key: 'minyak_goreng_premium', name: 'Minyak Goreng Premium (1 Liter)', category: 'Beras & Sembako' },
    { key: 'gula_pasir', name: 'Gula Pasir (1 Kg)', category: 'Beras & Sembako' },

    { key: 'kacang_tanah', name: 'Kacang Tanah (1 Kg)', category: 'Sayur & Kacang' },
    { key: 'kentang', name: 'Kentang (1 Kg)', category: 'Sayur & Kacang' },
    { key: 'wortel', name: 'Wortel (1 Kg)', category: 'Sayur & Kacang' },
    { key: 'tomat', name: 'Tomat (1 Kg)', category: 'Sayur & Kacang' },
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

export default function HargaBahanPokokIndex({ hargaBahanPokoks }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editTarget, setEditTarget] = useState<HargaBahanPokok | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<HargaBahanPokok | null>(null);
    const [selectedCommodity, setSelectedCommodity] = useState<string>('daging_sapi');
    const [activeTab, setActiveTab] = useState<'tabel' | 'grafik'>('tabel');

    const { data, setData, post, put, processing, errors, reset } = useForm<{
        tanggal: string;
        daging_sapi: string;
        ayam_potong: string;
        ayam_kampung: string;
        cabe_rawit_merah: string;
        cabe_rawit_hijau: string;
        cabe_keriting: string;
        cabe_merah_besar: string;
        telur: string;
        bawang_merah: string;
        bawang_putih: string;
        bawang_bombay: string;
        minyak_goreng_medium: string;
        minyak_goreng_premium: string;
        gula_pasir: string;
        kacang_tanah: string;
        kentang: string;
        wortel: string;
        tomat: string;
        beras_medium: string;
        beras_premium: string;
    }>({
        tanggal: '',
        daging_sapi: '',
        ayam_potong: '',
        ayam_kampung: '',
        cabe_rawit_merah: '',
        cabe_rawit_hijau: '',
        cabe_keriting: '',
        cabe_merah_besar: '',
        telur: '',
        bawang_merah: '',
        bawang_putih: '',
        bawang_bombay: '',
        minyak_goreng_medium: '',
        minyak_goreng_premium: '',
        gula_pasir: '',
        kacang_tanah: '',
        kentang: '',
        wortel: '',
        tomat: '',
        beras_medium: '',
        beras_premium: '',
    });

    const openCreate = () => {
        reset();
        setMode('create');
        setEditTarget(null);
        setIsOpen(true);
    };

    const openEdit = (item: HargaBahanPokok) => {
        setData({
            tanggal: item.tanggal,
            daging_sapi: item.daging_sapi.toString(),
            ayam_potong: item.ayam_potong.toString(),
            ayam_kampung: item.ayam_kampung.toString(),
            cabe_rawit_merah: item.cabe_rawit_merah.toString(),
            cabe_rawit_hijau: item.cabe_rawit_hijau.toString(),
            cabe_keriting: item.cabe_keriting.toString(),
            cabe_merah_besar: item.cabe_merah_besar.toString(),
            telur: item.telur.toString(),
            bawang_merah: item.bawang_merah.toString(),
            bawang_putih: item.bawang_putih.toString(),
            bawang_bombay: item.bawang_bombay.toString(),
            minyak_goreng_medium: item.minyak_goreng_medium.toString(),
            minyak_goreng_premium: item.minyak_goreng_premium.toString(),
            gula_pasir: item.gula_pasir.toString(),
            kacang_tanah: item.kacang_tanah.toString(),
            kentang: item.kentang.toString(),
            wortel: item.wortel.toString(),
            tomat: item.tomat.toString(),
            beras_medium: item.beras_medium.toString(),
            beras_premium: item.beras_premium.toString(),
        });
        setMode('edit');
        setEditTarget(item);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post('/admin/harga-bahan-pokok', {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Harga bahan pokok berhasil ditambahkan'); },
            });
        } else if (editTarget) {
            put(`/admin/harga-bahan-pokok/${editTarget.id}`, {
                onSuccess: () => { setIsOpen(false); reset(); toast.success('Harga bahan pokok berhasil diperbarui'); },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/harga-bahan-pokok/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); toast.success('Harga bahan pokok berhasil dihapus'); },
        });
    };

    // Prepare chart data chronologically
    const chartData = hargaBahanPokoks.map(item => ({
        name: formatIndonesianDate(item.tanggal).split(' ').slice(0, 2).join(' '), // e.g. "23 Mei"
        price: item[selectedCommodity as keyof HargaBahanPokok] as number,
    }));

    const activeCommodity = commodities.find(c => c.key === selectedCommodity);

    return (
        <>
            <Head title="Harga Bahan Pokok Bulungan" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Harga Bahan Pokok</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola, pantau, dan analisis fluktuasi harga komoditas pangan pokok Kabupaten Bulungan</p>
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
                                <table className="w-full text-xs text-left min-w-[1800px]">
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
                                        {hargaBahanPokoks.length === 0 ? (
                                            <tr>
                                                <td colSpan={22} className="px-4 py-16 text-center text-sm text-muted-foreground">
                                                    <Calendar className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                                    <p>Belum ada data pencatatan harga pangan pokok</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            // Render latest dates on top in the table for quick reading
                                            [...hargaBahanPokoks].reverse().map((item) => (
                                                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3 sticky left-0 bg-card z-10 font-bold border-r shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                                            {formatIndonesianDate(item.tanggal)}
                                                        </span>
                                                    </td>
                                                    {commodities.map((c) => (
                                                        <td key={c.key} className="px-4 py-3 text-center font-medium font-mono">
                                                            {formatRupiah(item[c.key as keyof HargaBahanPokok] as number)}
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
                                        Pilih komoditas di bawah ini untuk melihat kurva kenaikan atau penurunan harga bahan pokok per minggu secara kronologis.
                                    </p>
                                    <div className="space-y-1.5 pt-2">
                                        <Label>Pilih Komoditas Pangan</Label>
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

                                    {hargaBahanPokoks.length < 2 ? (
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
                        <DialogTitle>{mode === 'create' ? 'Catat Harga Bahan Pokok Baru' : 'Edit Catatan Harga Pokok'}</DialogTitle>
                        <DialogDescription>Masukkan harga bahan pokok dalam angka penuh tanpa koma/titik (Contoh: 145000).</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5 pb-3 border-b flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="tanggal" className="text-sm font-semibold flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-primary" /> Tanggal Pencatatan <span className="text-destructive">*</span>
                                </Label>
                                <p className="text-[10px] text-muted-foreground">Pilih tanggal dilakukannya survei harga bahan pokok.</p>
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

                        {/* SEKTOR: DAGING & TELUR */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-1 border-b">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground">Sektor Daging, Ayam & Telur</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="daging_sapi">Daging Sapi (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="daging_sapi" type="number" min="0" value={data.daging_sapi} onChange={e => setData('daging_sapi', e.target.value)} required placeholder="Contoh: 145000" />
                                    {errors.daging_sapi && <p className="text-xs text-destructive">{errors.daging_sapi}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="telur">Telur Ayam (1 Piring) <span className="text-destructive">*</span></Label>
                                    <Input id="telur" type="number" min="0" value={data.telur} onChange={e => setData('telur', e.target.value)} required placeholder="Contoh: 55000" />
                                    {errors.telur && <p className="text-xs text-destructive">{errors.telur}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ayam_potong">Ayam Potong Broiler (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ayam_potong" type="number" min="0" value={data.ayam_potong} onChange={e => setData('ayam_potong', e.target.value)} required placeholder="Contoh: 38000" />
                                    {errors.ayam_potong && <p className="text-xs text-destructive">{errors.ayam_potong}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ayam_kampung">Ayam Kampung (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="ayam_kampung" type="number" min="0" value={data.ayam_kampung} onChange={e => setData('ayam_kampung', e.target.value)} required placeholder="Contoh: 65000" />
                                    {errors.ayam_kampung && <p className="text-xs text-destructive">{errors.ayam_kampung}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SEKTOR: CABE & BAWANG */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-1 border-b">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground">Sektor Cabe & Bawang-Bawangan</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="cabe_rawit_merah">Cabe Rawit Merah (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="cabe_rawit_merah" type="number" min="0" value={data.cabe_rawit_merah} onChange={e => setData('cabe_rawit_merah', e.target.value)} required placeholder="Contoh: 75000" />
                                    {errors.cabe_rawit_merah && <p className="text-xs text-destructive">{errors.cabe_rawit_merah}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="cabe_rawit_hijau">Cabe Rawit Hijau (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="cabe_rawit_hijau" type="number" min="0" value={data.cabe_rawit_hijau} onChange={e => setData('cabe_rawit_hijau', e.target.value)} required placeholder="Contoh: 50000" />
                                    {errors.cabe_rawit_hijau && <p className="text-xs text-destructive">{errors.cabe_rawit_hijau}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="cabe_keriting">Cabe Keriting (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="cabe_keriting" type="number" min="0" value={data.cabe_keriting} onChange={e => setData('cabe_keriting', e.target.value)} required placeholder="Contoh: 48000" />
                                    {errors.cabe_keriting && <p className="text-xs text-destructive">{errors.cabe_keriting}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="cabe_merah_besar">Cabe Merah Besar (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="cabe_merah_besar" type="number" min="0" value={data.cabe_merah_besar} onChange={e => setData('cabe_merah_besar', e.target.value)} required placeholder="Contoh: 45000" />
                                    {errors.cabe_merah_besar && <p className="text-xs text-destructive">{errors.cabe_merah_besar}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="bawang_merah">Bawang Merah (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="bawang_merah" type="number" min="0" value={data.bawang_merah} onChange={e => setData('bawang_merah', e.target.value)} required placeholder="Contoh: 35000" />
                                    {errors.bawang_merah && <p className="text-xs text-destructive">{errors.bawang_merah}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="bawang_putih">Bawang Putih (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="bawang_putih" type="number" min="0" value={data.bawang_putih} onChange={e => setData('bawang_putih', e.target.value)} required placeholder="Contoh: 38000" />
                                    {errors.bawang_putih && <p className="text-xs text-destructive">{errors.bawang_putih}</p>}
                                </div>
                                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                    <Label htmlFor="bawang_bombay">Bawang Bombay (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="bawang_bombay" type="number" min="0" value={data.bawang_bombay} onChange={e => setData('bawang_bombay', e.target.value)} required placeholder="Contoh: 42000" />
                                    {errors.bawang_bombay && <p className="text-xs text-destructive">{errors.bawang_bombay}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SEKTOR: BERAS & SEMBAKO */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-1 border-b">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground">Sektor Beras & Sembako</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="beras_medium">Beras Medium (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="beras_medium" type="number" min="0" value={data.beras_medium} onChange={e => setData('beras_medium', e.target.value)} required placeholder="Contoh: 13500" />
                                    {errors.beras_medium && <p className="text-xs text-destructive">{errors.beras_medium}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="beras_premium">Beras Premium (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="beras_premium" type="number" min="0" value={data.beras_premium} onChange={e => setData('beras_premium', e.target.value)} required placeholder="Contoh: 16000" />
                                    {errors.beras_premium && <p className="text-xs text-destructive">{errors.beras_premium}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="gula_pasir">Gula Pasir (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="gula_pasir" type="number" min="0" value={data.gula_pasir} onChange={e => setData('gula_pasir', e.target.value)} required placeholder="Contoh: 17500" />
                                    {errors.gula_pasir && <p className="text-xs text-destructive">{errors.gula_pasir}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="minyak_goreng_medium">Minyak Goreng Medium (1 L) <span className="text-destructive">*</span></Label>
                                    <Input id="minyak_goreng_medium" type="number" min="0" value={data.minyak_goreng_medium} onChange={e => setData('minyak_goreng_medium', e.target.value)} required placeholder="Contoh: 16500" />
                                    {errors.minyak_goreng_medium && <p className="text-xs text-destructive">{errors.minyak_goreng_medium}</p>}
                                </div>
                                <div className="space-y-1.5 col-span-2 sm:col-span-2">
                                    <Label htmlFor="minyak_goreng_premium">Minyak Goreng Premium (1 L) <span className="text-destructive">*</span></Label>
                                    <Input id="minyak_goreng_premium" type="number" min="0" value={data.minyak_goreng_premium} onChange={e => setData('minyak_goreng_premium', e.target.value)} required placeholder="Contoh: 21000" />
                                    {errors.minyak_goreng_premium && <p className="text-xs text-destructive">{errors.minyak_goreng_premium}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SEKTOR: SAYUR & KACANG */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-1 border-b">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground">Sektor Sayur, Tomat & Kacang-Kacangan</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="kacang_tanah">Kacang Tanah (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="kacang_tanah" type="number" min="0" value={data.kacang_tanah} onChange={e => setData('kacang_tanah', e.target.value)} required placeholder="Contoh: 28000" />
                                    {errors.kacang_tanah && <p className="text-xs text-destructive">{errors.kacang_tanah}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="kentang">Kentang (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="kentang" type="number" min="0" value={data.kentang} onChange={e => setData('kentang', e.target.value)} required placeholder="Contoh: 22000" />
                                    {errors.kentang && <p className="text-xs text-destructive">{errors.kentang}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="wortel">Wortel (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="wortel" type="number" min="0" value={data.wortel} onChange={e => setData('wortel', e.target.value)} required placeholder="Contoh: 18000" />
                                    {errors.wortel && <p className="text-xs text-destructive">{errors.wortel}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="tomat">Tomat (1 Kg) <span className="text-destructive">*</span></Label>
                                    <Input id="tomat" type="number" min="0" value={data.tomat} onChange={e => setData('tomat', e.target.value)} required placeholder="Contoh: 16000" />
                                    {errors.tomat && <p className="text-xs text-destructive">{errors.tomat}</p>}
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
                            Hapus Catatan Harga Pangan
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus catatan harga tanggal <strong className="text-foreground">{formatIndonesianDate(deleteTarget?.tanggal || '')}</strong>? Tindakan ini tidak dapat dibatalkan.
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

HargaBahanPokokIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
