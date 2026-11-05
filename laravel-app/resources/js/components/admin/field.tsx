import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const adminInput = 'mt-1.5 block min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50';

export function AdminField({ label, error, hint, className, children }: { label: string; error?: string; hint?: string; className?: string; children: ReactNode }) {
    return <div className={cn('min-w-0', className)}>
        <label className="block text-sm font-semibold text-slate-800">{label}{children}</label>
        {hint && <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>}
        {error && <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>;
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={cn(adminInput, props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className={cn(adminInput, 'min-h-28 resize-y', props.className)} />;
}

export function AdminPageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
    return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p></div>{action}</div>;
}
