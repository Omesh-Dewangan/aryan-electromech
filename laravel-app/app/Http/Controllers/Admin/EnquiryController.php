<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnquiryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/enquiries/index', [
            'enquiries' => Enquiry::query()->latest()->paginate(20)->withQueryString(),
        ]);
    }

    public function update(Request $request, Enquiry $enquiry): RedirectResponse
    {
        $data = $request->validate(['status' => ['required', 'in:new,contacted,closed']]);
        $enquiry->update($data);

        return back()->with('success', 'Enquiry status updated.');
    }
}
