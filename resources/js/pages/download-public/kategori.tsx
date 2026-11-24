import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    MapPin, Phone, Mail, ChevronLeft, X, 
    Facebook, Instagram, AlertCircle, Clock, Calendar, Globe,
    FileDown, FolderDown, Building, Search, Eye, Download as DownloadIcon,
    FileText, FileSpreadsheet, FileImage, FileArchive, File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Menu {
    id: number;
    nama: string;
    tipe: string;
    url: string;
    parent_id: number | null;
    urutan: number;
    target: string;
    children?: Menu[];
}

interface DataDasar {
    id: number;
    tahun: number;
    url_facebook?: string;
    url_instagram?: string;
    url_tiktok?: string;
}

interface Agenda {
    id: number;
    nama_kegiatan: string;
    tanggal: string;
    jam?: string;
    lokasi: string;
}

interface KategoriDownload {
    id: number;
    nama: string;
    slug: string;
    ikon?: string;
    deskripsi?: string;
}

interface Download {
    id: number;
    kategori_download_id: number;
    judul: string;
    slug: string;
    deskripsi?: string;
    file: string;
    nama_file_asli: string;
    tipe_file: string;
    ukuran_file: number;
    sampul?: string;
    status: string;
    jumlah_unduhan: number;
    urutan: number;
    file_url?: string;
    sampul_url?: string;
    ukuran_format: string;
    kategori_download?: KategoriDownload;
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
    kategori: KategoriDownload;
    menus: Menu[];
    dataDasar: DataDasar | null;
    agendas: Agenda[];
    latestDownloads: Download[];
    downloads: PaginatedData<Download>;
    categories: KategoriDownload[];
}

function FileIcon({ tipe, className }: { tipe: string | null; className?: string }) {
    const t = tipe?.toLowerCase() ?? '';
    if (['pdf'].includes(t)) return <FileText className={cn('text-red-500', className)} />;
    if (['doc', 'docx'].includes(t)) return <FileText className={cn('text-blue-500', className)} />;
    if (['xls', 'xlsx'].includes(t)) return <FileSpreadsheet className={cn('text-green-500', className)} />;
    if (['ppt', 'pptx'].includes(t)) return <FileText className={cn('text-orange-500', className)} />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(t)) return <FileImage className={cn('text-purple-500', className)} />;
    if (['zip', 'rar'].includes(t)) return <FileArchive className={cn('text-amber-500', className)} />;
    return <File className={cn('text-slate-400', className)} />;
}

