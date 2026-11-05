import { Head, useForm } from '@inertiajs/react';
import {
    ArrowDown, ArrowRight, ArrowUpRight, Boxes, Cable, Check, ChevronDown,
    ClipboardList, Factory, HardHat, Mail, MapPin, Menu, MessageCircle, Phone,
    RefreshCw, Search, SlidersHorizontal, Sparkles, Wrench, X, Zap,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Product = { id: number; code: string; name: string; subtitle: string; category: string; image_url: string | null; description: string };
type HomeContent = {
    hero_kicker: string; hero_title: string; hero_highlight: string; hero_description: string; hero_image_url: string | null;
    about_heading: string; about_paragraph_one: string; about_paragraph_two: string; about_image_url: string | null;
    catalogue_heading: string; catalogue_intro: string; services_heading: string; services_intro: string;
    industries_heading: string; industries_intro: string; process_heading: string; process_intro: string;
    contact_heading: string; contact_intro: string;
};
type SiteSettings = { company_name: string; ceo_name: string; phone: string; email: string; whatsapp_number: string; gstin: string | null; address: string | null; map_embed_url: string | null; logo_url: string | null };
type ServiceItem = { id: number; title: string; detail: string; icon_name: string };
type ProcessStep = { id: number; step_number: number; title: string; detail: string; icon_name: string };
type HomeProps = { home: HomeContent; settings: SiteSettings; products: Product[]; services: ServiceItem[]; industries: string[]; steps: ProcessStep[] };

const navItems = [
    { label: 'Home', href: '#top', id: 'top' },
    { label: 'About', href: '#about', id: 'about' },
        { label: 'About', href: '#about', id: 'about' },

    { label: 'Catalogue', href: '#catalogue', id: 'catalogue' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Industries', href: '#industries', id: 'industries' },
    { label: 'Process', href: '#process', id: 'process' },
    { label: 'Contact', href: '#contact', id: 'contact' },
];

const categoryIconMap = { Sparkles, ClipboardList, Boxes, Cable, RefreshCw, Wrench, Check, Factory, Zap };

export default function Home({ home, settings, products, services, industries, steps }: HomeProps) {
    const [filter, setFilter] = useState('All');
    const [productSearch, setProductSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('top');
    const [sent, setSent] = useState(false);
    const form = useForm({ name: '', mobile: '', company: '', product_name: '', message: '' });
    const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category))], [products]);
    const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(`Hello ${settings.company_name}, I need a quotation for an electric panel.`)}`;
    const phoneUrl = `tel:${settings.phone.replace(/[^\d+]/g, '')}`;
    const filteredProducts = useMemo(() => products.filter((product) => {
        const matchesCategory = filter === 'All' || product.category === filter;
        const query = productSearch.trim().toLowerCase();
        const matchesSearch = !query || `${product.name} ${product.subtitle} ${product.category}`.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    }), [filter, productSearch]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const visibleSections = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            if (visibleSections[0]) setActiveMenu(visibleSections[0].target.id);
        }, { rootMargin: '-24% 0px -66% 0px', threshold: 0 });

        navItems.forEach(({ id }) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    function submitEnquiry(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post('/enquiries', { preserveScroll: true, onSuccess: () => { setSent(true); form.reset(); } });
    }

    return <>
        <Head title={`${settings.company_name} | Electric Panel Manufacturer in Raipur`} />
        <div className="min-h-screen bg-white text-slate-950 selection:bg-orange-100 selection:text-slate-950">
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <a href="#top" className="flex shrink-0 items-center" aria-label={`${settings.company_name} home`}>
                        <img src={settings.logo_url ?? '/images/arya-elecromech-wordmark.png'} alt={`${settings.company_name} logo`} width="220" height="63" className="h-[46px] w-[161px] object-contain sm:h-14 sm:w-[196px]" />
                    </a>
                    <nav aria-label="Main navigation" className="hidden items-center gap-0.5 rounded-full border border-slate-200/80 bg-slate-50/80 p-1 xl:flex">
                        {navItems.map(({ label, href, id }) => <a key={id} href={href} aria-current={activeMenu === id ? 'location' : undefined} className={cn('rounded-full px-3 py-2 text-[13px] transition-all', activeMenu === id ? 'bg-white font-semibold text-[#174b9b] shadow-sm ring-1 ring-slate-200/70' : 'font-medium text-slate-600 hover:bg-white/80 hover:text-slate-950')}>{label}</a>)}
                    </nav>
                    <div className="hidden xl:block"><Button asChild className="bg-[#10264b] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#1a3767]"><a href={whatsappUrl} target="_blank" rel="noreferrer">Get a quote <ArrowUpRight className="size-4" /></a></Button></div>
                    <button type="button" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)} className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 xl:hidden">{mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
                </div>
                {mobileMenuOpen && <nav aria-label="Mobile navigation" className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg xl:hidden"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-3">{navItems.map(({ label, href, id }) => <a key={id} href={href} aria-current={activeMenu === id ? 'location' : undefined} onClick={() => setMobileMenuOpen(false)} className={cn('flex min-h-11 items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors', activeMenu === id ? 'border-blue-200 bg-blue-50 font-semibold text-[#174b9b]' : 'border-slate-100 font-medium text-slate-700 hover:bg-slate-50')}>{label}{activeMenu === id && <span className="size-1.5 rounded-full bg-[#174b9b]" />}</a>)}<a href={whatsappUrl} target="_blank" rel="noreferrer" className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#10264b] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a3767] sm:col-span-1">Get a quote <ArrowUpRight className="size-4" /></a></div></nav>}
            </header>

            <main>
                <section id="top" className="relative isolate overflow-hidden bg-[#f3f6fa] text-[#10243e]">
                    <div className="pointer-events-none absolute inset-0 -z-10 opacity-70" style={{ backgroundImage: 'linear-gradient(rgba(15,23,42,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.045) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                    <div className="absolute -right-48 -top-64 -z-10 size-[38rem] rounded-full bg-blue-200/50 blur-3xl" />
                    <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 min-[1150px]:min-h-[650px] min-[1150px]:grid-cols-[.9fr_1.1fr] min-[1150px]:gap-12 lg:px-8 lg:py-20">
                        <div className="max-w-2xl">
                            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-slate-700 shadow-sm"><span className="size-1.5 rounded-full bg-[#f4772b]" />{home.hero_kicker}</p>
                            <h1 className="mt-6 max-w-[620px] text-[2.8rem] font-bold leading-[1.04] tracking-[-.05em] text-[#10243e] sm:text-6xl min-[1150px]:text-6xl 2xl:text-[4.25rem]">{home.hero_title}<br /><span className="text-[#e76527]">{home.hero_highlight}</span></h1>
                            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">{home.hero_description}</p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="h-12 bg-[#f4772b] px-5 text-white shadow-lg shadow-orange-950/30 hover:bg-[#ff8a45]"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />Talk to an engineer <ArrowUpRight className="size-4" /></a></Button>
                                <Button asChild size="lg" variant="outline" className="h-12 border-slate-300 bg-white px-5 text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50"><a href="#catalogue">Explore products <ArrowDown className="size-4" /></a></Button>
                            </div>
                            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-200 pt-6">
                                {[['Made to order', 'Project-specific engineering'], ['In-house', 'Fabrication & wiring'], ['Tested', 'Before dispatch']].map(([value, label]) => <div key={label}><p className="text-lg font-bold tracking-tight text-[#10243e]">{value}</p><p className="mt-1 text-[10px] font-medium uppercase tracking-[.15em] text-slate-500">{label}</p></div>)}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative overflow-hidden rounded-[1.4rem] border border-white bg-white p-2 shadow-2xl shadow-slate-900/15 sm:p-3">
                                <div className="relative overflow-hidden rounded-xl bg-[#0a1424]">
                                    {home.hero_image_url && <img src={home.hero_image_url} alt={`${settings.company_name} electrical panel line-up`} className="aspect-[1.34/1] w-full object-cover transition-transform duration-700 hover:scale-[1.025] sm:aspect-[1.42/1]" />}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071224]/90 via-[#071224]/30 to-transparent px-5 pb-5 pt-16 sm:px-7 sm:pb-6">
                                        <p className="text-sm font-semibold text-white sm:text-base">Low-voltage switchgear line-up</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="scroll-mt-24 py-20 sm:py-24">
                    <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:px-8">
                        <div className="relative">
                            {home.about_image_url && <img src={home.about_image_url} alt={`${settings.company_name} manufacturing works`} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" />}
                            <div className="absolute -bottom-5 right-4 max-w-[270px] rounded-xl bg-[#10264b] px-5 py-4 text-white shadow-xl sm:right-8"><p className="text-[9px] font-bold uppercase tracking-[.22em] text-blue-200">Company profile</p><p className="mt-1 font-semibold">{settings.company_name}</p></div>
                        </div>
                        <div className="pt-2 lg:pl-4">
                            <Eyebrow>About us</Eyebrow>
                            <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-[-.035em] text-[#132747] sm:text-4xl">{home.about_heading}</h2>
                            <p className="mt-5 text-base leading-7 text-slate-600">{home.about_paragraph_one}</p>
                            <p className="mt-4 text-base leading-7 text-slate-600">{home.about_paragraph_two}</p>
                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <InfoTile icon={HardHat} label="CEO" value={settings.ceo_name} />
                                <InfoTile icon={Wrench} label="Manufacturing" value="In-house fabrication & wiring" />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="catalogue" className="scroll-mt-20 bg-[#f5f7fa] py-20 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div><Eyebrow>Product catalogue</Eyebrow><h2 className="mt-3 text-3xl font-bold tracking-[-.035em] text-[#132747] sm:text-4xl">{home.catalogue_heading}</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">{home.catalogue_intro}</p></div>
                            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#174b9b] hover:text-[#10264b]">Discuss your requirement <ArrowRight className="size-4" /></a>
                        </div>
                        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap gap-2" aria-label="Filter products by category">{categories.map((category) => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)} className={cn('rounded-full border px-4 py-2 text-xs font-semibold transition-colors', filter === category ? 'border-[#10264b] bg-[#10264b] text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900')}>{category}</button>)}</div>
                            <label className="relative block w-full lg:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} className="h-10 w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Search panels..." aria-label="Search catalogue" /></label>
                        </div>
                        <p className="mt-5 text-xs font-medium text-slate-500">Showing <span className="text-slate-900">{filteredProducts.length}</span> of {products.length} products</p>
                        {filteredProducts.length > 0 ? <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.code} product={product} onSelect={() => setSelectedProduct(product)} />)}</div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><Search className="mx-auto size-7 text-slate-400" /><p className="mt-3 font-semibold text-slate-800">No panels found</p><p className="mt-1 text-sm text-slate-500">Try a different product name or category.</p></div>}
                    </div>
                </section>

                <section id="services" className="scroll-mt-20 py-20 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Eyebrow>Services</Eyebrow><h2 className="mt-3 text-3xl font-bold tracking-[-.035em] text-[#132747] sm:text-4xl">{home.services_heading}</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">{home.services_intro}</p>
                        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{services.map(({ id, icon_name, title, detail }, index) => { const Icon = categoryIconMap[icon_name as keyof typeof categoryIconMap] ?? Wrench; return <article key={id} className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5"><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-[#174b9b] transition-colors group-hover:bg-[#10264b] group-hover:text-white"><Icon className="size-5" /></span><span className="font-mono text-xs text-slate-400">{String(index + 1).padStart(2, '0')}</span></div><h3 className="mt-5 font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p></article>; })}</div>
                    </div>
                </section>

                <section id="industries" className="scroll-mt-20 bg-[#101d35] py-20 text-white sm:py-24">
                    <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-8">
                        <div><Eyebrow dark>Industries</Eyebrow><h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-.035em] sm:text-4xl">{home.industries_heading}</h2><p className="mt-4 max-w-xl leading-7 text-slate-300">{home.industries_intro}</p></div>
                        <div className="flex flex-wrap gap-2.5">{industries.map((industry) => <span key={industry} className="rounded-lg border border-white/15 bg-white/[.04] px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-orange-400/70 hover:bg-white/[.08]"><span className="mr-2 text-[#f2792c]">/</span>{industry}</span>)}</div>
                    </div>
                </section>

                <section id="process" className="scroll-mt-24 bg-[#f4f7fb] py-20 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                            <div><Eyebrow>Project delivery</Eyebrow><h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-[-.04em] text-[#132747] sm:text-4xl">{home.process_heading}</h2></div>
                            <p className="max-w-lg text-sm leading-6 text-slate-600 md:pb-1">{home.process_intro}</p>
                        </div>
                        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{steps.map(({ id, step_number, icon_name, title, detail }) => { const Icon = categoryIconMap[icon_name as keyof typeof categoryIconMap] ?? Check; const number = String(step_number).padStart(2, '0'); return <article key={id} className="group relative flex min-h-[230px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-6"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-[#174b9b] transition-colors group-hover:bg-[#174b9b] group-hover:text-white"><Icon className="size-5" /></span><span className="font-mono text-xs font-semibold tracking-[.16em] text-slate-400">STEP {number}</span></div><h3 className="mt-7 text-lg font-bold tracking-tight text-[#132747]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p><span className="mt-auto block pt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[#d85b12]">{number} <span aria-hidden="true">/ {String(steps.length).padStart(2, '0')}</span></span></article>; })}</div>
                    </div>
                </section>

                <section id="contact" className="scroll-mt-20 bg-[#f4f7fb] py-20 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                            <div><Eyebrow>Contact</Eyebrow><h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-.04em] text-[#132747] sm:text-4xl">{home.contact_heading}</h2></div>
                            <p className="max-w-lg text-sm leading-6 text-slate-600 md:pb-1">{home.contact_intro}</p>
                        </div>
                        <div className="grid items-stretch gap-5 lg:grid-cols-[.92fr_1.08fr] lg:gap-6">
                        <div className="rounded-2xl bg-[#10264b] p-5 text-white shadow-xl shadow-blue-950/10 sm:p-7">
                            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-blue-200">Contact information</p>
                            <div className="mt-6 space-y-5">
                                <ContactLink icon={Phone} label="Mobile" value={settings.phone} href={phoneUrl} />
                                <ContactLink icon={MessageCircle} label="WhatsApp" value="Message our team" href={whatsappUrl} external />
                                <ContactLink icon={Mail} label="Email" value={settings.email} href={`mailto:${settings.email}`} />
                            </div>
                            <div className="mt-7 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-[.7fr_1.3fr]">
                                {settings.gstin && <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-blue-200">GSTIN</p><p className="mt-1.5 text-sm font-semibold">{settings.gstin}</p></div>}
                                <div className={settings.gstin ? '' : 'sm:col-span-2'}><p className="text-[10px] font-bold uppercase tracking-[.2em] text-blue-200">Works address</p><p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-slate-100">{settings.address}</p></div>
                            </div>
                            {settings.address && <a href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-blue-100 transition-colors hover:text-white"><MapPin className="size-4" />Open works address in Maps <ArrowUpRight className="size-3.5" /></a>}
                            {settings.map_embed_url && <div className="mt-4 overflow-hidden rounded-xl border border-white/15 bg-white/10 p-1">
                                <iframe
                                    title={`${settings.company_name} location map`}
                                    src={settings.map_embed_url}
                                    className="h-52 w-full rounded-lg border-0 bg-slate-100 sm:h-56"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    allowFullScreen
                                />
                            </div>}
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl shadow-slate-900/5 sm:p-7 lg:p-8">
                            <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-start"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#d85b12]">Project enquiry</p><h3 className="mt-2 text-xl font-bold tracking-tight text-[#132747]">Request a quotation</h3></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">No obligation</span></div>
                            <p className="mt-4 text-sm leading-6 text-slate-600">Tell us a little about your project and the panel you need.</p>
                            {sent && <div role="status" className="mt-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><Check className="mt-0.5 size-4 shrink-0" /><span>Thank you. Your enquiry has been received.</span></div>}
                            <form onSubmit={submitEnquiry} className="mt-6 space-y-4">
                                <Field label="Name" required><input name="name" autoComplete="name" required value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className={inputClass} placeholder="Your name" />{form.errors.name && <span className="mt-1 block text-xs text-rose-600">{form.errors.name}</span>}</Field>
                                <Field label="Mobile" required><input name="mobile" type="tel" autoComplete="tel" required pattern="[0-9+() -]{8,30}" value={form.data.mobile} onChange={(e) => form.setData('mobile', e.target.value)} className={inputClass} placeholder="+91" />{form.errors.mobile && <span className="mt-1 block text-xs text-rose-600">{form.errors.mobile}</span>}</Field>
                                <Field label="Company"><input name="company" autoComplete="organization" value={form.data.company} onChange={(e) => form.setData('company', e.target.value)} className={inputClass} placeholder="Company name" />{form.errors.company && <span className="mt-1 block text-xs text-rose-600">{form.errors.company}</span>}</Field>
                                <Field label="Product"><div className="relative"><select name="product_name" value={form.data.product_name} onChange={(e) => form.setData('product_name', e.target.value)} className={cn(inputClass, 'appearance-none pr-10')}><option value="">Select panel (optional)</option>{products.map((product) => <option key={product.code} value={product.name}>{product.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" /></div>{form.errors.product_name && <span className="mt-1 block text-xs text-rose-600">{form.errors.product_name}</span>}</Field>
                                <Field label="Requirement"><textarea name="message" rows={4} value={form.data.message} onChange={(e) => form.setData('message', e.target.value)} className={cn(inputClass, 'resize-y')} placeholder="Share load, rating or project details" />{form.errors.message && <span className="mt-1 block text-xs text-rose-600">{form.errors.message}</span>}</Field>
                                <Button type="submit" disabled={form.processing} className="h-12 w-full bg-[#10264b] hover:bg-[#1b3e75]">{form.processing ? 'Sending…' : 'Send enquiry'} <ArrowRight className="size-4" /></Button>
                            </form>
                        </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 bg-[#081526] text-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_.8fr] lg:grid-cols-[1.3fr_.7fr_.8fr] lg:gap-14 lg:px-8 lg:py-16">
                    <div>
                        <a href="#top" aria-label="Back to home" className="inline-flex items-center"><img src={settings.logo_url ?? '/images/arya-elecromech-wordmark-dark.png'} alt={`${settings.company_name} logo`} width="250" height="72" className="h-[58px] w-[202px] object-contain object-left sm:h-[66px] sm:w-[230px]" /></a>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">{settings.company_name} · Electrical panel engineering and project support.</p>
                    </div>
                    <nav aria-label="Footer navigation">
                        <h2 className="text-xs font-bold uppercase tracking-[.18em] text-slate-200">Explore</h2>
                        <div className="mt-4 grid gap-3 text-sm text-slate-400">
                            {[['About', '#about'], ['Catalogue', '#catalogue'], ['Services', '#services'], ['Industries', '#industries'], ['Our process', '#process']].map(([label, href]) => <a key={href} href={href} className="w-fit transition-colors hover:text-white">{label}</a>)}
                        </div>
                    </nav>
                    <div className="rounded-2xl border border-white/10 bg-white/[.035] p-5 sm:p-6">
                        <h2 className="text-xs font-bold uppercase tracking-[.18em] text-slate-200">Start a project</h2>
                        <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">Have a panel requirement or an upcoming installation?</p>
                        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#f4772b] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition-all hover:-translate-y-0.5 hover:bg-[#e76527]">Talk to our team <ArrowUpRight className="size-4" /></a>
                    </div>
                </div>
                <div className="border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><p>© {new Date().getFullYear()} {settings.company_name}. All rights reserved.</p><a href="#top" className="inline-flex w-fit items-center gap-1 font-medium text-slate-400 transition-colors hover:text-white">Back to top <ArrowUpRight className="size-3.5" /></a></div>
                </div>
            </footer>

            <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp" className="group fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#19c563] text-white shadow-lg shadow-emerald-950/30 transition duration-300 hover:scale-110 hover:bg-[#13b85a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60 motion-reduce:transition-none">
                <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#19c563] opacity-40 animate-ping motion-reduce:animate-none" />
                <span className="relative grid size-14 place-items-center rounded-full"><MessageCircle className="size-6 transition-transform group-hover:rotate-[-8deg]" /><span className="absolute right-[15px] top-[16px] size-2 rounded-full bg-white" /></span>
            </a>

            <Dialog open={selectedProduct !== null} onOpenChange={(open) => { if (!open) setSelectedProduct(null); }}>
                {selectedProduct && <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl"><div className="grid sm:grid-cols-[.95fr_1.05fr]"><img src={selectedProduct.image_url ?? '/images/panel-lineup.png'} alt={selectedProduct.name} className="aspect-square w-full bg-slate-100 object-cover sm:h-full" /><div className="p-6 sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#d85b12]">{selectedProduct.code} · {selectedProduct.category}</p><DialogTitle className="mt-3 text-2xl font-bold text-[#132747]">{selectedProduct.name}</DialogTitle><DialogDescription className="mt-1 text-sm text-slate-500">{selectedProduct.subtitle}</DialogDescription><p className="mt-5 text-sm leading-7 text-slate-600">{selectedProduct.description}</p><p className="mt-5 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600"><SlidersHorizontal className="mt-0.5 size-4 shrink-0 text-[#174b9b]" />Panel configuration is finalized to your approved drawings, load requirements and switchgear selection.</p><Button asChild className="mt-6 w-full bg-[#10264b] hover:bg-[#1b3e75]"><a href={whatsappUrl} target="_blank" rel="noreferrer">Ask about this panel <ArrowUpRight className="size-4" /></a></Button></div></div></DialogContent>}
            </Dialog>
        </div>
    </>;
}

const inputClass = 'mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
    return <p className={cn('flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em]', dark ? 'text-blue-200' : 'text-[#d85b12]')}><span className="size-1.5 rounded-full bg-[#ed6b1b]" />{children}</p>;
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
    return <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-[#174b9b]"><Icon className="size-4" /></span><div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{value}</p></div></div>;
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: () => void }) {
    return <button type="button" onClick={onSelect} className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <div className="relative overflow-hidden bg-[#edf2f8] p-4">{product.image_url ? <img src={product.image_url} alt={product.name} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="grid aspect-[4/3] place-items-center rounded-lg bg-slate-100 text-slate-400"><Boxes className="size-10" /></div>}<span className="absolute left-6 top-6 rounded-md bg-white/90 px-2 py-1 font-mono text-[10px] font-semibold text-slate-600 backdrop-blur">{product.code}</span></div>
        <div className="p-5"><div className="flex items-center justify-between gap-3"><span className="text-[9px] font-bold uppercase tracking-[.16em] text-[#174b9b]">{product.category}</span><ArrowUpRight className="size-4 text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#174b9b]" /></div><h3 className="mt-3 text-lg font-bold tracking-tight text-[#132747]">{product.name}</h3><p className="mt-1 text-sm text-slate-500">{product.subtitle}</p><span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">View details <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></span></div>
    </button>;
}

function ContactLink({ icon: Icon, label, value, href, external = false }: { icon: typeof Phone; label: string; value: string; href: string; external?: boolean }) {
    return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="group flex w-fit items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-white/10 text-white transition-colors group-hover:bg-white/20"><Icon className="size-4" /></span><span><span className="block text-[9px] font-bold uppercase tracking-[.18em] text-blue-200">{label}</span><span className="mt-1 block text-sm font-semibold text-white group-hover:underline">{value}</span></span></a>;
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return <label className="block text-sm font-medium text-slate-800">{label}{required && <span className="ml-1 text-[#d85b12]">*</span>}{children}</label>;
}
