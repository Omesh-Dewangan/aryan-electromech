import { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowUpRight, ImagePlus, PackagePlus, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { AdminField, AdminPageHeader, TextArea, TextInput } from '@/components/admin/field';
import { AdminLayout } from '@/layouts/admin-layout';

type Product = { id: number; code: string; slug: string; name: string; subtitle: string; category: string; description: string; image_path: string | null; image_url: string | null; is_active: boolean; sort_order: number };
type Props = { products: Product[]; categories: string[] };
type FormData = { code: string; name: string; subtitle: string; category: string; description: string; image: File | null; is_active: boolean; sort_order: number };
const blank: FormData = { code: '', name: '', subtitle: '', category: '', description: '', image: null, is_active: true, sort_order: 0 };

export default function ProductsAdmin({ products, categories }: Props) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const form = useForm<FormData>(blank);
    function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
        form.clearErrors(key);
        form.setData(key, value);
    }
    const filtered = useMemo(() => products.filter((product) => `${product.name} ${product.code} ${product.category}`.toLowerCase().includes(search.toLowerCase())), [products, search]);

    function openEditor(product?: Product) {
        setEditing(product ?? null);
        form.clearErrors();
        if (product) form.setData({ code: product.code, name: product.name, subtitle: product.subtitle, category: product.category, description: product.description, image: null, is_active: product.is_active, sort_order: product.sort_order });
        else form.setData(blank);
        setOpen(true);
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const options = { forceFormData: true, preserveScroll: true, onSuccess: () => setOpen(false) };
        if (editing) form.transform((data) => ({ ...data, _method: 'put' })).post(`/admin/products/${editing.id}`, options);
        else form.post('/admin/products', options);
    }

    function remove(product: Product) {
        if (window.confirm(`Remove “${product.name}” from the public catalogue?`)) router.delete(`/admin/products/${product.id}`, { preserveScroll: true });
    }

    return <AdminLayout title="Products & catalogue">
        <Head title="Products & catalogue · Admin" />
        <AdminPageHeader title="Products & catalogue" description="Add products, replace photos and control which items appear on the public website." action={<Button onClick={() => openEditor()} className="h-11 bg-[#10264b] hover:bg-[#1a3767]"><Plus className="size-4" />Add product</Button>} />
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-600">{products.length} {products.length === 1 ? 'product' : 'products'} in your catalogue</p><label className="relative block w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search products" placeholder="Search products…" className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label></div>
        {filtered.length ? <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{filtered.map((product) => <Card key={product.id} className="overflow-hidden rounded-2xl border-slate-200 transition-shadow hover:shadow-md">
            <div className="flex gap-4 p-4 sm:p-5"><div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100">{product.image_url ? <img src={product.image_url} alt={product.name} className="size-full object-cover" /> : <ImagePlus className="size-6 text-slate-400" />}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-base font-bold text-slate-950">{product.name}</p><p className="mt-1 truncate text-xs text-slate-500">{product.subtitle}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${product.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{product.is_active ? 'Visible' : 'Hidden'}</span></div><p className="mt-2 truncate text-[10px] font-bold uppercase tracking-[.12em] text-[#174b9b]">{product.category} · {product.code}</p></div></div>
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5"><span className="text-xs text-slate-500">Display order: {product.sort_order}</span><div className="flex gap-1"><button type="button" onClick={() => openEditor(product)} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-700 hover:bg-white hover:text-[#174b9b]"><Pencil className="size-3.5" />Edit</button><button type="button" onClick={() => remove(product)} aria-label={`Delete ${product.name}`} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" /></button></div></div>
        </Card>)}</div> : <Card className="rounded-2xl border-dashed p-12 text-center"><PackagePlus className="mx-auto size-8 text-slate-300" /><h2 className="mt-4 font-semibold text-slate-800">No matching products</h2><p className="mt-1 text-sm text-slate-500">Try another search or add your first product.</p><Button onClick={() => openEditor()} className="mt-5 bg-[#10264b]"><Plus className="size-4" />Add product</Button></Card>}

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
                <DialogTitle className="pr-8 text-xl font-bold text-slate-950">{editing ? 'Edit product' : 'Add a product'}</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">Product information and image shown in your public catalogue.</DialogDescription>
                <form onSubmit={submit} className="mt-2 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <AdminField label="Product name" error={form.errors.name}><TextInput value={form.data.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. PCC Panel" required /></AdminField>
                        <AdminField label="Product code" error={form.errors.code}><TextInput value={form.data.code} onChange={(e) => updateField('code', e.target.value)} placeholder="e.g. AE-11" required /></AdminField>
                        <AdminField label="Short description" error={form.errors.subtitle}><TextInput value={form.data.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} placeholder="e.g. Power Control Centre" required /></AdminField>
                        <AdminField label="Category" hint="Choose an existing category or type a new one." error={form.errors.category}><TextInput list="product-categories" value={form.data.category} onChange={(e) => updateField('category', e.target.value)} placeholder="Select or type a category" required /><datalist id="product-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist></AdminField>
                        <AdminField label="Display order" hint="Smaller numbers appear first." error={form.errors.sort_order}><TextInput type="number" min="0" value={form.data.sort_order} onChange={(e) => updateField('sort_order', Number(e.target.value))} required /></AdminField>
                        <AdminField label="Product photo" hint="JPG, PNG or WebP · maximum 5 MB" error={form.errors.image}><TextInput type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => updateField('image', e.target.files?.[0] ?? null)} className="file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold" />{editing?.image_url && <img src={editing.image_url} alt="Current product" className="mt-2 h-20 w-28 rounded-lg object-cover" />}</AdminField>
                    </div>
                    
                    <AdminField label="Full description" error={form.errors.description}><TextArea value={form.data.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Describe what this panel is used for." required /></AdminField>
                    <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} className="size-4 rounded border-slate-300 accent-[#174b9b]" />Show this product on the public website</label>
                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={form.processing} className="bg-[#10264b] hover:bg-[#1a3767]">{form.processing ? 'Saving…' : editing ? 'Save changes' : 'Add to catalogue'} <ArrowUpRight className="size-4" /></Button></div>
                </form>
            </DialogContent>
        </Dialog>
    </AdminLayout>;
}
