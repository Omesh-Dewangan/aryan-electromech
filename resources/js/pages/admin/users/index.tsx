import { Head, router, useForm, usePoll } from '@inertiajs/react';
import { Activity, KeyRound, Mail, ShieldCheck, Trash2, UserPlus, Users, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdminField, AdminPageHeader, TextInput } from '@/components/admin/field';
import { AdminLayout } from '@/layouts/admin-layout';

type AdminUser = { id: number; name: string; email: string; login_id: string; login_count: number; today_login_count: number; is_online: boolean; last_login_at: string | null; created_at: string };
type Props = { users: AdminUser[]; currentUserId: number };
type FormData = { name: string; email: string; password: string; password_confirmation: string };

const blank: FormData = { name: '', email: '', password: '', password_confirmation: '' };

export default function AdminUsersPage({ users, currentUserId }: Props) {
    const form = useForm<FormData>(blank);
    usePoll(30_000, { only: ['users'] });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    function remove(user: AdminUser) {
        if (user.id === currentUserId) return;
        if (window.confirm(`Remove admin access for ${user.name}? They will no longer be able to sign in.`)) {
            router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
        }
    }

    return <AdminLayout title="Admin users">
        <Head title="Admin users · Admin" />
        <AdminPageHeader title="Admin users" description="Create a separate sign-in for a trusted teammate who helps manage this website." />

        <div className="grid items-start gap-6 2xl:grid-cols-[.9fr_1.1fr]">
            <Card className="rounded-2xl border-slate-200 p-5 sm:p-7">
                <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#174b9b]"><UserPlus className="size-5" /></span>
                    <div><h2 className="font-bold text-slate-950">Create an admin login</h2><p className="mt-1 text-sm leading-5 text-slate-500">Each teammate gets a unique Login ID and password.</p></div>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <AdminField label="Full name" error={form.errors.name}><TextInput autoComplete="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="e.g. Priya Sharma" required /></AdminField>
                    <AdminField label="Email address" hint="They can sign in with their email or generated Login ID." error={form.errors.email}><TextInput type="email" autoComplete="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} placeholder="name@company.com" required /></AdminField>
                    <AdminField label="Password" hint="Use at least 12 characters." error={form.errors.password}><TextInput type="password" autoComplete="new-password" minLength={12} value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} required /></AdminField>
                    <AdminField label="Confirm password" error={form.errors.password_confirmation}><TextInput type="password" autoComplete="new-password" minLength={12} value={form.data.password_confirmation} onChange={(event) => form.setData('password_confirmation', event.target.value)} required /></AdminField>
                    <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600"><KeyRound className="mt-0.5 size-4 shrink-0 text-slate-500" /><p>A unique Login ID is generated automatically. Passwords are encrypted and cannot be viewed later.</p></div>
                    <Button type="submit" disabled={form.processing} className="h-11 w-full bg-[#10264b] hover:bg-[#1a3767]"><UserPlus className="size-4" />{form.processing ? 'Creating account…' : 'Create admin account'}</Button>
                </form>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-slate-200">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-bold text-slate-950">People who can manage the website</h2><p className="mt-1 text-xs text-slate-500">{users.length} {users.length === 1 ? 'admin account' : 'admin accounts'}</p></div><span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><Users className="size-5" /></span></div>
                <div className="divide-y divide-slate-100">
                    {users.map((user) => {
                        const isCurrentUser = user.id === currentUserId;
                        return <article key={user.id} className="flex items-center gap-3 px-5 py-4 sm:px-6">
                            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#10264b] text-sm font-bold text-white">{user.name.slice(0, 1).toUpperCase()}</span>
                            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-semibold text-slate-900">{user.name}</h3>{isCurrentUser && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">You</span>}</div><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500"><Mail className="size-3.5 shrink-0" />{user.email}</p><p className="mt-1 text-xs font-semibold tracking-wide text-[#174b9b]">Login ID: {user.login_id}</p><div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500"><span className="inline-flex items-center gap-1"><Activity className="size-3.5" />{user.login_count} {user.login_count === 1 ? 'login' : 'logins'}</span><span>{user.last_login_at ? `Last login ${new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(user.last_login_at))}` : 'Never logged in'}</span></div><p className="mt-1 text-[11px] text-slate-400">Added {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(user.created_at))}</p></div>
                            <div className="flex shrink-0 flex-col items-end gap-1.5">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${user.is_online ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}><Wifi className="size-3.5" />{user.is_online ? 'Online' : 'Offline'}</span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500"><Activity className="size-3.5" />Today: {user.today_login_count}</span>
                            </div>
                            {!isCurrentUser && <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${user.name}`} title="Remove admin access" onClick={() => remove(user)} className="shrink-0 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" /></Button>}
                        </article>;
                    })}
                </div>
                <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-5 text-slate-500 sm:px-6"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /><p>Your account cannot be removed here, and the last admin account is always protected.</p></div>
            </Card>
        </div>
    </AdminLayout>;
}