const TIPE_COLOR: Record<string, string> = {
    pdf: 'bg-red-50 text-red-700 border-red-200',
    doc: 'bg-blue-50 text-blue-700 border-blue-200',
    docx: 'bg-blue-50 text-blue-700 border-blue-200',
    xls: 'bg-green-50 text-green-700 border-green-200',
    xlsx: 'bg-green-50 text-green-700 border-green-200',
    ppt: 'bg-orange-50 text-orange-700 border-orange-200',
    pptx: 'bg-orange-50 text-orange-700 border-orange-200',
    zip: 'bg-amber-50 text-amber-700 border-amber-200',
    rar: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function DownloadKategoriPublic({ 
    kategori,
    menus = [], 
    dataDasar, 
    agendas = [], 
    latestDownloads = [], 
    downloads, 
    categories = [] 
}: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [maintenanceMenu, setMaintenanceMenu] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [previewDownload, setPreviewDownload] = useState<Download | null>(null);

    const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, menuName: string, url: string) => {
        const isHome = url === '/' || url === '';
        const isAdmin = url.startsWith('/admin') || url.startsWith('/login') || url.includes('login') || url.includes('admin');
        const isHalaman = url.startsWith('/halaman/');
        const isKategori = url.startsWith('/kategori/');
        const isDownload = url === '/download' || url.startsWith('/kategori-download/');
        const isOpd = url === '/opd' || url.startsWith('/opd');
        const isGallery = url === '/gallery' || url.startsWith('/gallery') || url.startsWith('/kategori-foto/');
        const isHash = url.startsWith('#');

        if (!isHome && !isAdmin && !isHalaman && !isKategori && !isDownload && !isOpd && !isGallery && !isHash) {
            e.preventDefault();
            setMaintenanceMenu(menuName);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setMaintenanceMenu(`Pencarian "${searchQuery.trim()}"`);
            setSearchQuery('');
        }
    };

    const formatIndonesianDate = (dateStr: any) => {
        if (!dateStr) return '';
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const parts = String(dateStr).split('T')[0].split(' ')[0].split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            if (month >= 0 && month < 12) {
                return `${day} ${months[month]} ${year}`;
            }
        }
        return String(dateStr);
    };

    return (
        <>
            <Head title={`Kategori Unduhan: ${kategori.nama} - Pemerintah Kabupaten Bulungan`} />

            <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
                
                {/* HEADER / NAVBAR */}
                <header className="sticky top-0 z-50 bg-[#0f2d59] text-white shadow-md border-b border-blue-900/40">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        {/* Logo & Site Title */}
                        <a href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
                            <img src="/logo-bulungan.png" alt="Logo Bulungan" className="h-11 w-auto object-contain" />
                            <div className="flex flex-col">
                                <span className="text-[11px] md:text-xs font-bold tracking-widest text-emerald-400 uppercase leading-none">Pemerintah</span>
                                <span className="text-sm md:text-base font-black tracking-wide uppercase leading-tight">Kabupaten Bulungan</span>
                                <span className="text-[9px] md:text-[10px] text-slate-300 font-medium leading-none">Provinsi Kalimantan Utara</span>
                            </div>
                        </a>

                        {/* Desktop Navigation & Search */}
                        <div className="hidden lg:flex items-center gap-4">
                            <nav className="flex items-center gap-1">
                                {menus.map((menu) => (
                                    <div key={menu.id} className="relative group">
                                        {menu.children && menu.children.length > 0 ? (
                                            <>
                                                <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase text-slate-100 hover:text-emerald-400 transition-colors">
                                                    {menu.nama}
                                                    <span className="text-[9px] opacity-60">▼</span>
                                                </button>
                                                <div className="absolute top-full left-0 hidden group-hover:block min-w-[200px] bg-white text-slate-800 shadow-xl rounded-b-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {menu.children.map((child) => (
                                                        <a
                                                            key={child.id}
                                                            href={child.url}
                                                            target={child.target || '_self'}
                                                            onClick={(e) => handleMenuClick(e, child.nama, child.url)}
                                                            className="block px-4 py-2.5 text-[13px] font-semibold hover:bg-blue-50 hover:text-blue-900 transition-colors border-l-2 border-transparent hover:border-blue-600"
                                                        >
                                                            {child.nama}
                                                        </a>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <a
                                                href={menu.url}
                                                target={menu.target || '_self'}
                                                onClick={(e) => handleMenuClick(e, menu.nama, menu.url)}
                                                className="px-4 py-2 text-xs font-bold uppercase text-slate-100 hover:text-emerald-400 transition-colors block"
                                            >
                                                {menu.nama}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Compact Search bar */}
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari..."
                                    className="w-32 xl:w-40 bg-slate-950/20 hover:bg-slate-950/40 focus:bg-white text-slate-100 focus:text-slate-800 placeholder-slate-400 focus:placeholder-slate-400 text-xs font-semibold px-3 py-1.5 pl-8 rounded-full border border-blue-900/30 focus:border-white focus:outline-none transition-all duration-300"
                                />
                                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </form>
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-slate-200 hover:text-white rounded-md focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation Drawer */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden bg-[#0d2345] border-t border-blue-900/60 py-3 px-4 animate-in slide-in-from-top duration-300">
                            <div className="flex flex-col gap-1.5">
                                {menus.map((menu) => (
                                    <div key={menu.id} className="flex flex-col">
                                        <span className="px-3 py-2 text-xs font-bold uppercase text-emerald-400 border-b border-blue-950/20">{menu.nama}</span>
                                        {menu.children && menu.children.length > 0 ? (
                                            <div className="pl-4 flex flex-col gap-1 py-1">
                                                {menu.children.map((child) => (
                                                    <a
                                                        key={child.id}
                                                        href={child.url}
                                                        target={child.target || '_self'}
                                                        onClick={(e) => handleMenuClick(e, child.nama, child.url)}
                                                        className="px-3 py-1.5 text-xs text-slate-200 hover:text-white hover:bg-blue-900/40 rounded transition-colors"
                                                    >
                                                        {child.nama}
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <a
                                                href={menu.url}
                                                target={menu.target || '_self'}
                                                onClick={(e) => handleMenuClick(e, menu.nama, menu.url)}
                                                className="px-3 py-1.5 text-xs text-slate-200 hover:text-white hover:bg-blue-900/40 rounded transition-colors"
                                            >
                                                {menu.nama}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </header>

                {/* MAIN CONTENT AREA */}
                <main className="flex-grow py-6 md:py-8">
                    <div className="container mx-auto px-4 max-w-6xl">
                        
                        {/* Back button */}
                        <div className="mb-4">
                            <a 
                                href="/download"
                                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
                            >
                                <ChevronLeft className="h-4 w-4" /> Kembali ke Pusat Unduhan
                            </a>
                        </div>

                        {/* Beautiful Header */}
                        <div className="rounded-2xl h-[120px] md:h-[160px] w-full bg-gradient-to-r from-blue-900 to-indigo-950 flex flex-col justify-center px-8 border border-slate-800 shadow-md relative overflow-hidden mb-6">
                            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-xl"></div>
                            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase leading-none mb-1">Kategori Unduhan Daerah</span>
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide leading-tight">Kategori: {kategori.nama}</h2>
                            {kategori.deskripsi && (
                                <p className="text-[10px] md:text-xs text-slate-300 font-semibold mt-1">
                                    {kategori.deskripsi}
                                </p>
                            )}
                        </div>

                        {/* 2-Column Responsive Grid */}
                        <div className="grid gap-8 lg:grid-cols-3">
                            
                            {/* Column 1 & 2: Konten Utama (Left Side, lg:col-span-2) */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Category filter tags bar */}
                                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
                                        Pilih Kategori Unduhan:
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href="/download"
                                            className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all tracking-wider border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600"
                                        >
                                            Semua Berkas
                                        </Link>
                                        {categories.map((cat) => {
                                            const isActive = cat.id === kategori.id;
                                            return (
                                                <Link
                                                    key={cat.id}
                                                    href={`/kategori-download/${cat.slug}`}
                                                    className={cn(
                                                        "px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all tracking-wider border",
                                                        isActive 
                                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20" 
                                                            : "border-slate-200 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600"
                                                    )}
                                                >
                                                    {cat.nama}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Header showing totals */}
                                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                                    <span>Menampilkan Berkas Kategori: <span className="text-blue-600 font-black">{kategori.nama}</span></span>
                                    <span>Total: {downloads.total} Berkas</span>
                                </div>

                                {/* Download items (max 10 items list) */}
                                {downloads.data.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm text-slate-400 font-semibold text-xs">
                                        <FolderDown className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                                        Belum ada berkas unduhan yang terbit pada kategori ini.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {downloads.data.map((doc) => (
                                            <div 
                                                key={doc.id}
                                                className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow transition-all duration-300 flex flex-col md:flex-row gap-4 items-start justify-between group"
                                            >
                                                {/* Left section: Icon / cover and details */}
                                                <div className="flex gap-4 items-start min-w-0 flex-1">
                                                    {doc.sampul_url ? (
                                                        <img 
                                                            src={doc.sampul_url} 
                                                            alt="" 
                                                            className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-xl object-cover border border-slate-100 shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shadow-inner">
                                                            <FileIcon tipe={doc.tipe_file} className="h-7 w-7" />
                                                        </div>
                                                    )}

                                                    <div className="space-y-1.5 min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            <span className={cn(
                                                                'inline-flex items-center rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider',
                                                                TIPE_COLOR[doc.tipe_file] ?? 'bg-slate-50 text-slate-600 border-slate-200'
                                                            )}>
                                                                {doc.tipe_file || 'PDF'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-bold font-mono">
                                                                {doc.ukuran_format || '0 B'}
                                                            </span>
                                                            <span className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                                                                {kategori.nama}
                                                            </span>
                                                        </div>

                                                        <h4 className="font-extrabold text-sm md:text-base text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-wide leading-snug line-clamp-2">
                                                            {doc.judul}
                                                        </h4>
                                                        
                                                        {doc.deskripsi && (
                                                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                                                                {doc.deskripsi}
                                                            </p>
                                                        )}

                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3.5 w-3.5 text-slate-300" />
                                                                Unggah: {formatIndonesianDate(doc.created_at)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <FileDown className="h-3.5 w-3.5 text-slate-300" />
                                                                Diunduh: {doc.jumlah_unduhan.toLocaleString('id-ID')} Kali
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right section: Action Buttons */}
                                                <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 border-t border-slate-50 md:border-t-0 pt-3.5 md:pt-0">
                                                    <a 
                                                        href={`/unduh/${doc.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 border border-blue-600"
                                                    >
                                                        <FileDown className="h-4 w-4" /> Download
                                                    </a>
                                                    {doc.tipe_file === 'pdf' && (
                                                        <button 
                                                            onClick={() => setPreviewDownload(doc)}
                                                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-xs font-black uppercase tracking-wider transition-all border border-slate-200 shadow-sm"
                                                        >
                                                            <Eye className="h-4 w-4" /> Preview
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination structure */}
                                {downloads.last_page > 1 && (
                                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <span className="text-xs font-semibold text-slate-400">
                                            Menampilkan {downloads.from}–{downloads.to} dari {downloads.total} file
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {downloads.links.map((link, i) => (
                                                <Button
                                                    key={i}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    className={cn(
                                                        'text-xs font-bold rounded-lg',
                                                        link.active ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-600 border-slate-200'
                                                    )}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Column 3: Sidebar (Right Side, lg:col-span-1) */}
                            <div className="space-y-6 lg:border-l lg:border-slate-200 lg:pl-6">
                                
                                {/* Widget 1: Agenda Kegiatan */}
                                <div className="space-y-4">
                                    <h3 className="font-extrabold text-sm uppercase tracking-widest text-slate-800 border-l-2 border-blue-500 pl-3 flex items-center gap-1.5">
                                        <Calendar className="h-4.5 w-4.5 text-blue-500" />
                                        Agenda Terdekat
                                    </h3>
                                    
                                    {agendas.length === 0 ? (
                                        <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-slate-400 shadow-sm text-xs font-semibold">
                                            Tidak ada agenda terdekat.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {agendas.slice(0, 3).map((ag) => (
                                                <div 
                                                    key={ag.id} 
                                                    className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm hover:shadow transition-all flex flex-col gap-1.5 border-l-4 border-l-blue-600"
                                                >
                                                    <h4 className="font-bold text-[10px] text-slate-800 tracking-wide leading-relaxed uppercase line-clamp-2">
                                                        {ag.nama_kegiatan}
                                                    </h4>
                                                    <div className="flex flex-col gap-1 text-[8px] text-slate-500 font-semibold mt-0.5">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3 text-blue-500" />
                                                            {formatIndonesianDate(ag.tanggal)}
                                                        </span>
                                                        {ag.jam && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3 text-blue-500" />
                                                                {ag.jam}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1 text-slate-400">
                                                            <MapPin className="h-3 w-3 text-red-400" />
                                                            {ag.lokasi}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Widget 2: 5 Berkas Unduhan Terakhir */}
                                <div className="space-y-4 pt-4 border-t border-slate-200">
                                    <h3 className="font-extrabold text-sm uppercase tracking-widest text-slate-800 border-l-2 border-emerald-500 pl-3 flex items-center gap-1.5">
                                        <FileDown className="h-4.5 w-4.5 text-emerald-500" />
                                        Unduhan Terkini
                                    </h3>
                                    
                                    {latestDownloads.length === 0 ? (
                                        <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-slate-400 shadow-sm text-xs font-semibold">
                                            Belum ada file dokumen.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {latestDownloads.map((doc) => (
                                                <div 
                                                    key={doc.id}
                                                    className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow transition-all flex items-center justify-between gap-3 group"
                                                >
                                                    <div className="space-y-1 min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-amber-100 text-amber-800 tracking-wider">
                                                                {doc.tipe_file || 'PDF'}
                                                            </span>
                                                            <span className="text-[8px] text-slate-400 font-bold font-mono">
                                                                {doc.ukuran_format || '0 B'}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-bold text-[10px] text-slate-700 truncate group-hover:text-blue-600 transition-colors uppercase tracking-wide">
                                                            {doc.judul}
                                                        </h4>
                                                    </div>

                                                    <a 
                                                        href={`/unduh/${doc.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="h-7 w-7 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all shrink-0 border border-blue-100 hover:border-blue-600 shadow-sm active:scale-95"
                                                    >
                                                        <FileDown className="h-3.5 w-3.5" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </main>

                {/* FOOTER */}
                <footer className="bg-[#0b192e] text-slate-300 border-t-4 border-emerald-500 pt-10 pb-6">
                    <div className="container mx-auto px-4 max-w-6xl grid gap-10 md:grid-cols-3 border-b border-slate-800 pb-12 mb-8">
                        
                        {/* ADDRESS & INFO */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <img src="/logo-bulungan.png" alt="Logo Bulungan" className="h-12 w-auto object-contain" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest leading-none">Pemerintah</span>
                                    <span className="text-base font-black text-white uppercase tracking-wide mt-0.5">Kabupaten Bulungan</span>
                                </div>
                            </div>

                            <p className="text-xs font-semibold leading-relaxed tracking-wide text-slate-400">
                                Portal Layanan Informasi Publik Terpadu Pemerintah Kabupaten Bulungan, Provinsi Kalimantan Utara.
                            </p>

                            <div className="space-y-3.5 text-xs font-medium text-slate-300">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Jl. Jelarai Raya, Kota Tanjung Selor, Kabupaten Bulungan, Kalimantan Utara</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-emerald-400 shrink-0" />
                                    <span>(0552) 21008</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-emerald-400 shrink-0" />
                                    <span>pemkab@bulungan.go.id</span>
                                </div>
                            </div>
                        </div>

                        {/* NAVIGATION MENU UTAMA */}
                        <div className="space-y-6 md:pl-6">
                            <h3 className="font-extrabold text-sm uppercase tracking-widest text-white border-l-2 border-emerald-500 pl-3">
                                Navigasi Situs
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-semibold">
                                {menus.map((menu) => (
                                    <a 
                                        key={menu.id} 
                                        href={menu.url}
                                        onClick={(e) => handleMenuClick(e, menu.nama, menu.url)}
                                        className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                                    >
                                        <span className="text-[9px] text-emerald-400">▶</span>
                                        {menu.nama}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* SOCIAL MEDIA LINKS */}
                        <div className="space-y-6">
                            <h3 className="font-extrabold text-sm uppercase tracking-widest text-white border-l-2 border-emerald-500 pl-3">
                                Media Sosial Resmi
                            </h3>

                            <p className="text-xs font-semibold leading-relaxed text-slate-400">
                                Ikuti terus publikasi berita resmi dan pembaruan kegiatan daerah melalui kanal media sosial resmi kami.
                            </p>

                            <div className="flex flex-col gap-3">
                                {dataDasar?.url_facebook && (
                                    <a 
                                        href={dataDasar.url_facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-xs font-bold uppercase transition-all tracking-wider text-slate-200 hover:text-white"
                                    >
                                        <Facebook className="h-4.5 w-4.5" />
                                        Facebook Page
                                    </a>
                                )}
                                {dataDasar?.url_instagram && (
                                    <a 
                                        href={dataDasar.url_instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-pink-600 hover:border-pink-600 text-xs font-bold uppercase transition-all tracking-wider text-slate-200 hover:text-white"
                                    >
                                        <Instagram className="h-4.5 w-4.5" />
                                        Instagram Feed
                                    </a>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 text-center md:text-left">
                        <p>© {new Date().getFullYear()} Pemerintah Kabupaten Bulungan. Semua Hak Dilindungi.</p>
                        <p>Didukung oleh Laravel, React & Inertia.js</p>
                    </div>
                </footer>

                {/* MODAL: GENERAL MAINTENANCE NOTIFICATION FOR 404 LINKS */}
                {maintenanceMenu && (
                    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
                        <div className="relative w-full max-w-md bg-white rounded-2xl p-6 border shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center text-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 shrink-0">
                                <AlertCircle className="h-9 w-9 animate-bounce animate-duration-1000" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-extrabold text-lg text-slate-800 uppercase tracking-wide">Informasi Layanan</h3>
                                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                    Halaman Informasi <span className="font-black text-blue-600">{maintenanceMenu}</span> sedang dalam tahap pemeliharaan/pengembangan oleh DKIP Bulungan.
                                </p>
                            </div>

                            <button 
                                onClick={() => setMaintenanceMenu(null)}
                                className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase rounded-xl active:scale-95 transition-all shadow-md mt-2"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                {/* PDF Preview Dialog */}
                <Dialog open={!!previewDownload} onOpenChange={(open) => !open && setPreviewDownload(null)}>
                    <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-4">
                        <DialogHeader>
                            <DialogTitle className="line-clamp-1 text-slate-800 font-black uppercase text-sm md:text-base border-b pb-2">
                                Preview PDF: {previewDownload?.judul}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 w-full bg-[#f1f5f9] rounded-xl overflow-hidden mt-2 relative border shadow-inner">
                            {previewDownload && (
                                <iframe 
                                    src={`/preview/${previewDownload.id}`} 
                                    className="w-full h-full border-0 absolute inset-0" 
                                    title="PDF Preview"
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </>
    );
}
