import { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowUpRight, Layers3, Pencil, Plus, Search, Trash2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { AdminField, AdminPageHeader, TextArea, TextInput } from '@/components/admin/field';
import { AdminLayout } from '@/layouts/admin-layout';

type Resource = 'services' | 'industries' | 'process';
type Item = { id: number; name?: string; title?: string; detail?: string; icon_name?: string; is_active: boolean; sort_order?: number; step_number?: number };
type Props = { resource: Resource; title: string; items: Item[] };
type FormData = { name: string; title: string; detail: string; icon_name: string; is_active: boolean; sort_order: number; step_number: number };
const initial: FormData = { name: '', title: '', detail: '', icon_name: 'Wrench', is_active: true, sort_order: 0, step_number: 1 };
const iconChoices = ['Wrench', 'Sparkles', 'ClipboardList', 'Boxes', 'Cable', 'RefreshCw', 'Factory', 'Check', 'Zap'];

const resourceCopy: Record<Resource, { heading: string; description: string; singular: string }> = {
    services: { heading: 'Services', description: 'Manage the services shown on your public homepage.', singular: 'service' },
    industries: { heading: 'Industries', description: 'Add or hide the industries your company supports.', singular: 'industry' },
    process: { heading: 'Work process', description: 'Edit the steps clients see from first brief through delivery.', singular: 'step' },
};

export default function CollectionAdmin({ resource, items }: Props) {
    const copy = resourceCopy[resource];
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Item | null>(null);
    const form = useForm<FormData>(initial);
    const filtered = useMemo(() => items.filter((item) => `${item.name ?? ''} ${item.title ?? ''} ${item.detail ?? ''}`.toLowerCase().includes(search.toLowerCase())), [items, search]);

    function openEditor(item?: Item) {
        setEditing(item ?? null);
        form.clearErrors();
        if (!item) form.setData(initial);
        else form.setData({
            name: item.name ?? '', title: item.title ?? '', detail: item.detail ?? '', icon_name: item.icon_name ?? 'Wrench',
            is_active: item.is_active, sort_order: item.sort_order ?? 0, step_number: item.step_number ?? items.length + 1,
        });
        setOpen(true);
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const url = `/admin/${resource}${editing ? `/${editing.id}` : ''}`;
        const options = { preserveScroll: true, onSuccess: () => setOpen(false) };
        if (editing) form.put(url, options); else form.post(url, options);
    }

    function remove(item: Item) {
        const name = item.name ?? item.title ?? 'this item';
        if (window.confirm(`Remove “${name}” from the public website?`)) router.delete(`/admin/${resource}/${item.id}`, { preserveScroll: true });
    }

    return <AdminLayout title={copy.heading}>
        <Head title={`${copy.heading} · Admin`} />
        <AdminPageHeader title={copy.heading} description={copy.description} action={<Button onClick={() => openEditor()} className="h-11 bg-[#10264b] hover:bg-[#1a3767]"><Plus className="size-4" />Add {copy.singular}</Button>} />
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-600">{items.length} {items.length === 1 ? copy.singular : `${copy.singular}s`}</p><label className="relative block w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} aria-label={`Search ${copy.heading.toLowerCase()}`} placeholder={`Search ${copy.heading.toLowerCase()}…`} className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label></div>
        <div className="grid gap-3">{filtered.map((item) => <Card key={item.id} className="flex flex-col gap-4 rounded-2xl border-slate-200 p-4 sm:flex-row sm:items-center sm:p-5"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#174b9b]">{resource === 'services' ? <Wrench className="size-5" /> : <Layers3 className="size-5" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-900">{resource === 'industries' ? item.name : item.title}</h2><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{item.is_active ? 'Visible' : 'Hidden'}</span></div><p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{item.detail ?? `Display order: ${item.sort_order}`}</p></div><div className="flex gap-1 sm:ml-auto"><button type="button" onClick={() => openEditor(item)} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#174b9b]"><Pencil className="size-3.5" />Edit</button><button type="button" onClick={() => remove(item)} aria-label={`Delete ${item.name ?? item.title}`} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" /></button></div></Card>)}</div>
        {!filtered.length && <Card className="rounded-2xl border-dashed p-12 text-center"><Layers3 className="mx-auto size-8 text-slate-300" /><h2 className="mt-4 font-semibold text-slate-800">Nothing to show</h2><p className="mt-1 text-sm text-slate-500">Add your first {copy.singular} to get started.</p><Button onClick={() => openEditor()} className="mt-5 bg-[#10264b]"><Plus className="size-4" />Add {copy.singular}</Button></Card>}

        <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogTitle className="pr-8 text-xl font-bold text-slate-950">{editing ? `Edit ${copy.singular}` : `Add ${copy.singular}`}</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">This information will appear in the matching section on your website.</DialogDescription>
            <form onSubmit={submit} className="mt-2 space-y-4">
                {resource === 'industries' ? <>
                    <AdminField label="Industry name" error={form.errors.name}><TextInput value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="e.g. Mining & minerals" required /></AdminField>
                    <AdminField label="Display order" hint="Smaller numbers appear first." error={form.errors.sort_order}><TextInput type="number" min="0" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', Number(e.target.value))} required /></AdminField>
                </> : <>
                    {resource === 'process' && <AdminField label="Step number" hint="Controls the order of the process steps." error={form.errors.step_number}><TextInput type="number" min="1" max="99" value={form.data.step_number} onChange={(e) => form.setData('step_number', Number(e.target.value))} required /></AdminField>}
                    <AdminField label={resource === 'process' ? 'Step title' : 'Service name'} error={form.errors.title}><TextInput value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder={resource === 'process' ? 'e.g. Drawing approval' : 'e.g. Panel design'} required /></AdminField>
                    <AdminField label="Description" error={form.errors.detail}><TextArea value={form.data.detail} onChange={(e) => form.setData('detail', e.target.value)} placeholder="Write a short, helpful description." required /></AdminField>
                    <AdminField label="Icon" hint="Choose the closest matching icon." error={form.errors.icon_name}><select value={form.data.icon_name} onChange={(e) => form.setData('icon_name', e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-blue-500">{iconChoices.map((icon) => <option key={icon} value={icon}>{icon}</option>)}</select></AdminField>
                    {resource === 'services' && <AdminField label="Display order" hint="Smaller numbers appear first." error={form.errors.sort_order}><TextInput type="number" min="0" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', Number(e.target.value))} required /></AdminField>}
                </>}
                <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} className="size-4 rounded border-slate-300 accent-[#174b9b]" />Show this on the public website</label>
                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={form.processing} className="bg-[#10264b] hover:bg-[#1a3767]">{form.processing ? 'Saving…' : editing ? 'Save changes' : `Add ${copy.singular}`} <ArrowUpRight className="size-4" /></Button></div>
            </form>
        </DialogContent></Dialog>
    </AdminLayout>;
}
