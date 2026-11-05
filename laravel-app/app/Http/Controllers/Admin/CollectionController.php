<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Industry;
use App\Models\ProcessStep;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CollectionController extends Controller
{
    /** @var array<string, class-string<Service|Industry|ProcessStep>> */
    private const MODELS = ['services' => Service::class, 'industries' => Industry::class, 'process' => ProcessStep::class];

    public function index(string $resource): Response
    {
        $model = $this->model($resource);
        $query = $model::query();
        $items = match ($resource) {
            'process' => $query->orderBy('step_number')->get(),
            default => $query->orderBy('sort_order')->orderBy('id')->get(),
        };

        return Inertia::render('admin/collections/index', [
            'resource' => $resource,
            'items' => $items,
            'title' => Str::headline($resource),
        ]);
    }

    public function store(Request $request, string $resource): RedirectResponse
    {
        $data = $this->validated($request, $resource);
        $modelClass = $this->model($resource);
        $modelClass::query()->create($data);

        return back()->with('success', Str::headline($resource).' item added.');
    }

    public function update(Request $request, string $resource, int $id): RedirectResponse
    {
        $modelClass = $this->model($resource);
        $model = $modelClass::query()->findOrFail($id);
        $model->update($this->validated($request, $resource, $model->getKey()));

        return back()->with('success', Str::headline($resource).' item updated.');
    }

    public function destroy(string $resource, int $id): RedirectResponse
    {
        $modelClass = $this->model($resource);
        $modelClass::query()->findOrFail($id)->delete();

        return back()->with('success', Str::headline($resource).' item removed.');
    }

    /** @return class-string<Service|Industry|ProcessStep> */
    private function model(string $resource): string
    {
        return self::MODELS[$resource] ?? throw new NotFoundHttpException();
    }

    /** @return array<string, mixed> */
    private function validated(Request $request, string $resource, ?int $ignoreId = null): array
    {
        $activeRules = ['required', 'boolean'];
        return match ($resource) {
            'services' => $request->validate([
                'title' => ['required', 'string', 'max:160'],
                'detail' => ['required', 'string', 'max:1500'],
                'icon_name' => ['required', 'string', 'max:60'],
                'is_active' => $activeRules,
                'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
            ]),
            'industries' => $request->validate([
                'name' => ['required', 'string', 'max:120', Rule::unique('industries', 'name')->ignore($ignoreId)],
                'is_active' => $activeRules,
                'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
            ]),
            'process' => $request->validate([
                'step_number' => ['required', 'integer', 'min:1', 'max:99', Rule::unique('process_steps', 'step_number')->ignore($ignoreId)],
                'title' => ['required', 'string', 'max:160'],
                'detail' => ['required', 'string', 'max:1500'],
                'icon_name' => ['required', 'string', 'max:60'],
                'is_active' => $activeRules,
            ]),
            default => throw new NotFoundHttpException(),
        };
    }
}
