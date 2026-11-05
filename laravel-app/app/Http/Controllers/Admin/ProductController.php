<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/products/index', [
            'products' => Product::query()->orderBy('sort_order')->orderBy('name')->get()->map(fn (Product $product): array => [
                ...$product->toArray(),
                'image_url' => $this->imageUrl($product->image_path),
            ]),
            'categories' => Product::query()->distinct()->orderBy('category')->pluck('category')->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['name']);
        $data['image_path'] = $request->hasFile('image') ? $request->file('image')->store('products', 'uploads') : null;
        unset($data['image']);
        Product::query()->create($data);

        return back()->with('success', 'Product added to the catalogue.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validated($request, $product);
        if ($data['name'] !== $product->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $product->id);
        }
        unset($data['image']);

        if ($request->hasFile('image')) {
            $this->deleteStoredImage($product->image_path);
            $data['image_path'] = $request->file('image')->store('products', 'uploads');
        }

        $product->update($data);

        return back()->with('success', 'Product details updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->deleteStoredImage($product->image_path);
        $product->delete();

        return back()->with('success', 'Product removed from the catalogue.');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request, ?Product $product = null): array
    {
        return $request->validate([
            'code' => ['required', 'string', 'max:40', Rule::unique('products', 'code')->ignore($product?->id)],
            'name' => ['required', 'string', 'max:160'],
            'subtitle' => ['required', 'string', 'max:180'],
            'category' => ['required', 'string', 'max:80'],
            'description' => ['required', 'string', 'max:3000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ]);
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 2;
        while (Product::query()->where('slug', $slug)->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    private function deleteStoredImage(?string $path): void
    {
        if ($path && ! str_starts_with($path, '/') && ! str_starts_with($path, 'http')) {
            Storage::disk('uploads')->delete($path);
        }
    }

    private function imageUrl(?string $path): ?string
    {
        if (! $path) return null;
        if (str_starts_with($path, '/') || str_starts_with($path, 'http')) return $path;
        return Storage::disk('uploads')->url($path);
    }
}
