import { Head, useForm } from '@inertiajs/react';
import { ExternalLink, ImagePlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdminField, AdminPageHeader, TextArea, TextInput } from '@/components/admin/field';
import { AdminLayout } from '@/layouts/admin-layout';

type Settings = { company_name: string; ceo_name: string; phone: string; email: string; whatsapp_number: string; gstin: string | null; address: string; map_embed_url: string | null };
type Props = { settings: Settings; logoUrl: string | null };
type FormData = Settings & { logo: File | null };

export default function SettingsEditor({ settings, logoUrl }: Props) {
    const form = useForm<FormData>({ ...settings, gstin: settings.gstin ?? '', map_embed_url: settings.map_embed_url ?? '', logo: null });
    function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
        form.clearErrors(key);
        form.setData(key, value as never);
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post('/admin/settings', { forceFormData: true, preserveScroll: true });
    }

    return <AdminLayout title="Contact & branding">
        <Head title="Contact & branding · Admin" />
        <AdminPageHeader title="Contact & branding" description="Keep your public contact details, company logo and map location up to date." />
        <form onSubmit={submit} className="space-y-6">
            <Card className="rounded-2xl border-slate-200 p-5 sm:p-7"><div className="mb-6 border-b border-slate-100 pb-4"><h2 className="font-bold text-slate-950">Company details</h2><p className="mt-1 text-sm text-slate-500">These appear in your website’s contact section.</p></div><div className="grid gap-5 md:grid-cols-2">
                <AdminField label="Company name" error={form.errors.company_name}><TextInput value={form.data.company_name} onChange={(e) => updateField('company_name', e.target.value)} required /></AdminField>
                <AdminField label="CEO / contact person" error={form.errors.ceo_name}><TextInput value={form.data.ceo_name} onChange={(e) => updateField('ceo_name', e.target.value)} required /></AdminField>
                <AdminField label="GSTIN" error={form.errors.gstin}><TextInput value={form.data.gstin ?? ''} onChange={(e) => updateField('gstin', e.target.value)} placeholder="Optional" /></AdminField>
                <AdminField label="Phone number" error={form.errors.phone}><TextInput type="tel" value={form.data.phone} onChange={(e) => updateField('phone', e.target.value)} required /></AdminField>
                <AdminField label="Email address" error={form.errors.email}><TextInput type="email" value={form.data.email} onChange={(e) => updateField('email', e.target.value)} required /></AdminField>
                <AdminField label="WhatsApp number" hint="Country code and digits only, e.g. 919876543210." error={form.errors.whatsapp_number}><TextInput inputMode="numeric" value={form.data.whatsapp_number} onChange={(e) => updateField('whatsapp_number', e.target.value.replace(/\D/g, ''))} required /></AdminField>
                <AdminField label="Works address" error={form.errors.address}><TextArea value={form.data.address} onChange={(e) => updateField('address', e.target.value)} required /></AdminField>
                <AdminField label="Google Maps embed URL" hint="Paste the Google Maps embed link for your location." error={form.errors.map_embed_url}><TextArea value={form.data.map_embed_url ?? ''} onChange={(e) => updateField('map_embed_url', e.target.value)} placeholder="https://maps.google.com/maps?...&output=embed" /></AdminField>
            </div></Card>
            <Card className="rounded-2xl border-slate-200 p-5 sm:p-7"><div className="mb-6 border-b border-slate-100 pb-4"><h2 className="font-bold text-slate-950">Website logo</h2><p className="mt-1 text-sm text-slate-500">Upload a clear logo. PNG with transparent background works best.</p></div><AdminField label="Replace logo" hint="JPG, PNG or WebP · maximum 5 MB" error={form.errors.logo}>
                <div className="mt-1.5 flex flex-col gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center"><div className="grid h-20 w-48 shrink-0 place-items-center rounded-lg bg-[#081526] px-3">{logoUrl ? <img src={logoUrl} alt="Current company logo" className="max-h-16 max-w-full object-contain" /> : <ImagePlus className="size-6 text-slate-400" />}</div><div className="min-w-0 flex-1"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => updateField('logo', e.target.files?.[0] ?? null)} className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 file:shadow-sm" /><p className="mt-2 text-xs text-slate-500">{form.data.logo?.name ?? 'Leave empty to keep the current logo.'}</p></div></div>
            </AdminField></Card>
            <div className="sticky bottom-3 flex justify-end rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur"><Button type="submit" disabled={form.processing} className="h-11 bg-[#10264b] px-5 hover:bg-[#1a3767]"><Save className="size-4" />{form.processing ? 'Saving…' : 'Save contact & branding'}</Button></div>
        </form>
    </AdminLayout>;
}
