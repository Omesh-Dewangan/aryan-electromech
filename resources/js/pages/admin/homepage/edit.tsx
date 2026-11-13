import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdminField, AdminPageHeader, TextArea, TextInput } from '@/components/admin/field';
import { AdminLayout } from '@/layouts/admin-layout';

type Content = {
    hero_kicker: string; hero_title: string; hero_highlight: string; hero_description: string;
    about_heading: string; about_paragraph_one: string; about_paragraph_two: string;
    catalogue_heading: string; catalogue_intro: string; services_heading: string; services_intro: string;
    industries_heading: string; industries_intro: string; process_heading: string; process_intro: string;
    contact_heading: string; contact_intro: string;
};
type Props = { content: Content; images: { hero: string | null; about: string | null } };
type FormData = Content & { hero_image: File | null; about_image: File | null };

export default function HomepageEditor({ content, images }: Props) {
    const form = useForm<FormData>({ ...content, hero_image: null, about_image: null });
    const input = (key: keyof Content, label: string, hint?: string) => <AdminField key={key} label={label} hint={hint} error={form.errors[key]}><TextInput value={form.data[key]} onChange={(event) => { form.clearErrors(key); form.setData(key, event.target.value); }} /></AdminField>;
    const area = (key: keyof Content, label: string, hint?: string) => <AdminField key={key} label={label} hint={hint} error={form.errors[key]}><TextArea value={form.data[key]} onChange={(event) => { form.clearErrors(key); form.setData(key, event.target.value); }} /></AdminField>;
    const upload = (key: 'hero_image' | 'about_image', label: string, image: string | null) => <AdminField label={label} hint="JPG, PNG or WebP · maximum 5 MB" error={form.errors[key]}>
        <div className="mt-1.5 grid gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 sm:grid-cols-[140px_1fr] sm:items-center">
            {image ? <img src={image} alt={`${label} preview`} className="h-24 w-full rounded-lg bg-white object-cover sm:w-[140px]" /> : <div className="grid h-24 place-items-center rounded-lg bg-white text-slate-400"><ImagePlus className="size-6" /></div>}
            <div><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { form.clearErrors(key); form.setData(key, event.target.files?.[0] ?? null); }} className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 file:shadow-sm" /><p className="mt-2 text-xs text-slate-500">{form.data[key]?.name ?? 'Choose a new image to replace the current one.'}</p></div>
        </div>
    </AdminField>;

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post('/admin/homepage', { forceFormData: true, preserveScroll: true });
    }

    return <AdminLayout title="Homepage content">
        <Head title="Homepage content · Admin" />
        <AdminPageHeader title="Homepage content" description="Edit the words and photos visitors see on your homepage. Leave an image empty to keep the current one." action={<Button asChild variant="outline" className="bg-white"><a href="/" target="_blank" rel="noreferrer"><ArrowLeft className="size-4" />View homepage</a></Button>} />
        <form onSubmit={submit} className="space-y-6">
            <Card className="rounded-2xl border-slate-200 p-5 sm:p-7"><div className="mb-6 border-b border-slate-100 pb-4"><h2 className="font-bold text-slate-950">Main banner</h2><p className="mt-1 text-sm text-slate-500">The first section visitors see.</p></div><div className="grid gap-5 md:grid-cols-2">{input('hero_kicker', 'Small label')}{input('hero_title', 'Main heading')}{input('hero_highlight', 'Highlighted heading')}{area('hero_description', 'Short introduction', 'Keep it clear and concise.')}<div className="md:col-span-2">{upload('hero_image', 'Banner photo', images.hero)}</div></div></Card>
            <Card className="rounded-2xl border-slate-200 p-5 sm:p-7"><div className="mb-6 border-b border-slate-100 pb-4"><h2 className="font-bold text-slate-950">About your company</h2><p className="mt-1 text-sm text-slate-500">Tell visitors who you are and how you work.</p></div><div className="grid gap-5 md:grid-cols-2">{input('about_heading', 'Section heading')}{area('about_paragraph_one', 'First paragraph')}{area('about_paragraph_two', 'Second paragraph')}<div className="md:col-span-2">{upload('about_image', 'Company photo', images.about)}</div></div></Card>
            <Card className="rounded-2xl border-slate-200 p-5 sm:p-7"><div className="mb-6 border-b border-slate-100 pb-4"><h2 className="font-bold text-slate-950">Section headings and introductions</h2><p className="mt-1 text-sm text-slate-500">These update the catalogue, services, industries, process and contact sections.</p></div><div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
                {input('catalogue_heading', 'Catalogue heading')}{area('catalogue_intro', 'Catalogue introduction')}
                {input('services_heading', 'Services heading')}{area('services_intro', 'Services introduction')}
                {input('industries_heading', 'Industries heading')}{area('industries_intro', 'Industries introduction')}
                {input('process_heading', 'Work process heading')}{area('process_intro', 'Work process introduction')}
                {input('contact_heading', 'Contact heading')}{area('contact_intro', 'Contact introduction')}
            </div></Card>
            <div className="sticky bottom-3 flex justify-end rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur"><Button type="submit" disabled={form.processing} className="h-11 bg-[#10264b] px-5 hover:bg-[#1a3767]"><Save className="size-4" />{form.processing ? 'Saving…' : 'Save homepage changes'}</Button></div>
        </form>
    </AdminLayout>;
}
