import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AdminField, TextInput, adminInput } from '@/components/admin/field';

export default function AdminLogin() {
    const form = useForm({ login_id: '', password: '', remember: true });
    function updateField<K extends keyof typeof form.data>(key: K, value: typeof form.data[K]) {
        form.clearErrors(key);
        form.setData(key, value);
    }
    const [showPassword, setShowPassword] = useState(false);

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post('/admin/login', { preserveScroll: true });
    }

    return <>
        <Head title="Admin login · Aryan Electromech" />
        <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_.95fr]">
            <section className="relative hidden overflow-hidden bg-[#10264b] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
                <div className="absolute -right-32 -top-32 size-[30rem] rounded-full bg-blue-400/15 blur-3xl" />
                <a href="/" aria-label="Aryan Electromech Engineers home" className="relative inline-flex w-fit items-center"><img src="/images/arya-elecromech-wordmark-dark.png" alt="Aryan Electromech Engineers" width="190" height="64" className="h-12 w-[190px] object-contain object-left" /></a>
                <div className="relative max-w-xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-200">Website manager</p><h1 className="mt-5 text-5xl font-bold leading-tight tracking-[-.04em]">Your website, made easy to manage.</h1><p className="mt-5 max-w-lg text-base leading-7 text-blue-100">Update your products, photos and company information from one simple place.</p></div>
                <p className="relative text-xs text-blue-200/70">Private administrator access</p>
            </section>
            <section className="flex items-center justify-center px-5 py-12 sm:px-8">
                <div className="w-full max-w-md">
                    <a href="/" aria-label="Aryan Electromech Engineers home" className="mb-9 inline-flex lg:hidden">
                        <img src="/images/arya-elecromech-wordmark.png" alt="Aryan Electromech Engineers" width="190" height="64" className="h-12 w-48 object-contain object-left" />
                    </a>
                    <a href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900">← View public website</a>
                    <div className="mt-10 grid size-12 place-items-center rounded-2xl bg-blue-50 text-[#174b9b]"><LockKeyhole className="size-5" /></div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">Welcome back</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to manage the website content.</p>
                    <form onSubmit={submit} className="mt-8 space-y-5">
                        <AdminField label="Login ID or email" error={form.errors.login_id}><TextInput autoComplete="username" value={form.data.login_id} onChange={(event) => updateField('login_id', event.target.value)} placeholder="AE-000001 or you@company.com" required /></AdminField>
                        <AdminField label="Password" error={form.errors.password}><div className="relative"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={form.data.password} onChange={(event) => updateField('password', event.target.value)} className={`${adminInput} pr-11`} placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-lg text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#174b9b]"><span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>{showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}</button></div></AdminField>
                        <label className="flex items-center gap-2.5 text-sm text-slate-600"><input type="checkbox" checked={form.data.remember} onChange={(event) => updateField('remember', event.target.checked)} className="size-4 rounded border-slate-300 accent-[#174b9b]" />Keep me signed in</label>
                        <Button type="submit" disabled={form.processing} className="h-12 w-full bg-[#10264b] hover:bg-[#1a3767]">{form.processing ? 'Signing in…' : 'Sign in'} <ArrowRight className="size-4" /></Button>
                        <p className="text-center text-xs leading-5 text-slate-500">Only authorized administrators can access this area.</p>
                    </form>
                </div>
            </section>
        </main>
    </>;
}
