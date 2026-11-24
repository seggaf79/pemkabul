import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, FileText, Layers, Images, Download, FolderDown, Users, List, Image, FolderHeart, Link as LinkIcon, BarChart2, Youtube, Video, Calendar, Database, TrendingUp, Fish, Building } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Menu Utama',
        href: '/admin/menu',
        icon: List,
    },
    {
        title: 'Tautan Terkait',
        href: '/admin/link-website',
        icon: LinkIcon,
    },
    {
        title: 'Halaman',
        href: '/admin/halaman',
        icon: FileText,
    },
    {
        title: 'OPD Daerah',
        href: '/admin/opd',
        icon: Building,
    },
    {
        title: 'Kategori Halaman',
        href: '/admin/kategori-halaman',
        icon: Layers,
    },
    {
        title: 'Slider',
        href: '/admin/slider',
        icon: Images,
    },
    {
        title: 'Download',
        href: '/admin/download',
        icon: Download,
    },
    {
        title: 'Kategori Download',
        href: '/admin/kategori-download',
        icon: FolderDown,
    },
    {
        title: 'Gallery Foto',
        href: '/admin/foto',
        icon: Image,
    },
    {
        title: 'Kategori Foto',
        href: '/admin/kategori-foto',
        icon: FolderHeart,
    },
    {
        title: 'Gallery Video',
        href: '/admin/video',
        icon: Youtube,
    },
    {
        title: 'Kategori Video',
        href: '/admin/kategori-video',
        icon: Video,
    },
    {
        title: 'Agenda Kegiatan',
        href: '/admin/agenda',
        icon: Calendar,
    },
    {
        title: 'Data Dasar',
        href: '/admin/data-dasar',
        icon: Database,
    },
    {
        title: 'Harga Bahan Pokok',
        href: '/admin/harga-bahan-pokok',
        icon: TrendingUp,
    },
    {
        title: 'Harga Ikan',
        href: '/admin/harga-ikan',
        icon: Fish,
    },
    {
        title: 'Grafik & Statistik',
        href: '/admin/graph-chart',
        icon: BarChart2,
    },
    {
        title: 'Pengguna',
        href: '/admin/user',
        icon: Users,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="none" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
        </Sidebar>
    );
}
