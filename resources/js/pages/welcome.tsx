import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    MapPin, Phone, Mail, Users, Building, Layers, 
    Calendar, Video as VideoIcon, Play, ChevronLeft, ChevronRight, 
    X, Image as ImageIcon, Sparkles, TrendingUp, DollarSign, Fish, 
    Activity, Heart, Globe, Facebook, Instagram, AlertCircle, Clock,
    FileDown, FolderDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface Slider {
    id: number;
    judul: string;
    sub_judul?: string;
    gambar: string;
    urutan: number;
}

interface DataDasar {
    id: number;
    tahun: number;
    luas_wilayah: string;
    jumlah_kecamatan: string;
    jumlah_desa: string;
    jumlah_puskesmas: string;
    jumlah_penduduk: string;
    ipm: string;
    umk: string;
    url_facebook?: string;
    url_instagram?: string;
    url_tiktok?: string;
}

interface Video {
    id: number;
    kategori_video_id: number;
    judul: string;
    youtube_url: string;
    youtube_id: string;
    deskripsi?: string;
    waktu_publish: string;
    urutan: number;
    status: string;
}

interface Agenda {
    id: number;
    nama_kegiatan: string;
    tanggal: string;
    jam?: string;
    lokasi: string;
}

interface Foto {
    id: number;
    kategori_foto_id: number;
    foto: string;
    foto_url: string;
    deskripsi: string;
    lokasi?: string;
    status: string;
}

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
}

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
}

interface GraphChart {
    id: number;
    nama: string;
    tipe: 'bar' | 'line' | 'pie' | 'area';
    data: {
        seriesKeys: string[];
        items: any[];
    };
    keterangan?: string;
}

interface LinkWebsite {
    id: number;
    nama: string;
    url: string;
    logo: string;
    logo_url: string;
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
}

interface Props {
    menus: Menu[];
    sliders: Slider[];
    dataDasar: DataDasar | null;
    videos: Video[];
    agendas: Agenda[];
    fotos: Foto[];
    hargaBahanPokoks: HargaBahanPokok[];
    hargaIkans: HargaIkan[];
    graphCharts: GraphChart[];
    links: LinkWebsite[];
    downloads: Download[];
}

