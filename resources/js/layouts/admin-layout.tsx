import type { ReactNode } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Boxes, Building2, ClipboardList, FileText, Gauge, Globe2, Layers3, LogOut, Menu, Settings2, Users, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type AdminUser = { id: number; name: string; email: string };
type SharedProps = { auth: { user: AdminUser | null }; flash: { success?: string | null; error?: string | null } };

const navigation = [
    { label: 'Dashboard', href: '/admin', icon: Gauge },
    { label: 'Homepage content', href: '/admin/homepage', icon: FileText },
    { label: 'Products & catalogue', href: '/admin/products', icon: Boxes },
    { label: 'Services', href: '/admin/services', icon: Zap },
    { label: 'Industries', href: '/admin/industries', icon: Building2 },
    { label: 'Work process', href: '/admin/process', icon: Layers3 },
    { label: 'Enquiries', href: '/admin/enquiries', icon: ClipboardList },
    { label: 'Contact & branding', href: '/admin/settings', icon: Settings2 },
    { label: 'Admin users', href: '/admin/users', icon: Users },
];

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
    const page = usePage<SharedProps>();
    const { auth, flash } = page.props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const activePath = page.url.split('?')[0];

    useEffect(() => {
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
        const heartbeat = () => {
            void fetch('/admin/presence', {
                method: 'POST',
                credentials: 'same-origin',
                keepalive: true,
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
            }).catch(() => undefined);
        };

        heartbeat();
        const timer = window.setInterval(heartbeat, 30_000);
        return () => window.clearInterval(timer);
    }, []);

    return <>
        <Head title={`${title} · Admin`} />
        <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto border-r border-slate-200 bg-white xl:flex">
                <a href="/admin" className="flex h-20 items-center justify-center border-b border-white/10 bg-gradient-to-r from-[#10264b] to-[#1b3e75] px-5" aria-label="Aryan Electromech admin home">
                    <img src="/images/arya-elecromech-wordmark-dark.png" alt="Aryan Electromech Engineers" width="190" height="64" className="h-12 w-full max-w-[190px] object-contain" />
                </a>
                <div className="px-4 pt-6"><p className="px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Manage website</p>
                    <nav className="mt-3 grid gap-1">{navigation.map(({ label, href, icon: Icon }) => {
                        const active = activePath === href || (href !== '/admin' && activePath.startsWith(`${href}/`));
                        return <Link key={href} href={href} className={cn('flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors', active ? 'bg-blue-50 text-[#174b9b]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950')}><Icon className="size-4" />{label}</Link>;
                    })}</nav>
                </div>
                <div className="mt-auto border-t border-slate-100 p-4">
                    <a href="/" target="_blank" rel="noreferrer" className="mb-3 flex h-10 items-center gap-2 rounded-lg px-3 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"><Globe2 className="size-4" />View live website</a>
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-[#174b9b] shadow-sm">{auth.user?.name.slice(0, 1).toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-800">{auth.user?.name}</span><span className="block truncate text-[10px] text-slate-500">Administrator</span></span><button type="button" aria-label="Sign out" title="Sign out" onClick={() => router.post('/admin/logout')} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950"><LogOut className="size-4" /><span>Sign out</span></button></div>
                </div>
            </aside>

            <div className="xl:pl-64">
                <header className="sticky top-0 z-20 hidden h-14 items-center justify-end gap-3 border-b border-slate-200 bg-white/95 px-6 backdrop-blur xl:flex">
                    <span className="text-xs text-slate-500">Signed in as <span className="font-semibold text-slate-700">{auth.user?.name}</span></span>
                    <button type="button" onClick={() => router.post('/admin/logout')} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"><LogOut className="size-4" />Sign out</button>
                </header>
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur xl:hidden">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                        <a href="/admin" aria-label="Aryan Electromech admin home" className="flex items-center gap-2.5"><img src="/images/arya-elecromech-wordmark.png" alt="Aryan Electromech Engineers" width="150" height="54" className="h-10 w-[142px] object-contain" /><span className="sr-only">Website manager</span></a>
                        <div className="flex shrink-0 items-center gap-2">
                            <button type="button" aria-label="Sign out" title="Sign out" onClick={() => router.post('/admin/logout')} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 sm:px-3"><LogOut className="size-4" /><span className="hidden sm:inline">Sign out</span></button>
                            <button type="button" aria-label={mobileOpen ? 'Close admin navigation' : 'Open admin navigation'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700">{mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
                        </div>
                    </div>
                    {mobileOpen && <nav className="grid grid-cols-2 gap-2 border-t border-slate-100 p-3 sm:grid-cols-3">{navigation.map(({ label, href, icon: Icon }) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn('flex min-h-10 items-center gap-2 rounded-lg px-2.5 text-xs font-medium', activePath === href ? 'bg-blue-50 text-[#174b9b]' : 'text-slate-600 hover:bg-slate-50')}><Icon className="size-4 shrink-0" />{label}</Link>)}</nav>}
                </header>
                <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                    {flash.success && <div role="status" className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"><span className="size-2 rounded-full bg-emerald-500" />{flash.success}</div>}
                    {flash.error && <div role="alert" className="mb-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"><span className="size-2 rounded-full bg-rose-500" />{flash.error}</div>}
                    {children}
                </main>
            </div>
        </div>
    </>;
}
