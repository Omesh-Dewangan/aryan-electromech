import { Head, router } from '@inertiajs/react';
import { Mail, MessageCircle, PhoneCall } from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import { AdminPageHeader } from '@/components/admin/field';
import { Card } from '@/components/ui/card';

type Enquiry = { id: number; name: string; mobile: string; company: string | null; product_name: string | null; message: string | null; status: 'new' | 'contacted' | 'closed'; created_at: string };
type PageLink = { url: string | null; label: string; active: boolean };
type Props = { enquiries: { data: Enquiry[]; links: PageLink[]; total: number; from: number | null; to: number | null } };

const statusStyle: Record<Enquiry['status'], string> = {
    new: 'bg-blue-50 text-blue-700 ring-blue-600/10',
    contacted: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    closed: 'bg-slate-100 text-slate-600 ring-slate-500/10',
};

export default function EnquiriesAdmin({ enquiries }: Props) {
    function updateStatus(id: number, status: Enquiry['status']) {
        router.patch(`/admin/enquiries/${id}`, { status }, { preserveScroll: true });
    }

    return <AdminLayout title="Enquiries">
        <Head title="Enquiries · Admin" />
        <AdminPageHeader title="Website enquiries" description="Review quote requests and update their status as you follow up." />
        <Card className="overflow-hidden rounded-2xl border-slate-200">
            <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="font-bold text-slate-950">All messages</h2><p className="mt-1 text-xs text-slate-500">{enquiries.total} total enquiries</p></div><p className="text-xs text-slate-500">Use the status menu to track follow-up.</p></div>
            {enquiries.data.length ? <div className="divide-y divide-slate-100">{enquiries.data.map((enquiry) => <article key={enquiry.id} className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_1.3fr_auto] lg:items-start">
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-900">{enquiry.name}</h3>{enquiry.company && <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{enquiry.company}</span>}</div><p className="mt-1 text-xs text-slate-500">{new Date(enquiry.created_at).toLocaleString()}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs"><a href={`tel:${enquiry.mobile}`} className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-700"><PhoneCall className="size-3.5" />{enquiry.mobile}</a>{enquiry.product_name && <span className="inline-flex items-center gap-1.5 text-slate-600"><Mail className="size-3.5" />{enquiry.product_name}</span>}</div></div>
                <div className="min-w-0 rounded-xl bg-slate-50 p-3.5"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Requirement</p><p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{enquiry.message || 'No additional message provided.'}</p></div>
                <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${statusStyle[enquiry.status]}`}>{enquiry.status}</span><select aria-label={`Update status for ${enquiry.name}`} value={enquiry.status} onChange={(e) => updateStatus(enquiry.id, e.target.value as Enquiry['status'])} className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500"><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></div>
            </article>)}</div> : <div className="px-6 py-16 text-center"><MessageCircle className="mx-auto size-8 text-slate-300" /><h3 className="mt-4 font-semibold text-slate-800">No enquiries yet</h3><p className="mt-1 text-sm text-slate-500">New quote requests will appear here.</p></div>}
            {enquiries.links.length > 3 && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6"><p className="text-xs text-slate-500">Showing {enquiries.from}–{enquiries.to} of {enquiries.total}</p><div className="flex flex-wrap gap-1">{enquiries.links.map((link, index) => <a key={`${link.label}-${index}`} href={link.url ?? '#'} onClick={(event) => { if (!link.url) event.preventDefault(); }} className={`grid min-h-9 min-w-9 place-items-center rounded-lg px-2 text-xs ${link.active ? 'bg-[#10264b] font-semibold text-white' : link.url ? 'border border-slate-200 text-slate-600 hover:bg-slate-50' : 'cursor-not-allowed text-slate-300'}`}>{link.label.replace('&laquo;', '«').replace('&raquo;', '»')}</a>)}</div></div>}
        </Card>
    </AdminLayout>;
}