export default function Welcome({
    menus = [],
    sliders = [],
    dataDasar,
    videos = [],
    agendas = [],
    fotos = [],
    hargaBahanPokoks = [],
    hargaIkans = [],
    graphCharts = [],
    links = [],
    downloads = []
}: Props) {
    // 1. Slider State
    const [currentSlide, setCurrentSlide] = useState(0);

    // 2. Video Player Modal State
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

    // 3. Agenda Pagination State
    const [agendaPage, setAgendaPage] = useState(1);
    const agendasPerPage = 3; // Change to 3 per page

    // 4. Photo Gallery State (Carousel 4 at a time, total 10)
    const [photoIndex, setPhotoIndex] = useState(0);
    const [activePhoto, setActivePhoto] = useState<Foto | null>(null);

    // 5. Commodity & Fish Widgets State
    const [activePanganTab, setActivePanganTab] = useState<'tabel' | 'grafik'>('tabel');
    const [activeIkanTab, setActiveIkanTab] = useState<'tabel' | 'grafik'>('tabel');
    const [selectedPanganCommodity, setSelectedPanganCommodity] = useState<string>('daging_sapi');
    const [selectedIkanCommodity, setSelectedIkanCommodity] = useState<string>('ikan_tongkol');

    // 6. Custom Charts Carousel State
    const [chartCarouselIndex, setChartCarouselIndex] = useState(0);

    // 7. Regional Links Carousel State
    const [linkCarouselIndex, setLinkCarouselIndex] = useState(0);

    // 8. Mobile Menu State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 9. Download Carousel State
    const [downloadCarouselIndex, setDownloadCarouselIndex] = useState(0);

    // 10. Maintenance Modal State
    const [maintenanceMenu, setMaintenanceMenu] = useState<string | null>(null);

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

    // 11. Search Bar State & Submit handler
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setMaintenanceMenu(`Pencarian "${searchQuery.trim()}"`);
            setSearchQuery('');
        }
    };

    // Auto-slide effect for banner
    useEffect(() => {
        if (sliders.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliders.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [sliders]);

    // Smooth scroll hash on page load
    useEffect(() => {
        if (window.location.hash === '#download-section') {
            setTimeout(() => {
                const el = document.getElementById('download-section');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        }
    }, []);

    // Robust Date Formatter to prevent any JS serialization crashes
    const formatIndonesianDate = (dateStr: any) => {
        if (!dateStr) return '';
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const parts = String(dateStr).split(' ')[0].split('-');
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

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Calculate Agenda pagination
    const totalAgendaPages = Math.ceil(agendas.length / agendasPerPage);
    const paginatedAgendas = agendas.slice(
        (agendaPage - 1) * agendasPerPage,
        agendaPage * agendasPerPage
    );

    // Photo Carousel Left/Right triggers (shows 4 at a time, total 10)
    const nextPhotos = () => {
        if (fotos.length <= 4) return;
        setPhotoIndex((prev) => (prev + 1) % (fotos.length - 3));
    };
    const prevPhotos = () => {
        if (fotos.length <= 4) return;
        setPhotoIndex((prev) => (prev - 1 + (fotos.length - 3)) % (fotos.length - 3));
    };

    // Pangan Commodities list (All 20 items)
    const allPanganCommodities = [
        { key: 'daging_sapi', name: 'Daging Sapi (1 Kg)' },
        { key: 'ayam_potong', name: 'Ayam Potong (1 Kg)' },
        { key: 'ayam_kampung', name: 'Ayam Kampung (1 Kg)' },
        { key: 'telur', name: 'Telur (1 Piring)' },
        { key: 'cabe_rawit_merah', name: 'Cabe Rawit Merah (1 Kg)' },
        { key: 'cabe_rawit_hijau', name: 'Cabe Rawit Hijau (1 Kg)' },
        { key: 'cabe_keriting', name: 'Cabe Keriting (1 Kg)' },
        { key: 'cabe_merah_besar', name: 'Cabe Merah Besar (1 Kg)' },
        { key: 'bawang_merah', name: 'Bawang Merah (1 Kg)' },
        { key: 'bawang_putih', name: 'Bawang Putih (1 Kg)' },
        { key: 'bawang_bombay', name: 'Bawang Bombay (1 Kg)' },
        { key: 'minyak_goreng_medium', name: 'Minyak Goreng Medium (1 L)' },
        { key: 'minyak_goreng_premium', name: 'Minyak Goreng Premium (1 L)' },
        { key: 'gula_pasir', name: 'Gula Pasir (1 Kg)' },
        { key: 'kacang_tanah', name: 'Kacang Tanah (1 Kg)' },
        { key: 'kentang', name: 'Kentang (1 Kg)' },
        { key: 'wortel', name: 'Wortel (1 Kg)' },
        { key: 'tomat', name: 'Tomat (1 Kg)' },
        { key: 'beras_medium', name: 'Beras Medium (1 Kg)' },
        { key: 'beras_premium', name: 'Beras Premium (1 Kg)' }
    ];

    // Fish Commodities list (All 10 items)
    const allFishCommodities = [
        { key: 'ikan_tongkol', name: 'Ikan Tongkol (1 Kg)' },
        { key: 'ikan_bandeng_besar', name: 'Ikan Bandeng (1 Kg)' },
        { key: 'ikan_kembung', name: 'Ikan Kembung (1 Kg)' },
        { key: 'ikan_layang', name: 'Ikan Layang (1 Kg)' },
        { key: 'ikan_putih', name: 'Ikan Putih (1 Kg)' },
        { key: 'ikan_kakap_merah', name: 'Ikan Kakap Merah (1 Kg)' },
        { key: 'ikan_mas', name: 'Ikan Mas (1 Kg)' },
        { key: 'ikan_kakap_putih', name: 'Ikan Kakap Putih (1 Kg)' },
        { key: 'ikan_nila', name: 'Ikan Nila (1 Kg)' },
        { key: 'ikan_lele', name: 'Ikan Lele (1 Kg)' }
    ];

    // Regional links carousel slide
    const nextLinks = () => {
        if (links.length <= 3) return;
        setLinkCarouselIndex((prev) => (prev + 1) % (links.length - 2));
    };
    const prevLinks = () => {
        if (links.length <= 3) return;
        setLinkCarouselIndex((prev) => (prev - 1 + (links.length - 2)) % (links.length - 2));
    };

    // Download carousel slide
    const nextDownloads = () => {
        const remainingCount = downloads.slice(4).length;
        if (remainingCount <= 4) return;
        setDownloadCarouselIndex((prev) => (prev + 1) % (remainingCount - 3));
    };
    const prevDownloads = () => {
        const remainingCount = downloads.slice(4).length;
        if (remainingCount <= 4) return;
        setDownloadCarouselIndex((prev) => (prev - 1 + (remainingCount - 3)) % (remainingCount - 3));
    };

    // Custom charts carousel slide
    const nextCharts = () => {
        if (graphCharts.length <= 2) return;
        setChartCarouselIndex((prev) => (prev + 1) % (graphCharts.length - 1));
    };
    const prevCharts = () => {
        if (graphCharts.length <= 2) return;
        setChartCarouselIndex((prev) => (prev - 1 + (graphCharts.length - 1)) % (graphCharts.length - 1));
    };

    const latestPangan = hargaBahanPokoks.length > 0 ? hargaBahanPokoks[hargaBahanPokoks.length - 1] : null;
    const latestIkan = hargaIkans.length > 0 ? hargaIkans[hargaIkans.length - 1] : null;

    return (
        <>
            <Head title="Website Resmi Pemerintah Kabupaten Bulungan" />

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

                            {/* Clean, Compact Search bar */}
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari..."
                                    className="w-32 xl:w-40 bg-slate-950/20 hover:bg-slate-950/40 focus:bg-white text-slate-100 focus:text-slate-800 placeholder-slate-400 focus:placeholder-slate-400 text-xs font-semibold px-3 py-1.5 pl-8 rounded-full border border-blue-900/30 focus:border-white focus:outline-none transition-all duration-300"
                                />
                                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                <main className="flex-grow">

                    {/* BLOCK 1: DYNAMIC SLIDER (Height reduced to 75% of original, no overlay text) */}
                    <section className="relative w-full overflow-hidden bg-slate-900 shadow-lg border-b-4 border-emerald-500">
                        {sliders.length === 0 ? (
                            // Default Fallback Banner
                            <div className="relative w-full h-[240px] md:h-[340px] lg:h-[390px] flex items-center justify-center bg-gradient-to-r from-blue-950 to-emerald-950">
                                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200')" }}></div>
                            </div>
                        ) : (
                            // Dynamic Sliders without overlay texts
                            <div className="relative w-full h-[240px] md:h-[340px] lg:h-[390px]">
                                {sliders.map((slider, index) => (
                                    <div
                                        key={slider.id}
                                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center ${
                                            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                        }`}
                                    >
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms]"
                                            style={{ 
                                                backgroundImage: `url(${slider.gambar})`,
                                                transform: index === currentSlide ? 'scale(1.05)' : 'scale(1.00)'
                                            }}
                                        />
                                    </div>
                                ))}

                                {/* Slider Navigation Indicators */}
                                {sliders.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                        {sliders.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    index === currentSlide ? 'w-6 bg-emerald-500' : 'w-2 bg-white/50 hover:bg-white'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* DYNAMIC VIBRANT PASTEL CARDS 2, 3, 4: FIRST KEY STATISTICS GRID */}
                    <section className="relative z-20 -mt-12 max-w-6xl mx-auto px-4">
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Card 2: Luas Wilayah - Emerald Theme */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-6 shadow-lg border border-emerald-100/90 flex items-center gap-5 transform hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl">
                                <div className="h-14 w-14 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                    <Layers className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-widest">Luas Wilayah</span>
                                    <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                                        {dataDasar?.luas_wilayah ? `${dataDasar.luas_wilayah} Km²` : '18.010,43 Km²'}
                                    </span>
                                    <span className="text-[10px] text-emerald-600 font-semibold mt-1">Kabupaten Bulungan</span>
                                </div>
                            </div>

                            {/* Card 3: Jumlah Penduduk - Blue Theme */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 shadow-lg border border-blue-100/90 flex items-center gap-5 transform hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl">
                                <div className="h-14 w-14 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-white transition-colors duration-300">
                                    <Users className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-blue-700/80 uppercase tracking-widest">Jumlah Penduduk</span>
                                    <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                                        {dataDasar?.jumlah_penduduk ? dataDasar.jumlah_penduduk : '151.034 jiwa'}
                                    </span>
                                    <span className="text-[10px] text-blue-600 font-semibold mt-1">Survei Terakhir</span>
                                </div>
                            </div>

                            {/* Card 4: Jumlah Kecamatan - Purple Theme */}
                            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/50 rounded-2xl p-6 shadow-lg border border-purple-100/90 flex items-center gap-5 transform hover:-translate-y-1 transition-all duration-300 group hover:shadow-xl">
                                <div className="h-14 w-14 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-50 group-hover:text-white transition-colors duration-300">
                                    <Building className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-purple-700/80 uppercase tracking-widest">Jumlah Kecamatan</span>
                                    <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                                        {dataDasar?.jumlah_kecamatan ? `${dataDasar.jumlah_kecamatan} Kecamatan` : '10 Kecamatan'}
                                    </span>
                                    <span className="text-[10px] text-purple-600 font-semibold mt-1">Sektor Administrasi</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BLOCK 5 & 6: SPLIT VIDEO GALERI & AGENDA KEGIATAN */}
                    <section className="container mx-auto px-4 pt-8 pb-4 max-w-6xl">
                        <div className="grid gap-8 lg:grid-cols-3">
                            
                            {/* Block 5 (Left Side, 2 Cols) - YouTube Video Galeri (6 Videos, play inline) */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                                    <h2 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2 uppercase">
                                        <span className="h-4 w-1 bg-emerald-500 rounded-full inline-block"></span>
                                        <VideoIcon className="h-4.5 w-4.5 text-emerald-500" />
                                        Galeri Video Terkini
                                    </h2>
                                </div>

                                {videos.length === 0 ? (
                                    <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400 shadow-sm">
                                        <VideoIcon className="mx-auto mb-3 h-12 w-12 opacity-30 text-slate-500" />
                                        <p className="font-semibold text-sm">Belum ada video galeri publikasi</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                        {videos.map((vid) => (
                                            <div key={vid.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm group hover:shadow-md transition-all duration-300">
                                                {/* Thumbnail Container */}
                                                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                                                    <img 
                                                        src={`https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`} 
                                                        alt={vid.judul} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                                        <button 
                                                            onClick={() => setActiveVideoUrl(`https://www.youtube.com/embed/${vid.youtube_id}?autoplay=1`)}
                                                            className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md hover:bg-emerald-600 active:scale-95 transition-transform transform group-hover:scale-110"
                                                        >
                                                            <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="font-bold text-[10px] text-slate-800 line-clamp-2 leading-relaxed tracking-wider uppercase">
                                                        {vid.judul}
                                                    </h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Block 6 (Right Side, 1 Col) - Agenda Kegiatan (3 per page) */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                                    <h2 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2 uppercase">
                                        <span className="h-4 w-1 bg-blue-500 rounded-full inline-block"></span>
                                        <Calendar className="h-4.5 w-4.5 text-blue-500" />
                                        Agenda Kegiatan
                                    </h2>
                                </div>

                                {agendas.length === 0 ? (
                                    <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-400 shadow-sm h-[320px] flex flex-col items-center justify-center">
                                        <Clock className="mx-auto mb-2 h-10 w-10 opacity-30 text-slate-500" />
                                        <p className="font-semibold text-xs">Belum ada agenda aktif terjadwal</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-3 min-h-[300px]">
                                            {paginatedAgendas.map((ag) => (
                                                <div 
                                                    key={ag.id} 
                                                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow hover:border-slate-200 transition-all flex flex-col gap-2 border-l-4 border-l-blue-600"
                                                >
                                                    <h3 className="font-bold text-[11px] text-slate-800 tracking-wide leading-relaxed uppercase">
                                                        {ag.nama_kegiatan}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-500 font-semibold">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                                            {formatIndonesianDate(ag.tanggal)}
                                                        </span>
                                                        {ag.jam && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3.5 w-3.5 text-blue-500" />
                                                                {ag.jam}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 border-t pt-1.5 mt-1 border-slate-50">
                                                        <MapPin className="h-3.5 w-3.5 text-red-400" />
                                                        {ag.lokasi}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination buttons */}
                                        {totalAgendaPages > 1 && (
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                <button
                                                    disabled={agendaPage === 1}
                                                    onClick={() => setAgendaPage(prev => prev - 1)}
                                                    className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white border rounded hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1 shadow-sm"
                                                >
                                                    <ChevronLeft className="h-3 w-3" /> Sebelumnya
                                                </button>
                                                <span className="text-[10px] font-semibold text-slate-400">Hal {agendaPage} dari {totalAgendaPages}</span>
                                                <button
                                                    disabled={agendaPage === totalAgendaPages}
                                                    onClick={() => setAgendaPage(prev => prev + 1)}
                                                    className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white border rounded hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1 shadow-sm"
                                                >
                                                    Selanjutnya <ChevronRight className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* SECTION: DATA TERKINI DYNAMIC VIBRANT PASTEL CARDS (7, 8, 9) */}
                    <section className="bg-slate-100/70 border-y border-slate-200/50 py-8">
                        <div className="container mx-auto px-4 max-w-6xl space-y-5">
                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase">Data Terkini</h2>
                                <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full"></div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                {/* Card 7: Jumlah Desa - Orange Theme */}
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-2xl p-6 shadow-lg border border-orange-100/90 flex items-center gap-5 transform hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="h-14 w-14 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                        <MapPin className="h-7 w-7" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-orange-700/80 uppercase tracking-widest">Jumlah Desa</span>
                                        <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                                            {dataDasar?.jumlah_desa ? `${dataDasar.jumlah_desa} Desa` : '74 Desa'}
                                        </span>
                                        <span className="text-[10px] text-orange-600 font-semibold mt-1">Fasilitas Desa & Wilayah</span>
                                    </div>
                                </div>

                                {/* Card 8: Indeks Pembangunan Manusia (IPM) - Teal Theme */}
                                <div className="bg-gradient-to-br from-teal-50 to-cyan-50/50 rounded-2xl p-6 shadow-lg border border-teal-100/90 flex items-center gap-5 transform hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="h-14 w-14 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                                        <Heart className="h-7 w-7" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-teal-700/80 uppercase tracking-widest">IPM</span>
                                        <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                                            {dataDasar?.ipm ? dataDasar.ipm : '74,53'}
                                        </span>
                                        <span className="text-[10px] text-teal-600 font-semibold mt-1">Skala Bulungan</span>
                                    </div>
                                </div>

                                {/* Card 9: Jumlah Puskesmas - Red Theme */}
                                <div className="bg-gradient-to-br from-red-50 to-rose-50/50 rounded-2xl p-6 shadow-lg border border-red-100/90 flex items-center gap-5 transform hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="h-14 w-14 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                        <Activity className="h-7 w-7" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-red-700/80 uppercase tracking-widest">Jumlah Puskesmas</span>
                                        <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                                            {dataDasar?.jumlah_puskesmas ? `${dataDasar.jumlah_puskesmas} Unit` : '12 Unit'}
                                        </span>
                                        <span className="text-[10px] text-red-600 font-semibold mt-1">Layanan Kesehatan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NEW SECTION: DOWNLOAD DOKUMEN & REGULASI DAERAH */}
                    <section id="download-section" className="container mx-auto px-4 py-8 max-w-6xl space-y-4 scroll-mt-20">
                        <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                            <h2 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2 uppercase">
                                <span className="h-4 w-1 bg-blue-600 rounded-full inline-block"></span>
                                <FileDown className="h-5 w-5 text-blue-600 animate-pulse animate-duration-1000" />
                                Dokumen & Regulasi Resmi
                            </h2>
                            <Link 
                                href="/download"
                                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl border border-blue-600 text-[10px] uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 active:scale-95 shrink-0"
                            >
                                <FolderDown className="h-3.5 w-3.5" /> Pusat Unduhan
                            </Link>
                        </div>

                        {downloads.length === 0 ? (
                            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400 shadow-sm">
                                <FolderDown className="mx-auto mb-3 h-12 w-12 opacity-30 text-slate-500" />
                                <p className="font-semibold text-sm">Belum ada dokumen publikasi yang tersedia untuk diunduh</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {/* Top 4 Prominent Cards Grid */}
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    {downloads.slice(0, 4).map((doc) => (
                                        <div 
                                            key={doc.id}
                                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[230px] group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800 tracking-wider">
                                                        {doc.tipe_file || 'PDF'}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-bold font-mono">
                                                        {doc.ukuran_format || '0 B'}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-xs text-slate-800 line-clamp-3 group-hover:text-blue-600 transition-colors uppercase leading-relaxed tracking-wide">
                                                    {doc.judul}
                                                </h3>
                                                {doc.deskripsi && (
                                                    <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
                                                        {doc.deskripsi}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                                <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                                    {doc.jumlah_unduhan || 0} Unduhan
                                                </span>
                                                <a 
                                                    href={`/unduh/${doc.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                                                >
                                                    <FileDown className="h-3 w-3" /> Unduh
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* BLOCK 10: GALLERY FOTO (Ambil foto_url & deskripsi, carousel 4, total 10) */}
                    <section className="container mx-auto px-4 py-8 max-w-6xl space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                            <h2 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2 uppercase">
                                <span className="h-4 w-1 bg-emerald-500 rounded-full inline-block"></span>
                                <ImageIcon className="h-4.5 w-4.5 text-emerald-500" />
                                Gallery Foto Bulungan
                            </h2>
                            
                            {/* Slide triggers */}
                            {fotos.length > 4 && (
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={prevPhotos}
                                        className="h-8 w-8 rounded-full border bg-white flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={nextPhotos}
                                        className="h-8 w-8 rounded-full border bg-white flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {fotos.length === 0 ? (
                            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400 shadow-sm">
                                <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-30 text-slate-500" />
                                <p className="font-semibold text-sm">Belum ada foto galeri kegiatan</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden w-full">
                                <div 
                                    className="flex transition-transform duration-500 ease-out gap-6"
                                    style={{ transform: `translateX(-${photoIndex * 270}px)` }}
                                >
                                    {fotos.map((photo) => (
                                        <div 
                                            key={photo.id} 
                                            className="w-[246px] shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md group hover:shadow-xl transition-all duration-300 flex flex-col"
                                        >
                                            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                                <img 
                                                    src={photo.foto_url} 
                                                    alt={photo.deskripsi || "Foto Kegiatan"} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-4 flex flex-col justify-between flex-grow gap-3">
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-[10px] text-slate-800 line-clamp-2 leading-relaxed tracking-wider uppercase">
                                                        {photo.deskripsi || "Foto Kegiatan"}
                                                    </h3>
                                                    {photo.lokasi && (
                                                        <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-0.5">
                                                            <MapPin className="h-3 w-3 text-red-400" />
                                                            {photo.lokasi}
                                                        </span>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => setActivePhoto(photo)}
                                                    className="w-full py-1.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase rounded-md border border-emerald-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all text-center tracking-wider block"
                                                >
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* SECTION: HARGA KOMODITAS TERKINI (Squeezed and condensed) */}
                    <section className="bg-slate-100 py-6 border-y border-slate-200/50">
                        <div className="container mx-auto px-4 max-w-6xl space-y-4">
                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase flex items-center justify-center gap-2">
                                    <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
                                    Pantauan Harga Komoditas Terkini
                                </h2>
                                <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full"></div>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* PANGAN WIDGET (LEFT COL) */}
                                <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-200/30 space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2 flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4.5 w-4.5 text-emerald-500" />
                                            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Bahan Pokok & Sembako</h3>
                                        </div>
                                        
                                        {/* Tab toggles */}
                                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                                            <button 
                                                onClick={() => setActivePanganTab('tabel')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                                    activePanganTab === 'tabel' 
                                                        ? 'bg-white text-slate-800 shadow-sm' 
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                Daftar Harga
                                            </button>
                                            <button 
                                                onClick={() => setActivePanganTab('grafik')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                                    activePanganTab === 'grafik' 
                                                        ? 'bg-white text-slate-800 shadow-sm' 
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                Grafik Tren
                                            </button>
                                        </div>
                                    </div>

                                    {!latestPangan ? (
                                        <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                                            Belum ada data harga sembako yang tercatat.
                                        </div>
                                    ) : activePanganTab === 'tabel' ? (
                                        // Tab 1: Daftar Harga (Latest Date)
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-2">
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Komoditas + Harga Terkini</span>
                                                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                                                    Update: {formatIndonesianDate(latestPangan.tanggal)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                                                {allPanganCommodities.map((c) => {
                                                    const price = latestPangan[c.key as keyof HargaBahanPokok] as number;
                                                    return (
                                                        <div 
                                                            key={c.key} 
                                                            className="flex items-center justify-between py-1 border-b border-slate-100 hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                                                        >
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide truncate pr-2 max-w-[170px]">
                                                                {c.name}
                                                            </span>
                                                            <span className="font-extrabold text-[11px] text-emerald-600 font-mono">
                                                                {price === 0 ? 'Kosong' : (price ? formatRupiah(price) : 'Hubungi DKIP')}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        // Tab 2: Grafik Tren (Weekly History)
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between gap-3 px-2 flex-wrap">
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pilih Komoditas Sembako:</span>
                                                <div className="w-48">
                                                    <Select 
                                                        value={selectedPanganCommodity} 
                                                        onValueChange={setSelectedPanganCommodity}
                                                    >
                                                        <SelectTrigger className="h-7 text-[10px] font-semibold bg-slate-50 border-slate-200">
                                                            <SelectValue placeholder="Pilih Komoditas" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[220px]">
                                                            {allPanganCommodities.map(c => (
                                                                <SelectItem key={c.key} value={c.key} className="text-[10px] font-semibold">
                                                                    {c.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="h-[210px] w-full bg-slate-50/50 rounded-xl p-3 border border-slate-100 pr-4">
                                                <ResponsiveContainer width="100%" height={190}>
                                                    <LineChart 
                                                        data={hargaBahanPokoks.map(item => ({
                                                            name: formatIndonesianDate(item.tanggal).split(' ')[0] + ' ' + formatIndonesianDate(item.tanggal).split(' ')[1].slice(0, 3),
                                                            harga: item[selectedPanganCommodity as keyof HargaBahanPokok]
                                                        }))}
                                                        margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                                                        <YAxis 
                                                            stroke="#94a3b8" 
                                                            fontSize={8} 
                                                            tickLine={false} 
                                                            axisLine={false}
                                                            tickFormatter={(val) => `Rp ${val/1000}k`} 
                                                        />
                                                        <ChartTooltip 
                                                            contentStyle={{ fontSize: '9px', borderRadius: '8px' }}
                                                            formatter={(value: any) => [formatRupiah(value), allPanganCommodities.find(c => c.key === selectedPanganCommodity)?.name]} 
                                                        />
                                                        <Line 
                                                            type="monotone" 
                                                            dataKey="harga" 
                                                            stroke="#2563eb" 
                                                            strokeWidth={3} 
                                                            activeDot={{ r: 5 }} 
                                                            dot={{ r: 4, fill: '#ffffff', strokeWidth: 2, stroke: '#2563eb' }} 
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* FISH WIDGET (RIGHT COL) */}
                                <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-200/30 space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2 flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <Fish className="h-4.5 w-4.5 text-blue-500" />
                                            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Pantauan Harga Ikan</h3>
                                        </div>
                                        
                                        {/* Tab toggles */}
                                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                                            <button 
                                                onClick={() => setActiveIkanTab('tabel')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                                    activeIkanTab === 'tabel' 
                                                        ? 'bg-white text-slate-800 shadow-sm' 
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                Daftar Harga
                                            </button>
                                            <button 
                                                onClick={() => setActiveIkanTab('grafik')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                                    activeIkanTab === 'grafik' 
                                                        ? 'bg-white text-slate-800 shadow-sm' 
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                Grafik Tren
                                            </button>
                                        </div>
                                    </div>

                                    {!latestIkan ? (
                                        <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                                            Belum ada data harga ikan yang tercatat.
                                        </div>
                                    ) : activeIkanTab === 'tabel' ? (
                                        // Tab 1: Daftar Harga (Latest Date)
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-2">
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Komoditas + Harga Terkini</span>
                                                <span className="text-[9px] bg-blue-50 text-blue-700 font-extrabold px-2.5 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                                                    Update: {formatIndonesianDate(latestIkan.tanggal)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                                                {allFishCommodities.map((c) => {
                                                    const price = latestIkan[c.key as keyof HargaIkan] as number;
                                                    return (
                                                        <div 
                                                            key={c.key} 
                                                            className="flex items-center justify-between py-1 border-b border-slate-100 hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                                                        >
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide truncate pr-2 max-w-[170px]">
                                                                {c.name}
                                                            </span>
                                                            <span className="font-extrabold text-[11px] text-blue-600 font-mono">
                                                                {price === 0 ? 'Kosong' : (price ? formatRupiah(price) : 'Hubungi DKIP')}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        // Tab 2: Grafik Tren (Weekly History)
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between gap-3 px-2 flex-wrap">
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pilih Komoditas Ikan:</span>
                                                <div className="w-48">
                                                    <Select 
                                                        value={selectedIkanCommodity} 
                                                        onValueChange={setSelectedIkanCommodity}
                                                    >
                                                        <SelectTrigger className="h-7 text-[10px] font-semibold bg-slate-50 border-slate-200">
                                                            <SelectValue placeholder="Pilih Komoditas" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[220px]">
                                                            {allFishCommodities.map(c => (
                                                                <SelectItem key={c.key} value={c.key} className="text-[10px] font-semibold">
                                                                    {c.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="h-[210px] w-full bg-slate-50/50 rounded-xl p-3 border border-slate-100 pr-4">
                                                <ResponsiveContainer width="100%" height={190}>
                                                    <LineChart 
                                                        data={hargaIkans.map(item => ({
                                                            name: formatIndonesianDate(item.tanggal).split(' ')[0] + ' ' + formatIndonesianDate(item.tanggal).split(' ')[1].slice(0, 3),
                                                            harga: item[selectedIkanCommodity as keyof HargaIkan]
                                                        }))}
                                                        margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                                                        <YAxis 
                                                            stroke="#94a3b8" 
                                                            fontSize={8} 
                                                            tickLine={false} 
                                                            axisLine={false}
                                                            tickFormatter={(val) => `Rp ${val/1000}k`} 
                                                        />
                                                        <ChartTooltip 
                                                            contentStyle={{ fontSize: '9px', borderRadius: '8px' }}
                                                            formatter={(value: any) => [formatRupiah(value), allFishCommodities.find(c => c.key === selectedIkanCommodity)?.name]} 
                                                        />
                                                        <Line 
                                                            type="monotone" 
                                                            dataKey="harga" 
                                                            stroke="#10b981" 
                                                            strokeWidth={3} 
                                                            activeDot={{ r: 5 }} 
                                                            dot={{ r: 4, fill: '#ffffff', strokeWidth: 2, stroke: '#10b981' }} 
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BLOCK 11: GRAFIK DAN STATISTIK (Carousel display up to 5 charts) */}
                    <section className="container mx-auto px-4 py-8 max-w-6xl space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                            <h2 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2 uppercase">
                                <span className="h-4 w-1 bg-blue-600 rounded-full inline-block"></span>
                                <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
                                Grafik dan Statistik Daerah
                            </h2>

                            {/* Slide triggers */}
                            {graphCharts.length > 2 && (
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={prevCharts}
                                        className="h-8 w-8 rounded-full border bg-white flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={nextCharts}
                                        className="h-8 w-8 rounded-full border bg-white flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {graphCharts.length === 0 ? (
                            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400 shadow-sm">
                                <Activity className="mx-auto mb-3 h-12 w-12 opacity-30 text-slate-500" />
                                <p className="font-semibold text-sm">Belum ada visualisasi grafik statistik daerah</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden w-full">
                                <div 
                                    className="flex transition-transform duration-500 ease-out gap-8"
                                    style={{ transform: `translateX(-${chartCarouselIndex * 572}px)` }}
                                >
                                    {graphCharts.map((chart) => (
                                        <div 
                                            key={chart.id} 
                                            className="w-[540px] shrink-0 bg-white rounded-2xl p-6 border border-slate-200/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
                                        >
                                            <div>
                                                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">{chart.nama}</h3>
                                                {chart.keterangan && <p className="text-[9px] text-slate-400 font-medium mt-0.5">{chart.keterangan}</p>}
                                            </div>

                                            <div className="h-[230px] w-full pr-2">
                                                <ResponsiveContainer width="99%" height={230}>
                                                    {chart.tipe === 'bar' ? (
                                                        <BarChart data={chart.data.items} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                                                            <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                                            <ChartTooltip contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                                                            {chart.data.seriesKeys.map((key, i) => (
                                                                <Bar key={key} dataKey={key} fill={['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]} radius={[4, 4, 0, 0]} />
                                                            ))}
                                                        </BarChart>
                                                    ) : chart.tipe === 'area' ? (
                                                        <AreaChart data={chart.data.items} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                                                            <defs>
                                                                {chart.data.seriesKeys.map((key, i) => {
                                                                    const color = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5];
                                                                    return (
                                                                        <linearGradient key={key} id={`color_${key}`} x1="0" y1="0" x2="0" y2="1">
                                                                            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                                                                            <stop offset="95%" stopColor={color} stopOpacity={0.01}/>
                                                                        </linearGradient>
                                                                    );
                                                                })}
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                                                            <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                                            <ChartTooltip contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                                                            {chart.data.seriesKeys.map((key, i) => (
                                                                <Area key={key} type="monotone" dataKey={key} stroke={['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]} fillOpacity={1} fill={`url(#color_${key})`} strokeWidth={2} />
                                                            ))}
                                                        </AreaChart>
                                                    ) : chart.tipe === 'pie' ? (
                                                        <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                                            <ChartTooltip contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                                                            {chart.data.seriesKeys.map((key) => (
                                                                <Pie 
                                                                    key={key}
                                                                    data={chart.data.items} 
                                                                    dataKey={key} 
                                                                    nameKey="name" 
                                                                    cx="50%" 
                                                                    cy="50%" 
                                                                    outerRadius={80} 
                                                                    label={{ fontSize: 8, fontWeight: 'bold', fill: '#475569' }}
                                                                >
                                                                    {chart.data.items.map((entry, index) => (
                                                                        <Cell key={`cell-${index}`} fill={['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'][index % 7]} />
                                                                    ))}
                                                                </Pie>
                                                            ))}
                                                        </PieChart>
                                                    ) : (
                                                        <LineChart data={chart.data.items} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                                                            <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                                            <ChartTooltip contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                                                            {chart.data.seriesKeys.map((key, i) => (
                                                                <Line key={key} type="monotone" dataKey={key} stroke={['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]} strokeWidth={2.5} activeDot={{ r: 5 }} dot={{ r: 3, fill: '#ffffff', strokeWidth: 1.5 }} />
                                                            ))}
                                                        </LineChart>
                                                    )}
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* BLOCK 12: APLIKASI / WEB DAERAH (Ambil logo_url, carousel) */}
                    <section className="bg-slate-900 text-white py-8">
                        <div className="container mx-auto px-4 max-w-6xl space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2 uppercase">
                                    <span className="h-4 w-1 bg-emerald-500 rounded-full inline-block"></span>
                                    <Globe className="h-4.5 w-4.5 text-emerald-500" />
                                    Aplikasi / Web Daerah
                                </h2>

                                {/* Carousel Triggers */}
                                {links.length > 3 && (
                                    <div className="flex items-center gap-1.5">
                                        <button 
                                            onClick={prevLinks}
                                            className="h-8 w-8 rounded-full border border-slate-800 bg-slate-800/50 flex items-center justify-center text-slate-300 hover:bg-slate-800 transition-colors"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={nextLinks}
                                            className="h-8 w-8 rounded-full border border-slate-800 bg-slate-800/50 flex items-center justify-center text-slate-300 hover:bg-slate-800 transition-colors"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {links.length === 0 ? (
                                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-500">
                                    <Globe className="mx-auto mb-3 h-12 w-12 opacity-30" />
                                    <p className="font-semibold text-sm">Belum ada link website daerah eksternal</p>
                                </div>
                            ) : (
                                <div className="overflow-hidden w-full">
                                    <div 
                                        className="flex transition-transform duration-500 ease-out gap-8"
                                        style={{ transform: `translateX(-${linkCarouselIndex * 368}px)` }}
                                    >
                                        {links.map((link) => (
                                            <a 
                                                key={link.id} 
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-[336px] shrink-0 bg-slate-950/40 rounded-2xl p-6 border border-slate-800/80 shadow-md hover:bg-slate-950/80 hover:border-slate-700/60 transition-all duration-300 flex flex-col gap-4 group"
                                            >
                                                {/* Logo image displaying logo_url */}
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-xl bg-white/90 border border-slate-700/50 overflow-hidden flex items-center justify-center shrink-0">
                                                        {link.logo_url ? (
                                                            <img src={link.logo_url} alt={link.nama} className="w-full h-full object-contain p-1.5" />
                                                        ) : (
                                                            <Globe className="h-6 w-6 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-200 group-hover:text-emerald-400 transition-colors leading-tight">
                                                            {link.nama}
                                                        </h3>
                                                        <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Situs Layanan</span>
                                                    </div>
                                                </div>

                                                {link.deskripsi && (
                                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed tracking-wide line-clamp-3">
                                                        {link.deskripsi}
                                                    </p>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                </main>

                {/* FOOTER */}
                <footer className="bg-[#0b192e] text-slate-300 border-t-4 border-emerald-500 pt-10 pb-6">
                    <div className="container mx-auto px-4 max-w-6xl grid gap-10 md:grid-cols-3 border-b border-slate-800 pb-12 mb-8">
                        
                        {/* BLOCK 13: ADDRESS & INFO (Corrected Logo) */}
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

                        {/* BLOCK 14: NAVIGATION MENU UTAMA (2 COLUMNS DISPLAY) */}
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

                        {/* BLOCK 15: SOCIAL MEDIA LINKS FROM DATA DASAR */}
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
                                {dataDasar?.url_tiktok && (
                                    <a 
                                        href={dataDasar.url_tiktok}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-950 hover:border-white text-xs font-bold uppercase transition-all tracking-wider text-slate-200 hover:text-white"
                                    >
                                        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.06-1.45-.45-.32-.86-.71-1.22-1.14-.02 2.62-.01 5.24-.02 7.86-.06 2.04-.6 4.14-1.89 5.73-1.44 1.77-3.76 2.78-6.02 2.79-2.61.07-5.26-1.04-6.84-3.13-1.72-2.19-2.07-5.32-1.02-7.89 1.01-2.54 3.49-4.47 6.22-4.78.02 1.34-.01 2.68-.01 4.02-1.39.06-2.86.74-3.52 1.98-.77 1.37-.53 3.23.51 4.39.99 1.15 2.62 1.63 4.09 1.25 1.21-.29 2.22-1.29 2.51-2.48.14-1.38.07-2.77.09-4.15V.02Z"/>
                                        </svg>
                                        TikTok Feed
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

                {/* MODAL: INLINE YOUTUBE VIDEO PLAYER (BLOCK 5 IMMEDIATE CLICK PLAY) */}
                {activeVideoUrl && (
                    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
                        <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center animate-in zoom-in-95 duration-200">
                            
                            {/* Close trigger */}
                            <button 
                                onClick={() => setActiveVideoUrl(null)}
                                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-slate-900/60 hover:bg-slate-950 text-white flex items-center justify-center transition-colors focus:outline-none z-10"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Embed YouTube player */}
                            <iframe 
                                src={activeVideoUrl}
                                title="YouTube Video Player"
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                )}

                {/* MODAL: PHOTO GALLERY PREVIEW DETAIL (BLOCK 10 LIHAT POPUP) */}
                {activePhoto && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
                        <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
                            
                            {/* Close trigger */}
                            <button 
                                onClick={() => setActivePhoto(null)}
                                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors focus:outline-none z-10"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="relative bg-slate-950 overflow-hidden flex items-center justify-center max-h-[75vh]">
                                <img 
                                    src={activePhoto.foto_url} 
                                    alt={activePhoto.deskripsi || "Foto Kegiatan"} 
                                    className="max-h-[75vh] w-auto h-auto object-contain mx-auto" 
                                />
                            </div>

                            <div className="p-6 space-y-3">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase rounded tracking-wider">Foto Kegiatan</span>
                                    {activePhoto.lokasi && (
                                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5 text-red-400" />
                                            {activePhoto.lokasi}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-extrabold text-base text-slate-800 tracking-wide uppercase">{activePhoto.deskripsi || "Foto Kegiatan"}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: GENERAL MAINTENANCE NOTIFICATION FOR 404 LINKS */}
                {maintenanceMenu && (
                    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
                        <div className="relative w-full max-w-md bg-white rounded-2xl p-6 border shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center text-center gap-4">
                            
                            {/* Alert icon in gradient container */}
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
