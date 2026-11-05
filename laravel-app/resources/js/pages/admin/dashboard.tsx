import { Link } from '@inertiajs/react';
import { ArrowRight, Boxes, Building2, ClipboardList, FileText, Plus, Settings2, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/layouts/admin-layout';
import { AdminPageHeader } from '@/components/admin/field';

type Enquiry = { id: number; name: string; mobile: string; product_name: string | null; status: 'new' | 'contacted' | 'closed'; created_at: string };
type Props = { stats: { products: number; services: number; industries: number; new_enquiries: number }; recentEnquiries: Enquiry[] };

const statusStyles = { new: 'bg-blue-50 text-blue-700', contacted: 'bg-amber-50 text-amber-700', closed: 'bg-slate-100 text-slate-600' };

export default function AdminDashboard({ stats, recentEnquiries }: Props) {
    const tiles = [
        { label: 'Products in catalogue', value: stats.products, icon: Boxes, href: '/admin/products', color: 'bg-blue-50 text-blue-700' },
        { label: 'Services', value: stats.services, icon: Wrench, href: '/admin/services', color: 'bg-violet-50 text-violet-700' },
        { label: 'Industries served', value: stats.industries, icon: Building2, href: '/admin/industries', color: 'bg-emerald-50 text-emerald-700' },
        { label: 'New enquiries', value: stats.new_enquiries, icon: ClipboardList, href: '/admin/enquiries', color: 'bg-orange-50 text-orange-700' },
    ];

    return <AdminLayout title="Dashboard">
        <AdminPageHeader title="Good to see you" description="This is your website workspace. Choose a section below to make an update." action={<Button asChild variant="outline" className="h-10 bg-white"><a href="/" target="_blank" rel="noreferrer">View live website <ArrowRight className="size-4" /></a></Button>} />
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">{tiles.map(({ label, value, icon: Icon, href, color }) => <Link key={label} href={href} className="group"><Card className="rounded-2xl border-slate-200 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><span className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon className="size-5" /></span><ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" /></div><p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-sm text-slate-600">{label}</p></Card></Link>)}</div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
            <Card className="overflow-hidden rounded-2xl border-slate-200">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-bold text-slate-950">Recent enquiries</h2><p className="mt-1 text-xs text-slate-500">Messages submitted through your website form.</p></div><Button asChild variant="outline" size="sm"><Link href="/admin/enquiries">View all</Link></Button></div>
                {recentEnquiries.length ? <div className="divide-y divide-slate-100">{recentEnquiries.map((enquiry) => <div key={enquiry.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{enquiry.name}<span className="ml-2 font-normal text-slate-500">{enquiry.mobile}</span></p><p className="mt-1 truncate text-xs text-slate-500">{enquiry.product_name || 'General enquiry'}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[enquiry.status]}`}>{enquiry.status}</span></div>)}</div> : <div className="px-6 py-12 text-center"><ClipboardList className="mx-auto size-7 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No enquiries yet</p><p className="mt-1 text-xs text-slate-500">New website messages will appear here.</p></div>}
            </Card>

            <Card className="rounded-2xl border-slate-200 p-5 sm:p-6"><h2 className="font-bold text-slate-950">Quick actions</h2><p className="mt-1 text-xs leading-5 text-slate-500">Common updates, ready when you are.</p><div className="mt-5 grid gap-2.5">
                {[
                    { label: 'Edit homepage text & photos', href: '/admin/homepage', icon: FileText },
                    { label: 'Add a catalogue product', href: '/admin/products', icon: Plus },
                    { label: 'Update contact details', href: '/admin/settings', icon: Settings2 },
                ].map(({ label, href, icon: Icon }) => <Link key={href} href={href} className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 px-3.5 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/60 hover:text-[#174b9b]"><Icon className="size-4" />{label}<ArrowRight className="ml-auto size-4 text-slate-400" /></Link>)}
            </div></Card>
        </div>
    </AdminLayout>;
}
