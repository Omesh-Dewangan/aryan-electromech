<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\Industry;
use App\Models\Product;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'products' => Product::query()->count(),
                'services' => Service::query()->count(),
                'industries' => Industry::query()->count(),
                'new_enquiries' => Enquiry::query()->where('status', 'new')->count(),
            ],
            'recentEnquiries' => Enquiry::query()->latest()->limit(6)->get(['id', 'name', 'mobile', 'product_name', 'status', 'created_at']),
        ]);
    }
}
