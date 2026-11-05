<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\HomepageContent;
use App\Models\Industry;
use App\Models\ProcessStep;
use App\Models\Product;
use App\Models\Service;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $settings = SiteSetting::query()->firstOrFail();
        $home = HomepageContent::query()->firstOrFail();

        return Inertia::render('home/index', [
            'settings' => [
                'company_name' => $settings->company_name,
                'ceo_name' => $settings->ceo_name,
                'phone' => $settings->phone,
                'email' => $settings->email,
                'whatsapp_number' => $settings->whatsapp_number,
                'gstin' => $settings->gstin,
                'address' => $settings->address,
                'map_embed_url' => $settings->map_embed_url,
                'logo_url' => $this->imageUrl($settings->logo_path),
            ],
            'home' => [
                'hero_kicker' => $home->hero_kicker,
                'hero_title' => $home->hero_title,
                'hero_highlight' => $home->hero_highlight,
                'hero_description' => $home->hero_description,
                'hero_image_url' => $this->imageUrl($home->hero_image_path),
                'about_heading' => $home->about_heading,
                'about_paragraph_one' => $home->about_paragraph_one,
                'about_paragraph_two' => $home->about_paragraph_two,
                'about_image_url' => $this->imageUrl($home->about_image_path),
                'catalogue_heading' => $home->catalogue_heading,
                'catalogue_intro' => $home->catalogue_intro,
                'services_heading' => $home->services_heading,
                'services_intro' => $home->services_intro,
                'industries_heading' => $home->industries_heading,
                'industries_intro' => $home->industries_intro,
                'process_heading' => $home->process_heading,
                'process_intro' => $home->process_intro,
                'contact_heading' => $home->contact_heading,
                'contact_intro' => $home->contact_intro,
            ],
            'products' => Product::query()->where('is_active', true)->orderBy('sort_order')->get()->map(fn (Product $product): array => [
                'id' => $product->id,
                'code' => $product->code,
                'name' => $product->name,
                'subtitle' => $product->subtitle,
                'category' => $product->category,
                'description' => $product->description,
                'image_url' => $this->imageUrl($product->image_path),
            ]),
            'services' => Service::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'title', 'detail', 'icon_name']),
            'industries' => Industry::query()->where('is_active', true)->orderBy('sort_order')->pluck('name'),
            'steps' => ProcessStep::query()->where('is_active', true)->orderBy('step_number')->get(['id', 'step_number', 'title', 'detail', 'icon_name']),
        ]);
    }

    private function imageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, '/') || str_starts_with($path, 'https://') || str_starts_with($path, 'http://')) {
            return $path;
        }

        return Storage::disk('uploads')->url($path);
    }
}
