<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomepageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomepageController extends Controller
{
    public function edit(): Response
    {
        $content = HomepageContent::query()->firstOrFail();

        return Inertia::render('admin/homepage/edit', [
            'content' => $content,
            'images' => [
                'hero' => $this->imageUrl($content->hero_image_path),
                'about' => $this->imageUrl($content->about_image_path),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $content = HomepageContent::query()->firstOrFail();
        $data = $request->validate([
            'hero_kicker' => ['required', 'string', 'max:100'],
            'hero_title' => ['required', 'string', 'max:100'],
            'hero_highlight' => ['required', 'string', 'max:100'],
            'hero_description' => ['required', 'string', 'max:500'],
            'hero_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'about_heading' => ['required', 'string', 'max:180'],
            'about_paragraph_one' => ['required', 'string', 'max:1000'],
            'about_paragraph_two' => ['required', 'string', 'max:1000'],
            'about_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'catalogue_heading' => ['required', 'string', 'max:180'],
            'catalogue_intro' => ['required', 'string', 'max:500'],
            'services_heading' => ['required', 'string', 'max:180'],
            'services_intro' => ['required', 'string', 'max:500'],
            'industries_heading' => ['required', 'string', 'max:180'],
            'industries_intro' => ['required', 'string', 'max:500'],
            'process_heading' => ['required', 'string', 'max:180'],
            'process_intro' => ['required', 'string', 'max:500'],
            'contact_heading' => ['required', 'string', 'max:180'],
            'contact_intro' => ['required', 'string', 'max:500'],
        ]);

        unset($data['hero_image'], $data['about_image']);
        foreach (['hero_image' => 'hero_image_path', 'about_image' => 'about_image_path'] as $input => $column) {
            if ($request->hasFile($input)) {
                $data[$column] = $this->storeReplacement($request, $input, $content->{$column}, 'homepage');
            }
        }

        $content->update($data);

        return back()->with('success', 'Homepage content saved.');
    }

    private function storeReplacement(Request $request, string $field, ?string $oldPath, string $folder): string
    {
        if ($oldPath && ! str_starts_with($oldPath, '/') && ! str_starts_with($oldPath, 'http')) {
            Storage::disk('uploads')->delete($oldPath);
        }

        return $request->file($field)->store($folder, 'uploads');
    }

    private function imageUrl(?string $path): ?string
    {
        if (! $path) return null;
        if (str_starts_with($path, '/') || str_starts_with($path, 'http')) return $path;
        return Storage::disk('uploads')->url($path);
    }
}
