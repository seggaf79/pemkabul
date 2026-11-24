import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    MapPin, Phone, Mail, ChevronLeft, X, 
    Facebook, Instagram, AlertCircle, Clock, Calendar, Globe,
    FileDown, Building, Search, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface Download {
    id: number;
    judul: string;
    tipe_file: string;
    ukuran_format: string;
    file_url?: string;
    jumlah_unduhan: number;
}

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
    menus: Menu[];
    dataDasar: DataDasar | null;
    agendas?: Agenda[];
    downloads?: Download[];
    opds: PaginatedData<Opd>;
    filters: { search?: string };
}

export default function OpdPublicIndex({ 
    menus = [], 
    dataDasar, 
    agendas = [], 
    downloads = [], 
    opds,
    filters
}: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [maintenanceMenu, setMaintenanceMenu] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

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
        router.get('/opd', { search: searchQuery }, { preserveState: true });
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
            <Head title="Daftar Organisasi Perangkat Daerah (OPD) - Pemerintah Kabupaten Bulungan" />

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

                            {/* Navbar Search */}
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari OPD..."
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
                                href="/"
                                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
                            >
                                <ChevronLeft className="h-4 w-4" /> Kembali ke Beranda
                            </a>
                        </div>

                        {/* 2-Column Responsive Grid */}
                        <div className="grid gap-8 lg:grid-cols-3">
                            
                            {/* Column 1 & 2: Konten Utama (Left Side, lg:col-span-2) */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* Hero banner with deep blue gradient */}
                                <div className="rounded-2xl h-[180px] md:h-[200px] w-full bg-gradient-to-r from-[#0f2d59] to-[#1e4b8f] flex flex-col justify-center px-8 border border-slate-800 shadow-md relative overflow-hidden">
                                    <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-xl"></div>
                                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase leading-none mb-1">Daftar Resmi</span>
                                    <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight">Organisasi Perangkat Daerah (OPD)</h1>
                                    <p className="text-[11px] md:text-xs text-slate-300 font-semibold mt-2 max-w-lg leading-relaxed">
                                        Instansi, Dinas, Badan, dan Kantor di lingkungan Pemerintah Kabupaten Bulungan.
                                    </p>
                                </div>

                                {/* Dynamic Search & Filter Bar */}
                                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                                    <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
                                        <input 
                                            type="text" 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari nama OPD atau nama kepala dinas..."
                                            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 text-xs font-semibold px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none transition-all"
                                        />
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </form>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                                        Total: {opds.total} Instansi
                                    </div>
                                </div>

                                {/* OPD Cards Grid (Max 10 per page, paginated) */}
                                {opds.data.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm text-slate-400 font-semibold text-xs">
                                        Belum ada data OPD yang ditemukan.
                                    </div>
                                ) : (
                                    <div className="grid gap-5 md:grid-cols-2">
                                        {opds.data.map((opd) => {
                                            const hasPhoto = !!opd.foto_kantor;
                                            
                                            return (
                                                <Link 
                                                    key={opd.id}
                                                    href={`/opd/${opd.slug}`}
                                                    className="bg-white rounded-2xl border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                                                >
                                                    {/* 1. FOTO KANTOR (At the top, ratio aspect-[16/10] object-cover with dark overlay) */}
                                                    {hasPhoto ? (
                                                        <div className="w-full aspect-[16/10] overflow-hidden bg-slate-900 relative">
                                                            <img 
                                                                src={opd.foto_kantor_url!} 
                                                                alt={opd.nama} 
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full aspect-[16/10] bg-gradient-to-br from-blue-900 to-indigo-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group-hover:opacity-95 transition-opacity shrink-0">
                                                            <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-xl"></div>
                                                            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-xl"></div>
                                                            <Building className="h-10 w-10 text-emerald-400/90 mb-2 stroke-[1.5]" />
                                                            <span className="text-[8px] font-black tracking-widest text-emerald-400 uppercase">Kantor Pemerintah</span>
                                                            <span className="text-[10px] text-slate-300 font-bold max-w-[200px] mt-1 line-clamp-2 uppercase leading-tight">{opd.nama}</span>
                                                        </div>
                                                    )}

                                                    {/* Content Box */}
                                                    <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                                                        {/* Top Text Info */}
                                                        <div className="space-y-3.5">
                                                            {/* 2. NAMA OPD (Capitalized, bold blue navy text) */}
                                                            <h2 className="font-extrabold text-sm text-[#0f2d59] leading-snug uppercase tracking-wide group-hover:text-blue-700 transition-colors">
                                                                {opd.nama}
                                                            </h2>

                                                            {/* 3. NAMA KEPALA OPD (Rendered in a specific badge/badge-like section) */}
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-100 text-[10px] text-blue-800 font-bold uppercase tracking-wider">
                                                                <User className="h-3 w-3 text-blue-500 shrink-0" />
                                                                <span>Kepala: {opd.nama_kepala || 'Belum Ditetapkan'}</span>
                                                            </div>
                                                        </div>

                                                        {/* Bottom Info */}
                                                        {/* 4. ALAMAT KANTOR (Accompanied by a soft red MapPin icon) */}
                                                        <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[10px] text-slate-500 font-semibold leading-relaxed tracking-wide">
                                                            <MapPin className="h-4 w-4 text-red-500/90 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{opd.alamat || 'Alamat kantor tidak tersedia'}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Pagination Structure */}
                                {opds.last_page > 1 && (
                                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <span className="text-xs font-semibold text-slate-400">
                                            Menampilkan {opds.from}–{opds.to} dari {opds.total} OPD Daerah
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {opds.links.map((link, i) => (
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
                                    
                                    {downloads.length === 0 ? (
                                        <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-slate-400 shadow-sm text-xs font-semibold">
                                            Belum ada file dokumen.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {downloads.map((doc) => (
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

            </div>
        </>
    );
}
