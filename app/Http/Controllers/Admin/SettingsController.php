<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = SiteSetting::query()->firstOrFail();
        $logoUrl = $settings->logo_path
            ? (str_starts_with($settings->logo_path, '/') ? $settings->logo_path : Storage::disk('uploads')->url($settings->logo_path))
            : null;

        return Inertia::render('admin/settings/edit', ['settings' => $settings, 'logoUrl' => $logoUrl]);
    }

    public function update(Request $request): RedirectResponse
    {
        $settings = SiteSetting::query()->firstOrFail();
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:180'],
            'ceo_name' => ['required', 'string', 'max:160'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:180'],
            'whatsapp_number' => ['required', 'regex:/^[0-9]{8,15}$/'],
            'gstin' => ['nullable', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:500'],
            'map_embed_url' => ['nullable', 'url', 'max:1000'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ], ['whatsapp_number.regex' => 'WhatsApp number should use country code and digits only, for example 919876543210.']);

        unset($data['logo']);
        if ($request->hasFile('logo')) {
            if ($settings->logo_path && ! str_starts_with($settings->logo_path, '/') && ! str_starts_with($settings->logo_path, 'http')) {
                Storage::disk('uploads')->delete($settings->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('branding', 'uploads');
        }

        $settings->update($data);

        return back()->with('success', 'Contact details saved.');
    }
}
